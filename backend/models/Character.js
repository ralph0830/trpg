const { pool } = require('../database/migrate');

class Character {
  // 새 캐릭터 생성
  static async create(sessionId, playerName, characterName, characterClass = 'adventurer') {
    const query = `
      INSERT INTO characters (
        session_id, player_name, character_name, character_class,
        max_hp, current_hp, max_mp, current_mp
      ) 
      VALUES ($1, $2, $3, $4, 100, 100, 50, 50) 
      RETURNING *;
    `;
    const result = await pool.query(query, [sessionId, playerName, characterName, characterClass]);
    return result.rows[0];
  }

  // 캐릭터 조회
  static async findById(characterId) {
    const query = `SELECT * FROM characters WHERE id = $1;`;
    const result = await pool.query(query, [characterId]);
    return result.rows[0];
  }

  // 세션별 캐릭터 목록 조회
  static async findBySessionId(sessionId) {
    const query = `SELECT * FROM characters WHERE session_id = $1 ORDER BY created_at;`;
    const result = await pool.query(query, [sessionId]);
    return result.rows;
  }

  // 캐릭터 위치 업데이트
  static async updatePosition(characterId, x, y) {
    const query = `
      UPDATE characters 
      SET position_x = $2, position_y = $3, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *;
    `;
    const result = await pool.query(query, [characterId, x, y]);
    return result.rows[0];
  }

  // 캐릭터 HP/MP 업데이트
  static async updateStats(characterId, statsUpdate) {
    const fields = [];
    const values = [characterId];
    let paramIndex = 2;

    if (statsUpdate.currentHp !== undefined) {
      fields.push(`current_hp = $${paramIndex++}`);
      values.push(statsUpdate.currentHp);
    }
    
    if (statsUpdate.currentMp !== undefined) {
      fields.push(`current_mp = $${paramIndex++}`);
      values.push(statsUpdate.currentMp);
    }
    
    if (statsUpdate.maxHp !== undefined) {
      fields.push(`max_hp = $${paramIndex++}`);
      values.push(statsUpdate.maxHp);
    }
    
    if (statsUpdate.maxMp !== undefined) {
      fields.push(`max_mp = $${paramIndex++}`);
      values.push(statsUpdate.maxMp);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE characters 
      SET ${fields.join(', ')} 
      WHERE id = $1 
      RETURNING *;
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 캐릭터 활성 상태 업데이트
  static async updateActiveStatus(characterId, isActive, isAiControlled = false) {
    const query = `
      UPDATE characters 
      SET is_active = $2, is_ai_controlled = $3, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *;
    `;
    const result = await pool.query(query, [characterId, isActive, isAiControlled]);
    return result.rows[0];
  }

  // 캐릭터 삭제
  static async delete(characterId) {
    const query = `DELETE FROM characters WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [characterId]);
    return result.rows[0];
  }
}

module.exports = Character;