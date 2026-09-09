#!/bin/bash
# GCP 배포 스크립트
# 로컬에서 실행

set -e

GCP_IP="34.53.95.30"
GCP_USER="mathbank-admin"
SSH_KEY="$HOME/.ssh/mathbank-gcp"

echo "=== 코드 전송 ==="
rsync -avz \
  -e "ssh -i ${SSH_KEY}" \
  --exclude 'node_modules' \
  --exclude 'target' \
  --exclude '.git' \
  --exclude '.env*' \
  ./ ${GCP_USER}@${GCP_IP}:~/mathbank-msa/

echo "=== .env.prod 전송 (gitignore 파일) ==="
scp -i ${SSH_KEY} \
  .env.prod \
  ${GCP_USER}@${GCP_IP}:~/mathbank-msa/

echo "=== GCP에서 빌드 및 실행 ==="
ssh -i ${SSH_KEY} ${GCP_USER}@${GCP_IP} "
  cd ~/mathbank-msa
  docker compose -f docker-compose.prod.yml \
    --env-file .env.prod \
    up --build -d
"

echo "=== 완료 ==="
echo "http://${GCP_IP} 에서 확인하세요"
