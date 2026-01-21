const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, DOCX, TXT, JPG, JPEG, PNG files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        res.json({
            message: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                path: req.file.path,
                uploadedAt: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all uploaded files for user
// @route   GET /api/upload/files
// @access  Private
const getFiles = async (req, res) => {
    try {
        const uploadDir = 'uploads/';
        const userId = req.user._id.toString();

        if (!fs.existsSync(uploadDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(uploadDir)
            .filter(file => file.startsWith(userId))
            .map(file => {
                const stats = fs.statSync(path.join(uploadDir, file));
                return {
                    filename: file,
                    size: stats.size,
                    uploadedAt: stats.mtime,
                    path: path.join(uploadDir, file)
                };
            })
            .sort((a, b) => b.uploadedAt - a.uploadedAt);

        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private
const deleteFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const userId = req.user._id.toString();

        // Check if file belongs to user
        if (!filename.startsWith(userId)) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const filePath = path.join('uploads/', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    upload,
    uploadFile,
    getFiles,
    deleteFile
};
