# E-Waste Management System with QR Code Tracking

A comprehensive e-waste management system that uses QR codes to track the lifecycle of electronic waste items from collection to disposal.

## 🚀 Features

### QR Code Generation
- **Dynamic Form Creation**: Fill out detailed forms for e-waste items
- **Unique Serial Numbers**: Automatically generated unique identifiers (EW-XXXXX-XXXXX format)
- **Barcode Generation**: Creates both QR codes and barcodes for items
- **Backend Integration**: Saves all item data to MongoDB database
- **Printable Labels**: Download high-quality PNG labels for printing

### QR Code Scanning & Status Updates
- **Real-time Scanning**: Scan QR codes using device camera
- **Item Details Display**: View complete item information after scanning
- **Status Management**: Update item status through the scanning interface
- **Backend Sync**: All changes are immediately saved to the database
- **Status Workflow**: waiting for pickup → in transit → processing → done

### Backend API
- **RESTful Endpoints**: Complete CRUD operations for e-waste items
- **Serial Number Lookup**: Find items by unique serial numbers
- **Status Updates**: Update item status by serial number
- **MongoDB Integration**: Persistent data storage with Mongoose ODM

## 🏗️ Architecture

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       └── QRScanner.jsx          # QR code scanning component
│   ├── pages/
│   │   ├── QRGenerator.jsx            # QR code generation form
│   │   └── Demo.jsx                   # Demo page for testing
│   └── services/
│       └── api.js                     # Backend API integration
```

### Backend (Node.js + Express + MongoDB)
```
backend/
├── controllers/
│   └── ewasteController.js            # Business logic for e-waste operations
├── models/
│   └── EWaste.js                      # MongoDB schema definition
├── routes/
│   └── ewasteRoutes.js                # API endpoint definitions
└── server.js                          # Express server setup
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ewaste_management
```

Start the backend server:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📱 Usage

### 1. Generate QR Code
1. Navigate to `/qr-generator`
2. Fill out the e-waste item form with:
   - Item type, brand, model
   - Weight and condition
   - Pickup address
   - Additional notes
3. Click "Generate Label"
4. Download the generated label as PNG

### 2. Scan QR Code
1. Open the QR scanner (available in multiple pages)
2. Point camera at the QR code
3. View item details
4. Update status if needed

### 3. Status Workflow
Items progress through these statuses:
- **waiting for pickup**: Initial state when item is reported
- **in transit**: Item has been collected and is being transported
- **processing**: Item is being processed/recycled
- **done**: Item has been completely processed

## 🔌 API Endpoints

### E-Waste Management
```
POST   /api/ewastes                    # Create new e-waste item
GET    /api/ewastes                    # Get all e-waste items
GET    /api/ewastes/:id                # Get item by ID
GET    /api/ewastes/serial/:serial     # Get item by serial number
PUT    /api/ewastes/:id/status         # Update status by ID
PUT    /api/ewastes/serial/:serial/status  # Update status by serial
```

### Request/Response Examples

#### Create E-Waste Item
```json
POST /api/ewastes
{
  "itemType": "Laptop",
  "brand": "Dell",
  "model": "Latitude 5520",
  "weight": "2.5 kg",
  "condition": "Working",
  "pickupAddress": "123 Tech Street, Bangalore",
  "date": "2024-01-15"
}
```

#### Update Status
```json
PUT /api/ewastes/serial/EW-ABC123-XYZ/status
{
  "status": "in transit"
}
```

## 🗄️ Database Schema

### E-Waste Item
```javascript
{
  serial: String,           // Unique serial number (required)
  donorId: ObjectId,        // Reference to donor (required)
  itemType: String,         // Type of electronic item (required)
  brand: String,            // Brand name
  model: String,            // Model number
  age: String,              // Age of the item
  weight: String,           // Weight with unit
  condition: String,        // Current condition
  pickupAddress: String,    // Pickup location (required)
  date: Date,               // Collection date (required)
  pictureUrl: String,       // Image URL
  shortNote: String,        // Additional notes
  status: String,           // Current status (enum)
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

## 🧪 Testing

### Demo Page
Visit `/demo` to see a complete demonstration of the system:
- Sample e-waste items with different statuses
- Interactive QR scanning
- Workflow explanation

### Test QR Codes
The system includes test QR codes for development:
- `ewaste-item-001`
- `ewaste-item-002`
- `ewaste-item-003`

### Manual Testing
Use the manual serial entry feature in the QR scanner to test with custom serial numbers.

## 🔒 Security Considerations

- **Input Validation**: All form inputs are validated
- **Error Handling**: Comprehensive error handling for API calls
- **CORS Configuration**: Proper CORS setup for frontend-backend communication
- **Database Validation**: MongoDB schema validation

## 🚧 Future Enhancements

- **User Authentication**: Add login/signup functionality
- **Role-based Access**: Different permissions for donors, vendors, admins
- **Image Upload**: Support for item photos
- **Analytics Dashboard**: Track e-waste processing metrics
- **Mobile App**: Native mobile application
- **Real-time Notifications**: Status change alerts
- **Bulk Operations**: Import/export multiple items

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This system is designed for educational and demonstration purposes. For production use, additional security measures, error handling, and testing should be implemented.
