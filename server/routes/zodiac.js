const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/zodiacController');

router.get('/list', ctrl.getList);
router.get('/detail/:name', ctrl.getByName);
router.get('/match', ctrl.getMatch);
router.get('/daily-tip', ctrl.getDailyTip);
router.get('/birthday', ctrl.getBirthday);

module.exports = router;
