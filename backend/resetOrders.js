const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const resetOrders = async () => {
    try {
        console.log('Deleting all orders...');
        const result = await Order.deleteMany({});
        console.log(`✅ Successfully deleted ${result.deletedCount} orders`);
        console.log('Order history and revenue have been reset to 0');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting orders:', error);
        process.exit(1);
    }
};

resetOrders();
