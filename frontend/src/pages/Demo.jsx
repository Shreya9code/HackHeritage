import { useState } from 'react';
import { QrCode, Scan, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import QRScanner from '../components/common/QRScanner';

const Demo = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [demoItems] = useState([
    {
      serial: 'EW-DEMO-001',
      itemType: 'Laptop',
      brand: 'Dell',
      condition: 'Working',
      status: 'waiting for pickup',
      pickupAddress: '123 Tech Street, Bangalore'
    },
    {
      serial: 'EW-DEMO-002', 
      itemType: 'Mobile Phone',
      brand: 'Samsung',
      condition: 'Damaged',
      status: 'in transit',
      pickupAddress: '456 Digital Road, Mumbai'
    },
    {
      serial: 'EW-DEMO-003',
      itemType: 'Monitor',
      brand: 'HP',
      condition: 'Good',
      status: 'processing',
      pickupAddress: '789 Innovation Lane, Delhi'
    }
  ]);

  const handleScan = (result) => {
    setLastScannedItem(result);
    // The scanner will handle fetching item details and status updates
  };

  const openScanner = () => {
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            E-Waste Management Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the complete workflow: Generate QR codes for e-waste items, 
            scan them to check status, and update their lifecycle in real-time.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 mx-auto">
              <QrCode className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">1. Generate QR Code</h3>
            <p className="text-gray-600 text-center">
              Fill out the form to create a unique QR code for each e-waste item with all relevant details.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
              <ArrowRight className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">2. Item Processing</h3>
            <p className="text-gray-600 text-center">
              The item moves through different stages: waiting → in transit → processing → done.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-200">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
              <Scan className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">3. Scan & Update</h3>
            <p className="text-gray-600 text-center">
              Scan the QR code to view item details and update its status in real-time.
            </p>
          </div>
        </div>

        {/* Demo Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <QrCode className="w-6 h-6 mr-2 text-emerald-600" />
            Demo E-Waste Items
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {demoItems.map((item) => (
              <div key={item.serial} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{item.itemType}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'waiting for pickup' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'in transit' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Serial:</strong> {item.serial}</p>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>Condition:</strong> {item.condition}</p>
                  <p><strong>Address:</strong> {item.pickupAddress}</p>
                </div>
                <button
                  onClick={() => {
                    setLastScannedItem(item.serial);
                    openScanner();
                  }}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  Scan This Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-emerald-600" />
              Generate New QR Code
            </h3>
            <p className="text-gray-600 mb-4">
              Create a new e-waste item with a unique QR code. Fill out the form with item details.
            </p>
            <a
              href="/qr-generator"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go to Generator
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Scan className="w-5 h-5 mr-2 text-blue-600" />
              Scan QR Code
            </h3>
            <p className="text-gray-600 mb-4">
              Open the QR scanner to check item status and update the lifecycle of e-waste items.
            </p>
            <button
              onClick={openScanner}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Scanner
              <Scan className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Last Scanned Item */}
        {lastScannedItem && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Last Scanned Item
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-mono text-lg">{lastScannedItem}</p>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <p>
                <strong>QR Code Generation:</strong> Users fill out a form with e-waste item details 
                (type, brand, condition, weight, pickup address). The system generates a unique serial 
                number and creates a QR code containing this information.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <p>
                <strong>Database Storage:</strong> All item details are saved to the backend database 
                with an initial status of "waiting for pickup". The QR code is printed and attached to the item.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <p>
                <strong>Status Tracking:</strong> As the item moves through the e-waste management process, 
                vendors can scan the QR code to view current details and update the status 
                (in transit → processing → done).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                4
              </div>
              <p>
                <strong>Real-time Updates:</strong> All status changes are immediately reflected in the 
                database and can be viewed by scanning the QR code again. This provides complete 
                traceability of the e-waste lifecycle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={closeScanner}
        onScan={handleScan}
      />
    </div>
  );
};

export default Demo;
