import { NavLink } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Package, 
  Calendar, 
  FileText, 
  QrCode, 
  TrendingUp, 
  Megaphone, 
  Recycle,
  Plus,
  Scan,
  User,
  Home,
  Play
} from "lucide-react";

const Sidebar = () => {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      setUserName(user.fullName || user.primaryEmailAddress?.emailAddress || 'User');
      const role = localStorage.getItem('userRole');
      setUserRole(role || '');
    }
  }, [isLoaded, user]);

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { path: "/inventory", label: "Inventory", icon: Package },
    ];

    switch (userRole) {
      case 'donor':
        return [
          ...baseItems,
          { path: "/qr-generator", label: "Generate QR", icon: QrCode },
          { path: "/campaigns", label: "Campaigns", icon: Megaphone },
        ];
             case 'vendor':
         return [
           ...baseItems,
           { path: "/compliance", label: "Compliance", icon: FileText },
           { path: "/analytics", label: "Analytics", icon: TrendingUp },
         ];
      case 'company':
        return [
          ...baseItems,
          { path: "/compliance", label: "Compliance", icon: FileText },
          { path: "/analytics", label: "Analytics", icon: TrendingUp },
          { path: "/campaigns", label: "Campaigns", icon: Megaphone },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar bg-white shadow-lg fixed h-full w-64 overflow-y-auto border-r border-emerald-200">
      {/* Logo / Title */}
      <div className="p-6 border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h1 className="text-xl font-bold text-emerald-700 flex items-center">
          <Recycle className="w-6 h-6 mr-3" />
          E-Waste Manager
        </h1>
        <p className="text-xs text-emerald-600 mt-2">
          Centralized E-Waste Management System
        </p>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `p-3 rounded-lg flex items-center transition-colors ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700 font-semibold border-r-2 border-emerald-500"
                        : "hover:bg-emerald-50 text-gray-700 hover:text-emerald-600"
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Quick Actions */}
        {userRole && (
          <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h3 className="font-semibold text-emerald-700 mb-3">Quick Actions</h3>
            {userRole === 'company' && (
              <>
                <NavLink
                  to="/analytics"
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-purple-700 transition-colors mb-2 block"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </NavLink>
              </>
            )}
            {userRole === 'donor' && (
              <>
                <NavLink
                  to="/qr-generator"
                  className="w-full bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-emerald-700 transition-colors mb-2 block"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </NavLink>
              </>
            )}
                         {userRole === 'vendor' && (
               <>
                 <NavLink
                   to="/schedule"
                   className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-blue-700 transition-colors mb-2 block"
                 >
                   <Calendar className="w-4 h-4 mr-2" />
                   View Pickups
                 </NavLink>
                 <NavLink
                   to="/analytics"
                   className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-purple-700 transition-colors mb-2 block"
                 >
                   <TrendingUp className="w-4 h-4 mr-2" />
                   View Analytics
                 </NavLink>
               </>
             )}
            <NavLink
              to="/inventory"
              className="w-full bg-gray-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-gray-700 transition-colors block"
            >
              <Package className="w-4 h-4 mr-2" />
              View Inventory
            </NavLink>
          </div>
        )}
      </div>

      {/* User Info */}
      {userRole && (
        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-200 bg-emerald-50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-emerald-700">{userName}</p>
              <p className="text-xs text-emerald-600">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
