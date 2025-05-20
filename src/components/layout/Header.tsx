
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { Menu, MessageSquare } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { WhatsAppChat } from '@/components/chat/WhatsAppChat';

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
}

export const Header = ({ title = 'Dashboard', onMenuToggle }: HeaderProps) => {
  const { isMobile } = useMobile();
  const [mounted, setMounted] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  
  // Check if WhatsApp is connected
  useEffect(() => {
    setMounted(true);
    
    // Check local storage for WhatsApp session
    const checkWhatsAppSession = () => {
      try {
        const savedSession = localStorage.getItem('whatsappSession');
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          
          // Check if session is not expired (24 hours max)
          const now = new Date().getTime();
          const sessionTime = sessionData.timestamp;
          
          setIsWhatsAppConnected(now - sessionTime < 24 * 60 * 60 * 1000);
        } else {
          setIsWhatsAppConnected(false);
        }
      } catch (e) {
        setIsWhatsAppConnected(false);
      }
    };
    
    checkWhatsAppSession();
    
    // Listen for WhatsApp connection/disconnection events
    const handleWhatsAppConnected = () => setIsWhatsAppConnected(true);
    const handleWhatsAppDisconnected = () => setIsWhatsAppConnected(false);
    
    window.addEventListener('whatsapp-connected', handleWhatsAppConnected);
    window.addEventListener('whatsapp-disconnected', handleWhatsAppDisconnected);
    
    return () => {
      window.removeEventListener('whatsapp-connected', handleWhatsAppConnected);
      window.removeEventListener('whatsapp-disconnected', handleWhatsAppDisconnected);
    };
  }, []);

  if (!mounted) return null;

  return (
    <header className="flex h-14 items-center border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {isWhatsAppConnected && (
          <WhatsAppChat />
        )}
        <UserMenu />
      </div>
    </header>
  );
};
