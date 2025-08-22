import { useState, useRef, useEffect } from 'react';
import Quagga from '@ericblade/quagga2';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { 
  X, 
  Camera, 
  CameraOff, 
  Scan, 
  CheckCircle, 
  AlertCircle,
  Download,
  Upload,
  History,
  RefreshCw
} from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ewasteAPI } from '../../services/api';

const QRScanner = ({ isOpen, onClose, onScan }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [manualSerial, setManualSerial] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('in transit');
  const [scanMode, setScanMode] = useState('qr');
  
  // New state for e-waste item details
  const [ewasteItem, setEwasteItem] = useState(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const fileInputRef = useRef(null);
  const barcodeContainerRef = useRef(null);

  // Check camera permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (err) {
        console.log(err);
        setHasPermission(false);
        setError('Camera access denied. Please allow camera permissions to scan QR codes.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      checkPermissions();
    }
  }, [isOpen]);

  // Function to fetch e-waste item details from backend
  const fetchEwasteItem = async (serial) => {
    setIsLoadingItem(true);
    setError(null);
    try {
      const item = await ewasteAPI.getBySerial(serial);
      setEwasteItem(item);
      return item;
    } catch (err) {
      setError(err.message);
      setEwasteItem(null);
      return null;
    } finally {
      setIsLoadingItem(false);
    }
  };

  // Function to update e-waste status in backend
  const updateEwasteStatus = async (serial, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updatedItem = await ewasteAPI.updateStatusBySerial(serial, newStatus);
      setEwasteItem(updatedItem);
      return updatedItem;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleScan = async (result) => {
    if (result) {
      setScanResult(result);
      const newHistory = [
        { 
          id: Date.now(), 
          data: result, 
          timestamp: new Date().toLocaleString(),
          type: 'scan' 
        },
        ...scanHistory.slice(0, 9) // Keep only last 10 items
      ];
      setScanHistory(newHistory);
      
      // Notify parent component
      if (onScan) {
        onScan(result);
      }

      // Fetch e-waste item details from backend
      await fetchEwasteItem(result);
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setError(err.message || 'Failed to initialize QR scanner');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // In a real app, you would use a QR code decoding library here
      // For demo purposes, we'll simulate a scan result
      const simulatedResult = `file-upload-${Date.now()}`;
      handleScan(simulatedResult);
    };
    reader.readAsDataURL(file);
  };

  const handleRetry = () => {
    setScanResult(null);
    setError(null);
    setEwasteItem(null);
  };

  const handleClose = () => {
    setScanResult(null);
    setError(null);
    setEwasteItem(null);
    setIsViewingHistory(false);
    onClose();
  };

  // Initialize/teardown Quagga when in barcode mode
  useEffect(() => {
    const shouldStart = isOpen && hasPermission && !isLoading && scanMode === 'barcode';
    if (!shouldStart) return;

    let active = true;
    const start = async () => {
      try {
        await Quagga.init({
          inputStream: {
            type: 'LiveStream',
            target: barcodeContainerRef.current,
            constraints: { facingMode: 'environment' }
          },
          decoder: {
            readers: ['code_128_reader', 'ean_reader', 'ean_8_reader']
          },
          locate: true
        });
        if (!active) return;
        Quagga.start();
        Quagga.onDetected((data) => {
          const code = data?.codeResult?.code;
          if (code) handleScan(code);
        });
      } catch {
        setError('Failed to start barcode scanner');
      }
    };
    start();

    return () => {
      active = false;
      try { Quagga.offDetected(); Quagga.stop(); } catch { /* ignore cleanup errors */ }
    };
  }, [isOpen, hasPermission, isLoading, scanMode]);

  const renderScanner = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Initializing scanner...</p>
        </div>
      );
    }

    if (!hasPermission) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg p-6 text-center">
          <CameraOff className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
          <p className="text-gray-600 mb-4">
            Please allow camera permissions in your browser settings to use the QR scanner.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload QR Image Instead
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      );
    }

    if (scanResult) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-green-50 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Scanned Successfully!</h3>
          <div className="bg-white p-3 rounded-lg border border-green-200 w-full mb-4">
            <p className="text-sm font-mono break-words">{scanResult}</p>
          </div>
          
          {/* Show e-waste item details if available */}
          {ewasteItem && (
            <div className="w-full mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Item Details:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Type:</strong> {ewasteItem.itemType}</p>
                <p><strong>Status:</strong> {ewasteItem.status}</p>
                <p><strong>Pickup Address:</strong> {ewasteItem.pickupAddress}</p>
                {ewasteItem.brand && <p><strong>Brand:</strong> {ewasteItem.brand}</p>}
                {ewasteItem.weight && <p><strong>Weight:</strong> {ewasteItem.weight}</p>}
              </div>
              
              {/* Status Update Section */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <label className="block text-sm font-medium text-blue-900 mb-1">Update Status:</label>
                <div className="flex gap-2">
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="flex-1 rounded-lg border px-2 py-1 text-sm"
                  >
                    {['waiting for pickup', 'in transit', 'processing', 'done'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => updateEwasteStatus(ewasteItem.serial, statusUpdate)}
                    disabled={isUpdatingStatus || ewasteItem.status === statusUpdate}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading state for item details */}
          {isLoadingItem && (
            <div className="w-full mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Loading item details...</span>
              </div>
            </div>
          )}
          
          {/* Error state for item details */}
          {error && !ewasteItem && (
            <div className="w-full mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={handleRetry}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Scan Another
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Scanner Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        {scanMode === 'qr' ? (
          <>
            <QrScanner
              onDecode={handleScan}
              onError={handleError}
              constraints={{ 
                facingMode: 'environment',
                aspectRatio: 1 
              }}
              containerStyle={{
                borderRadius: '0.5rem',
                overflow: 'hidden',
                height: '256px'
              }}
              videoStyle={{
                objectFit: 'cover'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-blue-400 rounded-lg w-48 h-48 flex items-center justify-center">
                <Scan className="w-12 h-12 text-blue-400 animate-pulse" />
              </div>
            </div>
          </>
        ) : (
          <div ref={barcodeContainerRef} className="rounded-lg overflow-hidden h-64 bg-black/5" />
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Camera className="w-6 h-6 mr-2 text-blue-600" />
                {isViewingHistory ? 'Scan History' : 'QR Code Scanner'}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                {!isViewingHistory && scanHistory.length > 0 && (
                  <button
                    onClick={() => setIsViewingHistory(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="View scan history"
                  >
                    <History className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {isViewingHistory ? (
              <div className="space-y-4">
                <div className="max-h-64 overflow-y-auto">
                  {scanHistory.map((item) => (
                    <div key={item.id} className="p-3 border border-gray-200 rounded-lg mb-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm font-mono break-words">{item.data}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsViewingHistory(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Scanner
                </button>
              </div>
            ) : (
              <>
                {/* Mode toggle */}
                <div className="mb-3 flex items-center gap-2">
                  <button
                    onClick={() => setScanMode('qr')}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${scanMode === 'qr' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    QR Mode
                  </button>
                  <button
                    onClick={() => setScanMode('barcode')}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${scanMode === 'barcode' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    Barcode Mode
                  </button>
                </div>

                {renderScanner()}
                
                {/* Instructions */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Point your camera at a {scanMode === 'qr' ? 'QR code' : 'barcode'} to scan it automatically
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-full px-4 py-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Or upload an image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Manual serial entry for testing */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test with Manual Serial Entry</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualSerial}
                      onChange={(e) => setManualSerial(e.target.value)}
                      placeholder="e.g., EW-..."
                      className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => {
                        if (!manualSerial) return;
                        handleScan(manualSerial);
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Test Scan
                    </button>
                  </div>
                </div>

                {/* Demo QR Codes for Testing */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Scan className="w-4 h-4 mr-2" />
                    Test QR Codes
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'ewaste-item-001',
                      'ewaste-item-002', 
                      'ewaste-item-003'
                    ].map((testCode) => (
                      <button
                        key={testCode}
                        onClick={() => handleScan(testCode)}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                      >
                        Test: {testCode.split('-')[2]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default QRScanner;