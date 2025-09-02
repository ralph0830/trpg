import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

const SessionManager = () => {
  const { joinSession, gameSession, connected } = useSocket();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [formData, setFormData] = useState({
    sessionId: '',
    playerName: '',
    characterName: ''
  });

  // 폼 데이터 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 세션 참가 처리
  const handleJoinSession = (e) => {
    e.preventDefault();
    if (formData.sessionId && formData.playerName && formData.characterName) {
      joinSession(formData.sessionId, formData.playerName, formData.characterName);
      setShowJoinForm(false);
    }
  };

  // 새 세션 생성 (임시로 랜덤 ID 사용)
  const handleCreateSession = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionName: `TRPG 세션 ${new Date().toLocaleDateString()}`,
          maxPlayers: 4
        })
      });

      if (response.ok) {
        const newSession = await response.json();
        setFormData(prev => ({
          ...prev,
          sessionId: newSession.id
        }));
        setShowJoinForm(true);
        alert(`새 게임 세션이 생성되었습니다! ID: ${newSession.id}`);
      } else {
        alert('세션 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('세션 생성 오류:', error);
      alert('세션 생성 중 오류가 발생했습니다.');
    }
  };

  // 이미 게임 세션에 참가한 경우
  if (gameSession) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#e8f5e8',
        border: '1px solid #4caf50',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <div><strong>🎮 {gameSession.name}</strong></div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          세션 ID: {gameSession.id}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      minWidth: '400px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        🎲 AI TRPG 게임
      </h2>
      
      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '5px 10px', 
          borderRadius: '4px',
          backgroundColor: connected ? '#e8f5e8' : '#ffebee',
          color: connected ? '#2e7d32' : '#c62828',
          fontSize: '14px'
        }}>
          {connected ? '🟢 서버 연결됨' : '🔴 서버 연결 중...'}
        </div>
      </div>

      {!showJoinForm ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', color: '#666' }}>
            게임을 시작하려면 새 세션을 생성하거나 기존 세션에 참가하세요.
          </div>
          
          <button
            onClick={handleCreateSession}
            disabled={!connected}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: connected ? '#1976d2' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: connected ? 'pointer' : 'not-allowed'
            }}
          >
            🎮 새 게임 세션 생성
          </button>

          <button
            onClick={() => setShowJoinForm(true)}
            disabled={!connected}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: connected ? '#4caf50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: connected ? 'pointer' : 'not-allowed'
            }}
          >
            👥 기존 세션 참가
          </button>
        </div>
      ) : (
        <form onSubmit={handleJoinSession}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              세션 ID:
            </label>
            <input
              type="text"
              name="sessionId"
              value={formData.sessionId}
              onChange={handleInputChange}
              placeholder="게임 세션 ID를 입력하세요"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              플레이어 이름:
            </label>
            <input
              type="text"
              name="playerName"
              value={formData.playerName}
              onChange={handleInputChange}
              placeholder="당신의 이름을 입력하세요"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              캐릭터 이름:
            </label>
            <input
              type="text"
              name="characterName"
              value={formData.characterName}
              onChange={handleInputChange}
              placeholder="캐릭터 이름을 입력하세요"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowJoinForm(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '12px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              세션 참가
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SessionManager;