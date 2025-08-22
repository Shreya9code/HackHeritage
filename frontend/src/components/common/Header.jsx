import { useState } from 'react';

const Header = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <button className="md:hidden mr-3 text-gray-600" id="menuToggle">
          <i className="fas fa-bars text-xl"></i>
        </button>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <i className="fas fa-bell"></i>
            <span className="absolute -top-1 -right-1 !bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">3</span>
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-10">
              <div className="px-4 py-2 border-b">
                <h3 className="text-sm font-medium">Notifications</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 py-3 hover:!bg-gray-50">
                  <p className="text-sm">New e-waste pickup scheduled for tomorrow</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="px-4 py-3 hover:!bg-gray-50">
                  <p className="text-sm">Your recycling report for July is ready</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
                <div className="px-4 py-3 hover:!bg-gray-50">
                  <p className="text-sm">New campaign launched: E-Waste Awareness Week</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border rounded-full py-1 px-4 text-sm pl-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <i className="fas fa-search absolute left-3 top-2 text-gray-400"></i>
        </div>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 rounded-full !bg-green-200 flex items-center justify-center">
              <i className="fas fa-user text-green-600"></i>
            </div>
            <span className="text-sm hidden md:block">Guest User</span>
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">Guest User</p>
                <p className="text-xs text-gray-500">Not logged in</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm hover:!bg-gray-50 flex items-center">
                <i className="fas fa-sign-in-alt mr-2 text-gray-500"></i> Login
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:!bg-gray-50 flex items-center">
                <i className="fas fa-cog mr-2 text-gray-500"></i> Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;