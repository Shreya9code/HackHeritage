const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
    try {
        console.log('Testing API endpoints...');

        // Test the main API endpoint
        const response = await axios.get(`${API_BASE_URL.replace('/api', '')}`);
        console.log('✅ Main API endpoint:', response.data);

        // Test user creation endpoint
        const testUser = {
            clerkId: 'test_clerk_id_123',
            name: 'Test User',
            email: 'test@example.com',
            contactNumber: '1234567890',
            address: 'Test Address'
        };

        try {
            const createResponse = await axios.post(`${API_BASE_URL}/users/donor`, testUser);
            console.log('✅ User creation endpoint:', createResponse.data);
        } catch (error) {
            console.log('❌ User creation endpoint error:', error.response?.data || error.message);
        }

        // Test user retrieval endpoint
        try {
            const getUserResponse = await axios.get(`${API_BASE_URL}/users/clerk/test_clerk_id_123`);
            console.log('✅ User retrieval endpoint:', getUserResponse.data);
        } catch (error) {
            console.log('❌ User retrieval endpoint error:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('❌ API test failed:', error.message);
    }
}

testAPI();
