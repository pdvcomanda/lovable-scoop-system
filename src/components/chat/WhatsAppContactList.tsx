
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, RefreshCw, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Customer {
  id: string;
  name: string;
  phone: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  avatar?: string;
}

interface WhatsAppContactListProps {
  onSelectChat: (customer: Customer) => void;
}

export const WhatsAppContactList = ({ onSelectChat }: WhatsAppContactListProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simular carregamento de contatos
  useEffect(() => {
    loadContacts();
  }, []);
  
  const loadContacts = () => {
    setLoading(true);
    
    // Simular atraso na API
    setTimeout(() => {
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'Maria Silva',
          phone: '+55 11 98765-4321',
          unreadCount: 3,
          lastMessage: 'Quero um açaí tradicional com granola e banana',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 8), // 8 min ago
        },
        {
          id: '2',
          name: 'João Oliveira',
          phone: '+55 11 91234-5678',
          unreadCount: 0,
          lastMessage: 'Já está pronto o meu pedido?',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        },
        {
          id: '3',
          name: 'Ana Souza',
          phone: '+55 11 97777-8888',
          unreadCount: 1,
          lastMessage: 'Olá, vocês tem açaí zero açúcar?',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
        },
        {
          id: '4',
          name: 'Carlos Santos',
          phone: '+55 11 96666-5555',
          unreadCount: 0,
          lastMessage: 'Obrigado pelo atendimento!',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        },
        {
          id: '5',
          name: 'Fernanda Lima',
          phone: '+55 11 95555-4444',
          unreadCount: 2,
          lastMessage: 'Qual o preço do açaí grande?',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 25), // 25 min ago
        },
      ];
      
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  };
  
  // Filtrar contatos pela busca
  const filteredContacts = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  // Ordenar por mensagens não lidas e depois por horário
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    // Primeiro por mensagens não lidas
    if (a.unreadCount !== b.unreadCount) {
      return b.unreadCount - a.unreadCount;
    }
    
    // Depois por horário
    if (a.lastMessageTime && b.lastMessageTime) {
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
    }
    
    return 0;
  });
  
  // Formatar o horário da última mensagem
  const formatLastMessageTime = (date?: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  return (
    <div className="flex flex-col h-full border-r">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="font-medium mb-3">Conversas</div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar conversa" 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : sortedContacts.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            {searchTerm ? 'Nenhum contato encontrado' : 'Nenhuma conversa recente'}
          </div>
        ) : (
          <div>
            {sortedContacts.map((customer) => (
              <button
                key={customer.id}
                onClick={() => onSelectChat(customer)}
                className={cn(
                  "w-full text-left flex items-center p-3 gap-3 hover:bg-accent transition-colors",
                  customer.unreadCount > 0 ? "bg-accent/30" : ""
                )}
              >
                <Avatar className="h-10 w-10">
                  {customer.avatar ? (
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                  ) : (
                    <AvatarFallback>
                      {customer.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn("font-medium truncate", 
                      customer.unreadCount > 0 ? "font-semibold" : ""
                    )}>
                      {customer.name}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatLastMessageTime(customer.lastMessageTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className={cn("text-sm truncate",
                      customer.unreadCount > 0 
                        ? "text-foreground font-medium" 
                        : "text-muted-foreground"
                    )}>
                      {customer.lastMessage}
                    </span>
                    
                    {customer.unreadCount > 0 && (
                      <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {customer.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Refresh Button */}
      <div className="p-3 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={loadContacts}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar contatos
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
