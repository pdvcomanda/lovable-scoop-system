
import { useState, useEffect } from 'react';

export function useIsMobile(): { isMobile: boolean } {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Função para verificar se é dispositivo móvel
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkIfMobile);

    // Limpar listener na desmontagem
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return { isMobile };
}

// Alias para compatibilidade com código existente
export const useMobile = useIsMobile;
