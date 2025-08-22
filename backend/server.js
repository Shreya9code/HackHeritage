const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

// Load env vars
dotenv.config();

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected!");
    // Optional: set a global variable for db access
    global.db = client.db("ewaste"); // your database name
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'E-Waste Management API' });
});

// Define routes
/*
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/reports', require('./routes/reports'));
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
