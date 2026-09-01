# mathbank-msa

수학 문제은행(mathbank, [1호 프로젝트](https://github.com/SmileHamster/mathbank))을 MSA 구조로 재구성하는 2호 포트폴리오 프로젝트입니다.
도메인·태그 체계 등 기존 지식은 그대로 가져오되, 서비스를 4개로 쪼개고 그 사이의 통신·인증·배포를 어떻게 다루는지에 초점을 맞춥니다.

**현재 상태**: 스켈레톤만 존재. 아직 실제 코드 없음.

---

## 구조 (모노레포)

```
mathbank-msa/
├── services/
│   ├── auth-service/       회원 인증 (mathbank의 auth 패키지에서 분리)
│   ├── problem-service/    문제·태그 (mathbank의 problem 패키지에서 분리)
│   ├── examsheet-service/  시험지 생성·PDF (mathbank의 examsheet 패키지에서 분리)
│   └── attempt-service/    학생·응시·통계 (mathbank의 attempt 패키지에서 분리)
├── gateway/                 Spring Cloud Gateway (라우팅 + JWT 인증)
└── docker-compose.yml        (4단계에서 추가 예정)
```

서비스마다 별도 GitHub 저장소로 나누는 멀티레포 대신, 하나의 저장소에서 폴더로 관리하는 모노레포 방식을 선택했습니다.
혼자 개발하고 Docker Compose로 한 VM에 같이 배포할 규모라, 여러 저장소를 오가며 버전을 맞추는 오버헤드가 이득보다 크다고 판단했습니다.

---

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

---

## 1호 프로젝트와의 관계

이 저장소는 mathbank와 **별개의 git 저장소**입니다. 도메인 지식(6축 태그 체계, 시험지 생성 알고리즘 등)과 기술적 의사결정 기록은 [mathbank의 PLANNING.md/README](https://github.com/SmileHamster/mathbank)를 참고하세요. 코드를 그대로 복사하기보다, 서비스 경계에 맞게 다시 설계하며 가져올 예정입니다.
