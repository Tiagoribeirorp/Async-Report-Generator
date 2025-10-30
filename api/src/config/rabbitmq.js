// api/src/config/rabbitmq.js
const amqp = require('amqplib');

let connection = null;
let channel = null;
let isConnecting = false;

const connectRabbitMQ = async (maxRetries = 10, retryInterval = 5000) => {
  if (isConnecting) {
    console.log('🔄 Conexão com RabbitMQ já em andamento...');
    return;
  }
  
  isConnecting = true;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentando conectar ao RabbitMQ (tentativa ${attempt}/${maxRetries})...`);
      
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      
      // Cria a fila para relatórios
      await channel.assertQueue('report-requests', {
        durable: true
      });
      
      console.log('✅ RabbitMQ conectado e fila "report-requests" criada');
      isConnecting = false;
      return channel;
      
    } catch (error) {
      console.error(`❌ Falha na tentativa ${attempt} de conectar com RabbitMQ:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('❌ Todas as tentativas de conexão com RabbitMQ falharam');
        isConnecting = false;
        throw error;
      }
      
      console.log(`⏳ Aguardando ${retryInterval / 1000} segundos antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('Channel do RabbitMQ não está disponível');
  }
  return channel;
};

// Handler para reconexão automática
connection?.on('close', () => {
  console.log('🔌 Conexão RabbitMQ fechada, tentando reconectar...');
  isConnecting = false;
  setTimeout(() => connectRabbitMQ(), 5000);
});

connection?.on('error', (err) => {
  console.error('❌ Erro na conexão RabbitMQ:', err);
  isConnecting = false;
});

module.exports = { connectRabbitMQ, getChannel };