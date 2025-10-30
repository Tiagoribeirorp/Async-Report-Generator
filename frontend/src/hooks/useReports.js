// frontend/src/hooks/useReports.js - VERSÃO REAL
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { reportService } from '../services/api';

// Chaves para o React Query
export const reportKeys = {
  all: ['reports'],
  lists: () => [...reportKeys.all, 'list'],
  list: (filters) => [...reportKeys.lists(), filters],
  details: () => [...reportKeys.all, 'detail'],
  detail: (id) => [...reportKeys.details(), id],
  stats: () => [...reportKeys.all, 'stats']
};

// Hook para listar relatórios
export const useReports = (params = {}) => {
  return useQuery(
    reportKeys.list(params),
    () => reportService.listReports(params),
    {
      refetchInterval: 3000, // Atualiza a cada 3 segundos
      staleTime: 2000,
      retry: 2,
    }
  );
};

// Hook para criar relatório
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(reportService.createReport, {
    onSuccess: () => {
      // Invalida as queries para refetch
      queryClient.invalidateQueries(reportKeys.lists());
      queryClient.invalidateQueries(reportKeys.stats());
    },
    onError: (error) => {
      console.error('❌ Erro ao criar relatório:', error);
    }
  });
};

// Hook para buscar um relatório específico
export const useReport = (id) => {
  return useQuery(
    reportKeys.detail(id),
    () => reportService.getReport(id),
    {
      enabled: !!id,
      refetchInterval: (data) => {
        // Se o relatório ainda não está completo, refetch a cada 2 segundos
        return data?.report?.status !== 'completed' ? 2000 : false;
      },
    }
  );
};

// Hook para estatísticas
export const useReportStats = () => {
  return useQuery(
    reportKeys.stats(),
    reportService.getStats,
    {
      refetchInterval: 10000, // Atualiza stats a cada 10 segundos
      retry: 2,
    }
  );
};

// Hook para deletar relatório
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation(reportService.deleteReport, {
    onSuccess: () => {
      queryClient.invalidateQueries(reportKeys.lists());
      queryClient.invalidateQueries(reportKeys.stats());
    },
  });
};