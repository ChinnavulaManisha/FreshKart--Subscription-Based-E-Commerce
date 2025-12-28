const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware: Enable CORS for cross-origin requests
app.use(cors());

// Middleware: Parse incoming JSON requests
app.use(express.json());

// Main entry point for static file serving
// Serve uploaded images from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// API Route Definitions
// Mount various router modules for different features
app.use('/api/users', require('./routes/userRoutes'));          // Auth and User management
app.use('/api/products', require('./routes/productRoutes'));    // Product catalog
app.use('/api/subscriptions', require('./routes/subscriptionRoutes')); // Recurring deliveries
app.use('/api/orders', require('./routes/orderRoutes'));        // Order processing
app.use('/api/utils', require('./routes/utilsRoutes'));         // Helper utilities (e.g., Pincode)

// Error Handling Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Custom 404 handler for unknown routes
app.use(notFound);

// Global error handler for catching and formatting errors
app.use(errorHandler);

// Server startup configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
