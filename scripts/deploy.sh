#!/bin/bash
# GCP 배포 스크립트
# 로컬에서 실행

set -e

GCP_IP="34.53.95.30"
GCP_USER="mathbank-admin"
SSH_KEY="$HOME/.ssh/mathbank-gcp"

echo "=== 코드 전송 (git archive, HEAD 커밋 기준 — rsync 미설치 환경 대응) ==="
ARCHIVE="$(mktemp -t mathbank-msa-deploy-XXXXXX.tar.gz)"
git archive --format=tar HEAD | gzip > "${ARCHIVE}"
scp -i "${SSH_KEY}" "${ARCHIVE}" ${GCP_USER}@${GCP_IP}:/tmp/mathbank-msa-deploy.tar.gz
ssh -i "${SSH_KEY}" ${GCP_USER}@${GCP_IP} "
  mkdir -p ~/mathbank-msa
  tar -xzf /tmp/mathbank-msa-deploy.tar.gz -C ~/mathbank-msa
  rm /tmp/mathbank-msa-deploy.tar.gz
"
rm -f "${ARCHIVE}"

echo "=== .env.prod 전송 (gitignore 파일) ==="
scp -i ${SSH_KEY} \
  .env.prod \
  ${GCP_USER}@${GCP_IP}:~/mathbank-msa/

echo "=== GCP에서 빌드 및 실행 ==="
# e2-micro(1 vCPU, ~1GB)에서 여러 서비스를 동시에 빌드(Maven x N + npm)하면
# 리소스 경합으로 Maven Central TLS 핸드셰이크가 끊기는 현상이 있다.
# COMPOSE_PARALLEL_LIMIT은 Compose v2의 BuildKit 빌드에는 적용되지 않아서
# (up의 컨테이너 기동 동시성에만 적용됨) 서비스별로 build를 따로 호출해
# 확실히 한 번에 하나씩만 빌드하도록 강제한다.
ssh -i ${SSH_KEY} ${GCP_USER}@${GCP_IP} "
  cd ~/mathbank-msa
  for svc in auth-service problem-service examsheet-service attempt-service gateway frontend; do
    echo \"--- building \$svc ---\"
    docker compose -f docker-compose.prod.yml --env-file .env.prod build \$svc
  done
  docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
"

echo "=== 완료 ==="
echo "http://${GCP_IP} 에서 확인하세요"
