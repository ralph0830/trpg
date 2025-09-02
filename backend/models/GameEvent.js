const { pool } = require('../database/migrate');

class GameEvent {
  // 새 게임 이벤트 생성 (채팅, 행동, AI 응답 등)
  static async create(sessionId, eventType, eventData, message, characterId = null, isVisibleToAll = true) {
    const query = `
      INSERT INTO game_events (session_id, character_id, event_type, event_data, message, is_visible_to_all) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `;
    const result = await pool.query(query, [
      sessionId, characterId, eventType, JSON.stringify(eventData), message, isVisibleToAll
    ]);
    return result.rows[0];
  }

  // 세션별 게임 이벤트 조회 (최신순)
  static async findBySessionId(sessionId, limit = 50) {
    const query = `
      SELECT ge.*, c.character_name, c.player_name 
      FROM game_events ge 
      LEFT JOIN characters c ON ge.character_id = c.id 
      WHERE ge.session_id = $1 
      ORDER BY ge.created_at DESC 
      LIMIT $2;
    `;
    const result = await pool.query(query, [sessionId, limit]);
    return result.rows.reverse(); // 시간순으로 정렬
  }

  // 채팅 메시지 생성
  static async createChatMessage(sessionId, characterId, message) {
    return await this.create(sessionId, 'chat', { message }, message, characterId, true);
  }

  // AI 응답 생성
  static async createAIResponse(sessionId, aiResponse, context = {}) {
    return await this.create(sessionId, 'ai_response', { response: aiResponse, context }, aiResponse, null, true);
  }

  // 액션 이벤트 생성
  static async createActionEvent(sessionId, characterId, action, result) {
    const message = `${action.character_name}이(가) ${action.type}을(를) 시도합니다.`;
    return await this.create(sessionId, 'action', { action, result }, message, characterId, true);
  }

  // 전투 이벤트 생성
  static async createCombatEvent(sessionId, attackerId, targetId, combatResult) {
    const message = `전투가 발생했습니다!`;
    return await this.create(sessionId, 'combat', { 
      attacker_id: attackerId, 
      target_id: targetId, 
      result: combatResult 
    }, message, attackerId, true);
  }

  // 특정 타입의 이벤트만 조회
  static async findByType(sessionId, eventType, limit = 20) {
    const query = `
      SELECT ge.*, c.character_name, c.player_name 
      FROM game_events ge 
      LEFT JOIN characters c ON ge.character_id = c.id 
      WHERE ge.session_id = $1 AND ge.event_type = $2 
      ORDER BY ge.created_at DESC 
      LIMIT $3;
    `;
    const result = await pool.query(query, [sessionId, eventType, limit]);
    return result.rows.reverse();
  }

  // 오래된 이벤트 삭제 (성능 최적화용)
  static async deleteOldEvents(daysOld = 7) {
    const query = `
      DELETE FROM game_events 
      WHERE created_at < NOW() - INTERVAL '${daysOld} days' 
      RETURNING id;
    `;
    const result = await pool.query(query);
    return result.rows.length; // 삭제된 행 수 반환
  }
}

module.exports = GameEvent;