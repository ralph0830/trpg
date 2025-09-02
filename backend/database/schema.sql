-- TRPG 게임 데이터베이스 스키마
-- 생성일: 2025.09.02

-- 게임 세션 테이블
CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    session_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'waiting', -- waiting, active, completed, paused
    max_players INTEGER DEFAULT 4,
    current_players INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    ai_context TEXT, -- AI 게임 마스터의 현재 컨텍스트
    story_summary TEXT -- 현재까지의 스토리 요약
);

-- 플레이어 캐릭터 테이블
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_name VARCHAR(255) NOT NULL,
    character_name VARCHAR(255) NOT NULL,
    character_class VARCHAR(100), -- 전사, 마법사, 도적 등
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    
    -- 기본 능력치
    max_hp INTEGER DEFAULT 100,
    current_hp INTEGER DEFAULT 100,
    max_mp INTEGER DEFAULT 50,
    current_mp INTEGER DEFAULT 50,
    
    -- 스탯
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    
    -- 위치 정보
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    
    -- 상태
    is_active BOOLEAN DEFAULT TRUE, -- 플레이어가 온라인인지
    is_ai_controlled BOOLEAN DEFAULT FALSE, -- AI가 대신 조작 중인지
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인벤토리 테이블
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(100), -- weapon, armor, potion, misc
    item_description TEXT,
    quantity INTEGER DEFAULT 1,
    item_stats JSONB, -- 아이템 능력치 (JSON 형태)
    is_equipped BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 맵 데이터 테이블
CREATE TABLE IF NOT EXISTS maps (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    map_name VARCHAR(255) NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    map_data JSONB NOT NULL, -- 2D 배열 맵 데이터
    map_type VARCHAR(100), -- town, dungeon, field
    description TEXT,
    is_active BOOLEAN DEFAULT FALSE, -- 현재 활성화된 맵인지
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게임 이벤트 로그 테이블 (채팅, 행동, AI 응답 등)
CREATE TABLE IF NOT EXISTS game_events (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- chat, action, ai_response, combat, item_use
    event_data JSONB NOT NULL, -- 이벤트 상세 데이터
    message TEXT, -- 표시될 메시지
    is_visible_to_all BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NPC 및 몬스터 테이블
CREATE TABLE IF NOT EXISTS npcs (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
    npc_name VARCHAR(255) NOT NULL,
    npc_type VARCHAR(100), -- npc, monster, boss
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    
    -- NPC 능력치 (몬스터용)
    max_hp INTEGER DEFAULT 50,
    current_hp INTEGER DEFAULT 50,
    attack_power INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 5,
    
    -- AI 관련
    personality TEXT, -- NPC 성격/행동 패턴
    dialogue_context TEXT, -- 대화 컨텍스트
    
    is_alive BOOLEAN DEFAULT TRUE,
    is_hostile BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_characters_session_id ON characters(session_id);
CREATE INDEX IF NOT EXISTS idx_inventory_character_id ON inventory(character_id);
CREATE INDEX IF NOT EXISTS idx_maps_session_id ON maps(session_id);
CREATE INDEX IF NOT EXISTS idx_game_events_session_id ON game_events(session_id);
CREATE INDEX IF NOT EXISTS idx_game_events_created_at ON game_events(created_at);
CREATE INDEX IF NOT EXISTS idx_npcs_session_id ON npcs(session_id);
CREATE INDEX IF NOT EXISTS idx_npcs_map_id ON npcs(map_id);