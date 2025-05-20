
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, RefreshCw, Smartphone, Check, X, MessageSquare } from 'lucide-react';

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
    welcomeMessage: 'Olá! Bem-vindo à nossa loja. Como posso ajudar?',
    enableAutoReply: true,
    enableCatalog: true,
    enablePayment: true,
    autoReplyDelay: 10,
    selectedAI: 'gpt', // 'gpt', 'copilot', 'gemini', 'none'
  });
  
  // WebSocket reference for WhatsApp connection
  const wsRef = useRef<WebSocket | null>(null);
  
  // Create connection with WhatsApp Web
  const startWhatsAppConnection = () => {
    try {
      // Reset state
      setStatus({ status: 'connecting' });
      
      // Initialize connection to WhatsApp Web
      if (typeof window !== 'undefined' && 'WebSocket' in window) {
        // In a real app, we would connect to the WhatsApp Web WebSocket API
        // This is a simplified example using a mock server
        const wsUrl = process.env.NODE_ENV === 'production' 
          ? 'wss://api.whatsapp-web.com/v1/connect'
          : 'wss://mock-whatsapp-api.example.com';
          
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connection established');
          
          // In real implementation, we would authenticate here
          // For demo, we'll simulate QR code generation
          setTimeout(() => {
            setStatus({
              status: 'connecting',
              qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-connect-exemplo',
            });
          }, 1000);
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'connection_success') {
              setStatus({
                status: 'authenticated',
                phoneNumber: data.phoneNumber,
              });
              toast.success("WhatsApp conectado com sucesso!");
              
              // Save session
              localStorage.setItem('whatsappSession', JSON.stringify({
                phoneNumber: data.phoneNumber,
                timestamp: new Date().getTime(),
              }));
            }
            
            if (data.type === 'qr_code') {
              setStatus({
                status: 'connecting',
                qrCode: data.qrCode,
              });
            }
            
          } catch (e) {
            console.error('Error parsing WebSocket message', e);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error', error);
          toast.error("Erro na conexão com WhatsApp. Tente novamente.");
          setStatus({ status: 'disconnected' });
        };
        
        ws.onclose = () => {
          console.log('WebSocket connection closed');
          // Only update status if not already authenticated
          if (status.status !== 'authenticated') {
            setStatus({ status: 'disconnected' });
          }
        };
        
        wsRef.current = ws;
        
        // For demo purposes, simulate success after a timeout
        if (process.env.NODE_ENV !== 'production') {
          simulateWhatsAppConnection();
        }
      } else {
        toast.error("WebSockets não são suportados neste navegador.");
        setStatus({ status: 'disconnected' });
      }
    } catch (error) {
      console.error('Error starting WhatsApp connection', error);
      toast.error("Erro ao iniciar conexão com WhatsApp.");
      setStatus({ status: 'disconnected' });
    }
  };
  
  // Simulate WhatsApp connection (for demo only)
  const simulateWhatsAppConnection = () => {
    setTimeout(() => {
      setStatus({
        status: 'authenticated',
        phoneNumber: '+55 11 98765-4321',
      });
      
      toast.success("WhatsApp conectado com sucesso!");
      
      localStorage.setItem('whatsappSession', JSON.stringify({
        phoneNumber: '+55 11 98765-4321',
        timestamp: new Date().getTime(),
      }));
    }, 10000);
  };
  
  const disconnectWhatsApp = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setStatus({ status: 'disconnected' });
    localStorage.removeItem('whatsappSession');
    toast.info("WhatsApp desconectado");
  };
  
  const handleBotSettingChange = (key: string, value: any) => {
    setBotSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Save settings
    localStorage.setItem('whatsappBotSettings', JSON.stringify({
      ...botSettings,
      [key]: value
    }));
    
    toast.success("Configuração salva");
  };
  
  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('whatsappBotSettings');
    if (savedSettings) {
      setBotSettings(JSON.parse(savedSettings));
    }
    
    // Check for existing session
    const savedSession = localStorage.getItem('whatsappSession');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        
        // Check if session is not expired (24 hours max)
        const now = new Date().getTime();
        const sessionTime = sessionData.timestamp;
        
        if (now - sessionTime < 24 * 60 * 60 * 1000) {
          setStatus({
            status: 'authenticated',
            phoneNumber: sessionData.phoneNumber,
          });
        } else {
          // Session expired
          localStorage.removeItem('whatsappSession');
        }
      } catch (e) {
        // Invalid session, ignore
        localStorage.removeItem('whatsappSession');
      }
    }
    
    // Cleanup WebSocket connection on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

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
              {/* Connection status */}
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
              
              {/* QR Code area */}
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
              
              {/* Instructions and requirements */}
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
                <Label htmlFor="selectedAI">Modelo de IA para respostas</Label>
                <Select 
                  value={botSettings.selectedAI}
                  onValueChange={(value) => handleBotSettingChange('selectedAI', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo de IA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt">OpenAI GPT</SelectItem>
                    <SelectItem value="copilot">Microsoft Copilot</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="none">Não usar IA (apenas scripts)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Escolha qual modelo de IA será usado para gerar respostas automáticas
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
              
              {/* AI model configuration */}
              {botSettings.selectedAI !== 'none' && (
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Configuração da {
                    botSettings.selectedAI === 'gpt' ? 'OpenAI GPT' : 
                    botSettings.selectedAI === 'copilot' ? 'Microsoft Copilot' : 
                    'Google Gemini'
                  }</h3>
                  
                  <div className="space-y-3 mt-3">
                    <div className="space-y-2">
                      <Label htmlFor="aiApiKey">API Key</Label>
                      <Input 
                        id="aiApiKey"
                        type="password"
                        placeholder={`Digite sua ${botSettings.selectedAI.toUpperCase()} API Key`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {botSettings.selectedAI === 'gpt' && 'Disponível em https://platform.openai.com/api-keys'}
                        {botSettings.selectedAI === 'copilot' && 'Disponível no portal da Microsoft Azure'}
                        {botSettings.selectedAI === 'gemini' && 'Disponível em https://aistudio.google.com/'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aiPrompt">Prompt da IA</Label>
                      <Textarea 
                        id="aiPrompt"
                        placeholder="Defina o comportamento e personalidade do atendente virtual"
                        rows={3}
                        defaultValue={`Você é um atendente virtual de uma loja. Seja cordial, direto e útil. Responda perguntas sobre produtos, horários de funcionamento e formas de pagamento.`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Modelo</Label>
                      <Select defaultValue={
                        botSettings.selectedAI === 'gpt' ? 'gpt-4o-mini' : 
                        botSettings.selectedAI === 'copilot' ? 'copilot-pro' : 
                        'gemini-pro'
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {botSettings.selectedAI === 'gpt' && (
                            <>
                              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Econômico)</SelectItem>
                              <SelectItem value="gpt-4o">GPT-4o (Recomendado)</SelectItem>
                            </>
                          )}
                          
                          {botSettings.selectedAI === 'copilot' && (
                            <>
                              <SelectItem value="copilot-lite">Copilot Lite</SelectItem>
                              <SelectItem value="copilot-pro">Copilot Pro</SelectItem>
                            </>
                          )}
                          
                          {botSettings.selectedAI === 'gemini' && (
                            <>
                              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                              <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full mt-2">Salvar Configurações da IA</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
