import { useState, useEffect } from 'react';
import CategoryFilter from '../components/inventory/CategoryFilter';
import ItemCard from '../components/inventory/ItemCard';
import AddItemModal from '../components/inventory/AddItemModal';
import { Plus, RefreshCw } from 'lucide-react';
import { ewasteAPI } from '../services/api';
import { useUser } from '@clerk/clerk-react';

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ categories: ['all'] });
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const { user } = useUser();

  // Get user role on component mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Fetch e-waste items based on user role
  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let fetchedItems;
        
        if (userRole === 'donor') {
          // For donors, fetch their own items using Clerk ID
          fetchedItems = await ewasteAPI.getByDonorId(user.id);
        } else {
          // For vendors and companies, fetch all items
          fetchedItems = await ewasteAPI.getAll();
        }
        
        // Transform the data to match the expected format
        const transformedItems = fetchedItems.map(item => ({
          id: item._id,
          name: item.itemType,
          model: item.model || 'N/A',
          brand: item.brand || 'N/A',
          category: item.classification || 'recyclable',
          weight: `${item.weightValue} ${item.weightUnit}`,
          condition: item.condition || 'Unknown',
          status: item.status,
          dateAdded: new Date(item.createdAt).toLocaleDateString(),
          serial: item.serial,
          pickupAddress: item.pickupAddress,
          estimatedPrice: item.estimatedPrice,
          shortNote: item.shortNote,
          age: item.age,
          donorId: item.donorId // Include donor ID for vendor/admin view
        }));
        
        setItems(transformedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
        // For now, use localStorage items as fallback
        const storedItems = JSON.parse(localStorage.getItem('ewaste_items') || '[]');
        const transformedStoredItems = storedItems.map(item => ({
          id: item.serial,
          name: item.type,
          model: 'N/A',
          brand: 'N/A',
          category: item.classification || 'recyclable',
          weight: `${item.weightValue} ${item.weightUnit}`,
          condition: item.condition || 'Unknown',
          status: item.status,
          dateAdded: new Date(item.createdAt).toLocaleDateString(),
          serial: item.serial,
          pickupAddress: item.pickupAddress,
          estimatedPrice: item.estimatedPrice,
          shortNote: '',
          age: '',
          donorId: item.donorId || 'Unknown'
        }));
        setItems(transformedStoredItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [user, userRole]);

  const handleAddItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    // Trigger a re-fetch of items
    const fetchItems = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let fetchedItems;
        
        if (userRole === 'donor') {
          fetchedItems = await ewasteAPI.getByDonorId(user.id);
        } else {
          fetchedItems = await ewasteAPI.getAll();
        }
        
        const transformedItems = fetchedItems.map(item => ({
          id: item._id,
          name: item.itemType,
          model: item.model || 'N/A',
          brand: item.brand || 'N/A',
          category: item.classification || 'recyclable',
          weight: `${item.weightValue} ${item.weightUnit}`,
          condition: item.condition || 'Unknown',
          status: item.status,
          dateAdded: new Date(item.createdAt).toLocaleDateString(),
          serial: item.serial,
          pickupAddress: item.pickupAddress,
          estimatedPrice: item.estimatedPrice,
          shortNote: item.shortNote,
          age: item.age,
          donorId: item.donorId
        }));
        
        setItems(transformedItems);
      } catch (error) {
        console.error('Error refreshing items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  };

  // Filter items based on selected categories and search query
  const filteredItems = items.filter(item => {
    const matchesCategory = filter.categories.includes('all') || 
                           filter.categories.includes(item.category);
    const matchesSearch = searchQuery === '' || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.serial && item.serial.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.pickupAddress && item.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.donorId && item.donorId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userRole === 'donor' ? 'My E-Waste Items' : 'All E-Waste Items'}
          </h2>
          <p className="text-gray-600 mt-1">
            {userRole === 'donor' 
              ? 'View all your submitted e-waste items' 
              : userRole === 'vendor'
                ? 'View all reported e-waste items from all donors'
                : 'Manage all e-waste items reported by donors'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {userRole !== 'donor' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Item
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <CategoryFilter 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-12 h-12 text-gray-400 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading items...</h3>
          <p className="text-gray-500">Please wait while we fetch your e-waste items</p>
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
                     <h3 className="text-lg font-medium text-gray-900 mb-2">
             {searchQuery ? 'No items found' : userRole === 'donor' ? 'No e-waste items submitted yet' : 'No e-waste items reported yet'}
           </h3>
           <p className="text-gray-500 mb-4">
             {searchQuery 
               ? 'Try adjusting your search query' 
               : userRole === 'donor' 
                 ? 'Start by generating a QR code for your e-waste item' 
                 : 'No donors have submitted e-waste items yet'
             }
           </p>
          {userRole === 'donor' ? (
            <button
              onClick={() => window.location.href = '/qr-generator'}
              className="!bg-emerald-600 text-white px-4 py-2 rounded-lg hover:!bg-emerald-700 transition-colors"
            >
              Generate QR Code
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition-colors"
            >
              Add Your First Item
            </button>
          )}
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default Inventory;