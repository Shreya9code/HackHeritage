import { useState } from 'react';
import { X, Truck, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { ewasteAPI } from '../../services/api';

const QRScanModal = ({ isOpen, onClose, item, onItemUpdate }) => {
  const [role, setRole] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (!role) {
      setError('Please select a role');
      return;
    }
    
    if (role === 'vendor' && !licenseNo.trim()) {
      setError('License number is required for vendor role');
      return;
    }
    
    if (role === 'company' && !registrationNo.trim()) {
      setError('Registration number is required for company role');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await ewasteAPI.updateStatusWithRole(
        item.id,
        role,
        role === 'vendor' ? licenseNo : undefined,
        role === 'company' ? registrationNo : undefined
      );
      
      if (response.success) {
        setSuccess(response.message);
        
        // Update the item in the parent component
        if (onItemUpdate) {
          // Create updated item object
          const updatedItem = {
            ...item,
            status: response.newStatus === 'In Transit' ? 'in transit' : 'done',
            // Add additional fields based on role
            ...(role === 'vendor' && {
              inTransitBy: 'vendor',
              inTransitAt: new Date().toISOString(),
              inTransitNotes: `Item picked up by vendor (${licenseNo})`
            }),
            ...(role === 'company' && {
              completedBy: 'company',
              completedAt: new Date().toISOString(),
              completionNotes: `Item processed by company (${registrationNo})`
            })
          };
          onItemUpdate(updatedItem);
        }
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          // Reset form
          setRole('');
          setLicenseNo('');
          setRegistrationNo('');
          setSuccess('');
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRole('');
      setLicenseNo('');
      setRegistrationNo('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Update Item Status</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Item Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Item: {item.name}</p>
          <p className="text-sm text-gray-600 mb-1">Serial: {item.serial}</p>
          <p className="text-sm text-gray-600">Status: {item.status}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role *
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={role === 'vendor'}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Vendor</span>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="company"
                  checked={role === 'company'}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Company</span>
                </div>
              </label>
            </div>
          </div>

          {/* License Number (Vendor) */}
          {role === 'vendor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number *
              </label>
              <input
                type="text"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                placeholder="Enter vendor license number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Registration Number (Company) */}
          {role === 'company' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="Enter company registration number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !role || (role === 'vendor' && !licenseNo.trim()) || (role === 'company' && !registrationNo.trim())}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QRScanModal;
