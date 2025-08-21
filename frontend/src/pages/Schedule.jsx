import { useState } from 'react';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [pickups, setPickups] = useState([
    {
      id: 1,
      date: '2024-01-15',
      time: '10:00 AM',
      vendor: 'GreenTech Recycling',
      items: 'Laptops (5), Monitors (3)',
      location: 'IT Department',
      status: 'scheduled'
    },
    {
      id: 2,
      date: '2024-01-16',
      time: '2:30 PM',
      vendor: 'EcoDispose Solutions',
      items: 'Mobile phones (12), Batteries (15)',
      location: 'Science Block',
      status: 'scheduled'
    }
  ]);

  const [newPickup, setNewPickup] = useState({
    date: '',
    time: '',
    vendor: '',
    items: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const pickup = {
      id: Date.now(),
      ...newPickup,
      status: 'scheduled'
    };
    setPickups([...pickups, pickup]);
    setNewPickup({ date: '', time: '', vendor: '', items: '', location: '' });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    setNewPickup({
      ...newPickup,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Pickups</h1>
          <p className="text-gray-600">Manage e-waste collection schedules</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + New Pickup
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
        <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center p-2 font-medium text-gray-600">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date(2024, 0, i + 1);
            const hasPickup = pickups.some(p => p.date === date.toISOString().split('T')[0]);
            return (
              <div
                key={i}
                className={`p-2 text-center cursor-pointer rounded-lg ${
                  hasPickup 
                    ? 'bg-emerald-100 text-emerald-700 font-medium' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedDate(date)}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pickups List */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-200">
        <div className="p-6 border-b border-emerald-200">
          <h2 className="text-xl font-semibold">Pickups for {selectedDate.toDateString()}</h2>
        </div>
        
        {pickups.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pickups scheduled</h3>
            <p className="text-gray-500">Schedule your first e-waste pickup</p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-200">
            {pickups.map(pickup => (
              <div key={pickup.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pickup.status)}`}>
                        {pickup.status}
                      </span>
                      <span className="text-gray-500">{pickup.time}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{pickup.vendor}</h3>
                    <p className="text-gray-600 mt-1">📍 {pickup.location}</p>
                    <p className="text-gray-600 mt-1">📦 {pickup.items}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Pickup Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-emerald-200">
              <h3 className="text-xl font-semibold">Schedule New Pickup</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={newPickup.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={newPickup.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
                <input
                  type="text"
                  name="vendor"
                  value={newPickup.vendor}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., GreenTech Recycling"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={newPickup.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., IT Department"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items *</label>
                <input
                  type="text"
                  name="items"
                  value={newPickup.items}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Laptops (5), Monitors (3)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Schedule Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
