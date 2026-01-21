const axios = require('axios');

const testRegistration = async () => {
    const testUser = {
        name: "Test User",
        email: `test_${Date.now()}@example.com`,
        password: "password123"
    };

    console.log('Testing Registration with:', testUser);

    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
        console.log('Registration Successful!');
        console.log('User Data:', response.data);

        // Test Login
        console.log('\nTesting Login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login Successful!');
        console.log('Token:', loginResponse.data.token);

        return { success: true, user: testUser };
    } catch (error) {
        console.error('Test Failed!');
        console.error('Error Status:', error.response?.status);
        console.error('Error Message:', error.response?.data?.message || error.message);
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

testRegistration();
