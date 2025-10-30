// worker/src/worker.js
require('dotenv').config();
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const { connectRabbitMQ, getChannel } = require('./config/rabbitmq');
const Report = require('./models/Report');
const reportProcessor = require('./services/reportProcessor');

class ReportWorker {
  constructor() {
    this.isProcessing = false;
  }

  async initialize() {
    try {
      console.log('🚀 Inicializando Worker de Relatórios...');
      
      await connectDB();
      await connectRedis();
      await connectRabbitMQ();
      
      await this.startConsuming();
      
      console.log('✅ Worker inicializado e consumindo mensagens');
      
    } catch (error) {
      console.error('❌ Falha ao inicializar Worker:', error);
      process.exit(1);
    }
  }

  async startConsuming() {
    const channel = getChannel();
    
    // Configura o consumo da fila
    await channel.prefetch(1); // Processa uma mensagem por vez
    
    console.log('📭 Aguardando mensagens na fila "report-requests"...');
    
    channel.consume('report-requests', async (msg) => {
      if (msg !== null) {
        await this.processMessage(msg, channel);
      }
    }, {
      noAck: false // Confirmação manual das mensagens
    });
  }

  async processMessage(msg, channel) {
    let report = null;
    
    try {
      const messageContent = JSON.parse(msg.content.toString());
      const { reportId, type, parameters } = messageContent;
      
      console.log(`📥 Nova mensagem recebida: ${reportId}`);
      
      // Atualiza status para processing
      report = await Report.findByIdAndUpdate(
        reportId,
        { 
          status: 'processing',
          startedAt: new Date()
        },
        { new: true }
      );
      
      if (!report) {
        throw new Error(`Relatório ${reportId} não encontrado`);
      }
      
      // Processa o relatório
      const result = await reportProcessor.processReport(reportId, type, parameters);
      
      // Atualiza status para completed
      await Report.findByIdAndUpdate(reportId, {
        status: 'completed',
        fileUrl: result.fileUrl,
        completedAt: new Date()
      });
      
      console.log(`✅ Relatório ${reportId} finalizado com sucesso`);
      
      // Confirma a mensagem (remove da fila)
      channel.ack(msg);
      
    } catch (error) {
      console.error(`❌ Erro ao processar mensagem:`, error);
      
      // Se temos um report, marca como failed
      if (report && report._id) {
        await Report.findByIdAndUpdate(report._id, {
          status: 'failed',
          error: error.message,
          completedAt: new Date()
        });
      }
      
      // Rejeita a mensagem (pode ser reprocessada depois)
      channel.nack(msg, false, false);
    }
  }
}

// Inicializa o worker
const worker = new ReportWorker();
worker.initialize().catch(console.error);

// Handlers para graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Recebido SIGINT, encerrando worker...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Recebido SIGTERM, encerrando worker...');
  process.exit(0);
});