// frontend/src/App.jsx - VERSÃO COM COMPONENTES ORIGINAIS E DADOS MOCK
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ReportForm from './components/reportForm';
import ReportList from './components/ReportList';
import StatsDashboard from './components/StatsDashboard';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="text-3xl mr-3">🚀</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gerador de Relatórios</h1>
                  <p className="text-sm text-gray-600">Sistema assíncrono com MongoDB, Redis e RabbitMQ</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Status: <span className="text-green-600 font-medium">● Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Dashboard */}
            <StatsDashboard />
            
            {/* Formulário */}
            <ReportForm />
            
            {/* Lista de Relatórios */}
            <ReportList />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>✨ Sistema desenvolvido com Node.js, React, MongoDB, Redis, RabbitMQ e Docker</p>
              <p className="text-sm mt-2">💡 Modo de demonstração com dados mock</p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;