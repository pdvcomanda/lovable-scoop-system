
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { QrCode, RefreshCw, Smartphone, Check, X } from 'lucide-react';

interface WhatsAppStatus {
  status: 'disconnected' | 'connecting' | 'connected' | 'authenticated';
  qrCode?: string;
  phoneNumber?: string;
}

export function WhatsAppConnection() {
  const [status, setStatus] = useState<WhatsAppStatus>({
    status: 'disconnected',
  });
  const [configTab, setConfigTab] = useState('connection');
  const [botSettings, setBotSettings] = useState({
    welcomeMessage: 'Olá! Bem-vindo à Açaí Delícia. Como posso ajudar?',
    enableAutoReply: true,
    enableCatalog: true,
    enablePayment: true,
    autoReplyDelay: 10,
  });
  
  // Simular ciclo de conexão do WhatsApp
  const startWhatsAppConnection = () => {
    // Resetar estado
    setStatus({ status: 'connecting' });
    
    // Simular geração do QR Code
    setTimeout(() => {
      setStatus({
        status: 'connecting',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-connect-exemplo',
      });
      
      // Simular conexão bem-sucedida após 10 segundos
      const timer = setTimeout(() => {
        setStatus({
          status: 'authenticated',
          phoneNumber: '+55 11 98765-4321',
        });
        toast.success("WhatsApp conectado com sucesso!");
      }, 10000);
      
      // Apenas para demonstração, permitir cancelar a conexão
      return () => clearTimeout(timer);
    }, 2000);
  };
  
  const disconnectWhatsApp = () => {
    setStatus({ status: 'disconnected' });
    toast.info("WhatsApp desconectado");
  };
  
  const handleBotSettingChange = (key: string, value: any) => {
    setBotSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Salvar configurações
    localStorage.setItem('whatsappBotSettings', JSON.stringify({
      ...botSettings,
      [key]: value
    }));
    
    toast.success("Configuração salva");
  };
  
  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('whatsappBotSettings');
    if (savedSettings) {
      setBotSettings(JSON.parse(savedSettings));
    }
    
    // Verificar se há uma sessão salva
    const savedSession = localStorage.getItem('whatsappSession');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setStatus({
          status: 'authenticated',
          phoneNumber: sessionData.phoneNumber,
        });
      } catch (e) {
        // Sessão inválida, ignorar
      }
    }
  }, []);
  
  // Salvar sessão quando autenticado
  useEffect(() => {
    if (status.status === 'authenticated' && status.phoneNumber) {
      localStorage.setItem('whatsappSession', JSON.stringify({
        phoneNumber: status.phoneNumber,
        timestamp: new Date().getTime(),
      }));
    }
  }, [status]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração WhatsApp</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={configTab} onValueChange={setConfigTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="connection">Conexão</TabsTrigger>
            <TabsTrigger value="bot">Bot de Atendimento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <div className="space-y-6">
              {/* Estado da conexão */}
              <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                <div className={`h-3 w-3 rounded-full ${status.status === 'authenticated' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <div>
                  <span className="font-medium">Status: </span>
                  {status.status === 'disconnected' && 'Desconectado'}
                  {status.status === 'connecting' && 'Conectando...'}
                  {status.status === 'authenticated' && 'Conectado'}
                </div>
                
                {status.status === 'authenticated' && (
                  <div className="ml-auto text-sm text-muted-foreground">
                    Número: {status.phoneNumber}
                  </div>
                )}
              </div>
              
              {/* Área do QR Code */}
              <div className="flex flex-col items-center justify-center py-8">
                {status.status === 'disconnected' && (
                  <div className="text-center">
                    <QrCode className="h-20 w-20 mx-auto opacity-50 mb-4" />
                    <p className="mb-4">Conecte seu WhatsApp para começar a usar a integração</p>
                    <Button onClick={startWhatsAppConnection}>Conectar WhatsApp</Button>
                  </div>
                )}
                
                {status.status === 'connecting' && !status.qrCode && (
                  <div className="text-center">
                    <RefreshCw className="h-20 w-20 mx-auto opacity-50 mb-4 animate-spin" />
                    <p>Iniciando conexão com WhatsApp...</p>
                  </div>
                )}
                
                {status.status === 'connecting' && status.qrCode && (
                  <div className="text-center">
                    <div className="border rounded-md p-4 mb-4">
                      <img src={status.qrCode} alt="QR Code do WhatsApp" className="w-48 h-48 mx-auto" />
                    </div>
                    <div className="mb-4 text-sm">
                      <p>Escaneie o QR Code com seu WhatsApp</p>
                      <ol className="text-left text-muted-foreground mt-2 space-y-1">
                        <li>1. Abra o WhatsApp no seu smartphone</li>
                        <li>2. Toque em Menu (⋮) ou Configurações</li>
                        <li>3. Selecione WhatsApp Web/Desktop</li>
                        <li>4. Aponte a câmera para este QR Code</li>
                      </ol>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => startWhatsAppConnection()}
                      className="mr-2"
                    >
                      Gerar novo QR Code
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setStatus({ status: 'disconnected' })}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
                
                {status.status === 'authenticated' && (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xl font-medium mb-2">WhatsApp conectado</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Seu WhatsApp está conectado e pronto para uso
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={disconnectWhatsApp}
                    >
                      Desconectar
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Instruções e requisitos */}
              <Alert>
                <AlertDescription>
                  <h4 className="font-medium mb-2">Requisitos para uso da integração</h4>
                  <ul className="text-sm space-y-1">
                    <li>• WhatsApp instalado no seu smartphone</li>
                    <li>• Conexão com a internet no smartphone e no computador</li>
                    <li>• WhatsApp Business é recomendado para melhores resultados</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="bot">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAutoReply" className="text-base">Atendente automático</Label>
                  <Switch 
                    id="enableAutoReply"
                    checked={botSettings.enableAutoReply}
                    onCheckedChange={(checked) => handleBotSettingChange('enableAutoReply', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ativar bot para responder automaticamente as mensagens dos clientes
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Mensagem de boas-vindas</Label>
                <Textarea 
                  id="welcomeMessage"
                  placeholder="Digite a mensagem que será enviada ao iniciar uma conversa"
                  value={botSettings.welcomeMessage}
                  onChange={(e) => handleBotSettingChange('welcomeMessage', e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Esta mensagem será enviada automaticamente ao iniciar uma nova conversa
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autoReplyDelay">Tempo de resposta (segundos)</Label>
                <Input 
                  id="autoReplyDelay"
                  type="number"
                  min={1}
                  max={60}
                  value={botSettings.autoReplyDelay}
                  onChange={(e) => handleBotSettingChange('autoReplyDelay', parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Tempo de espera antes de enviar resposta automática
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableCatalog" className="text-base">Catálogo de produtos</Label>
                  <Switch 
                    id="enableCatalog"
                    checked={botSettings.enableCatalog}
                    onCheckedChange={(checked) => handleBotSettingChange('enableCatalog', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Permitir que clientes consultem produtos pelo WhatsApp
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enablePayment" className="text-base">Pagamentos via WhatsApp</Label>
                  <Switch 
                    id="enablePayment"
                    checked={botSettings.enablePayment}
                    onCheckedChange={(checked) => handleBotSettingChange('enablePayment', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Permitir pagamentos via PIX e envio de comprovante pelo WhatsApp
                </p>
              </div>
              
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Frases para o bot de atendimento</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Defina frases que seu bot usará para responder perguntas específicas
                </p>
                <div className="space-y-3">
                  {['pedido', 'horário', 'endereço'].map((key, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Input 
                        value={key === 'pedido' ? 'Fazer pedido' : key === 'horário' ? 'Horário de funcionamento' : 'Endereço'} 
                        className="w-1/3"
                        readOnly
                      />
                      <Textarea 
                        placeholder={`Digite a resposta para "${key}"`}
                        className="flex-1"
                        rows={2}
                        defaultValue={
                          key === 'pedido' ? 'Para fazer seu pedido, escolha os itens do nosso cardápio digital:' : 
                          key === 'horário' ? 'Estamos abertos todos os dias das 10h às 22h.' :
                          'Estamos localizados na Rua dos Açaís, 123 - Centro.'
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
