
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SendHorizontal, ArrowLeft, X, PlusCircle, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'customer';
  timestamp: Date;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  avatar?: string;
}

interface WhatsAppChatWindowProps {
  activeChat: Customer | null;
  onClose: () => void;
  onBack: () => void;
}

export const WhatsAppChatWindow = ({
  activeChat,
  onClose,
  onBack
}: WhatsAppChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simular carregamento de mensagens
  useEffect(() => {
    if (activeChat) {
      // Limpar mensagens anteriores
      setMessages([]);
      
      // Simular carregamento de histórico
      setTimeout(() => {
        const sampleMessages: Message[] = [
          {
            id: '1',
            content: 'Olá, gostaria de fazer um pedido de açaí',
            sender: 'customer',
            timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 min ago
          },
          {
            id: '2',
            content: 'Claro! Qual sabor você gostaria?',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 9) // 9 min ago
          },
          {
            id: '3',
            content: 'Quero um açaí tradicional com granola e banana',
            sender: 'customer',
            timestamp: new Date(Date.now() - 1000 * 60 * 8) // 8 min ago
          },
          {
            id: '4',
            content: 'Qual o tamanho? Temos 300ml, 500ml e 700ml',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 7) // 7 min ago
          }
        ];
        
        setMessages(sampleMessages);
      }, 800);
    }
  }, [activeChat]);
  
  // Role para o final quando novas mensagens chegarem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (newMessage.trim() && activeChat) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simular resposta do cliente após 1-3 segundos
      setTimeout(() => {
        const randomResponses = [
          'Ok, entendi!',
          'Perfeito, obrigado!',
          'Quanto tempo demora para entrega?',
          'Vocês aceitam PIX?',
          'Tem desconto para pedidos maiores?'
        ];
        
        const customerResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponses[Math.floor(Math.random() * randomResponses.length)],
          sender: 'customer',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, customerResponse]);
      }, 1000 + Math.random() * 2000);
    }
  };
  
  // Formatar horário da mensagem
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-3 border-b shadow-sm bg-white">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden mr-1" 
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {activeChat && (
          <>
            <Avatar className="h-9 w-9">
              {activeChat.avatar ? (
                <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
              ) : (
                <AvatarFallback>
                  {activeChat.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <div className="font-medium truncate">{activeChat.name}</div>
              <div className="text-xs text-muted-foreground truncate">{activeChat.phone}</div>
            </div>
          </>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="text-3xl mb-2">👋</div>
            <p>Sem mensagens ainda</p>
            <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[75%] gap-1",
                  message.sender === 'user' ? "ml-auto items-end" : ""
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-white border shadow-sm"
                  )}
                >
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground px-1">
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <CardFooter className="border-t p-3 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center w-full gap-2">
          <Button variant="ghost" size="icon" type="button">
            <PlusCircle className="h-5 w-5" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1"
          />
          
          <Button variant="ghost" size="icon" type="button">
            <Smile className="h-5 w-5" />
          </Button>
          
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost"
            disabled={!newMessage.trim()}
          >
            <SendHorizontal className={cn(
              "h-5 w-5",
              newMessage.trim() ? "text-primary" : "text-muted-foreground"
            )} />
          </Button>
        </form>
      </CardFooter>
    </div>
  );
};
