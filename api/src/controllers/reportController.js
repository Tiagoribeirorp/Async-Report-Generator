// api/src/controllers/reportController.js
const Report = require('../models/Report');
const { getChannel } = require('../config/rabbitmq');
const { client } = require('../config/redis');

class ReportController {
  // Solicitar novo relatório
  async requestReport(req, res) {
    try {
      const { type, parameters = {} } = req.body;
      
      // Validação básica
      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de relatório é obrigatório'
        });
      }

      // Tipos válidos
      const validTypes = ['sales', 'users', 'products', 'financial'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Tipo de relatório inválido. Tipos válidos: ${validTypes.join(', ')}`
        });
      }
      
      // Cria o relatório no MongoDB
      const report = new Report({
        type,
        parameters,
        status: 'pending'
      });
      
      await report.save();
      
      // Tenta enviar para a fila do RabbitMQ (se disponível)
      try {
        const channel = getChannel();
        channel.sendToQueue('report-requests', 
          Buffer.from(JSON.stringify({
            reportId: report._id.toString(),
            type,
            parameters,
            userId: report.userId
          })),
          { persistent: true }
        );
        
        console.log(`📋 Relatório ${report._id} enviado para fila do RabbitMQ`);
        
      } catch (rabbitError) {
        console.log('⚠️ RabbitMQ offline, relatório ficará pendente até a conexão ser restabelecida');
        // O relatório continua como 'pending' e pode ser processado quando o Worker estiver rodando
      }
      
      res.status(202).json({
        success: true,
        message: 'Relatório em processamento',
        reportId: report._id,
        status: 'pending',
        createdAt: report.createdAt
      });
      
    } catch (error) {
      console.error('Erro ao solicitar relatório:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar status do relatório
  async getReportStatus(req, res) {
    try {
      const { id } = req.params;
      
      // Validação do ID
      if (!id || id.length !== 24) {
        return res.status(400).json({
          success: false,
          message: 'ID do relatório inválido'
        });
      }
      
      // Primeiro tenta buscar do cache Redis
      try {
        const cachedReport = await client.get(`report:${id}`);
        if (cachedReport) {
          console.log('📦 Retornando relatório do cache Redis');
          const reportData = JSON.parse(cachedReport);
          return res.json({
            success: true,
            fromCache: true,
            report: reportData
          });
        }
      } catch (cacheError) {
        console.log('⚠️ Erro no cache Redis, buscando do MongoDB:', cacheError.message);
      }
      
      // Se não tem cache ou erro no Redis, busca do MongoDB
      const report = await Report.findById(id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Relatório não encontrado'
        });
      }
      
      // Se o relatório está completo, armazena no cache por 5 minutos
      if (report.status === 'completed') {
        try {
          await client.setEx(
            `report:${id}`, 
            300, // 5 minutos
            JSON.stringify(report.toObject())
          );
        } catch (cacheError) {
          console.log('⚠️ Não foi possível armazenar no cache Redis:', cacheError.message);
        }
      }
      
      res.json({
        success: true,
        fromCache: false,
        report
      });
      
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar todos os relatórios do usuário
  async listReports(req, res) {
    try {
      const { limit = 10, page = 1 } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const reports = await Report.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Report.countDocuments();
      
      res.json({
        success: true,
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
      
    } catch (error) {
      console.error('Erro ao listar relatórios:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Deletar relatório
  async deleteReport(req, res) {
    try {
      const { id } = req.params;
      
      // Validação do ID
      if (!id || id.length !== 24) {
        return res.status(400).json({
          success: false,
          message: 'ID do relatório inválido'
        });
      }
      
      const report = await Report.findByIdAndDelete(id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Relatório não encontrado'
        });
      }
      
      // Remove do cache Redis se existir
      try {
        await client.del(`report:${id}`);
      } catch (cacheError) {
        console.log('⚠️ Erro ao remover do cache Redis:', cacheError.message);
      }
      
      res.json({
        success: true,
        message: 'Relatório deletado com sucesso',
        report
      });
      
    } catch (error) {
      console.error('Erro ao deletar relatório:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Estatísticas dos relatórios
  async getStats(req, res) {
    try {
      const stats = await Report.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const total = await Report.countDocuments();
      
      // Transforma o array em objeto
      const statusCounts = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});
      
      res.json({
        success: true,
        stats: {
          total,
          ...statusCounts
        }
      });
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new ReportController();