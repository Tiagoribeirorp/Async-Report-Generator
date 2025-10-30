// frontend/src/services/api.js - VERSÃO REAL
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para logs (útil para debug)
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const reportService = {
  // Solicitar novo relatório
  async createReport(reportData) {
    const response = await api.post('/api/reports', reportData);
    return response.data;
  },

  // Buscar relatório por ID
  async getReport(id) {
    const response = await api.get(`/api/reports/${id}`);
    return response.data;
  },

  // Listar todos os relatórios
  async listReports(params = {}) {
    const response = await api.get('/api/reports', { params });
    return response.data;
  },

  // Deletar relatório
  async deleteReport(id) {
    const response = await api.delete(`/api/reports/${id}`);
    return response.data;
  },

  // Estatísticas
  async getStats() {
    const response = await api.get('/api/reports/stats/summary');
    return response.data;
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;