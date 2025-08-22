const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
//connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'E-Waste Management API' });
});

// Define routes
/*app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/reports', require('./routes/reports'));
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});