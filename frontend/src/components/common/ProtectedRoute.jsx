import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAPI } from '../../services/api';

const ProtectedRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoaded) return;

      if (!user) {
        navigate('/signin');
        return;
      }

      // Skip role check for these routes
      if (location.pathname === '/role-selection' || 
          location.pathname === '/signin' || 
          location.pathname === '/signup' ||
          location.pathname.startsWith('/sign-in') ||
          location.pathname.startsWith('/sign-up')) {
        setIsChecking(false);
        return;
      }

      // First check if we have role data in localStorage (user just completed role selection)
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      console.log('ProtectedRoute - Checking localStorage:', { storedRole, storedUserId });
      
      if (storedRole && storedUserId) {
        // User has role data in localStorage, allow access
        console.log('ProtectedRoute - User has role data in localStorage, allowing access');
        setIsChecking(false);
        return;
      }

      try {
        // Check if user has already selected a role
        const userData = await userAPI.getUserByClerkId(user.id);
        
        if (!userData?.user) {
          // User hasn't selected a role yet, redirect to role selection
          navigate('/role-selection');
          return;
        }

        // Store user role and ID in localStorage for future use
        localStorage.setItem('userRole', userData.user.role);
        localStorage.setItem('userId', userData.user.id);
        localStorage.setItem('userName', userData.user.name);
        
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        // If there's an error and no stored data, redirect to role selection
        navigate('/role-selection');
      }
    };

    checkUserRole();
  }, [user, isLoaded, navigate, location.pathname]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
