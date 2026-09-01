# mathbank-msa

mathbank 1호(모놀리식)를 MSA로 전환한 2호 프로젝트입니다.
Spring Cloud Gateway + Docker Compose 기반으로 구성합니다.

**현재 상태**: 스켈레톤만 존재. 아직 실제 코드 없음.

## 서비스 구성

| 서비스 | 역할 | 포트 |
|---|---|---|
| gateway | API Gateway, JWT 인증, 라우팅 | 8080 |
| auth-service | 회원 인증 | 8081 |
| problem-service | 문제·태그 관리 | 8082 |
| examsheet-service | 시험지 자동 생성 | 8083 |
| attempt-service | 학생·응시·통계 | 8084 |

## 관련 프로젝트

- 1호 모놀리식: https://github.com/SmileHamster/mathbank

---

## 왜 모노레포인가

서비스마다 별도 GitHub 저장소로 나누는 멀티레포 대신, 하나의 저장소에서 폴더로 관리하는 모노레포 방식을 선택했습니다.
혼자 개발하고 Docker Compose로 한 VM에 같이 배포할 규모라, 여러 저장소를 오가며 버전을 맞추는 오버헤드가 이득보다 크다고 판단했습니다.

## 로드맵

- [ ] 1단계: mathbank의 auth/problem/examsheet/attempt 패키지를 독립 Spring Boot 서비스 4개로 분리
- [ ] 2단계: 각 서비스가 단독으로 기동되는지 확인
- [ ] 3단계: Spring Cloud Gateway 추가 — 라우팅 + JWT 인증
- [ ] 4단계: Docker Compose로 전체 컨테이너화
- [ ] 5단계: GCP 배포
- [ ] 6단계: 서비스 수평 확장 체감 → Eureka 도입 (필요성 확인되면)
- [ ] 7단계: Nginx 필요성 판단
- [ ] 8단계: Kubernetes 검토

> 6~8단계는 실제로 필요성이 확인될 때만 진행 — 처음부터 K8s까지 다 하는 게 목표가 아니라, 각 단계에서 왜 다음 도구가 필요해지는지 스스로 판단하는 과정 자체가 포인트.
