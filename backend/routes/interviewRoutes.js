const express = require('express');
const router = express.Router();
const { getVideos, saveVideo } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVideos).post(protect, saveVideo);

module.exports = router;
