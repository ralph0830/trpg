# 🎲 AI TRPG Game

D&D 5e 기반의 AI 게임 마스터와 함께하는 웹 기반 TRPG 게임입니다.

[![GitHub License](https://img.shields.io/github/license/ralph0830/trpg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](docker-compose.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql)](https://www.postgresql.org/)

## ✨ 주요 기능

- 🤖 **AI 게임 마스터**: Gemini API 기반 동적 스토리 생성
- 👥 **멀티플레이어**: 최대 4명 동시 플레이 지원
- 💬 **실시간 채팅**: Socket.IO 기반 실시간 통신
- 🗺️ **인터랙티브 맵**: 타일 기반 2D 게임 맵
- ⚔️ **D&D 5e 시스템**: 정통 TRPG 규칙 구현
- 🎒 **인벤토리 관리**: 아이템 사용 및 장착 시스템

## 🚀 빠른 시작

### Docker Compose 사용 (권장)

```bash
# 저장소 클론
git clone https://github.com/ralph0830/trpg.git
cd trpg

# 환경변수 설정
cp .env.example .env

# 전체 스택 실행
docker compose up -d
```

**접속 주소:**
- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:3002
- PostgreSQL: localhost:5433

### 개별 실행

#### 1. 데이터베이스 시작
```bash
docker compose up -d db
```

#### 2. 백엔드 실행
```bash
cd backend
npm install
npm run dev
```

#### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 📋 시스템 요구사항

- **Docker & Docker Compose** (권장)
- **Node.js 22+** (개별 실행 시)
- **PostgreSQL 14+** (개별 실행 시)

## 🎮 게임 플레이

1. 웹 브라우저에서 http://localhost:5173 접속
2. "새 게임 세션 생성" 또는 "기존 세션 참가" 선택
3. 플레이어명과 캐릭터명 입력
4. 친구들과 함께 AI GM이 진행하는 모험 시작!

## 🛠 기술 스택

### Frontend
- **React 19** + **Vite 7**: 모던 프론트엔드 프레임워크
- **Socket.IO Client**: 실시간 통신

### Backend
- **Node.js 22** + **Express.js 5**: REST API 서버
- **Socket.IO 4.8**: WebSocket 실시간 통신
- **PostgreSQL**: 게임 데이터 저장

### AI & External Services
- **Gemini API**: AI 게임 마스터
- **n8n**: 워크플로우 자동화 (예정)

### DevOps
- **Docker Compose**: 통합 개발환경
- **Nodemon**: 개발 시 자동 재시작

## 📁 프로젝트 구조

```
trpg/
├── docker-compose.yml          # Docker 통합 환경
├── .env.example               # 환경변수 템플릿
├── backend/                   # Node.js 백엔드
│   ├── server.js             # 메인 서버
│   ├── models/               # 데이터베이스 모델
│   ├── routes/               # REST API 라우터
│   └── database/             # DB 스키마 및 마이그레이션
├── frontend/                  # React 프론트엔드
│   ├── src/
│   │   ├── components/       # UI 컴포넌트
│   │   ├── contexts/         # React Context
│   │   └── main.jsx
│   └── public/
└── docs/                      # 프로젝트 문서
    ├── PRD.md                # 제품 요구사항 정의서
    ├── GAMERULE.md           # D&D 5e 게임 규칙
    └── docker-README.md      # Docker 사용법
```

## 🔧 개발 명령어

```bash
# 전체 스택 실행
docker compose up -d

# 서비스별 로그 확인
docker compose logs backend
docker compose logs frontend

# 서비스 재시작
docker compose restart backend

# 전체 정리
docker compose down

# 데이터베이스 마이그레이션
docker compose exec backend npm run migrate
```

## 📖 문서

- [제품 요구사항 정의서 (PRD)](PRD.md)
- [D&D 5e 게임 규칙](GAMERULE.md)
- [Docker 개발환경 가이드](docker-README.md)
- [TODO 및 개발 계획](TODO.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- **Dungeons & Dragons 5th Edition** - 게임 규칙 시스템
- **Google Gemini** - AI 게임 마스터 기능
- **Socket.IO** - 실시간 통신 라이브러리
- **React** & **Node.js** 커뮤니티

---

⚡ **Made with [Claude Code](https://claude.ai/code)**