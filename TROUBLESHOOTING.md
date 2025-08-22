# Troubleshooting Guide

## SSO Callback Issue

### Problem
After signing up, you see a blank page with URL `http://localhost:5173/signup/sso-callback`

### Solution
The issue has been fixed by implementing proper callback handling. Here's what was done:

1. **Added Callback Routes**: Added routes to handle Clerk's SSO callbacks
2. **Created RedirectHandler**: A component that properly handles post-authentication redirects
3. **Updated Clerk Configuration**: Configured Clerk to redirect to role selection after signup
4. **Fixed Routing**: Added proper routing for all callback patterns

### Files Modified
- `frontend/src/App.jsx` - Added callback routes and Clerk navigation handler
- `frontend/src/pages/SignUp.jsx` - Added redirect URLs
- `frontend/src/pages/SignIn.jsx` - Added redirect URLs
- `frontend/src/components/common/RedirectHandler.jsx` - New component for handling redirects

### Testing the Fix

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the signup flow**:
   - Go to `http://localhost:5173`
   - Click "Sign Up"
   - Complete the signup process
   - You should be redirected to `/role-selection` instead of seeing a blank page

## Common Issues and Solutions

### 1. Backend Connection Issues

**Problem**: Frontend can't connect to backend API

**Solution**:
- Ensure backend is running on port 5000
- Check that MongoDB is connected
- Verify environment variables are set correctly

**Test Backend**:
```bash
curl http://localhost:5000
# Should return: {"message":"E-Waste Management API"}
```

### 2. Clerk Authentication Issues

**Problem**: Clerk authentication not working

**Solution**:
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set in `.env`
- Check Clerk dashboard for correct configuration
- Ensure redirect URLs are configured in Clerk dashboard

### 3. Role Selection Not Working

**Problem**: User gets stuck on role selection page

**Solution**:
- Check browser console for errors
- Verify backend API endpoints are working
- Check MongoDB connection

### 4. Database Connection Issues

**Problem**: Can't connect to MongoDB

**Solution**:
- Verify `MONGODB_URI` is set correctly in backend `.env`
- Ensure MongoDB is running
- Check network connectivity

## Debug Steps

### 1. Check Backend Logs
```bash
cd backend
npm start
# Look for connection errors or API errors
```

### 2. Check Frontend Console
- Open browser developer tools
- Look for JavaScript errors
- Check network tab for failed API calls

### 3. Test API Endpoints
```bash
# Test main endpoint
curl http://localhost:5000

# Test user creation (replace with actual data)
curl -X POST http://localhost:5000/api/users/donor \
  -H "Content-Type: application/json" \
  -d '{"clerkId":"test123","name":"Test User","email":"test@example.com"}'
```

### 4. Check Environment Variables

**Frontend (.env)**:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

**Backend (.env)**:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

## Expected Flow

1. **User visits app** → Landing page
2. **User clicks Sign Up** → Clerk signup form
3. **User completes signup** → Redirected to `/role-selection`
4. **User selects role** → Fills out form
5. **User submits form** → Redirected to `/dashboard`
6. **User sees role-specific dashboard** → Success!

## If Issues Persist

1. **Clear browser cache and localStorage**
2. **Restart both frontend and backend servers**
3. **Check all environment variables**
4. **Verify MongoDB is running and accessible**
5. **Check Clerk dashboard configuration**

## Support

If you continue to experience issues:

1. Check the browser console for error messages
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Check Clerk dashboard for authentication configuration
