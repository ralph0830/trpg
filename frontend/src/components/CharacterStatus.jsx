import React from 'react';
import { useSocket } from '../contexts/SocketContext';

const CharacterStatus = () => {
  const { character, gameSession } = useSocket();

  // HP/MP 게이지 컴포넌트
  const StatusBar = ({ label, current, max, color }) => {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    
    return (
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
          <span><strong>{label}</strong></span>
          <span>{current}/{max}</span>
        </div>
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    );
  };

  // 능력치 표시 컴포넌트
  const AbilityScore = ({ name, value, modifier }) => (
    <div style={{ 
      textAlign: 'center', 
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      margin: '2px'
    }}>
      <div style={{ fontSize: '12px', color: '#666' }}>{name}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#999' }}>
        {modifier >= 0 ? '+' : ''}{modifier}
      </div>
    </div>
  );

  if (!character) {
    return (
      <div>
        <h2>캐릭터 상태</h2>
        <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          게임 세션에 참가하면 캐릭터 정보가 표시됩니다.
        </div>
      </div>
    );
  }

  // 능력치 수정치 계산 (D&D 5e 규칙)
  const getModifier = (score) => Math.floor((score - 10) / 2);

  return (
    <div>
      <h2>캐릭터 상태</h2>
      
      {/* 캐릭터 기본 정보 */}
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
          {character.character_name}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          플레이어: {character.player_name}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          위치: ({character.position_x}, {character.position_y})
        </div>
      </div>

      {/* HP/MP 게이지 */}
      <StatusBar 
        label="체력 (HP)" 
        current={character.current_hp} 
        max={character.max_hp} 
        color="#f44336" 
      />
      
      <StatusBar 
        label="마나 (MP)" 
        current={character.current_mp} 
        max={character.max_mp} 
        color="#2196f3" 
      />

      {/* 기본 능력치 */}
      <div style={{ marginTop: '15px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
          능력치
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          <AbilityScore 
            name="힘" 
            value={character.strength} 
            modifier={getModifier(character.strength)} 
          />
          <AbilityScore 
            name="민첩" 
            value={character.dexterity} 
            modifier={getModifier(character.dexterity)} 
          />
          <AbilityScore 
            name="체력" 
            value={character.constitution} 
            modifier={getModifier(character.constitution)} 
          />
          <AbilityScore 
            name="지능" 
            value={character.intelligence} 
            modifier={getModifier(character.intelligence)} 
          />
          <AbilityScore 
            name="지혜" 
            value={character.wisdom} 
            modifier={getModifier(character.wisdom)} 
          />
          <AbilityScore 
            name="매력" 
            value={character.charisma} 
            modifier={getModifier(character.charisma)} 
          />
        </div>
      </div>

      {/* 게임 상태 */}
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <div>레벨: {character.level || 1}</div>
        <div>활성 상태: {character.is_active ? '🟢 온라인' : '🔴 오프라인'}</div>
        <div>AI 제어: {character.is_ai_controlled ? '🤖 AI 제어' : '👤 플레이어 제어'}</div>
      </div>
    </div>
  );
};

export default CharacterStatus;
