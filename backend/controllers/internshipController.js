const Internship = require('../models/Internship');

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private
const createInternship = async (req, res) => {
    try {
        const { companyName, role, platform, appliedDate, status, notes } = req.body;

        // Validation
        if (!companyName || !role || !platform || !appliedDate) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const internship = await Internship.create({
            userId: req.user._id,
            companyName,
            role,
            platform,
            appliedDate,
            status: status || 'Applied',
            notes: notes || ''
        });

        res.status(201).json(internship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all internships for logged-in user
// @route   GET /api/internships
// @access  Private
const getInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Private
const getInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Check if user owns this internship
        if (internship.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private
const updateInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Check if user owns this internship
        if (internship.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const oldStatus = internship.status;
        const newStatus = req.body.status;

        // Update internship
        const updatedInternship = await Internship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedInternship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private
const deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Check if user owns this internship
        if (internship.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Internship.findByIdAndDelete(req.params.id);
        res.json({ message: 'Internship deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get internship statistics
// @route   GET /api/internships/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const internships = await Internship.find({ userId: req.user._id });

        const stats = {
            total: internships.length,
            applied: internships.filter(i => i.status === 'Applied').length,
            shortlisted: internships.filter(i => i.status === 'Shortlisted').length,
            interviewScheduled: internships.filter(i => i.status === 'Interview Scheduled').length,
            selected: internships.filter(i => i.status === 'Selected').length,
            completed: internships.filter(i => i.status === 'Completed').length,
            rejected: internships.filter(i => i.status === 'Rejected').length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInternship,
    getInternships,
    getInternship,
    updateInternship,
    deleteInternship,
    getStats
};
