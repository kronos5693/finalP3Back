const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('../utils/logger');
//const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prueba';
const uri = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(uri,/* {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }*/);
        logger.info('Conexión a MongoDB exitosa');
    } catch (error) {
        logger.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
