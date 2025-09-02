const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// 캐릭터 조회
router.get('/:id', async (req, res) => {
  try {
    const characterId = parseInt(req.params.id);
    const character = await Character.findById(characterId);
    
    if (!character) {
      return res.status(404).json({ error: '캐릭터를 찾을 수 없습니다.' });
    }

    res.json(character);
  } catch (error) {
    console.error('캐릭터 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 캐릭터 능력치 업데이트
router.patch('/:id/stats', async (req, res) => {
  try {
    const characterId = parseInt(req.params.id);
    const statsUpdate = req.body;
    
    // 허용된 능력치만 업데이트
    const allowedStats = ['currentHp', 'currentMp', 'maxHp', 'maxMp'];
    const filteredStats = {};
    
    for (const stat of allowedStats) {
      if (statsUpdate[stat] !== undefined) {
        filteredStats[stat] = parseInt(statsUpdate[stat]);
      }
    }

    if (Object.keys(filteredStats).length === 0) {
      return res.status(400).json({ error: '업데이트할 능력치가 없습니다.' });
    }

    const character = await Character.updateStats(characterId, filteredStats);
    
    if (!character) {
      return res.status(404).json({ error: '캐릭터를 찾을 수 없습니다.' });
    }

    res.json(character);
  } catch (error) {
    console.error('캐릭터 능력치 업데이트 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 캐릭터 위치 업데이트
router.patch('/:id/position', async (req, res) => {
  try {
    const characterId = parseInt(req.params.id);
    const { x, y } = req.body;
    
    if (x === undefined || y === undefined) {
      return res.status(400).json({ error: '좌표 정보가 필요합니다.' });
    }

    const character = await Character.updatePosition(characterId, parseInt(x), parseInt(y));
    
    if (!character) {
      return res.status(404).json({ error: '캐릭터를 찾을 수 없습니다.' });
    }

    res.json(character);
  } catch (error) {
    console.error('캐릭터 위치 업데이트 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 캐릭터 활성 상태 업데이트
router.patch('/:id/status', async (req, res) => {
  try {
    const characterId = parseInt(req.params.id);
    const { isActive, isAiControlled } = req.body;
    
    const character = await Character.updateActiveStatus(
      characterId, 
      isActive !== undefined ? isActive : true, 
      isAiControlled !== undefined ? isAiControlled : false
    );
    
    if (!character) {
      return res.status(404).json({ error: '캐릭터를 찾을 수 없습니다.' });
    }

    res.json(character);
  } catch (error) {
    console.error('캐릭터 상태 업데이트 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;