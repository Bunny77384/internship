const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    platform: {
        type: String,
        required: [true, 'Platform is required'],
        enum: ['LinkedIn', 'Internshala', 'Company Website', 'Naukri', 'Indeed', 'Other']
    },
    appliedDate: {
        type: Date,
        required: [true, 'Applied date is required']
    },
    startDate: {
        type: Date
    },
    nextStepDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Completed', 'Rejected'],
        default: 'Applied'
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', internshipSchema);
