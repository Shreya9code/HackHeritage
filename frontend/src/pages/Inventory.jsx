import { useState } from 'react';
import CategoryFilter from '../components/inventory/CategoryFilter';
import ItemCard from '../components/inventory/ItemCard';
import AddItemModal from '../components/inventory/AddItemModal';
import { Plus } from 'lucide-react';

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ categories: ['all'] });
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([
    // Sample items data
    {
      id: '1',
      name: 'Dell Laptop',
      model: 'Latitude E5450',
      category: 'computer',
      department: 'IT Department',
      quantity: 5,
      status: 'pending',
      dateAdded: 'Aug 15, 2023'
    },
    // More items...
  ]);

  const handleAddItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter items based on selected categories and search query
  const filteredItems = items.filter(item => {
    const matchesCategory = filter.categories.includes('all') || 
                           filter.categories.includes(item.category);
    const matchesSearch = searchQuery === '' || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">E-Waste Inventory</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <CategoryFilter 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto !bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search query' : 'Get started by adding your first e-waste item'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition-colors"
          >
            Add Your First Item
          </button>
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