
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { WhatsApp, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsAppChatWindow } from './WhatsAppChatWindow';
import { WhatsAppContactList } from './WhatsAppContactList';
import { WhatsAppConnection } from '../whatsapp/WhatsAppConnection';
import { useMobile } from '@/hooks/use-mobile';

interface Customer {
  id: string;
  name: string;
  phone: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  avatar?: string;
}

export const WhatsAppChat = () => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Customer | null>(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Verificar se o WhatsApp está conectado
  const [whatsAppConnected, setWhatsAppConnected] = useState(false);
  
  // Verificar conexão do WhatsApp ao iniciar
  useEffect(() => {
    const savedSession = localStorage.getItem('whatsappSession');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        const timestamp = sessionData.timestamp || 0;
        const now = new Date().getTime();
        
        // Verificar se a sessão expirou (24 horas)
        if (now - timestamp < 24 * 60 * 60 * 1000) {
          setWhatsAppConnected(true);
        }
      } catch (e) {
        // Sessão inválida, ignorar
      }
    }
  }, []);
  
  // Simular contagem de mensagens não lidas
  useEffect(() => {
    const interval = setInterval(() => {
      if (whatsAppConnected) {
        setTotalUnread(prev => {
          // 20% de chance de aumentar a contagem
          if (Math.random() < 0.2 && !isOpen) {
            return prev + 1;
          }
          return prev;
        });
      }
    }, 30000); // a cada 30 segundos
    
    return () => clearInterval(interval);
  }, [whatsAppConnected, isOpen]);
  
  // Redefinir contagem ao abrir
  useEffect(() => {
    if (isOpen) {
      setTotalUnread(0);
    }
  }, [isOpen]);
  
  // Diferentes comportamentos para mobile vs desktop
  if (isMobile) {
    // Mobile: Use Sheet (slide-up)
    return (
      <>
        <WhatsAppButton 
          unreadCount={totalUnread} 
          onClick={() => {
            if (!whatsAppConnected) {
              setShowSettings(true);
            } else {
              setIsOpen(true);
            }
          }}
        />
        
        <Sheet
          open={isOpen && !showSettings}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setActiveChat(null);
            }
          }}
        >
          <SheetContent side="bottom" className="h-[90vh] p-0 sm:max-w-full">
            <div className="flex flex-col h-full">
              {activeChat ? (
                <WhatsAppChatWindow 
                  activeChat={activeChat}
                  onClose={() => setIsOpen(false)}
                  onBack={() => setActiveChat(null)}
                />
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center p-3 border-b">
                    <h2 className="font-semibold text-lg">WhatsApp</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowSettings(true)}
                      className="ml-auto mr-1"
                    >
                      <WhatsApp className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <WhatsAppContactList 
                      onSelectChat={(customer) => {
                        setActiveChat(customer);
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        <Dialog 
          open={showSettings} 
          onOpenChange={setShowSettings}
        >
          <DialogContent className="max-w-md p-0 h-[90vh] flex flex-col">
            <div className="flex items-center p-3 border-b">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettings(false)}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold text-lg">Configurar WhatsApp</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettings(false)}
                className="ml-auto"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              <WhatsAppConnection />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // Desktop: Use Dialog (modal)
  return (
    <>
      <WhatsAppButton 
        unreadCount={totalUnread} 
        onClick={() => {
          if (!whatsAppConnected) {
            setShowSettings(true);
          } else {
            setIsOpen(true);
          }
        }}
      />
      
      <Dialog 
        open={isOpen && !showSettings}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setActiveChat(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl p-0 h-[80vh]">
          <div className="flex h-full">
            <div className="w-80 h-full">
              <WhatsAppContactList 
                onSelectChat={(customer) => {
                  setActiveChat(customer);
                }}
              />
            </div>
            <div className="flex-1 h-full">
              {activeChat ? (
                <WhatsAppChatWindow 
                  activeChat={activeChat}
                  onClose={() => setIsOpen(false)}
                  onBack={() => setActiveChat(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <WhatsApp className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Selecione uma conversa</h3>
                  <p className="text-muted-foreground">
                    Escolha uma conversa na lista à esquerda para começar
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={showSettings} 
        onOpenChange={setShowSettings}
      >
        <DialogContent className="max-w-md p-0">
          <div className="flex items-center p-3 border-b">
            <h2 className="font-semibold text-lg">Configurar WhatsApp</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSettings(false)}
              className="ml-auto"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto p-0">
            <WhatsAppConnection />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Componente do botão do WhatsApp
interface WhatsAppButtonProps {
  unreadCount: number;
  onClick: () => void;
}

const WhatsAppButton = ({ unreadCount, onClick }: WhatsAppButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg p-0 w-14 h-14",
        "bg-green-500 hover:bg-green-600 text-white",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <WhatsApp className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};
