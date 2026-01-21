const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleInternships = [
    {
        companyName: 'Google',
        role: 'Software Engineer Intern',
        platform: 'LinkedIn',
        appliedDate: new Date('2024-01-15'),
        status: 'Selected',
        nextStepDate: new Date('2024-02-01')
    },
    {
        companyName: 'Microsoft',
        role: 'Frontend Developer Intern',
        platform: 'Company Website',
        appliedDate: new Date('2024-01-10'),
        status: 'Selected', // Offer Received
        nextStepDate: new Date('2024-01-25')
    },
    {
        companyName: 'Meta',
        role: 'React Engineer',
        platform: 'Other',
        appliedDate: new Date('2023-12-01'),
        status: 'Rejected',
        nextStepDate: new Date('2023-12-20')
    },
    {
        companyName: 'Amazon',
        role: 'SDE Intern',
        platform: 'Other',
        appliedDate: new Date('2023-11-15'),
        status: 'Rejected',
        nextStepDate: new Date('2023-12-05')
    },
    {
        companyName: 'Netflix',
        role: 'UI/UX Intern',
        platform: 'LinkedIn',
        appliedDate: new Date('2024-01-20'),
        status: 'Interview Scheduled',
        nextStepDate: new Date('2024-02-10')
    }
];

const seedData = async () => {
    try {
        // Find a user to assign these to (ideally the first one)
        const user = await User.findOne();

        if (!user) {
            console.log('No user found. Please register a user first.');
            process.exit(1);
        }

        const internshipsWithUser = sampleInternships.map(internship => ({
            ...internship,
            userId: user._id
        }));

        await Internship.insertMany(internshipsWithUser);
        console.log('Sample data imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
