const express = require('express');
const router = express.Router();
const GameSession = require('../models/GameSession');
const Character = require('../models/Character');
const GameEvent = require('../models/GameEvent');

// 모든 게임 세션 조회
router.get('/', async (req, res) => {
  try {
    const sessions = await GameSession.findAll();
    res.json(sessions);
  } catch (error) {
    console.error('세션 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 특정 게임 세션 조회
router.get('/:id', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = await GameSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: '게임 세션을 찾을 수 없습니다.' });
    }

    // 세션의 캐릭터들도 함께 조회
    const characters = await Character.findBySessionId(sessionId);
    
    res.json({
      ...session,
      characters
    });
  } catch (error) {
    console.error('세션 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 새 게임 세션 생성
router.post('/', async (req, res) => {
  try {
    const { sessionName, maxPlayers = 4 } = req.body;
    
    if (!sessionName) {
      return res.status(400).json({ error: '세션 이름이 필요합니다.' });
    }

    const session = await GameSession.create(sessionName, maxPlayers);
    
    // 환영 메시지 생성
    await GameEvent.createAIResponse(session.id, 
      `새로운 모험이 시작됩니다! "${sessionName}" 세션에 오신 것을 환영합니다.`
    );
    
    res.status(201).json(session);
  } catch (error) {
    console.error('세션 생성 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 게임 세션 상태 업데이트
router.patch('/:id/status', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!['waiting', 'active', 'completed', 'paused'].includes(status)) {
      return res.status(400).json({ error: '잘못된 상태입니다.' });
    }

    const additionalData = {};
    if (status === 'active') {
      additionalData.startedAt = new Date();
    } else if (status === 'completed') {
      additionalData.endedAt = new Date();
    }

    const session = await GameSession.updateStatus(sessionId, status, additionalData);
    
    if (!session) {
      return res.status(404).json({ error: '게임 세션을 찾을 수 없습니다.' });
    }

    res.json(session);
  } catch (error) {
    console.error('세션 상태 업데이트 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 게임 세션 이벤트 조회
router.get('/:id/events', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit) || 50;
    const eventType = req.query.type;
    
    let events;
    if (eventType) {
      events = await GameEvent.findByType(sessionId, eventType, limit);
    } else {
      events = await GameEvent.findBySessionId(sessionId, limit);
    }
    
    res.json(events);
  } catch (error) {
    console.error('이벤트 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 게임 세션 삭제
router.delete('/:id', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = await GameSession.delete(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: '게임 세션을 찾을 수 없습니다.' });
    }

    res.json({ message: '게임 세션이 삭제되었습니다.', session });
  } catch (error) {
    console.error('세션 삭제 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;