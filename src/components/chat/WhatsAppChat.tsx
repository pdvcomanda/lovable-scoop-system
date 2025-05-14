
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Phone, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'customer';
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount: number;
  lastActive: Date;
  messages: Message[];
}

// Mock data - em ambiente real seria substituído por conexão com API do WhatsApp
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '+5511987654321',
    unreadCount: 2,
    lastActive: new Date(Date.now() - 1000 * 60 * 5),
    messages: [
      { id: '1', text: 'Olá, gostaria de saber se tem o produto X em estoque?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 30), read: true },
      { id: '2', text: 'Sim, temos disponível!', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 29), read: true },
      { id: '3', text: 'Qual o valor?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 10), read: true },
      { id: '4', text: 'R$ 99,90', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 9), read: true },
      { id: '5', text: 'Vocês entregam?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 5), read: false },
      { id: '6', text: 'E qual o prazo?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 4), read: false },
    ]
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    phone: '+5511976543210',
    unreadCount: 0,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3),
    messages: [
      { id: '1', text: 'Boa tarde! Vocês têm horário disponível hoje?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), read: true },
      { id: '2', text: 'Boa tarde! Sim, temos às 15h e às 17h', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), read: true },
      { id: '3', text: 'Ótimo! Vou às 15h', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), read: true },
    ]
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    phone: '+5511965432109',
    unreadCount: 1,
    lastActive: new Date(Date.now() - 1000 * 60 * 45),
    messages: [
      { id: '1', text: 'Qual o endereço da loja?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 50), read: true },
      { id: '2', text: 'Av. Paulista, 1000 - São Paulo', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 49), read: true },
      { id: '3', text: 'Tem estacionamento?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 45), read: false },
    ]
  }
];

export const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeContact?.messages]);
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  const selectContact = (contact: Contact) => {
    // Marcar mensagens como lidas ao selecionar o contato
    const updatedContacts = contacts.map(c => {
      if (c.id === contact.id) {
        return {
          ...c,
          unreadCount: 0,
          messages: c.messages.map(m => ({ ...m, read: true }))
        };
      }
      return c;
    });
    
    setContacts(updatedContacts);
    setActiveContact(updatedContacts.find(c => c.id === contact.id) || null);
  };
  
  const sendMessage = () => {
    if (!newMessage.trim() || !activeContact) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      read: true
    };
    
    const updatedContacts = contacts.map(c => {
      if (c.id === activeContact.id) {
        return {
          ...c,
          lastMessage: newMessage.trim(),
          lastActive: new Date(),
          messages: [...c.messages, message]
        };
      }
      return c;
    });
    
    setContacts(updatedContacts);
    setActiveContact(updatedContacts.find(c => c.id === activeContact.id) || null);
    setNewMessage('');
  };
  
  const totalUnreadMessages = contacts.reduce((acc, contact) => acc + contact.unreadCount, 0);
  
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 h-[500px] shadow-xl flex flex-col overflow-hidden">
          <CardHeader className="p-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Chat
                {totalUnreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {totalUnreadMessages}
                  </Badge>
                )}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <Tabs defaultValue="chats" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="chats" className="flex-1">Conversas</TabsTrigger>
              <TabsTrigger value="contacts" className="flex-1">Contatos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chats" className="flex-1 overflow-hidden flex flex-col m-0 pt-0 pb-0">
              {activeContact ? (
                <>
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{activeContact.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{activeContact.name}</p>
                        <p className="text-xs text-muted-foreground">{activeContact.phone}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => setActiveContact(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-3">
                      {activeContact.messages.map(message => (
                        <div 
                          key={message.id}
                          className={cn(
                            "max-w-[70%] rounded-lg p-2.5",
                            message.sender === 'user' ? 
                              "ml-auto bg-primary text-primary-foreground" : 
                              "mr-auto bg-muted text-muted-foreground"
                          )}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div className={cn(
                            "text-xs flex justify-end mt-1",
                            message.sender === 'user' ? "text-primary-foreground/80" : "text-muted-foreground/80"
                          )}>
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <CardFooter className="p-3 pt-2 border-t">
                    <div className="flex w-full gap-2">
                      <Input 
                        placeholder="Digite uma mensagem..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            sendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={sendMessage}
                        size="sm" 
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {contacts.map(contact => (
                      <div 
                        key={contact.id}
                        onClick={() => selectContact(contact)}
                        className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>{contact.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {contact.lastActive.toLocaleDateString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate">
                              {contact.messages[contact.messages.length - 1]?.text || ''}
                            </p>
                            {contact.unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-1 text-xs h-5 min-w-5 flex items-center justify-center">
                                {contact.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
            
            <TabsContent value="contacts" className="flex-1 overflow-auto m-0 p-2">
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {contacts.map(contact => (
                    <div 
                      key={contact.id}
                      onClick={() => selectContact(contact)}
                      className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center p-0 bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnreadMessages > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center"
            >
              {totalUnreadMessages}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
};
