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
  AlertTriangle,
  Check,
  User,
  Truck
} from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ewasteAPI } from '../../services/api';
import { useUser } from '@clerk/clerk-react';

const ItemCard = ({ item, userRole, onItemUpdate }) => {
  const [showQR, setShowQR] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const { user } = useUser();

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
      case 'done':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'Completed' };
      case 'waiting for pickup':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, label: 'Waiting for Pickup' };
      case 'in transit':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock, label: 'In Transit' };
      case 'processing':
        return { color: 'text-purple-600', bg: 'bg-purple-100', icon: Clock, label: 'Processing' };
      case 'reported':
        return { color: 'text-orange-600', bg: 'bg-orange-100', icon: Clock, label: 'Reported' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock, label: status || 'Unknown' };
    }
  };

  const handleAcceptItem = async () => {
    if (!user || !item.id) return;
    
    setIsAccepting(true);
    try {
      const updatedItem = await ewasteAPI.acceptItem(item.id, user.id, 'Item accepted by vendor');
      console.log('✅ Item accepted successfully by vendor:', updatedItem);
      
      // Call the parent callback to update the item in the inventory
      if (onItemUpdate) {
        onItemUpdate(updatedItem);
      }
    } catch (error) {
      console.error('❌ Error accepting item:', error);
      alert('Failed to accept item. Please try again.');
    } finally {
      setIsAccepting(false);
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
            <p className="text-xs text-gray-500 mb-1">Classification</p>
            <p className="text-sm font-medium capitalize">{item.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Brand</p>
            <p className="text-sm font-medium">{item.brand}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Weight</p>
            <p className="text-sm font-medium">{item.weight}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Condition</p>
            <p className="text-sm font-medium">{item.condition}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Submitted On</p>
            <p className="text-sm font-medium">{item.dateAdded}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Est. Price</p>
            <p className="text-sm font-medium">₹{item.estimatedPrice || '0'}</p>
          </div>
        </div>

        {/* Serial Number */}
        {item.serial && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Serial Number</p>
            <p className="text-sm font-mono font-medium">{item.serial}</p>
          </div>
        )}

        {/* Pickup Address */}
        {item.pickupAddress && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Pickup Address</p>
            <p className="text-sm font-medium">{item.pickupAddress}</p>
          </div>
        )}

        {/* Notes */}
        {item.shortNote && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm font-medium">{item.shortNote}</p>
          </div>
        )}

        {/* Donor ID (for vendors and companies) */}
        {item.donorId && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Donor ID</p>
            <p className="text-sm font-mono font-medium text-blue-700">{item.donorId}</p>
          </div>
        )}

        {/* Vendor Acceptance Info */}
        {item.vendorAcceptedBy && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Accepted By Vendor</p>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-700">{item.vendorAcceptedBy}</p>
            </div>
            {item.vendorAcceptedAt && (
              <p className="text-xs text-green-600 mt-1">
                {new Date(item.vendorAcceptedAt).toLocaleDateString()}
              </p>
            )}
            {item.vendorNotes && (
              <p className="text-xs text-green-600 mt-1">{item.vendorNotes}</p>
            )}
          </div>
        )}

        {/* Status and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${StatusInfo.bg}`}>
            <StatusIcon className={`w-4 h-4 mr-1 ${StatusInfo.color}`} />
            <span className={`text-xs font-medium ${StatusInfo.color}`}>{StatusInfo.label}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Accept Button for Vendors */}
            {userRole === 'vendor' && item.status === 'reported' && (
              <button
                onClick={handleAcceptItem}
                disabled={isAccepting}
                className="flex items-center px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-3 h-3 mr-1" />
                {isAccepting ? 'Accepting...' : 'Accept'}
              </button>
            )}
            
            <button 
              onClick={() => setShowQR(!showQR)}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <QrCode className="w-4 h-4 mr-1" />
              {showQR ? 'Hide QR' : 'Show QR'}
            </button>
          </div>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.serial || item.id}`} 
                alt="QR Code" 
                className="w-full h-full" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {item.serial ? `Serial: ${item.serial}` : 'Scan to view item details'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;