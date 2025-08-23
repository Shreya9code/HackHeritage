import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// E-waste API functions
export const ewasteAPI = {
  // Get e-waste by serial number (for QR scanning)
  getBySerial: async (serial) => {
    try {
      const response = await api.get(`/ewastes/serial/${serial}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('E-waste item not found');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch e-waste item');
    }
  },

  // Update status by serial number
  updateStatusBySerial: async (serial, status) => {
    try {
      const response = await api.put(`/ewastes/serial/${serial}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update status');
    }
  },

  // Accept e-waste item (vendor function)
  acceptItem: async (itemId, vendorId, notes = '') => {
    try {
      const response = await api.put(`/ewastes/${itemId}/accept`, { vendorId, notes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to accept item');
    }
  },

  // Update item to "in transit" (vendor function)
  updateToInTransit: async (itemId, vendorId, notes = '') => {
    try {
      const response = await api.put(`/ewastes/${itemId}/in-transit`, { vendorId, notes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update item to in transit');
    }
  },

  // Mark item as done (company function)
  markAsDone: async (itemId, companyId, notes = '') => {
    try {
      const response = await api.put(`/ewastes/${itemId}/done`, { companyId, notes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to mark item as done');
    }
  },

  // Create new e-waste item
  create: async (ewasteData) => {
    try {
      const response = await api.post('/ewastes', ewasteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create e-waste item');
    }
  },

  // Get all e-waste items
  getAll: async () => {
    try {
      const response = await api.get('/ewastes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch e-waste items');
    }
  },

  // Get e-waste items by donor ID (Clerk ID)
  getByDonorId: async (donorId) => {
    try {
      console.log('🌐 API: Calling getByDonorId with donorId:', donorId);
      const response = await api.get(`/ewastes/donor/${donorId}`);
      console.log('🌐 API: Response received:', response.data.length, 'items');
      console.log('🌐 API: Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('🌐 API: Error in getByDonorId:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch donor e-waste items');
    }
  },
};

// User management API functions
export const userAPI = {
  // Create or update user based on role
  createOrUpdateUser: async (role, userData) => {
    try {
      const response = await api.post(`/users/${role}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create/update user');
    }
  },

  // Get user by Clerk ID
  getUserByClerkId: async (clerkId) => {
    try {
      const response = await api.get(`/users/clerk/${clerkId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // User not found
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch user');
    }
  },
};

export default api;
