// worker/src/config/rabbitmq.js
const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async (maxRetries = 10, retryInterval = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Worker: Tentando conectar ao RabbitMQ (tentativa ${attempt}/${maxRetries})...`);
      
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      
      // Garante que a fila existe
      await channel.assertQueue('report-requests', {
        durable: true
      });
      
      console.log('✅ Worker: RabbitMQ conectado e pronto para consumir');
      return channel;
      
    } catch (error) {
      console.error(`❌ Worker: Falha na tentativa ${attempt} de conectar com RabbitMQ:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('❌ Worker: Todas as tentativas de conexão com RabbitMQ falharam');
        throw error;
      }
      
      console.log(`⏳ Worker: Aguardando ${retryInterval / 1000} segundos...`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };