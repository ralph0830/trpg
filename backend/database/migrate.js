const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// DB 연결 설정 (환경 변수에서 가져오기)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USER || 'ralph',
  password: process.env.DB_PASSWORD || 'pjtfc1251!',
  database: process.env.DB_NAME || 'trpg',
});

async function runMigration() {
  try {
    console.log('🔄 데이터베이스 마이그레이션 시작...');
    
    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // 마이그레이션 실행
    await pool.query(schema);
    
    console.log('✅ 데이터베이스 스키마 생성 완료!');
    
    // 기본 데이터 삽입
    await insertSeedData();
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  }
}

async function insertSeedData() {
  try {
    console.log('🌱 시드 데이터 삽입 시작...');
    
    // 샘플 게임 세션 생성
    const sessionResult = await pool.query(`
      INSERT INTO game_sessions (session_name, status, story_summary) 
      VALUES ('테스트 모험', 'waiting', '새로운 모험이 시작되려 합니다.')
      RETURNING id;
    `);
    
    const sessionId = sessionResult.rows[0].id;
    console.log(`📋 테스트 게임 세션 생성 완료 (ID: ${sessionId})`);
    
    // 샘플 맵 데이터 생성 (10x10 마을 맵)
    const mapData = Array(10).fill(null).map(() => 
      Array(10).fill(0).map((_, x) => x === 0 || x === 9 ? 1 : 0) // 테두리는 벽(1), 내부는 빈공간(0)
    );
    
    await pool.query(`
      INSERT INTO maps (session_id, map_name, width, height, map_data, map_type, description, is_active) 
      VALUES ($1, '시작 마을', 10, 10, $2, 'town', '모험이 시작되는 평화로운 마을', true);
    `, [sessionId, JSON.stringify(mapData)]);
    
    console.log('🗺️ 샘플 맵 생성 완료');
    
    // 샘플 NPC 생성
    await pool.query(`
      INSERT INTO npcs (session_id, map_id, npc_name, npc_type, position_x, position_y, personality, is_hostile) 
      VALUES ($1, (SELECT id FROM maps WHERE session_id = $1 LIMIT 1), '마을 촌장', 'npc', 5, 5, '친절하고 현명한 마을의 지도자', false);
    `, [sessionId]);
    
    console.log('👥 샘플 NPC 생성 완료');
    console.log('✅ 시드 데이터 삽입 완료!');
    
  } catch (error) {
    console.error('❌ 시드 데이터 삽입 실패:', error);
    throw error;
  }
}

// 직접 실행시 마이그레이션 실행
if (require.main === module) {
  require('dotenv').config();
  runMigration()
    .then(() => {
      console.log('🎉 모든 마이그레이션 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 마이그레이션 실패:', error);
      process.exit(1);
    });
}

module.exports = { runMigration, pool };