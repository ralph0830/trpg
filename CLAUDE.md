# AI-Powered TRPG Game Project

D&D 5e 기반 4-player 웹 TRPG with Node.js backend + React frontend + PostgreSQL

## ✅ 구현 완료 현황

### Backend (완료)
- **서버**: Express.js + Socket.IO (포트 3002)
- **데이터베이스**: PostgreSQL (Docker 컨테이너)
- **실시간 통신**: WebSocket 게임 세션, 채팅, 캐릭터 이동
- **REST API**: 세션 관리, 캐릭터 CRUD
- **DB 스키마**: 7개 테이블 완전 구현

### Frontend (기본 구조)  
- **React 19**: 3-패널 레이아웃 컴포넌트 스켈레톤
- **Socket.IO 클라이언트**: 준비됨 (연동 필요)

### 다음 단계
- Frontend ↔ Backend 연동
- AI GM (Gemini API) 통합  
- D&D 5e 게임 로직 구현

## 핵심 파일 구조

```
trpg/
├── CLAUDE.md (프로젝트 개요)
├── PRD.md (요구사항 문서) 
├── GAMERULE.md (D&D 5e 규칙)
├── TODO.md (개발 과제)
├── docker-compose.yml (PostgreSQL)
├── backend/
│   ├── server.js (메인 서버)
│   ├── database/ (스키마, 마이그레이션)
│   ├── models/ (GameSession, Character, GameEvent)
│   └── routes/ (REST API 엔드포인트)
└── frontend/src/ (React 컴포넌트)
```

## 개발 환경 설정

### 🐳 Docker Compose 통합 실행 (권장)
```bash
# 전체 스택 한 번에 실행
docker compose up -d

# 접속 주소
# - 프론트엔드: http://localhost:5173
# - 백엔드 API: http://localhost:3002
# - PostgreSQL: localhost:5433
```

### 📋 개별 실행 방법

#### 1. 데이터베이스 시작
```bash
docker compose up -d db  # PostgreSQL만 실행
```

#### 2. 백엔드 실행
```bash  
cd backend
npm install
npm run dev  # 포트 3002, nodemon 자동 재시작
```

#### 3. 프론트엔드 실행
```bash
cd frontend  
npm install
npm run dev  # Vite 개발서버 localhost:5173
```

## API 엔드포인트

### REST API (http://localhost:3002/api)
- `GET /sessions` - 게임 세션 목록
- `POST /sessions` - 새 세션 생성
- `GET /sessions/:id` - 특정 세션 조회
- `PATCH /sessions/:id/status` - 세션 상태 변경
- `GET /characters/:id` - 캐릭터 조회
- `PATCH /characters/:id/stats` - 능력치 업데이트

### Socket.IO 이벤트
- `joinSession` - 게임 세션 참가
- `chatMessage` - 채팅 메시지 전송  
- `moveCharacter` - 캐릭터 이동
- `newGameEvent` - 실시간 게임 이벤트

## 데이터베이스 스키마

- `game_sessions` - 게임 세션 정보
- `characters` - 플레이어 캐릭터 (HP, MP, 위치, 능력치)
- `inventory` - 아이템 인벤토리  
- `maps` - 2D 타일 맵 데이터
- `game_events` - 모든 게임 활동 로그
- `npcs` - NPC/몬스터 정보

## 개발 명령어
- `npm start` - 백엔드 개발서버 
- `npm run dev` - 프론트엔드 개발서버
- `node database/migrate.js` - DB 마이그레이션 실행