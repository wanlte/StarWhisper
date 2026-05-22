const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/characterController');

router.get('/list', ctrl.getList);
router.post('/match', ctrl.matchCharacter);

module.exports = router;
