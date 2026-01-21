const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const verifyConnection = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    } catch (error) {
        console.error("ERROR: Failed to connect.");
        console.error(error.message);
        process.exit(1);
    }
};

verifyConnection();
