#!/bin/bash
# GCP VM 초기 설정 스크립트
# 최초 1회만 실행 (이후엔 idempotent하게 재실행해도 안전하도록 작성했다)
#
# 전제: 이 VM에는 이미 1호 프로젝트(mathbank 모놀리식)가
#       systemd 서비스(mathbank.service, 포트 8080)로 떠 있고
#       iptables로 80 -> 8080 리다이렉트가 걸려 있다 (1호 DEPLOY.md 참고).
#       이 스크립트는 그 위에 2호(MSA) 스택을 얹는 것을 전제로,
#       80번 포트의 리다이렉트 대상을 2호 frontend(3000)로 옮긴다.
#
#       중요: 2호 gateway 컨테이너도 호스트 8080 포트를 그대로 쓴다
#       (docker-compose.prod.yml). 1호 mathbank.service가 이미 호스트
#       8080을 점유하고 있으면 2호 gateway는 포트 바인딩 자체가 실패해서
#       뜨지도 못한다 (단순 iptables 라우팅 우선순위 문제가 아니라 진짜 충돌).
#       => 1호 systemd 서비스(mathbank.service)를 반드시 먼저 중지해야
#          2호가 이 VM에서 뜰 수 있다. e2-micro(1GB RAM)에서는 어차피
#          모놀리식 1호 + MSA 5개 서비스를 동시에 굴리는 것도 현실적으로
#          무리다. 이 결정(1호 중지)은 사용자 확인 없이 진행하지 않는다.

set -e

echo "=== 1. 패키지 업데이트 ==="
sudo apt-get update -y

echo "=== 2. Docker 설치 ==="
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
else
  echo "Docker가 이미 설치되어 있음 - 스킵"
fi

echo "=== 3. Docker Compose 플러그인 설치 ==="
sudo apt-get install -y docker-compose-plugin

echo "=== 4. MariaDB 설치 확인 ==="
# 1호 배포 때 이미 설치되어 있을 가능성이 높다 (mathbank DB 보유 중).
# 이미 설치되어 있으면 apt는 그냥 스킵하고, 기존 DB(mathbank)는 건드리지 않는다.
if ! command -v mariadb &> /dev/null && ! command -v mysql &> /dev/null; then
  sudo apt-get install -y mariadb-server
fi
sudo systemctl start mariadb
sudo systemctl enable mariadb

echo "=== 5. MariaDB 초기화 (2호 전용 스키마 4개 추가) ==="
# IF NOT EXISTS라 1호가 쓰는 기존 'mathbank' DB에는 영향 없음.
sudo mysql -e "
CREATE DATABASE IF NOT EXISTS mathbank_auth
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS mathbank_problem
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS mathbank_exam
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS mathbank_attempt
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"

echo "=== 6. 스키마 적용 안내 ==="
echo "각 서비스의 init-db/*.sql 을 아래처럼 직접 적용해야 한다 (최초 1회):"
echo '  sudo mysql < ~/mathbank-msa/init-db/02-auth-schema.sql'
echo '  sudo mysql < ~/mathbank-msa/init-db/03-problem-schema.sql'
echo '  sudo mysql < ~/mathbank-msa/init-db/04-exam-schema.sql'
echo '  sudo mysql < ~/mathbank-msa/init-db/05-attempt-schema.sql'
echo '  sudo mysql < ~/mathbank-msa/init-db/06-tag-data.sql'

echo "=== 7. 포트포워딩 (80 -> 3000, 2호 frontend로) ==="
# 1호가 이미 걸어둔 80 -> 8080 규칙이 남아있으면 먼저 제거한다.
# (PREROUTING은 먼저 매치되는 규칙이 이기므로, 지우지 않으면 새 규칙이 죽은 규칙이 된다.)
sudo iptables -t nat -D PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080 2>/dev/null || true
sudo iptables -t nat -C PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000 2>/dev/null || \
  sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
# 443 리다이렉트는 넣지 않는다: 이 스택 어디에도 TLS 종단이 없어서
# 443으로 들어온 트래픽을 평문 HTTP 포트(8080)로 넘겨봤자 응답하지 못한다.
# HTTPS가 필요해지면 Let's Encrypt 등으로 실제 TLS 종단부터 구성해야 한다.

echo "=== 8. 스왑 파일 생성 (2GB, 없으면) ==="
# 로컬 실측 기준 5개 서비스 컨테이너 메모리 합계만 ~800MB (JVM 튜닝 반영 후).
# 여기에 MariaDB + OS 오버헤드까지 더하면 e2-micro의 1GB를 넘길 수 있다.
# 스왑이 있으면 순간적인 초과는 느려지더라도 OOM-kill로 죽는 대신 버틴다.
if ! sudo swapon --show | grep -q '/swapfile'; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
  echo "스왑이 이미 설정되어 있음 - 스킵"
fi

echo "=== 완료 ==="
echo "이제 'newgrp docker' 또는 재접속 후 Docker 사용 가능"
echo "1호 systemd 서비스(mathbank.service)를 계속 쓸지 여부는 별도로 결정할 것"
echo "  (계속 쓴다면: sudo systemctl status mathbank 로 확인, 포트 충돌 없음 - 8080은 내부 전용으로 바뀌었음)"
