const express = require('express');
const router = express.Router();
const {
  addMonitor,
  getAllStatuses,
  getStatus,
  removeMonitor,
  getHistory,
  home
} = require('../controllers/monitor');

router.post('/add-url', addMonitor);

router.get('/status', getAllStatuses);

router.get('/status/:url', getStatus);

router.delete('/remove-url', removeMonitor);

router.get('/history/:url', getHistory);

router.get('/', home);

module.exports = router;
