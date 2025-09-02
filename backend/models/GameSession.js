const { pool } = require('../database/migrate');

class GameSession {
  // 새 게임 세션 생성
  static async create(sessionName, maxPlayers = 4) {
    const query = `
      INSERT INTO game_sessions (session_name, max_players, story_summary) 
      VALUES ($1, $2, '새로운 모험이 시작되려 합니다.') 
      RETURNING *;
    `;
    const result = await pool.query(query, [sessionName, maxPlayers]);
    return result.rows[0];
  }

  // 게임 세션 조회
  static async findById(sessionId) {
    const query = `SELECT * FROM game_sessions WHERE id = $1;`;
    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  // 모든 게임 세션 조회
  static async findAll() {
    const query = `SELECT * FROM game_sessions ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
  }

  // 게임 세션 상태 업데이트
  static async updateStatus(sessionId, status, additionalData = {}) {
    const fields = ['status = $2'];
    const values = [sessionId, status];
    let paramIndex = 3;

    if (additionalData.startedAt) {
      fields.push(`started_at = $${paramIndex++}`);
      values.push(additionalData.startedAt);
    }
    
    if (additionalData.endedAt) {
      fields.push(`ended_at = $${paramIndex++}`);
      values.push(additionalData.endedAt);
    }
    
    if (additionalData.currentPlayers !== undefined) {
      fields.push(`current_players = $${paramIndex++}`);
      values.push(additionalData.currentPlayers);
    }

    const query = `
      UPDATE game_sessions 
      SET ${fields.join(', ')} 
      WHERE id = $1 
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // AI 컨텍스트 업데이트
  static async updateAIContext(sessionId, context, storySummary) {
    const query = `
      UPDATE game_sessions 
      SET ai_context = $2, story_summary = $3 
      WHERE id = $1 
      RETURNING *;
    `;
    const result = await pool.query(query, [sessionId, context, storySummary]);
    return result.rows[0];
  }

  // 게임 세션 삭제
  static async delete(sessionId) {
    const query = `DELETE FROM game_sessions WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }
}

module.exports = GameSession;