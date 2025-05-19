
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { Printer, Bluetooth, ArrowDown, X, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PrinterDevice {
  id: string;
  name: string;
  type: 'bluetooth' | 'usb' | 'network';
  connected: boolean;
}

export function PrinterSettings() {
  const [printerTab, setPrinterTab] = useState<string>("bluetooth");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [printers, setPrinters] = useState<PrinterDevice[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [driverDownloaded, setDriverDownloaded] = useState<boolean>(false);
  const [bluetoothAvailable, setBluetoothAvailable] = useState<boolean>(false);
  const [usbAvailable, setUsbAvailable] = useState<boolean>(false);
  
  // Verificar disponibilidade de Bluetooth na inicialização
  useEffect(() => {
    checkBluetoothAvailability();
    checkUSBAvailability();
    
    // Carregar impressoras salvas do localStorage
    const savedPrinters = localStorage.getItem('configuredPrinters');
    if (savedPrinters) {
      setPrinters(JSON.parse(savedPrinters));
    }
  }, []);
  
  // Simular verificação da disponibilidade de Bluetooth
  const checkBluetoothAvailability = () => {
    // Verificar se o navegador suporta Web Bluetooth API
    if ('bluetooth' in navigator) {
      setBluetoothAvailable(true);
    } else {
      setBluetoothAvailable(false);
    }
  };
  
  // Simular verificação da disponibilidade de USB
  const checkUSBAvailability = () => {
    // Verificar se o navegador suporta Web USB API
    if ('usb' in navigator) {
      setUsbAvailable(true);
    } else {
      setUsbAvailable(false);
    }
  };
  
  // Iniciar busca por dispositivos Bluetooth
  const scanBluetoothDevices = async () => {
    if (!bluetoothAvailable) {
      toast.error("Bluetooth não disponível neste navegador");
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Usar Web Bluetooth API para buscar dispositivos
      // Esta é apenas uma implementação simulada
      // Na implementação real, usaríamos navigator.bluetooth.requestDevice()
      
      setTimeout(() => {
        // Simular dispositivos encontrados
        const mockDevices = [
          { id: 'bt-1', name: 'Impressora Térmica BT', type: 'bluetooth' as const, connected: false },
          { id: 'bt-2', name: 'Impressora POS BT', type: 'bluetooth' as const, connected: false },
        ];
        
        setPrinters(prevPrinters => {
          // Filtrar impressoras bluetooth existentes e adicionar as novas
          const filteredPrinters = prevPrinters.filter(p => p.type !== 'bluetooth');
          const newPrinters = [...filteredPrinters, ...mockDevices];
          
          // Salvar no localStorage
          localStorage.setItem('configuredPrinters', JSON.stringify(newPrinters));
          
          return newPrinters;
        });
        
        setIsScanning(false);
        toast.success("Busca por impressoras Bluetooth concluída");
      }, 2000);
    } catch (error) {
      console.error('Erro ao buscar dispositivos Bluetooth:', error);
      toast.error("Erro ao buscar dispositivos Bluetooth");
      setIsScanning(false);
    }
  };
  
  // Iniciar busca por dispositivos USB
  const scanUSBDevices = async () => {
    if (!usbAvailable) {
      toast.error("USB não disponível neste navegador");
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Usar Web USB API para buscar dispositivos
      // Esta é apenas uma implementação simulada
      // Na implementação real, usaríamos navigator.usb.requestDevice()
      
      setTimeout(() => {
        // Simular dispositivos encontrados
        const mockDevices = [
          { id: 'usb-1', name: 'Impressora Térmica USB', type: 'usb' as const, connected: false },
          { id: 'usb-2', name: 'Impressora de Cupom USB', type: 'usb' as const, connected: false },
        ];
        
        setPrinters(prevPrinters => {
          // Filtrar impressoras USB existentes e adicionar as novas
          const filteredPrinters = prevPrinters.filter(p => p.type !== 'usb');
          const newPrinters = [...filteredPrinters, ...mockDevices];
          
          // Salvar no localStorage
          localStorage.setItem('configuredPrinters', JSON.stringify(newPrinters));
          
          return newPrinters;
        });
        
        setIsScanning(false);
        toast.success("Busca por impressoras USB concluída");
      }, 2000);
    } catch (error) {
      console.error('Erro ao buscar dispositivos USB:', error);
      toast.error("Erro ao buscar dispositivos USB");
      setIsScanning(false);
    }
  };
  
  // Conectar a uma impressora
  const connectPrinter = (printerId: string) => {
    // Simular conexão com a impressora
    setPrinters(printers.map(printer => {
      if (printer.id === printerId) {
        return { ...printer, connected: true };
      }
      return printer;
    }));
    
    setSelectedPrinter(printerId);
    localStorage.setItem('selectedPrinter', printerId);
    
    // Se não tiver driver, oferecer download
    if (!driverDownloaded) {
      downloadDriver(printerId);
    } else {
      toast.success("Conectado à impressora com sucesso!");
    }
  };
  
  // Desconectar de uma impressora
  const disconnectPrinter = (printerId: string) => {
    // Simular desconexão da impressora
    setPrinters(printers.map(printer => {
      if (printer.id === printerId) {
        return { ...printer, connected: false };
      }
      return printer;
    }));
    
    if (selectedPrinter === printerId) {
      setSelectedPrinter(null);
      localStorage.removeItem('selectedPrinter');
    }
    
    toast.success("Impressora desconectada");
  };
  
  // Simular download do driver
  const downloadDriver = (printerId: string) => {
    toast("Baixando driver necessário...", {
      duration: 3000,
    });
    
    // Simular progresso de download
    setTimeout(() => {
      setDriverDownloaded(true);
      toast.success("Driver instalado com sucesso!");
    }, 3000);
  };
  
  // Remover uma impressora
  const removePrinter = (printerId: string) => {
    // Desconectar primeiro se estiver conectada
    const printer = printers.find(p => p.id === printerId);
    if (printer?.connected) {
      disconnectPrinter(printerId);
    }
    
    // Remover da lista
    const updatedPrinters = printers.filter(p => p.id !== printerId);
    setPrinters(updatedPrinters);
    localStorage.setItem('configuredPrinters', JSON.stringify(updatedPrinters));
    
    toast.success("Impressora removida");
  };
  
  // Adicionar impressora de rede manualmente
  const addNetworkPrinter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('printerName') as string;
    const ipAddress = formData.get('ipAddress') as string;
    const port = formData.get('port') as string;
    
    if (!name || !ipAddress || !port) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    const newPrinter: PrinterDevice = {
      id: `network-${Date.now()}`,
      name,
      type: 'network',
      connected: false,
    };
    
    const updatedPrinters = [...printers, newPrinter];
    setPrinters(updatedPrinters);
    localStorage.setItem('configuredPrinters', JSON.stringify(updatedPrinters));
    
    toast.success("Impressora de rede adicionada");
    
    // Limpar formulário
    e.currentTarget.reset();
  };
  
  // Filtrar impressoras por tipo
  const filteredPrinters = printers.filter(printer => {
    if (printerTab === 'bluetooth') return printer.type === 'bluetooth';
    if (printerTab === 'usb') return printer.type === 'usb';
    if (printerTab === 'network') return printer.type === 'network';
    return true;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" /> Configuração de Impressoras
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={printerTab} onValueChange={setPrinterTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="bluetooth" className="flex items-center gap-2">
              <Bluetooth className="h-4 w-4" />
              Bluetooth
            </TabsTrigger>
            <TabsTrigger value="usb">USB</TabsTrigger>
            <TabsTrigger value="network">Rede</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bluetooth">
            <div className="space-y-4">
              {!bluetoothAvailable && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Bluetooth não disponível neste navegador. Use Chrome ou Edge para esta funcionalidade.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Impressoras Bluetooth</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={scanBluetoothDevices} 
                  disabled={isScanning || !bluetoothAvailable}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>Buscar Impressoras</>
                  )}
                </Button>
              </div>
              
              {filteredPrinters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma impressora Bluetooth encontrada
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPrinters.map(printer => (
                    <div 
                      key={printer.id} 
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{printer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {printer.connected ? 'Conectado' : 'Desconectado'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {printer.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectPrinter(printer.id)}
                          >
                            Desconectar
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => connectPrinter(printer.id)}
                          >
                            Conectar
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removePrinter(printer.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {driverDownloaded && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <ArrowDown className="h-4 w-4" />
                  Driver instalado com sucesso!
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="usb">
            <div className="space-y-4">
              {!usbAvailable && (
                <Alert variant="destructive">
                  <AlertDescription>
                    API USB não disponível neste navegador. Use Chrome ou Edge para esta funcionalidade.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Impressoras USB</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={scanUSBDevices} 
                  disabled={isScanning || !usbAvailable}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>Buscar Impressoras</>
                  )}
                </Button>
              </div>
              
              {filteredPrinters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma impressora USB encontrada
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPrinters.map(printer => (
                    <div 
                      key={printer.id} 
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{printer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {printer.connected ? 'Conectado' : 'Desconectado'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {printer.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectPrinter(printer.id)}
                          >
                            Desconectar
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => connectPrinter(printer.id)}
                          >
                            Conectar
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removePrinter(printer.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="network">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Impressoras de Rede</h3>
              
              <form onSubmit={addNetworkPrinter} className="space-y-4 border rounded-md p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="printerName">Nome da Impressora</Label>
                    <Input id="printerName" name="printerName" placeholder="Impressora de Cozinha" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ipAddress">Endereço IP</Label>
                      <Input id="ipAddress" name="ipAddress" placeholder="192.168.1.100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Porta</Label>
                      <Input id="port" name="port" placeholder="9100" />
                    </div>
                  </div>
                </div>
                
                <Button type="submit">Adicionar Impressora</Button>
              </form>
              
              {filteredPrinters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma impressora de rede configurada
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPrinters.map(printer => (
                    <div 
                      key={printer.id} 
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{printer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {printer.connected ? 'Conectado' : 'Desconectado'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {printer.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectPrinter(printer.id)}
                          >
                            Desconectar
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => connectPrinter(printer.id)}
                          >
                            Conectar
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removePrinter(printer.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Configurações Gerais</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="printOnOrder" className="block">Imprimir automaticamente ao finalizar venda</Label>
                <p className="text-sm text-muted-foreground">Imprimir cupom sempre que uma venda for finalizada</p>
              </div>
              <Switch id="printOnOrder" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="printKitchen" className="block">Imprimir comanda para cozinha</Label>
                <p className="text-sm text-muted-foreground">Enviar automaticamente comanda para impressora da cozinha</p>
              </div>
              <Switch id="printKitchen" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="printerDefault">Impressora padrão</Label>
              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma impressora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {printers.map(printer => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name} ({printer.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="printerKitchen">Impressora da cozinha</Label>
              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma impressora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {printers.map(printer => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name} ({printer.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
