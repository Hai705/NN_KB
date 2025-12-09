const mongoose = require('mongoose');

async function connect() {
    try {
        // SỬA DÒNG NÀY:
        // Nếu có biến MONGO_URI thì dùng (trên Render), không thì dùng localhost (dưới máy)
        const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/AndShop';
        
        await mongoose.connect(dbUrl);
        console.log('Connect Database success!');
    } catch (error) {
        console.log('Connect Database failed:', error);
    }
};

module.exports = {
    connect,
    JWT_SECRET: process.env.JWT_SECRET,
};