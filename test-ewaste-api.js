const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testEwasteAPI() {
  try {
    console.log('Testing E-Waste API...\n');

    // Test 1: Create a new e-waste item
    console.log('1. Testing CREATE e-waste item...');
    const testEwaste = {
      donorId: '507f1f77bcf86cd799439011', // Test donor ID
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
      shortNote: 'Test e-waste item',
      classification: 'reusable',
      estimatedPrice: 150.00,
      status: 'waiting for pickup'
    };

    const createResponse = await axios.post(`${API_BASE_URL}/ewastes`, testEwaste);
    console.log('✅ CREATE successful:', createResponse.data.serial);

    // Test 2: Get all e-waste items
    console.log('\n2. Testing GET all e-waste items...');
    const getAllResponse = await axios.get(`${API_BASE_URL}/ewastes`);
    console.log('✅ GET all successful:', getAllResponse.data.length, 'items found');

    // Test 3: Get e-waste by serial
    console.log('\n3. Testing GET e-waste by serial...');
    const getBySerialResponse = await axios.get(`${API_BASE_URL}/ewastes/serial/EW-TEST-001`);
    console.log('✅ GET by serial successful:', getBySerialResponse.data.serial);

    // Test 4: Update status
    console.log('\n4. Testing UPDATE status...');
    const updateResponse = await axios.put(`${API_BASE_URL}/ewastes/serial/EW-TEST-001/status`, {
      status: 'in transit'
    });
    console.log('✅ UPDATE status successful:', updateResponse.data.status);

    console.log('\n🎉 All API tests passed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Run the test
testEwasteAPI();
