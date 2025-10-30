// frontend/src/components/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pendente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: '⏳'
    },
    processing: {
      label: 'Processando',
      color: 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse',
      icon: '🔄'
    },
    completed: {
      label: 'Concluído',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: '✅'
    },
    failed: {
      label: 'Falhou',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: '❌'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <span className="mr-2">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;