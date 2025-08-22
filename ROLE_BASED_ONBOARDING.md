# Role-Based Onboarding System

A complete full-stack implementation for a role-based onboarding flow using React, Clerk, Express, and MongoDB.

## 🎯 Overview

This system provides a seamless onboarding experience where users can:
1. Sign up/sign in using Clerk authentication
2. Select their role (Donor, Vendor, or Company Admin)
3. Fill out role-specific forms
4. Access role-appropriate features in the dashboard

## 🏗️ Architecture

### Frontend (React + Clerk)
- **Authentication**: Clerk handles user authentication
- **Role Selection**: Interactive role selection with form validation
- **Protected Routes**: Role-based access control
- **State Management**: Custom hooks for user data management

### Backend (Express + MongoDB)
- **Unified API**: Single endpoint for all user operations
- **Role-based Collections**: Separate collections for each user type
- **Data Validation**: Server-side validation and error handling

## 📋 User Roles

### 1. Donor
- **Purpose**: Users who want to donate e-waste items
- **Required Fields**: name, email, contactNumber, address
- **Features**: Schedule pickups, view campaigns, track donations

### 2. Vendor
- **Purpose**: Users who process and handle e-waste
- **Required Fields**: name, email, licenseNumber, contactNumber, address
- **Features**: Manage pickups, compliance tracking, analytics

### 3. Company Admin
- **Purpose**: Company administrators who manage operations
- **Required Fields**: name, email, registrationNumber, contactNumber, address
- **Features**: Full system access, QR generation, campaign management

## 🔄 User Flow

```
1. User visits app → Landing page
2. User signs up/signs in → Clerk authentication
3. User redirected to role selection → /role-selection
4. User selects role and fills form → Form validation
5. Data sent to backend → User created in appropriate collection
6. User redirected to dashboard → Role-specific features available
```

## 🛠️ Implementation Details

### Backend Models

All models include a `clerkId` field to link with Clerk authentication:

```javascript
// Donor Model
{
  clerkId: String (required, unique),
  name: String (required),
  email: String (required, unique),
  contactNumber: String,
  address: String,
  createdAt: Date
}

// Vendor Model
{
  clerkId: String (required, unique),
  name: String (required),
  email: String (required, unique),
  licenseNumber: String (required, unique),
  contactNumber: String,
  address: String,
  createdAt: Date
}

// Company Model
{
  clerkId: String (required, unique),
  name: String (required),
  email: String (required, unique),
  registrationNumber: String (required, unique),
  contactNumber: String,
  address: String,
  createdAt: Date
}
```

### API Endpoints

#### POST `/api/users/:role`
Creates or updates user based on role.

**Parameters:**
- `role`: 'donor', 'vendor', or 'company'

**Request Body:**
```javascript
{
  clerkId: "user_clerk_id",
  name: "User Name",
  email: "user@example.com",
  contactNumber: "1234567890",
  address: "User Address",
  licenseNumber: "LIC123", // Required for vendors
  registrationNumber: "REG123" // Required for companies
}
```

**Response:**
```javascript
{
  success: true,
  message: "User created/updated successfully",
  user: {
    id: "user_id",
    clerkId: "user_clerk_id",
    name: "User Name",
    email: "user@example.com",
    role: "donor",
    contactNumber: "1234567890",
    address: "User Address",
    // Role-specific fields included
  }
}
```

#### GET `/api/users/clerk/:clerkId`
Retrieves user information by Clerk ID.

**Response:**
```javascript
{
  success: true,
  user: {
    id: "user_id",
    clerkId: "user_clerk_id",
    name: "User Name",
    email: "user@example.com",
    role: "donor",
    contactNumber: "1234567890",
    address: "User Address",
    // Role-specific fields included
  }
}
```

### Frontend Components

#### RoleSelection.jsx
- Handles role selection and form submission
- Validates form data before submission
- Pre-fills email from Clerk user data
- Redirects to dashboard after successful submission

#### ProtectedRoute.jsx
- Wraps protected routes
- Checks if user has completed role selection
- Redirects to role selection if needed
- Prevents access to dashboard without role assignment

#### useAuth.js Hook
- Manages authentication state
- Provides user role and ID information
- Handles role updates and data persistence
- Integrates with localStorage for session management

## 🔐 Security Features

- **Authentication**: Clerk handles secure authentication
- **Role-based Access**: Different features for different roles
- **Data Validation**: Both client and server-side validation
- **Unique Constraints**: Prevents duplicate users and data
- **Protected Routes**: Automatic redirection for unauthorized access

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: Clear error messages
- **Form Validation**: Real-time validation feedback
- **Role-specific Forms**: Dynamic form fields based on role
- **Modern Styling**: TailwindCSS for beautiful UI

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- MongoDB database
- Clerk account and API keys

### Environment Variables

**Frontend (.env):**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

**Backend (.env):**
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Installation

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

3. **Set up environment variables**
4. **Start the servers:**
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend
   cd frontend
   npm run dev
   ```

## 📁 File Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Header.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   └── RoleSelection.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── Donor.js
│   │   ├── Vendor.js
│   │   └── Company.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── server.js
│   └── package.json
└── README.md
```

## 🧪 Testing the Flow

1. **Sign Up**: Create a new account using Clerk
2. **Role Selection**: Choose your role (donor/vendor/company)
3. **Form Completion**: Fill out the required fields
4. **Dashboard Access**: Verify role-specific features are available
5. **Refresh Test**: Refresh the page to ensure role persistence

## 🔧 Customization

### Adding New Roles
1. Create new model in `backend/models/`
2. Update `userRoutes.js` to handle new role
3. Add role option in `RoleSelection.jsx`
4. Update role-based navigation in `Sidebar.jsx`

### Modifying Form Fields
1. Update the corresponding model schema
2. Modify form fields in `RoleSelection.jsx`
3. Update validation logic
4. Test the new fields

## 🐛 Troubleshooting

### Common Issues

1. **User not redirected to role selection**
   - Check if user exists in database
   - Verify Clerk ID is being passed correctly

2. **Form submission fails**
   - Check backend logs for validation errors
   - Verify all required fields are filled

3. **Role not persisting after refresh**
   - Check localStorage implementation
   - Verify useAuth hook is working correctly

### Debug Mode
Enable debug logging in the backend:
```javascript
console.log('User data:', userData);
console.log('Role:', role);
```

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check Clerk dashboard for authentication issues

## 🔄 Future Enhancements

- **Email Verification**: Additional email verification step
- **Profile Management**: Allow users to update their profiles
- **Role Switching**: Allow users to change roles (with approval)
- **Advanced Analytics**: Role-specific analytics and reporting
- **Multi-language Support**: Internationalization support
- **Mobile App**: React Native version for mobile devices
