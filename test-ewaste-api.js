const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testEwasteAPI() {
  try {
    console.log('Testing E-Waste API...\n');

    // Test 1: Create a new e-waste item
    console.log('1. Testing CREATE e-waste item...');
    const testEwaste = {
      donorId: 'user_test_clerk_id_123', // Test Clerk ID
      serial: 'EW-TEST-001',
      itemType: 'Laptop',
      brand: 'Dell',
      model: 'Latitude 5520',
      age: '3 years',
      weightValue: '2.5',
      weightUnit: 'kg',
      condition: 'Working',
      pickupAddress: '123 Test Street, Test City',
      date: new Date(),
      pictureUrl: '',
      shortNote: 'Test e-waste item',
      classification: 'reusable',
      estimatedPrice: 150.00,
      status: 'reported',
      createdAt: new Date()
    };

    const createResponse = await axios.post(`${API_BASE_URL}/ewastes`, testEwaste);
    console.log('✅ CREATE successful:', createResponse.data.serial);

    // Test 2: Get all e-waste items
    console.log('\n2. Testing GET all e-waste items...');
    const getAllResponse = await axios.get(`${API_BASE_URL}/ewastes`);
    console.log('✅ GET all successful:', getAllResponse.data.length, 'items found');

    // Test 3: Get e-waste items by donor ID
    console.log('\n3. Testing GET e-waste by donor ID...');
    const getByDonorResponse = await axios.get(`${API_BASE_URL}/ewastes/donor/user_test_clerk_id_123`);
    console.log('✅ GET by donor ID successful:', getByDonorResponse.data.length, 'items found');

    // Test 4: Get e-waste by serial
    console.log('\n4. Testing GET e-waste by serial...');
    const getBySerialResponse = await axios.get(`${API_BASE_URL}/ewastes/serial/EW-TEST-001`);
    console.log('✅ GET by serial successful:', getBySerialResponse.data.serial);

    // Test 5: Update status to waiting for pickup (vendor accepts)
    console.log('\n5. Testing UPDATE status to waiting for pickup...');
    const updateResponse1 = await axios.put(`${API_BASE_URL}/ewastes/serial/EW-TEST-001/status`, {
      status: 'waiting for pickup'
    });
    console.log('✅ UPDATE status to waiting for pickup successful:', updateResponse1.data.status);

    // Test 6: Update status to in transit
    console.log('\n6. Testing UPDATE status to in transit...');
    const updateResponse2 = await axios.put(`${API_BASE_URL}/ewastes/serial/EW-TEST-001/status`, {
      status: 'in transit'
    });
    console.log('✅ UPDATE status to in transit successful:', updateResponse2.data.status);

    console.log('\n🎉 All API tests passed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Run the test
testEwasteAPI();
