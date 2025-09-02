import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const ChatWindow = () => {
  const { messages, sendMessage, connected, gameSession, character } = useSocket();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 처리
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && gameSession && character) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  // 메시지 타입별 스타일 설정
  const getMessageStyle = (messageType) => {
    const baseStyle = {
      margin: '5px 0',
      padding: '8px 12px',
      borderRadius: '8px',
      wordWrap: 'break-word'
    };

    switch (messageType) {
      case 'system':
        return { ...baseStyle, backgroundColor: '#e3f2fd', fontStyle: 'italic' };
      case 'ai':
        return { ...baseStyle, backgroundColor: '#f3e5f5', border: '1px solid #9c27b0' };
      case 'chat':
        return { ...baseStyle, backgroundColor: '#f5f5f5' };
      default:
        return baseStyle;
    }
  };

  // 연결 상태 표시
  const connectionStatus = connected ? '🟢 연결됨' : '🔴 연결끊김';
  const gameStatus = gameSession ? `게임: ${gameSession.name}` : '게임 세션 없음';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
        <h2>Chat</h2>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div>{connectionStatus}</div>
          <div>{gameStatus}</div>
          {character && <div>캐릭터: {character.character_name}</div>}
        </div>
      </div>
      
      <div style={{ 
        flex: 1, 
        border: '1px solid #ccc', 
        marginBottom: '10px', 
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#fafafa'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
            아직 메시지가 없습니다. 게임 세션에 참가하고 채팅을 시작해보세요!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={getMessageStyle(msg.type)}>
              {msg.type === 'chat' && (
                <strong style={{ color: '#1976d2' }}>{msg.playerName}: </strong>
              )}
              {msg.type === 'ai' && (
                <strong style={{ color: '#9c27b0' }}>🤖 GM: </strong>
              )}
              {msg.type === 'system' && (
                <span style={{ color: '#666' }}>📢 </span>
              )}
              <span>{msg.message}</span>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
        <input 
          type="text" 
          placeholder={
            !connected ? "서버 연결 중..." : 
            !gameSession ? "게임 세션에 참가하세요" : 
            "메시지를 입력하세요..."
          }
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={!connected || !gameSession}
          style={{ 
            flex: 1, 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '4px 0 0 4px'
          }}
        />
        <button 
          type="submit" 
          disabled={!connected || !gameSession || !inputMessage.trim()}
          style={{
            padding: '10px 15px',
            backgroundColor: connected && gameSession ? '#1976d2' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: connected && gameSession ? 'pointer' : 'not-allowed'
          }}
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
