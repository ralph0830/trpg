import React from 'react';
import { useSocket } from './contexts/SocketContext';
import MapViewer from './components/MapViewer';
import CharacterStatus from './components/CharacterStatus';
import Inventory from './components/Inventory';
import ChatWindow from './components/ChatWindow';
import SessionManager from './components/SessionManager';

function App() {
  const { gameSession } = useSocket();

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* 게임 세션에 참가하지 않은 경우 SessionManager 표시 */}
      {!gameSession && <SessionManager />}
      
      <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '10px' }}>
        <MapViewer />
      </div>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
          <CharacterStatus />
        </div>
        <div style={{ flex: 1 }}>
          <Inventory />
        </div>
      </div>
      <div style={{ width: '400px', padding: '10px' }}>
        <ChatWindow />
      </div>
    </div>
  );
}

export default App;
