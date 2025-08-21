import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRGenerator = () => {
  const [qrData, setQrData] = useState({
    itemType: '',
    serialNumber: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'pending'
  });
  const [generatedQR, setGeneratedQR] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const itemTypes = [
    'Laptop',
    'Desktop Computer',
    'Monitor',
    'Mobile Phone',
    'Tablet',
    'Printer',
    'Scanner',
    'Keyboard',
    'Mouse',
    'Headphones',
    'Other'
  ];

  const statusOptions = [
    'pending',
    'in-transit',
    'received',
    'processing',
    'recycled',
    'disposed'
  ];

  const generateQRCode = () => {
    if (!qrData.itemType || !qrData.serialNumber) {
      alert('Please fill in at least Item Type and Serial Number');
      return;
    }

    setIsGenerating(true);
    
    // Create a structured data object for the QR code
    const qrContent = {
      type: 'e-waste',
      itemType: qrData.itemType,
      serialNumber: qrData.serialNumber,
      location: qrData.location,
      date: qrData.date,
      notes: qrData.notes,
      status: qrData.status,
      timestamp: new Date().toISOString()
    };

    // Convert to JSON string for QR code
    const qrString = JSON.stringify(qrContent);
    setGeneratedQR(qrString);
    
    setTimeout(() => setIsGenerating(false), 500);
  };

  const downloadQR = () => {
    if (!generatedQR) return;
    
    const canvas = document.createElement('canvas');
    const svg = document.querySelector('#qr-code svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      
      const link = document.createElement('a');
      link.download = `qr-${qrData.itemType}-${qrData.serialNumber}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const resetForm = () => {
    setQrData({
      itemType: '',
      serialNumber: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'pending'
    });
    setGeneratedQR('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-emerald-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
        <p className="mt-2 text-gray-600">
          Generate QR codes for e-waste items to track their lifecycle and management process.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Information</h2>
            
            <div className="space-y-4">
              {/* Item Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type *
                </label>
                <select
                  value={qrData.itemType}
                  onChange={(e) => setQrData({...qrData, itemType: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select item type</option>
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  value={qrData.serialNumber}
                  onChange={(e) => setQrData({...qrData, serialNumber: e.target.value})}
                  placeholder="Enter serial number"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={qrData.location}
                  onChange={(e) => setQrData({...qrData, location: e.target.value})}
                  placeholder="Enter location (e.g., Building A, Floor 2)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={qrData.date}
                  onChange={(e) => setQrData({...qrData, date: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={qrData.status}
                  onChange={(e) => setQrData({...qrData, status: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={qrData.notes}
                  onChange={(e) => setQrData({...qrData, notes: e.target.value})}
                  placeholder="Additional notes about the item..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={generateQRCode}
                disabled={isGenerating || !qrData.itemType || !qrData.serialNumber}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Display Section */}
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated QR Code</h2>
            
            {generatedQR ? (
              <div className="space-y-4">
                <div id="qr-code" className="flex justify-center">
                  <QRCodeSVG
                    value={generatedQR}
                    size={200}
                    level="M"
                    includeMargin={true}
                    className="border-4 border-white shadow-lg"
                  />
                </div>
                
                <div className="text-center space-y-3">
                  <button
                    onClick={downloadQR}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Download QR Code
                  </button>
                  
                  <div className="text-xs text-gray-500">
                    <p>Scan this QR code to view item details</p>
                    <p className="mt-1">Contains: {generatedQR.length} characters</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Fill the form and generate a QR code</p>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Information */}
          {generatedQR && (
            <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">QR Code Data</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Item Type:</span>
                  <span className="text-gray-900">{qrData.itemType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Serial Number:</span>
                  <span className="text-gray-900">{qrData.serialNumber}</span>
                </div>
                {qrData.location && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Location:</span>
                    <span className="text-gray-900">{qrData.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Date:</span>
                  <span className="text-gray-900">{new Date(qrData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className="text-gray-900 capitalize">{qrData.status.replace('-', ' ')}</span>
                </div>
                {qrData.notes && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Notes:</span>
                    <span className="text-gray-900">{qrData.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
