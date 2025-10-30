// worker/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Worker: MongoDB conectado com sucesso');
  } catch (error) {
    console.error('❌ Worker: Erro ao conectar com MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;