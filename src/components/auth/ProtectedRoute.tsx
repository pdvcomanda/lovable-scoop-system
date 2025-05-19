
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário está autenticado mas não tem tenant_id associado
  // e não é superadmin, redirecionar para uma página de "sem acesso"
  if (!profile?.tenant_id && !profile?.is_superadmin && !window.location.pathname.includes('/admin')) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="mb-6 text-center text-gray-600">
          Seu usuário não está associado a nenhuma loja. Por favor, contate o administrador do sistema.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
