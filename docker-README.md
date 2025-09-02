# 🐳 Docker Compose 개발 환경 설정

전체 TRPG 스택을 Docker Compose로 한 번에 실행할 수 있습니다.

## 🚀 빠른 시작

### 1. 환경 변수 설정
```bash
cp .env.example .env
```

### 2. 전체 스택 실행 (개발모드)
```bash
# 전체 서비스 백그라운드 실행
docker compose up -d

# 또는 로그 확인하며 실행
docker compose up
```

### 3. 웹 브라우저에서 접속
- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:3002
- **PostgreSQL**: localhost:5433

## 📋 서비스 구성

| 서비스 | 포트 | 설명 | 상태 확인 |
|-------|------|------|----------|
| `frontend` | 5173 | React + Vite 개발서버 | http://localhost:5173 |
| `backend` | 3002 | Node.js + Socket.IO 서버 | http://localhost:3002 |
| `db` | 5433 | PostgreSQL 14 데이터베이스 | `docker compose exec db psql -U ralph trpg` |

## 🛠 개발 명령어

### 전체 스택 관리
```bash
# 서비스 시작
docker compose up -d

# 서비스 중지
docker compose down

# 로그 확인 (전체)
docker compose logs

# 특정 서비스 로그 확인
docker compose logs frontend
docker compose logs backend
docker compose logs db

# 서비스 재시작
docker compose restart backend
```

### 개별 서비스 접속
```bash
# 백엔드 컨테이너 접속
docker compose exec backend sh

# 프론트엔드 컨테이너 접속
docker compose exec frontend sh

# 데이터베이스 접속
docker compose exec db psql -U ralph trpg
```

### 데이터베이스 관리
```bash
# 데이터베이스 마이그레이션 실행
docker compose exec backend npm run migrate

# 데이터베이스 초기화
docker compose down -v  # 볼륨까지 삭제
docker compose up -d
```

## 🔥 핫 리로드 개발

- **프론트엔드**: 코드 변경 시 자동 리로드 (Vite)
- **백엔드**: 코드 변경 시 자동 재시작 (Nodemon)
- 코드는 호스트와 컨테이너 간 실시간 동기화

## 🐛 문제 해결

### 포트 충돌
```bash
# 기존 서비스 종료 후 재시작
docker compose down
sudo lsof -i :3002  # 포트 사용 프로세스 확인
docker compose up -d
```

### 데이터베이스 연결 문제
```bash
# 헬스체크 확인
docker compose ps

# 데이터베이스 로그 확인
docker compose logs db

# 데이터베이스 재시작
docker compose restart db
```

### 컨테이너 재빌드
```bash
# 이미지 재빌드 (의존성 변경 시)
docker compose build --no-cache

# 특정 서비스만 재빌드
docker compose build backend
```

## ⚙️ 환경 변수

주요 환경 변수들은 `.env` 파일에서 관리됩니다:

```bash
# 데이터베이스
DB_HOST=db
DB_PORT=5432
DB_USER=ralph
DB_PASSWORD=pjtfc1251!
DB_NAME=trpg

# 백엔드
PORT=3002
NODE_ENV=development

# 프론트엔드
VITE_BACKEND_URL=http://localhost:3002
```

## 🎮 게임 시작하기

1. 모든 서비스가 실행 중인지 확인: `docker compose ps`
2. 브라우저에서 http://localhost:5173 접속
3. "새 게임 세션 생성" 클릭
4. 플레이어명, 캐릭터명 입력
5. 게임 시작! 🎲

## 📚 추가 기능

### 프로덕션 빌드
```bash
# 프로덕션용 Docker 이미지 빌드
docker compose -f docker-compose.prod.yml build

# 프로덕션 환경 실행
docker compose -f docker-compose.prod.yml up -d
```

### 백업 & 복원
```bash
# 데이터베이스 백업
docker compose exec db pg_dump -U ralph trpg > backup.sql

# 데이터베이스 복원  
docker compose exec -T db psql -U ralph trpg < backup.sql
```

---

💡 **팁**: VSCode에서 Docker 확장을 설치하면 컨테이너 관리가 더욱 편해집니다!