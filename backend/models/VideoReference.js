const mongoose = require('mongoose');

const videoReferenceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a name for the video']
    },
    url: {
        type: String,
        required: [true, 'Please add a video URL']
    },
    type: {
        type: String,
        enum: ['upload', 'link'],
        default: 'upload'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VideoReference', videoReferenceSchema);
