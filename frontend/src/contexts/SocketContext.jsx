import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameSession, setGameSession] = useState(null);
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [gameEvents, setGameEvents] = useState([]);

  useEffect(() => {
    // Socket.IO 서버 연결 (백엔드 포트 3002)
    const newSocket = io('http://localhost:3002', {
      transports: ['websocket']
    });

    // 연결 이벤트
    newSocket.on('connect', () => {
      console.log('🔌 서버에 연결되었습니다:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ 서버와 연결이 끊어졌습니다');
      setConnected(false);
    });

    // 게임 세션 관련 이벤트
    newSocket.on('joinedSession', (data) => {
      console.log('🎮 세션 참가 성공:', data);
      setGameSession(data.session);
      setCharacter(data.character);
    });

    newSocket.on('playerJoined', (data) => {
      console.log('👤 새 플레이어 참가:', data);
      setMessages(prev => [...prev, {
        type: 'system',
        message: `${data.playerName}님이 게임에 참가했습니다.`,
        timestamp: new Date().toISOString()
      }]);
    });

    newSocket.on('gameHistory', (events) => {
      console.log('📜 게임 히스토리 로드:', events);
      setGameEvents(events);
    });

    // 채팅 메시지 이벤트
    newSocket.on('chatMessage', (data) => {
      console.log('💬 새 메시지:', data);
      setMessages(prev => [...prev, {
        type: 'chat',
        playerName: data.playerName,
        message: data.message,
        timestamp: data.timestamp
      }]);
    });

    // AI GM 메시지 이벤트
    newSocket.on('aiMessage', (data) => {
      console.log('🤖 AI GM 메시지:', data);
      setMessages(prev => [...prev, {
        type: 'ai',
        message: data.message,
        timestamp: data.timestamp
      }]);
    });

    // 캐릭터 상태 업데이트
    newSocket.on('characterUpdated', (updatedCharacter) => {
      console.log('⚡ 캐릭터 상태 업데이트:', updatedCharacter);
      setCharacter(updatedCharacter);
    });

    // 에러 핸들링
    newSocket.on('error', (error) => {
      console.error('❌ 서버 에러:', error);
      alert(error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // 세션 참가 함수
  const joinSession = (sessionId, playerName, characterName) => {
    if (socket && connected) {
      socket.emit('joinSession', { sessionId, playerName, characterName });
    }
  };

  // 메시지 전송 함수
  const sendMessage = (message) => {
    if (socket && connected && gameSession) {
      socket.emit('chatMessage', {
        sessionId: gameSession.id,
        message,
        timestamp: new Date().toISOString()
      });
    }
  };

  const value = {
    socket,
    connected,
    gameSession,
    character,
    messages,
    gameEvents,
    joinSession,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};