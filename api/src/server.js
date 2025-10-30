// api/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const { connectRabbitMQ } = require('./config/rabbitmq');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reports', reportRoutes);

// Health check melhorado
app.get('/health', async (req, res) => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'OK',
      redis: 'OK',
      rabbitmq: 'CONNECTING' // Inicialmente como connecting
    }
  };
  
  res.status(200).json(healthcheck);
});

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API do Gerador de Relatórios Assíncronos',
    status: 'API rodando (RabbitMQ em conexão)',
    endpoints: {
      health: '/health',
      requestReport: 'POST /api/reports',
      getReport: 'GET /api/reports/:id',
      listReports: 'GET /api/reports'
    }
  });
});

// Initialize services
const initializeApp = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    // Inicia o RabbitMQ em background sem travar a API
    connectRabbitMQ().catch(err => {
      console.log('⚠️ RabbitMQ iniciando em background...');
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 API Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 API Docs: http://localhost:${PORT}/`);
      console.log('⚠️ RabbitMQ conectando em background...');
    });
    
  } catch (error) {
    console.error('❌ Falha ao inicializar aplicação:', error);
    process.exit(1);
  }
};

initializeApp();