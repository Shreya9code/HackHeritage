import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const RoleSelection = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  
  // Form data for different roles
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    licenseNumber: '', // for vendors
    registrationNumber: '', // for companies
  });

  useEffect(() => {
    const checkExistingUser = async () => {
      if (!isLoaded || !user) return;

      try {
        const userData = await userAPI.getUserByClerkId(user.id);
        if (userData?.user) {
          // User already has a role, redirect to dashboard
          localStorage.setItem('userRole', userData.user.role);
          localStorage.setItem('userId', userData.user.id);
          localStorage.setItem('userName', userData.user.name);
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkExistingUser();
  }, [isLoaded, user, navigate]);

  useEffect(() => {
    if (isLoaded && user) {
      // Pre-fill email from Clerk user data
      setFormData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || '',
      }));
    }
  }, [isLoaded, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (selectedRole === 'vendor' && !formData.licenseNumber.trim()) {
      setError('License number is required for vendors');
      return false;
    }
    if (selectedRole === 'company' && !formData.registrationNumber.trim()) {
      setError('Registration number is required for companies');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const userData = {
        clerkId: user.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
      };

      // Add role-specific fields
      if (selectedRole === 'vendor') {
        userData.licenseNumber = formData.licenseNumber.trim();
      } else if (selectedRole === 'company') {
        userData.registrationNumber = formData.registrationNumber.trim();
      }

      const response = await userAPI.createOrUpdateUser(selectedRole, userData);
      
      console.log('User created successfully:', response);
      
      // Store user info in localStorage for future use
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userName', response.user.name);
      
      console.log('User data stored in localStorage:', {
        role: selectedRole,
        id: response.user.id,
        name: response.user.name
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking your account...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600">Please select your role and provide your details to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Role Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'donor', title: 'Donor', description: 'I want to donate e-waste items', icon: '♻️' },
                { id: 'vendor', title: 'Vendor', description: 'I process and handle e-waste', icon: '🏭' },
                { id: 'company', title: 'Company Admin', description: 'I manage company operations', icon: '🏢' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedRole === role.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                      : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-3">{role.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Role-specific Form */}
          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your contact number"
                  />
                </div>

                {selectedRole === 'vendor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter your license number"
                    />
                  </div>
                )}

                {selectedRole === 'company' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Registration Number *
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter company registration number"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your address"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Setting up your account...' : 'Continue to Dashboard'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
