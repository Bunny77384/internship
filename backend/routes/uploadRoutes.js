const express = require('express');
const router = express.Router();
const { upload, uploadFile, getFiles, deleteFile } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.post('/', upload.single('file'), uploadFile);
router.get('/files', getFiles);
router.delete('/:filename', deleteFile);

module.exports = router;
