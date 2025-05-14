
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-pos-primary mb-6">404</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" /> Ir para o início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
