import { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import JsBarcode from 'jsbarcode';

const QRGenerator = () => {
  const [qrData, setQrData] = useState({
    itemType: '',
    customItemType: '',
    brand: '',
    model: '',
    age: '',
    weightValue: '',
    weightUnit: 'kg',
    condition: '',
    pickupAddress: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    picture: null,
  });
  const [generatedSerial, setGeneratedSerial] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const labelRef = useRef(null);
  const barcodeRef = useRef(null);

  // Helpers for localStorage persistence
  const STORAGE_KEY = 'ewaste_items';
  const readItems = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_e) {
      return [];
    }
  };
  const writeItems = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };
  const upsertItem = (item) => {
    const items = readItems();
    const idx = items.findIndex((i) => i.serial === item.serial);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.unshift(item);
    }
    writeItems(items);
  };

  const generatedItem = useMemo(() => {
    if (!generatedSerial) return null;
    const { itemType, customItemType, weightValue, weightUnit, condition, pickupAddress, date } = qrData;

    const normalizedType = (itemType === 'Other' ? customItemType : itemType) || '';
    const numericWeightValue = Number.parseFloat(weightValue || '0') || 0;
    const numericWeightKg = (weightUnit === 'kg') ? numericWeightValue : (numericWeightValue / 1000);

    const computeClassification = () => {
      const typeLower = normalizedType.toLowerCase();
      const conditionLower = (condition || '').toLowerCase();
      const hazardousTypes = ['battery', 'ups', 'crt', 'tube', 'bulb', 'toner', 'ink'];
      if (hazardousTypes.some(t => typeLower.includes(t)) || conditionLower.includes('leak')) {
        return 'hazardous';
      }
      const reusableTypes = ['laptop','desktop','monitor','mobile','phone','tablet'];
      if (reusableTypes.some(t => typeLower.includes(t)) && (conditionLower.includes('working') || conditionLower.includes('good'))) {
        if (numericWeightKg <= 25) return 'reusable';
      }
      return 'recyclable';
    };

    const computeEstimatedPrice = () => {
      const typeLower = normalizedType.toLowerCase();
      const conditionLower = (condition || '').toLowerCase();
      // Base price per kg (in INR) by rough category
      let basePerKg = 15; // default miscellaneous e-waste
      if (/(laptop|desktop|computer|monitor|tablet|mobile|phone)/.test(typeLower)) basePerKg = 60;
      if (/(printer|scanner|tv|television)/.test(typeLower)) basePerKg = 35;
      if (/(battery|ups|crt|tube|bulb|toner|ink)/.test(typeLower)) basePerKg = 10; // often disposal cost offsets value

      // Condition multiplier
      let conditionMultiplier = 0.6; // fair/unknown
      if (/(working|good|ok)/.test(conditionLower)) conditionMultiplier = 1.0;
      if (/(damaged|broken|dead|faulty)/.test(conditionLower)) conditionMultiplier = 0.4;
      if (/(leak|hazard)/.test(conditionLower)) conditionMultiplier = 0.2;

      const price = Math.max(0, basePerKg * numericWeightKg * conditionMultiplier);
      return Math.round(price * 100) / 100; // 2 decimals
    };

    return {
      serial: generatedSerial,
      type: normalizedType,
      weightValue,
      weightUnit,
      condition,
      pickupAddress,
      date,
      classification: computeClassification(),
      estimatedPrice: computeEstimatedPrice(),
      status: 'waiting for pickup',
      createdAt: new Date().toISOString()
    };
  }, [generatedSerial, qrData]);

  // Render barcode when we have an item
  useEffect(() => {
    if (generatedItem && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, generatedItem.serial, {
          format: 'CODE128',
          lineColor: '#000',
          background: '#ffffff',
          width: 2,
          height: 64,
          displayValue: false,
          margin: 0
        });
      } catch (_e) {
        // ignore
      }
    }
  }, [generatedItem]);

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

  const generateLabel = () => {
    if (!qrData.itemType) {
      alert('Please select an Item Type');
      return;
    }
    if (qrData.itemType === 'Other' && !qrData.customItemType) {
      alert('Please specify the Item Type');
      return;
    }

    setIsGenerating(true);
    
    // Generate a serial number
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.floor(Math.random() * 46655).toString(36).toUpperCase();
    const serial = `EW-${ts}-${rand}`;
    setGeneratedSerial(serial);

    // Persist item with initial status
    const normalizedType = qrData.itemType === 'Other' ? qrData.customItemType : qrData.itemType;
    const conditionLower = (qrData.condition || '').toLowerCase();
    const numericWeightValue = Number.parseFloat(qrData.weightValue || '0') || 0;
    const numericWeightKg = (qrData.weightUnit === 'kg') ? numericWeightValue : (numericWeightValue / 1000);
    const hazardousTypes = ['battery', 'ups', 'crt', 'tube', 'bulb', 'toner', 'ink'];
    const reusableTypes = ['laptop','desktop','monitor','mobile','phone','tablet'];
    const classification = hazardousTypes.some(t => (normalizedType || '').toLowerCase().includes(t)) || conditionLower.includes('leak')
      ? 'hazardous'
      : (reusableTypes.some(t => (normalizedType || '').toLowerCase().includes(t)) && (conditionLower.includes('working') || conditionLower.includes('good')) && numericWeightKg <= 25)
        ? 'reusable'
        : 'recyclable';

    const newItem = {
      serial,
      type: normalizedType,
      weightValue: qrData.weightValue,
      weightUnit: qrData.weightUnit,
      condition: qrData.condition,
      pickupAddress: qrData.pickupAddress,
      date: qrData.date,
      classification,
      estimatedPrice: (() => {
        const typeLower = (normalizedType || '').toLowerCase();
        const condLower = (qrData.condition || '').toLowerCase();
        let basePerKg = 15;
        if (/(laptop|desktop|computer|monitor|tablet|mobile|phone)/.test(typeLower)) basePerKg = 60;
        if (/(printer|scanner|tv|television)/.test(typeLower)) basePerKg = 35;
        if (/(battery|ups|crt|tube|bulb|toner|ink)/.test(typeLower)) basePerKg = 10;
        let m = 0.6;
        if (/(working|good|ok)/.test(condLower)) m = 1.0;
        if (/(damaged|broken|dead|faulty)/.test(condLower)) m = 0.4;
        if (/(leak|hazard)/.test(condLower)) m = 0.2;
        const kg = (qrData.weightUnit === 'kg') ? (Number.parseFloat(qrData.weightValue || '0') || 0) : ((Number.parseFloat(qrData.weightValue || '0') || 0) / 1000);
        const price = Math.max(0, basePerKg * kg * m);
        return Math.round(price * 100) / 100;
      })(),
      status: 'waiting for pickup',
      createdAt: new Date().toISOString()
    };
    upsertItem(newItem);

    setTimeout(() => setIsGenerating(false), 300);
  };

  const downloadLabel = async () => {
    try {
      if (!generatedSerial) {
        alert('Please generate a label first.');
        return;
      }
      if (!labelRef.current) {
        alert('Label not found on screen.');
        return;
      }
      const canvas = await html2canvas(labelRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `label-${generatedSerial}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
      } else {
        const link = document.createElement('a');
        link.download = `label-${generatedSerial}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download label. Please try again.');
    }
  };

  const resetForm = () => {
    setQrData({
      itemType: '',
      customItemType: '',
      brand: '',
      model: '',
      age: '',
      weightValue: '',
      weightUnit: 'kg',
      condition: '',
      pickupAddress: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      picture: null,
    });
    setGeneratedSerial('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-emerald-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">E-waste Label Generator</h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Type *</label>
                <select
                  value={qrData.itemType}
                  onChange={(e) => setQrData({ ...qrData, itemType: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="">Select item type</option>
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {qrData.itemType === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify item type"
                    value={qrData.customItemType}
                    onChange={(e) => setQrData({ ...qrData, customItemType: e.target.value })}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                  />
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand (optional)</label>
                <input
                  type="text"
                  value={qrData.brand}
                  onChange={(e) => setQrData({ ...qrData, brand: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model (optional)</label>
                <input
                  type="text"
                  value={qrData.model}
                  onChange={(e) => setQrData({ ...qrData, model: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (optional)</label>
                <input
                  type="text"
                  value={qrData.age}
                  onChange={(e) => setQrData({ ...qrData, age: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={qrData.weightValue}
                    onChange={(e) => setQrData({ ...qrData, weightValue: e.target.value })}
                    className="flex-1 rounded-lg border px-3 py-2"
                  />
                  <select
                    value={qrData.weightUnit}
                    onChange={(e) => setQrData({ ...qrData, weightUnit: e.target.value })}
                    className="w-28 rounded-lg border px-3 py-2"
                  >
                    <option value="kg">kg</option>
                    <option value="g">gram</option>
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <input
                  type="text"
                  value={qrData.condition}
                  onChange={(e) => setQrData({ ...qrData, condition: e.target.value })}
                  placeholder="e.g., Working, Damaged"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Pickup Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                <input
                  type="text"
                  value={qrData.pickupAddress}
                  onChange={(e) => setQrData({ ...qrData, pickupAddress: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={qrData.date}
                  onChange={(e) => setQrData({ ...qrData, date: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrData({ ...qrData, picture: e.target.files[0] })}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Note (optional)</label>
                <textarea
                  value={qrData.notes}
                  onChange={(e) => setQrData({ ...qrData, notes: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={generateLabel}
                disabled={isGenerating || !qrData.itemType || (qrData.itemType === 'Other' && !qrData.customItemType)}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
              >
                {isGenerating ? 'Generating...' : 'Generate Label'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Label Display Section */}
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Label</h2>
            
            {generatedItem ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div
                    ref={labelRef}
                    className="w-[640px] h-[420px] rounded-md overflow-hidden shadow relative"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#111111',
                      border: '1px solid #111111',
                      fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto'
                    }}
                  >
                    {/* Top: Pickup Address (single full-width) */}
                    <div className="p-3">
                      <div className="text-sm font-semibold mb-1 text-center">Pickup Address</div>
                      <div className="text-xs whitespace-pre-wrap break-words rounded p-2" style={{ border: '1px solid #111111' }}>
                        {generatedItem.pickupAddress || '—'}
                      </div>
                    </div>
                    {/* Middle: Barcode band */}
                    <div className="py-3 flex flex-col items-center justify-center" style={{ borderTop: '1px solid #111111', borderBottom: '1px solid #111111' }}>
                      <svg ref={barcodeRef} className="w-[86%] h-20" />
                      <div className="mt-1 text-xs tracking-widest">{generatedItem.serial}</div>
                    </div>
                    {/* Bottom: Item details and status/date */}
                    <div className="grid grid-cols-2">
                      <div className="p-3">
                        <div className="text-sm font-semibold mb-1 text-center">Item Details</div>
                        <div className="text-xs rounded p-2" style={{ border: '1px solid #111111' }}>
                          <div>Type: {generatedItem.type || '—'}</div>
                          <div>Weight: {generatedItem.weightValue ? `${generatedItem.weightValue} ${generatedItem.weightUnit}` : '—'}</div>
                          <div>Classification: {generatedItem.classification}</div>
                          <div>Est. Price: ₹{Number.isFinite(generatedItem.estimatedPrice) ? generatedItem.estimatedPrice.toFixed(2) : '0.00'}</div>
                        </div>
                      </div>
                      <div className="p-3" style={{ borderLeft: '1px solid #111111' }}>
                        <div className="text-sm font-semibold mb-1 text-center">Status & Date</div>
                        <div className="text-xs rounded p-2" style={{ border: '1px solid #111111' }}>
                          <div>Status: {generatedItem.status}</div>
                          <div>Date: {generatedItem.date}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-3">
                  <button
                    onClick={downloadLabel}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
                  >
                    Download Label PNG
                  </button>
                  <p className="text-xs text-gray-500">Tip: Vendor can scan this barcode to update status.</p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <p className="text-gray-600">Fill the form and generate a label</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
