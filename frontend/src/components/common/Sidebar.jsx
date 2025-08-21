import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "fas fa-chart-pie" },
    { path: "/inventory", label: "Inventory", icon: "fas fa-boxes" },
    { path: "/schedule", label: "Schedule Pickup", icon: "fas fa-calendar-alt" },
    { path: "/compliance", label: "Compliance", icon: "fas fa-file-contract" },
    { path: "/qr-generator", label: "QR Generator", icon: "fas fa-qrcode" },
    { path: "/analytics", label: "Analytics", icon: "fas fa-chart-line" },
    { path: "/campaigns", label: "Campaigns", icon: "fas fa-bullhorn" },
  ];

  return (
    <div className="sidebar bg-white shadow-md fixed h-full overflow-y-auto">
      {/* Logo / Title */}
      <div className="p-5 border-b">
        <h1 className="text-xl font-bold text-green-600 flex items-center">
          <i className="fas fa-recycle mr-2"></i> E-Waste Manager
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Centralized E-Waste Management System
        </p>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `p-3 rounded-lg flex items-center transition ${
                    isActive
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-700">Quick Actions</h3>
          <button className="mt-2 w-full bg-green-500 text-white py-2 rounded-md text-sm flex items-center justify-center hover:bg-green-600 transition-colors">
            <i className="fas fa-plus mr-2"></i> Add New Item
          </button>
          <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md text-sm flex items-center justify-center hover:bg-blue-600 transition-colors">
            <i className="fas fa-qrcode mr-2"></i> Scan QR Code
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
            <i className="fas fa-user text-green-600"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Guest User</p>
            <p className="text-xs text-gray-500">Not logged in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
