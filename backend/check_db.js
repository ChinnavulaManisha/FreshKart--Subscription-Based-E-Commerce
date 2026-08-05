const mongoose = require('mongoose');
const Order = require('./models/Order');
const Subscription = require('./models/Subscription');
const connectDB = require('./config/db');
require('dotenv').config({ path: './.env' });

const run = async () => {
    await connectDB();
    const subs = await Subscription.find();
    console.log('Subscriptions:', subs.length, subs);
    
    const orders = await Order.find();
    console.log('Orders:', orders.length, orders.map(o => ({
        id: o._id,
        items: o.orderItems.map(i => ({name: i.name, isSub: i.isSubscription, freq: i.frequency}))
    })));
    process.exit();
};
run();
