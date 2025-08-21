import { useState } from 'react';
import { 
  Cpu, 
  Smartphone, 
  Monitor, 
  Battery, 
  FlaskRound, 
  Headphones,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  QrCode,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const ItemCard = ({ item }) => {
  const [showQR, setShowQR] = useState(false);

  const getIcon = (category) => {
    const icons = {
      'computer': Cpu,
      'mobile': Smartphone,
      'monitor': Monitor,
      'battery': Battery,
      'lab-equipment': FlaskRound,
      'accessories': Headphones
    };
    return icons[category] || Cpu;
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'recycled':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'Recycled' };
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, label: 'Pending Pickup' };
      case 'hazardous':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle, label: 'Hazardous' };
      case 'processing':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock, label: 'In Process' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock, label: 'Unknown' };
    }
  };

  const IconComponent = getIcon(item.category);
  const StatusInfo = getStatusInfo(item.status);
  const StatusIcon = StatusInfo.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center`}>
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.model}</p>
          </div>
        </div>
        
        <Menu as="div" className="relative">
          <MenuButton className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
            <MenuItem>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Item
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${active ? 'bg-red-50' : ''}`}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="text-sm font-medium capitalize">{item.category.replace('-', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Department</p>
            <p className="text-sm font-medium">{item.department}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Added On</p>
            <p className="text-sm font-medium">{item.dateAdded}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Quantity</p>
            <p className="text-sm font-medium">{item.quantity} units</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${StatusInfo.bg}`}>
            <StatusIcon className={`w-4 h-4 mr-1 ${StatusInfo.color}`} />
            <span className={`text-xs font-medium ${StatusInfo.color}`}>{StatusInfo.label}</span>
          </div>
          
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <QrCode className="w-4 h-4 mr-1" />
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ewaste-${item.id}`} 
                alt="QR Code" 
                className="w-full h-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Scan to view item details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;