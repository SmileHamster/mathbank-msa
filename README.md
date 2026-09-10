# mathbank-msa

mathbank 1호(모놀리식)를 MSA로 전환한 2호 프로젝트입니다.
Spring Cloud Gateway + Docker Compose 기반으로 구성했습니다.

**현재 상태**: 5개 서비스 + React 프론트엔드 구현 완료, GCP Compute Engine에 배포되어 운영 중.

**배포 주소**: http://34.53.95.30

## 서비스 구성

| 서비스 | 역할 | 포트 |
|---|---|---|
| gateway | API Gateway, JWT 검증, 라우팅 (Spring Cloud Gateway, WebFlux) | 8080 |
| auth-service | 회원 인증, JWT 발급 | 8081 |
| problem-service | 문제·태그 관리, 이미지 업로드 | 8082 |
| examsheet-service | 시험지 자동 생성, PDF 출력 | 8083 |
| attempt-service | 학생 관리, 응시 기록, 성적 통계 | 8084 |
| frontend | React + Vite 기반 SPA | 3000 (개발) / 80 (배포) |

서비스마다 MariaDB 스키마를 분리해서 사용합니다 (`mathbank_auth`, `mathbank_problem`, `mathbank_exam`, `mathbank_attempt`).

## 기술 스택

- Spring Boot 4.0.6, Spring Cloud Gateway 2025.1 (gateway-server-webflux)
- JWT 인증 (jjwt), MariaDB, MyBatis
- React 19 + Vite + Tailwind CSS, KaTeX(수식 렌더링), Recharts(통계 차트)
- Docker Compose, GCP Compute Engine e2-micro (Always Free), GitHub Actions

## 로컬 실행

```bash
docker compose up --build
```

`http://localhost:3000` 에서 프론트엔드 확인 (게이트웨이는 8080, DB는 3307로 노출).

## 관련 프로젝트

- 1호 모놀리식: https://github.com/SmileHamster/mathbank

---

## 왜 모노레포인가

서비스마다 별도 GitHub 저장소로 나누는 멀티레포 대신, 하나의 저장소에서 폴더로 관리하는 모노레포 방식을 선택했습니다.
혼자 개발하고 Docker Compose로 한 VM에 같이 배포할 규모라, 여러 저장소를 오가며 버전을 맞추는 오버헤드가 이득보다 크다고 판단했습니다.

## 로드맵

- [x] 1단계: mathbank의 auth/problem/examsheet/attempt 패키지를 독립 Spring Boot 서비스 4개로 분리
- [x] 2단계: 각 서비스가 단독으로 기동되는지 확인
- [x] 3단계: Spring Cloud Gateway 추가 — 라우팅 + JWT 인증
- [x] 4단계: Docker Compose로 전체 컨테이너화 (React 프론트엔드 포함)
- [x] 5단계: GCP 배포 (e2-micro, Always Free)
- [ ] 6단계: 서비스 수평 확장 체감 → Eureka 도입 (필요성 확인되면)
- [ ] 7단계: Nginx 필요성 판단
- [ ] 8단계: Kubernetes 검토

> 6~8단계는 실제로 필요성이 확인될 때만 진행 — 처음부터 K8s까지 다 하는 게 목표가 아니라, 각 단계에서 왜 다음 도구가 필요해지는지 스스로 판단하는 과정 자체가 포인트.

## 배포 트러블슈팅 메모

- **e2-micro(958MB) 메모리 부족**: JVM 5개가 동시에 뜨면 게이트웨이가 POST 요청 body를 다운스트림으로 포워딩할 때 Netty가 버퍼를 할당하지 못해 응답 없이 멈추는 현상이 있었음(GET처럼 body 없는 요청은 영향 없음). 원인은 코드가 아니라 메모리였고, 스왑을 2GB → 4GB로 늘려 해결.
- 각 서비스 JVM은 `-Xmx140~180m`, SerialGC로 튜닝되어 있음 (`*/Dockerfile` 참고).
