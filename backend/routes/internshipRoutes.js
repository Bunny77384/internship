const express = require('express');
const router = express.Router();
const {
    createInternship,
    getInternships,
    getInternship,
    updateInternship,
    deleteInternship,
    getStats
} = require('../controllers/internshipController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.route('/')
    .get(getInternships)
    .post(createInternship);

router.get('/stats', getStats);

router.route('/:id')
    .get(getInternship)
    .put(updateInternship)
    .delete(deleteInternship);

module.exports = router;
