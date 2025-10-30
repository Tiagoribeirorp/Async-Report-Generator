// frontend/src/components/ReportForm.jsx
import React, { useState } from 'react';
import { useCreateReport } from '../hooks/useReports';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    type: 'sales',
    parameters: {
      dateRange: '2024-01-01 to 2024-12-31'
    }
  });

  const createReportMutation = useCreateReport();

  const reportTypes = [
    { value: 'sales', label: '📊 Relatório de Vendas', description: 'Análise de vendas e performance' },
    { value: 'users', label: '👥 Relatório de Usuários', description: 'Dados de usuários e segmentação' },
    { value: 'products', label: '📦 Relatório de Produtos', description: 'Estoque e performance de produtos' },
    { value: 'financial', label: '💰 Relatório Financeiro', description: 'Análise financeira e fluxo de caixa' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (createReportMutation.isLoading) return;

    try {
      await createReportMutation.mutateAsync(formData);
      
      // Reset form
      setFormData({
        type: 'sales',
        parameters: {
          dateRange: '2024-01-01 to 2024-12-31'
        }
      });

    } catch (error) {
      console.error('Erro ao criar relatório:', error);
    }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      parameters: {
        dateRange: prev.parameters.dateRange
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Solicitar Novo Relatório</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Relatório */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Relatório
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTypes.map((type) => (
              <div
                key={type.value}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.type === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTypeChange(type.value)}
              >
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-600 mt-1">{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Parâmetros */}
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">
            Período
          </label>
          <input
            type="text"
            id="dateRange"
            value={formData.parameters.dateRange}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              parameters: { ...prev.parameters, dateRange: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 2024-01-01 to 2024-12-31"
          />
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={createReportMutation.isLoading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            createReportMutation.isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {createReportMutation.isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Solicitando...
            </span>
          ) : (
            '🚀 Gerar Relatório'
          )}
        </button>

        {/* Mensagem de Sucesso */}
        {createReportMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">
              ✅ Relatório solicitado com sucesso! Acompanhe o processamento abaixo.
            </p>
          </div>
        )}

        {/* Mensagem de Erro */}
        {createReportMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              ❌ Erro ao solicitar relatório. Tente novamente.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReportForm;