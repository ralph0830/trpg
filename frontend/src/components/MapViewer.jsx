import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const MapViewer = () => {
  const { gameSession, character } = useSocket();
  const [mapData, setMapData] = useState(null);
  const [gridSize] = useState({ width: 20, height: 15 }); // 기본 그리드 크기

  // 기본 맵 데이터 생성 (임시)
  useEffect(() => {
    if (gameSession && !mapData) {
      // 임시 맵 데이터 생성 (나중에 서버에서 받아오도록 수정)
      const defaultMap = Array(gridSize.height).fill().map((_, y) =>
        Array(gridSize.width).fill().map((_, x) => {
          // 테두리는 벽으로 설정
          if (x === 0 || x === gridSize.width - 1 || y === 0 || y === gridSize.height - 1) {
            return 'wall';
          }
          // 랜덤하게 일부 벽 배치
          if (Math.random() < 0.1) {
            return 'wall';
          }
          return 'floor';
        })
      );
      
      setMapData(defaultMap);
    }
  }, [gameSession, mapData, gridSize]);

  // 타일 타입별 스타일 정의
  const getTileStyle = (tileType, x, y) => {
    const baseStyle = {
      width: '25px',
      height: '25px',
      border: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      cursor: 'pointer'
    };

    // 캐릭터 위치 표시
    const isPlayerPosition = character && character.position_x === x && character.position_y === y;
    
    if (isPlayerPosition) {
      return {
        ...baseStyle,
        backgroundColor: '#2196f3',
        color: 'white',
        fontWeight: 'bold'
      };
    }

    switch (tileType) {
      case 'wall':
        return { ...baseStyle, backgroundColor: '#424242', color: 'white' };
      case 'floor':
        return { ...baseStyle, backgroundColor: '#f5f5f5' };
      case 'door':
        return { ...baseStyle, backgroundColor: '#795548', color: 'white' };
      case 'treasure':
        return { ...baseStyle, backgroundColor: '#ffc107' };
      default:
        return { ...baseStyle, backgroundColor: '#e0e0e0' };
    }
  };

  // 타일 타입별 표시 문자
  const getTileContent = (tileType, x, y) => {
    // 캐릭터 위치 표시
    if (character && character.position_x === x && character.position_y === y) {
      return '👤';
    }

    switch (tileType) {
      case 'wall':
        return '█';
      case 'floor':
        return '';
      case 'door':
        return '🚪';
      case 'treasure':
        return '💰';
      default:
        return '';
    }
  };

  // 타일 클릭 처리 (이동 요청)
  const handleTileClick = (x, y) => {
    if (character && mapData && mapData[y][x] !== 'wall') {
      // TODO: 서버에 이동 요청 전송
      console.log(`캐릭터 이동 요청: (${character.position_x}, ${character.position_y}) -> (${x}, ${y})`);
    }
  };

  if (!gameSession) {
    return (
      <div>
        <h2>게임 맵</h2>
        <div style={{ textAlign: 'center', color: '#999', padding: '50px' }}>
          게임 세션에 참가하면 맵이 표시됩니다.
        </div>
      </div>
    );
  }

  if (!mapData) {
    return (
      <div>
        <h2>게임 맵</h2>
        <div style={{ textAlign: 'center', color: '#999', padding: '50px' }}>
          맵 데이터를 로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>게임 맵</h2>
        {character && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            위치: ({character.position_x}, {character.position_y})
          </div>
        )}
      </div>

      {/* 맵 범례 */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '10px', 
        fontSize: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#424242', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>█</div>
          <span>벽</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd'
          }}></div>
          <span>바닥</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#2196f3', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>👤</div>
          <span>플레이어</span>
        </div>
      </div>

      {/* 맵 그리드 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
        gap: '0',
        border: '2px solid #333',
        width: 'fit-content',
        backgroundColor: 'white'
      }}>
        {mapData.map((row, y) =>
          row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              style={getTileStyle(tile, x, y)}
              onClick={() => handleTileClick(x, y)}
              title={`(${x}, ${y}) - ${tile}`}
            >
              {getTileContent(tile, x, y)}
            </div>
          ))
        )}
      </div>

      {/* 미니 컨트롤 */}
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        💡 팁: 타일을 클릭하여 이동할 수 있습니다. (벽 제외)
      </div>
    </div>
  );
};

export default MapViewer;
