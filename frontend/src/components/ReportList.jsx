// frontend/src/components/ReportList.jsx
import React from 'react';
import { useReports, useDeleteReport } from '../hooks/useReports';
import StatusBadge from './StatusBadge';

const ReportList = () => {
  const { data, isLoading, error } = useReports();
  const deleteReportMutation = useDeleteReport();

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      try {
        await deleteReportMutation.mutateAsync(reportId);
      } catch (error) {
        console.error('Erro ao excluir relatório:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getReportTypeIcon = (type) => {
    const icons = {
      sales: '📊',
      users: '👥',
      products: '📦',
      financial: '💰'
    };
    return icons[type] || '📋';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Relatórios Recentes</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Relatórios Recentes</h2>
        <div className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-red-600 font-medium">Erro ao carregar relatórios</p>
          <p className="text-gray-600 mt-2">Tente recarregar a página</p>
        </div>
      </div>
    );
  }

  const reports = data?.reports || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📜 Relatórios Recentes</h2>
        <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
          {reports.length} {reports.length === 1 ? 'relatório' : 'relatórios'}
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório encontrado</h3>
          <p className="text-gray-600">Solicite seu primeiro relatório usando o formulário acima!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-2xl">
                    {getReportTypeIcon(report.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {report.type === 'sales' && 'Relatório de Vendas'}
                        {report.type === 'users' && 'Relatório de Usuários'}
                        {report.type === 'products' && 'Relatório de Produtos'}
                        {report.type === 'financial' && 'Relatório Financeiro'}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        ID: {report._id.slice(-8)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Criado em:</span>{' '}
                        {formatDate(report.createdAt)}
                      </p>
                      {report.parameters?.dateRange && (
                        <p>
                          <span className="font-medium">Período:</span>{' '}
                          {report.parameters.dateRange}
                        </p>
                      )}
                      {report.completedAt && (
                        <p>
                          <span className="font-medium">Concluído em:</span>{' '}
                          {formatDate(report.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={report.status} />
                  
                  {report.status === 'completed' && report.fileUrl && (
                    <button
                      onClick={() => window.open(`${import.meta.env.VITE_API_URL}${report.fileUrl}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      📁 Abrir
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    disabled={deleteReportMutation.isLoading}
                    className="text-red-600 hover:text-red-800 p-2 transition-colors disabled:opacity-50"
                    title="Excluir relatório"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Progress Bar para relatórios em processamento */}
              {report.status === 'processing' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full animate-pulse-slow"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    Processando... Aguarde
                  </p>
                </div>
              )}

              {report.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <strong>Erro:</strong> {report.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;