
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { BellRing, MessageSquare, AlertTriangle, BadgeCheck, Receipt } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NotificationsSettings = () => {
  // Configurações de notificação de estoque
  const [lowStockNotify, setLowStockNotify] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(20); // porcentagem
  
  // Configurações de notificações de vendas
  const [newOrderNotify, setNewOrderNotify] = useState(true);
  const [salesReportNotify, setSalesReportNotify] = useState(true);
  const [salesReportFrequency, setSalesReportFrequency] = useState("daily");
  
  // Configurações de integração com WhatsApp
  const [whatsappIntegration, setWhatsappIntegration] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("+5511987654321");
  
  // Configurações de notificações por email
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailAddress, setEmailAddress] = useState("contato@acaidelicia.com.br");
  
  // Configurações de alertas no sistema
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(true);
  
  const saveNotificationSettings = () => {
    toast.success("Configurações de notificações salvas com sucesso!");
  };
  
  // Testar notificações
  const testNotification = (type: string) => {
    switch (type) {
      case "lowStock":
        toast({
          title: "Alerta de Estoque Baixo",
          description: "Açaí Tradicional está com estoque baixo (2kg restantes).",
          variant: "destructive",
        });
        break;
      case "newOrder":
        toast({
          title: "Novo Pedido Recebido",
          description: "Pedido #12345 foi recebido agora.",
          variant: "default",
        });
        break;
      case "report":
        toast({
          title: "Relatório de Vendas",
          description: "O relatório diário de vendas está disponível para visualização.",
          variant: "default",
        });
        break;
      case "whatsapp":
        toast({
          title: "Mensagem de WhatsApp",
          description: `Mensagem de teste enviada para ${whatsappNumber}.`,
          variant: "default",
        });
        break;
      case "email":
        toast({
          title: "Email de Teste",
          description: `Email de teste enviado para ${emailAddress}.`,
          variant: "default",
        });
        break;
      default:
        break;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          <h2 className="text-xl font-bold">Configurações de Notificações</h2>
        </div>
        
        <div className="space-y-6">
          {/* Alertas de Estoque */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="text-lg font-medium">Alertas de Estoque</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de estoque baixo</Label>
                <div className="text-sm text-gray-500">
                  Receber notificações quando o estoque estiver baixo
                </div>
              </div>
              <Switch 
                checked={lowStockNotify}
                onCheckedChange={setLowStockNotify}
              />
            </div>
            
            {lowStockNotify && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="low-stock-threshold">Limite de estoque baixo (%)</Label>
                <div className="flex gap-2 items-center">
                  <Input 
                    id="low-stock-threshold"
                    type="number"
                    min={0}
                    max={100}
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testNotification("lowStock")}
                  >
                    Testar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Notificar quando o estoque atingir esta porcentagem do estoque mínimo.
                </p>
              </div>
            )}
          </div>
          
          {/* Notificações de Vendas */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <h3 className="text-lg font-medium">Notificações de Vendas</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Novos pedidos</Label>
                <div className="text-sm text-gray-500">
                  Receber notificações para novos pedidos
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={newOrderNotify}
                  onCheckedChange={setNewOrderNotify}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => testNotification("newOrder")}
                  disabled={!newOrderNotify}
                >
                  Testar
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios de vendas</Label>
                <div className="text-sm text-gray-500">
                  Receber notificações de relatórios de vendas
                </div>
              </div>
              <Switch 
                checked={salesReportNotify}
                onCheckedChange={setSalesReportNotify}
              />
            </div>
            
            {salesReportNotify && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sales-report-frequency">Frequência</Label>
                    <Select
                      value={salesReportFrequency}
                      onValueChange={setSalesReportFrequency}
                    >
                      <SelectTrigger id="sales-report-frequency">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="self-end">
                    <Button 
                      variant="outline"
                      onClick={() => testNotification("report")}
                    >
                      Testar Notificação
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Integração com WhatsApp */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <h3 className="text-lg font-medium">Integração com WhatsApp</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar integração com WhatsApp</Label>
                <div className="text-sm text-gray-500">
                  Enviar notificações através do WhatsApp
                </div>
              </div>
              <Switch 
                checked={whatsappIntegration}
                onCheckedChange={setWhatsappIntegration}
              />
            </div>
            
            {whatsappIntegration && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                <div className="flex gap-2">
                  <Input 
                    id="whatsapp-number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+551199999999"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => testNotification("whatsapp")}
                  >
                    Testar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Insira o número no formato internacional (ex: +551199999999).
                </p>
              </div>
            )}
          </div>
          
          {/* Notificações por Email */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              <h3 className="text-lg font-medium">Notificações por Email</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar notificações por email</Label>
                <div className="text-sm text-gray-500">
                  Receber notificações por email
                </div>
              </div>
              <Switch 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            {emailNotifications && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="email-address">Endereço de Email</Label>
                <div className="flex gap-2">
                  <Input 
                    id="email-address"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="contato@exemplo.com"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => testNotification("email")}
                  >
                    Testar
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Outras Configurações */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Outras Configurações</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações do navegador</Label>
                <div className="text-sm text-gray-500">
                  Exibir notificações no navegador
                </div>
              </div>
              <Switch 
                checked={browserNotifications}
                onCheckedChange={setBrowserNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sons de notificação</Label>
                <div className="text-sm text-gray-500">
                  Reproduzir sons ao receber notificações
                </div>
              </div>
              <Switch 
                checked={soundNotifications}
                onCheckedChange={setSoundNotifications}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={saveNotificationSettings}>Salvar Alterações</Button>
        </div>
      </div>
    </Card>
  );
};
