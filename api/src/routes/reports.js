// api/src/routes/reports.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Solicitar novo relatório
router.post('/', reportController.requestReport);

// Buscar status do relatório
router.get('/:id', reportController.getReportStatus);

// Listar relatórios
router.get('/', reportController.listReports);

// Deletar relatório
router.delete('/:id', reportController.deleteReport);

// Estatísticas
router.get('/stats/summary', reportController.getStats);

module.exports = router;