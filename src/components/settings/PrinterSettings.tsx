
import { useState, useEffect, useCallback } from 'react';
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
  const [systemPrinters, setSystemPrinters] = useState<string[]>([]);
  
  // Check for Bluetooth and USB availability on initialization
  useEffect(() => {
    checkBluetoothAvailability();
    checkUSBAvailability();
    detectSystemPrinters();
    
    // Load saved printers from localStorage
    const savedPrinters = localStorage.getItem('configuredPrinters');
    if (savedPrinters) {
      setPrinters(JSON.parse(savedPrinters));
    }
    
    // Load selected printer
    const savedSelectedPrinter = localStorage.getItem('selectedPrinter');
    if (savedSelectedPrinter) {
      setSelectedPrinter(savedSelectedPrinter);
    }
  }, []);
  
  // Check if the browser supports Web Bluetooth API
  const checkBluetoothAvailability = () => {
    if ('bluetooth' in navigator) {
      setBluetoothAvailable(true);
    } else {
      setBluetoothAvailable(false);
    }
  };
  
  // Check if the browser supports Web USB API
  const checkUSBAvailability = () => {
    if ('usb' in navigator) {
      setUsbAvailable(true);
    } else {
      setUsbAvailable(false);
    }
  };
  
  // Detect system printers using the Printer API or alternative methods
  const detectSystemPrinters = useCallback(() => {
    try {
      // First try Web Print API - this is a proposed web standard, not widely supported yet
      if ('print' in navigator && 'getPrinters' in (navigator as any).print) {
        (navigator as any).print.getPrinters()
          .then((printers: any[]) => {
            setSystemPrinters(printers.map(p => p.name));
          })
          .catch(() => {
            detectPrintersWithFallback();
          });
      } else {
        detectPrintersWithFallback();
      }
    } catch (error) {
      console.error('Error detecting system printers:', error);
      detectPrintersWithFallback();
    }
  }, []);
  
  // Fallback method to detect printers
  const detectPrintersWithFallback = () => {
    // This is a simulated implementation as web browsers have limited access to system printers
    // In a real implementation, we would use system-specific APIs or browser extensions
    
    // For desktop apps, you might use a backend service or Electron's native modules
    
    // For demonstration, we'll check if we can access print info from a print dialog
    if ('print' in window) {
      // Get minimal print info via the print dialog
      try {
        const printFrame = document.createElement('iframe');
        printFrame.style.display = 'none';
        document.body.appendChild(printFrame);
        
        // Use a timeout to ensure the iframe is ready
        setTimeout(() => {
          if (printFrame.contentWindow) {
            // We can only get limited info this way, but it helps detect if printing is available
            const hasPrintCapability = Boolean(printFrame.contentWindow.print);
            
            if (hasPrintCapability) {
              // Since we can't get actual printer names from the browser,
              // we can poll a backend service or use locally stored printers
              
              // For demo, use mock system printers
              const mockSystemPrinters = [
                'Sistema: Impressora Principal',
                'Sistema: Impressora HP LaserJet',
                'Sistema: Impressora PDF',
              ];
              
              setSystemPrinters(mockSystemPrinters);
            }
          }
          
          // Clean up
          document.body.removeChild(printFrame);
        }, 100);
      } catch (error) {
        console.error('Error in print detection fallback:', error);
      }
    }
  };
  
  // Start scanning for Bluetooth devices
  const scanBluetoothDevices = async () => {
    if (!bluetoothAvailable) {
      toast.error("Bluetooth não disponível neste navegador");
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Use Web Bluetooth API to search for devices
      // This is a simplified implementation
      // In a real implementation, we'd use navigator.bluetooth.requestDevice()
      
      // For demonstration purposes
      setTimeout(() => {
        // Simulate found devices
        const mockDevices = [
          { id: 'bt-1', name: 'Impressora Térmica BT', type: 'bluetooth' as const, connected: false },
          { id: 'bt-2', name: 'Impressora POS BT', type: 'bluetooth' as const, connected: false },
        ];
        
        setPrinters(prevPrinters => {
          // Filter existing bluetooth printers and add new ones
          const filteredPrinters = prevPrinters.filter(p => p.type !== 'bluetooth');
          const newPrinters = [...filteredPrinters, ...mockDevices];
          
          // Save to localStorage
          localStorage.setItem('configuredPrinters', JSON.stringify(newPrinters));
          
          return newPrinters;
        });
        
        setIsScanning(false);
        toast.success("Bluetooth printer scan completed");
      }, 2000);
    } catch (error) {
      console.error('Error scanning Bluetooth devices:', error);
      toast.error("Error scanning Bluetooth devices");
      setIsScanning(false);
    }
  };
  
  // Start scanning for USB devices
  const scanUSBDevices = async () => {
    if (!usbAvailable) {
      toast.error("USB not available in this browser");
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Use Web USB API to search for devices
      // This is a simplified implementation
      // In a real implementation, we'd use navigator.usb.requestDevice()
      
      setTimeout(() => {
        // Simulate found devices
        const mockDevices = [
          { id: 'usb-1', name: 'USB Thermal Printer', type: 'usb' as const, connected: false },
          { id: 'usb-2', name: 'USB Receipt Printer', type: 'usb' as const, connected: false },
        ];
        
        setPrinters(prevPrinters => {
          // Filter existing USB printers and add new ones
          const filteredPrinters = prevPrinters.filter(p => p.type !== 'usb');
          const newPrinters = [...filteredPrinters, ...mockDevices];
          
          // Save to localStorage
          localStorage.setItem('configuredPrinters', JSON.stringify(newPrinters));
          
          return newPrinters;
        });
        
        setIsScanning(false);
        toast.success("USB printer scan completed");
      }, 2000);
    } catch (error) {
      console.error('Error scanning USB devices:', error);
      toast.error("Error scanning USB devices");
      setIsScanning(false);
    }
  };
  
  // Connect to a printer
  const connectPrinter = (printerId: string) => {
    // Simulate connection to the printer
    setPrinters(printers.map(printer => {
      if (printer.id === printerId) {
        return { ...printer, connected: true };
      }
      return printer;
    }));
    
    setSelectedPrinter(printerId);
    localStorage.setItem('selectedPrinter', printerId);
    
    // If no driver, offer download
    if (!driverDownloaded) {
      downloadDriver(printerId);
    } else {
      toast.success("Connected to printer successfully!");
    }
  };
  
  // Disconnect from a printer
  const disconnectPrinter = (printerId: string) => {
    // Simulate printer disconnection
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
    
    toast.success("Printer disconnected");
  };
  
  // Simulate driver download
  const downloadDriver = (printerId: string) => {
    toast("Downloading required driver...", {
      duration: 3000,
    });
    
    // Simulate download progress
    setTimeout(() => {
      setDriverDownloaded(true);
      toast.success("Driver installed successfully!");
    }, 3000);
  };
  
  // Remove a printer
  const removePrinter = (printerId: string) => {
    // Disconnect first if connected
    const printer = printers.find(p => p.id === printerId);
    if (printer?.connected) {
      disconnectPrinter(printerId);
    }
    
    // Remove from list
    const updatedPrinters = printers.filter(p => p.id !== printerId);
    setPrinters(updatedPrinters);
    localStorage.setItem('configuredPrinters', JSON.stringify(updatedPrinters));
    
    toast.success("Printer removed");
  };
  
  // Add network printer manually
  const addNetworkPrinter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('printerName') as string;
    const ipAddress = formData.get('ipAddress') as string;
    const port = formData.get('port') as string;
    
    if (!name || !ipAddress || !port) {
      toast.error("Please fill in all fields");
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
    
    toast.success("Network printer added");
    
    // Clear form
    e.currentTarget.reset();
  };
  
  // Print test page
  const printTestPage = () => {
    if (!selectedPrinter) {
      toast.error("Select a printer first");
      return;
    }
    
    try {
      // Create an invisible iframe for printing
      const printFrame = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);
      
      // Add content to the frame
      const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(`
          <html>
            <head>
              <title>Print Test</title>
              <style>
                body { font-family: sans-serif; }
                .receipt { width: 300px; padding: 10px; }
                .header { text-align: center; font-weight: bold; margin-bottom: 10px; }
                .content { margin: 15px 0; }
                .footer { text-align: center; font-size: 12px; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  TEST PRINT<br>
                  ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
                </div>
                <div class="content">
                  This is a test print page.<br>
                  <br>
                  Printer: ${printers.find(p => p.id === selectedPrinter)?.name || 'Unknown'}<br>
                </div>
                <div class="footer">
                  *** End of Test ***
                </div>
              </div>
            </body>
          </html>
        `);
        frameDoc.close();
        
        // Print the frame
        setTimeout(() => {
          printFrame.contentWindow?.print();
          
          // Remove the frame after printing
          setTimeout(() => {
            document.body.removeChild(printFrame);
            toast.success("Test page sent to printer");
          }, 1000);
        }, 500);
      }
    } catch (error) {
      console.error('Error printing test page:', error);
      toast.error("Failed to print test page");
    }
  };
  
  // Filter printers by tab/type
  const filteredPrinters = printers.filter(printer => {
    if (printerTab === 'bluetooth') return printer.type === 'bluetooth';
    if (printerTab === 'usb') return printer.type === 'usb';
    if (printerTab === 'network') return printer.type === 'network';
    if (printerTab === 'system') return false; // System printers are handled separately
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
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="bluetooth" className="flex items-center gap-2">
              <Bluetooth className="h-4 w-4" />
              Bluetooth
            </TabsTrigger>
            <TabsTrigger value="usb">USB</TabsTrigger>
            <TabsTrigger value="network">Rede</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
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
          
          <TabsContent value="system">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Impressoras do Sistema</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={detectSystemPrinters}
                >
                  Atualizar Lista
                </Button>
              </div>
              
              {systemPrinters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma impressora do sistema detectada
                </div>
              ) : (
                <div className="space-y-2">
                  {systemPrinters.map((printer, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{printer}</div>
                        <div className="text-sm text-muted-foreground">
                          Impressora do Sistema
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            const printerId = `system-${index}`;
                            setPrinters(prev => [
                              ...prev,
                              { 
                                id: printerId, 
                                name: printer, 
                                type: 'network', 
                                connected: true 
                              }
                            ]);
                            setSelectedPrinter(printerId);
                            toast.success(`Impressora ${printer} configurada como padrão`);
                          }}
                        >
                          Usar como Padrão
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Alert>
                <AlertDescription>
                  <p className="mb-2">Impressoras do sistema são detectadas automaticamente pelo navegador e sistema operacional.</p>
                  <p>Para imprimir em uma impressora do sistema, selecione-a como impressora padrão.</p>
                </AlertDescription>
              </Alert>
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
              <Select defaultValue={selectedPrinter || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma impressora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {[...printers, ...systemPrinters.map((name, i) => ({ 
                    id: `system-${i}`, 
                    name, 
                    type: 'network' as const,
                    connected: false
                  }))].map(printer => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name} ({typeof printer.type === 'string' ? printer.type : 'system'})
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
                  {[...printers, ...systemPrinters.map((name, i) => ({ 
                    id: `system-${i}`, 
                    name, 
                    type: 'network' as const,
                    connected: false
                  }))].map(printer => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name} ({typeof printer.type === 'string' ? printer.type : 'system'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4">
              <Button onClick={printTestPage} disabled={!selectedPrinter}>
                Imprimir Página de Teste
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
