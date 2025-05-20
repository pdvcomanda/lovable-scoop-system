
import { useState } from "react";
import { MessageSquare, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppChatWindow } from "./WhatsAppChatWindow";
import { WhatsAppContactList } from "./WhatsAppContactList";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Define the Customer interface to match what's used in WhatsAppContactList
interface Customer {
  id: string;
  name: string;
  phone: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  avatar?: string;
}

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"contacts" | "chat">("contacts");
  const [activeContact, setActiveContact] = useState<Customer | null>(null);
  
  const { user } = useAuth();
  
  // Only show for authenticated users
  if (!user) return null;
  
  const handleOpenChat = (customer: Customer) => {
    setActiveContact(customer);
    setView("chat");
  };
  
  const handleBackToContacts = () => {
    setView("contacts");
    setActiveContact(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div 
          className={cn(
            "relative rounded-lg shadow-xl bg-white dark:bg-slate-900",
            "border border-slate-200 dark:border-slate-800",
            "w-80 sm:w-96 h-[32rem] overflow-hidden flex flex-col"
          )}
        >
          {/* Header */}
          <div className="p-3 bg-primary text-primary-foreground flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary-foreground/10"
              onClick={() => view === "contacts" ? setIsOpen(false) : handleBackToContacts()}
            >
              {view === "chat" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
            <h2 className="text-sm font-medium">
              {view === "contacts" ? "Conversas" : "Chat"}
            </h2>
            <div className="w-8" /> {/* Spacer to center title */}
          </div>
          
          {/* Content */}
          {view === "contacts" ? (
            <WhatsAppContactList onSelectChat={handleOpenChat} />
          ) : (
            <WhatsAppChatWindow 
              activeChat={activeContact || { 
                id: '', 
                name: '', 
                phone: '', 
                unreadCount: 0 
              }}
              onClose={() => setIsOpen(false)} 
              onBack={handleBackToContacts} 
            />
          )}
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Abrir WhatsApp</span>
        </Button>
      )}
    </div>
  );
}
