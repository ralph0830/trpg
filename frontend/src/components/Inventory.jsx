import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const Inventory = () => {
  const { character, gameSession } = useSocket();
  const [inventoryItems, setInventoryItems] = useState([]);

  // 임시 인벤토리 데이터 (나중에 서버에서 받아오도록 수정)
  useEffect(() => {
    if (character && gameSession) {
      // TODO: 서버에서 실제 인벤토리 데이터 가져오기
      const defaultItems = [
        { id: 1, name: '체력 포션', quantity: 3, type: 'consumable', description: 'HP를 50 회복합니다.', icon: '🧪' },
        { id: 2, name: '롱소드', quantity: 1, type: 'weapon', description: '1d8 베기 피해를 줍니다.', icon: '⚔️' },
        { id: 3, name: '가죽 갑옷', quantity: 1, type: 'armor', description: 'AC +2 보너스를 제공합니다.', icon: '🛡️' },
        { id: 4, name: '금화', quantity: 50, type: 'currency', description: '게임 내 화폐입니다.', icon: '💰' },
        { id: 5, name: '마나 포션', quantity: 2, type: 'consumable', description: 'MP를 30 회복합니다.', icon: '🔵' }
      ];
      setInventoryItems(defaultItems);
    }
  }, [character, gameSession]);

  // 아이템 사용 처리
  const handleUseItem = (item) => {
    if (item.type === 'consumable' && item.quantity > 0) {
      console.log(`아이템 사용: ${item.name}`);
      
      // 아이템 수량 감소
      setInventoryItems(prevItems =>
        prevItems.map(invItem =>
          invItem.id === item.id
            ? { ...invItem, quantity: invItem.quantity - 1 }
            : invItem
        ).filter(invItem => invItem.quantity > 0)
      );
      
      // TODO: 서버에 아이템 사용 요청 전송
      alert(`${item.name}을(를) 사용했습니다!`);
    } else if (item.type === 'weapon' || item.type === 'armor') {
      console.log(`아이템 장착: ${item.name}`);
      // TODO: 아이템 장착/해제 로직
      alert(`${item.name}을(를) 장착했습니다!`);
    }
  };

  // 아이템 타입별 색상
  const getItemTypeColor = (type) => {
    switch (type) {
      case 'weapon':
        return '#f44336';
      case 'armor':
        return '#2196f3';
      case 'consumable':
        return '#4caf50';
      case 'currency':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  // 아이템 타입별 한글명
  const getItemTypeLabel = (type) => {
    switch (type) {
      case 'weapon':
        return '무기';
      case 'armor':
        return '방어구';
      case 'consumable':
        return '소모품';
      case 'currency':
        return '화폐';
      default:
        return '기타';
    }
  };

  if (!character) {
    return (
      <div>
        <h2>인벤토리</h2>
        <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          게임 세션에 참가하면 인벤토리가 표시됩니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>인벤토리</h2>
      
      {/* 인벤토리 상태 */}
      <div style={{ 
        marginBottom: '15px', 
        fontSize: '12px', 
        color: '#666',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <div>소지품: {inventoryItems.length}개</div>
        <div>무게: {inventoryItems.reduce((sum, item) => sum + item.quantity, 0)} / 100</div>
      </div>

      {/* 아이템 목록 */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {inventoryItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            인벤토리가 비어있습니다.
          </div>
        ) : (
          inventoryItems.map(item => (
            <div 
              key={item.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => handleUseItem(item)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: getItemTypeColor(item.type),
                      fontWeight: 'bold'
                    }}>
                      {getItemTypeLabel(item.type)}
                    </div>
                  </div>
                </div>
                
                {item.quantity > 1 && (
                  <div style={{
                    backgroundColor: '#e0e0e0',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ×{item.quantity}
                  </div>
                )}
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginTop: '6px',
                fontStyle: 'italic'
              }}>
                {item.description}
              </div>
              
              {/* 사용 가능한 아이템에 대한 힌트 */}
              {item.type === 'consumable' && (
                <div style={{ 
                  fontSize: '11px', 
                  color: '#4caf50', 
                  marginTop: '4px'
                }}>
                  💡 클릭하여 사용
                </div>
              )}
              
              {(item.type === 'weapon' || item.type === 'armor') && (
                <div style={{ 
                  fontSize: '11px', 
                  color: '#2196f3', 
                  marginTop: '4px'
                }}>
                  💡 클릭하여 장착
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 인벤토리 관리 팁 */}
      <div style={{ 
        marginTop: '10px', 
        fontSize: '11px', 
        color: '#999',
        borderTop: '1px solid #eee',
        paddingTop: '8px'
      }}>
        💡 아이템을 클릭하여 사용하거나 장착할 수 있습니다.
      </div>
    </div>
  );
};

export default Inventory;
