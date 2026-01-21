const VideoReference = require('../models/VideoReference');

// @desc    Get all video references
// @route   GET /api/interviews
// @access  Private
const getVideos = async (req, res) => {
    try {
        const videos = await VideoReference.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
};

// @desc    Save video reference
// @route   POST /api/interviews
// @access  Private
const saveVideo = async (req, res) => {
    const { name, url, type } = req.body;

    if (!name || !url) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    try {
        const video = await VideoReference.create({
            user: req.user.id,
            name,
            url,
            type
        });
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: 'Error saving video reference' });
    }
};

module.exports = {
    getVideos,
    saveVideo
};
