const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { postMessage, getHistory } = require('../controllers/chatController');

const router = express.Router();

router.use(authMiddleware);
router.post('/message', postMessage);
router.get('/history', getHistory);

module.exports = router;
