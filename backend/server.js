require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { Pool } = require('pg');

// Import models
const GameSession = require('./models/GameSession');
const Character = require('./models/Character');
const GameEvent = require('./models/GameEvent');

// DB Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test DB Connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL database!');
  client.release();
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, you should restrict this to your frontend's domain
    methods: ["GET", "POST"]
  }
});

// 미들웨어
app.use(express.json());

// CORS 미들웨어 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // OPTIONS 요청에 대한 응답
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 라우터 설정
const sessionsRouter = require('./routes/sessions');
const charactersRouter = require('./routes/characters');

app.use('/api/sessions', sessionsRouter);
app.use('/api/characters', charactersRouter);

// 활성 게임 세션과 플레이어 추적
const activeSessions = new Map(); // sessionId -> { players: Set, status: 'waiting'|'active' }
const playerSessions = new Map(); // socketId -> { sessionId, characterId }

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('<h1>AI TRPG Backend</h1>');
});

// Socket.IO 이벤트 핸들러
io.on('connection', (socket) => {
  console.log(`👤 사용자 연결: ${socket.id}`);

  // 게임 세션 참가
  socket.on('joinSession', async (data) => {
    try {
      const { sessionId, playerName, characterName } = data;
      
      // 세션 존재 확인
      const session = await GameSession.findById(sessionId);
      if (!session) {
        socket.emit('error', { message: '존재하지 않는 게임 세션입니다.' });
        return;
      }

      // 캐릭터 생성 또는 조회
      let character;
      const existingCharacters = await Character.findBySessionId(sessionId);
      const existingCharacter = existingCharacters.find(c => c.player_name === playerName);
      
      if (existingCharacter) {
        character = await Character.updateActiveStatus(existingCharacter.id, true, false);
      } else {
        if (existingCharacters.length >= session.max_players) {
          socket.emit('error', { message: '게임 세션이 가득찼습니다.' });
          return;
        }
        character = await Character.create(sessionId, playerName, characterName);
      }

      // 세션 추적 정보 업데이트
      if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, { players: new Set(), status: 'waiting' });
      }
      
      const sessionData = activeSessions.get(sessionId);
      sessionData.players.add(socket.id);
      playerSessions.set(socket.id, { sessionId, characterId: character.id });

      // 소켓을 세션 룸에 추가
      socket.join(`session_${sessionId}`);

      // 세션 플레이어 수 업데이트
      await GameSession.updateStatus(sessionId, sessionData.status, { 
        currentPlayers: sessionData.players.size 
      });

      // 클라이언트에 성공 응답
      socket.emit('joinedSession', {
        session,
        character,
        players: existingCharacters.length + (existingCharacter ? 0 : 1)
      });

      // 세션의 모든 플레이어에게 새 플레이어 알림
      socket.to(`session_${sessionId}`).emit('playerJoined', {
        playerName,
        characterName: character.character_name,
        playersCount: sessionData.players.size
      });

      // 기존 게임 이벤트 로드
      const gameEvents = await GameEvent.findBySessionId(sessionId, 20);
      socket.emit('gameHistory', gameEvents);

      console.log(`🎮 ${playerName}이(가) 세션 ${sessionId}에 참가했습니다.`);

    } catch (error) {
      console.error('세션 참가 오류:', error);
      socket.emit('error', { message: '세션 참가에 실패했습니다.' });
    }
  });

  // 채팅 메시지
  socket.on('chatMessage', async (data) => {
    try {
      const playerSession = playerSessions.get(socket.id);
      if (!playerSession) {
        socket.emit('error', { message: '게임 세션에 참가해주세요.' });
        return;
      }

      const { sessionId, characterId } = playerSession;
      const { message } = data;

      // 게임 이벤트 생성
      const gameEvent = await GameEvent.createChatMessage(sessionId, characterId, message);
      
      // 캐릭터 정보 포함하여 브로드캐스트
      const character = await Character.findById(characterId);
      const eventData = {
        ...gameEvent,
        character_name: character.character_name,
        player_name: character.player_name
      };

      io.to(`session_${sessionId}`).emit('newGameEvent', eventData);

    } catch (error) {
      console.error('채팅 메시지 오류:', error);
      socket.emit('error', { message: '메시지 전송에 실패했습니다.' });
    }
  });

  // 캐릭터 이동
  socket.on('moveCharacter', async (data) => {
    try {
      const playerSession = playerSessions.get(socket.id);
      if (!playerSession) return;

      const { sessionId, characterId } = playerSession;
      const { x, y } = data;

      // 캐릭터 위치 업데이트
      const updatedCharacter = await Character.updatePosition(characterId, x, y);

      // 세션의 모든 플레이어에게 위치 업데이트 브로드캐스트
      io.to(`session_${sessionId}`).emit('characterMoved', {
        characterId,
        position: { x, y },
        characterName: updatedCharacter.character_name
      });

    } catch (error) {
      console.error('캐릭터 이동 오류:', error);
    }
  });

  // 연결 해제
  socket.on('disconnect', async () => {
    try {
      const playerSession = playerSessions.get(socket.id);
      if (playerSession) {
        const { sessionId, characterId } = playerSession;
        
        // 세션 추적 정보에서 제거
        const sessionData = activeSessions.get(sessionId);
        if (sessionData) {
          sessionData.players.delete(socket.id);
          
          // 세션 플레이어 수 업데이트
          await GameSession.updateStatus(sessionId, sessionData.status, { 
            currentPlayers: sessionData.players.size 
          });

          // 빈 세션 정리
          if (sessionData.players.size === 0) {
            activeSessions.delete(sessionId);
          }
        }

        // 캐릭터를 비활성화 (AI 제어로 전환 가능)
        await Character.updateActiveStatus(characterId, false, true);
        
        // 세션의 다른 플레이어들에게 알림
        socket.to(`session_${sessionId}`).emit('playerLeft', {
          characterId,
          playersCount: sessionData ? sessionData.players.size : 0
        });

        playerSessions.delete(socket.id);
      }

      console.log(`👤 사용자 연결 해제: ${socket.id}`);
    } catch (error) {
      console.error('연결 해제 처리 오류:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});