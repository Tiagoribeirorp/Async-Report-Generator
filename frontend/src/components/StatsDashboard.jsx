// frontend/src/components/StatsDashboard.jsx
import React from 'react';
import { useReportStats } from '../hooks/useReports';

const StatsDashboard = () => {
  const { data, isLoading, error } = useReportStats();

  const stats = data?.stats || {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
  };

  const StatCard = ({ title, value, icon, color, description }) => (
    <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg p-6 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Dashboard</h2>
        <div className="text-center py-8 text-red-600">
          ❌ Erro ao carregar estatísticas
        </div>
      </div>
    );
  }

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Dashboard de Relatórios</h2>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total de Relatórios"
          value={stats.total}
          icon="📋"
          color="border-blue-500"
          description="Relatórios solicitados"
        />
        
        <StatCard
          title="Concluídos"
          value={stats.completed}
          icon="✅"
          color="border-green-500"
          description="Processados com sucesso"
        />
        
        <StatCard
          title="Em Processamento"
          value={stats.processing}
          icon="🔄"
          color="border-yellow-500"
          description="Sendo gerados agora"
        />
        
        <StatCard
          title="Taxa de Sucesso"
          value={`${completionRate}%`}
          icon="📊"
          color="border-purple-500"
          description="Relatórios finalizados"
        />
      </div>

      {/* Barra de Progresso */}
      {stats.total > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Distribuição de Status</h3>
          <div className="space-y-2">
            {[
              { status: 'completed', label: 'Concluídos', color: 'bg-green-500', count: stats.completed },
              { status: 'processing', label: 'Processando', color: 'bg-yellow-500', count: stats.processing },
              { status: 'pending', label: 'Pendentes', color: 'bg-blue-500', count: stats.pending },
              { status: 'failed', label: 'Falhas', color: 'bg-red-500', count: stats.failed }
            ].map((item) => {
              const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
              
              return (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <span className="w-24 font-medium text-gray-700">{item.label}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-12 text-right font-semibold">
                    {item.count} ({Math.round(percentage)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dicas Rápidas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="font-semibold text-blue-800 mb-1">💡 Dica Rápida</div>
          <p className="text-blue-700">Relatórios são processados em background e ficam disponíveis automaticamente</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="font-semibold text-green-800 mb-1">⚡ Performance</div>
          <p className="text-green-700">Relatórios concluídos são cacheados para acesso rápido</p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="font-semibold text-purple-800 mb-1">🔄 Atualização</div>
          <p className="text-purple-700">A lista atualiza automaticamente a cada 3 segundos</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;