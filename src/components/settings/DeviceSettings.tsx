
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Printer, Scale, Smartphone } from "lucide-react";

export const DeviceSettings = () => {
  const [printerSettings, setPrinterSettings] = useState({
    mainPrinter: "printer1",
    kitchenPrinter: "printer2",
    printCustomerReceipt: true,
    printKitchenReceipt: true
  });
  
  const [scaleSettings, setScaleSettings] = useState({
    scaleModel: "scale1",
    port: "port1",
    autoIntegration: true,
    readBarcode: true
  });
  
  const [usbDevices, setUsbDevices] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  
  const handlePrinterChange = (key: keyof typeof printerSettings, value: string | boolean) => {
    setPrinterSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleScaleChange = (key: keyof typeof scaleSettings, value: string | boolean) => {
    setScaleSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Simular detecção de dispositivos USB
  const scanDevices = () => {
    setScanning(true);
    
    // Simulação: descubra dispositivos após um pequeno atraso
    setTimeout(() => {
      setUsbDevices([
        "Epson TM-T20X (USB001)",
        "Elgin i9 (USB002)",
        "Toledo Prix 4 (USB003)"
      ]);
      setScanning(false);
      toast.success("Dispositivos detectados com sucesso!");
    }, 2000);
  };
  
  const saveDeviceSettings = () => {
    toast.success("Configurações de dispositivos salvas com sucesso!");
  };

  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          <h2 className="text-xl font-bold">Impressoras</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="main-printer">Impressora Principal</Label>
            <Select 
              value={printerSettings.mainPrinter}
              onValueChange={value => handlePrinterChange('mainPrinter', value)}
            >
              <SelectTrigger id="main-printer">
                <SelectValue placeholder="Selecione a impressora" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="printer1">Epson TM-T20X (Caixa)</SelectItem>
                <SelectItem value="printer2">Elgin i9 (Balcão)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kitchen-printer">Impressora da Cozinha</Label>
            <Select 
              value={printerSettings.kitchenPrinter}
              onValueChange={value => handlePrinterChange('kitchenPrinter', value)}
            >
              <SelectTrigger id="kitchen-printer">
                <SelectValue placeholder="Selecione a impressora" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="printer1">Epson TM-T20X (Caixa)</SelectItem>
                <SelectItem value="printer2">Elgin i9 (Balcão)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="space-y-0.5">
            <Label>Via do Cliente</Label>
            <div className="text-sm text-gray-500">Imprimir via do cliente automaticamente</div>
          </div>
          <Switch 
            checked={printerSettings.printCustomerReceipt}
            onCheckedChange={value => handlePrinterChange('printCustomerReceipt', value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Via da Cozinha</Label>
            <div className="text-sm text-gray-500">Imprimir via da cozinha automaticamente</div>
          </div>
          <Switch 
            checked={printerSettings.printKitchenReceipt}
            onCheckedChange={value => handlePrinterChange('printKitchenReceipt', value)}
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          <h2 className="text-xl font-bold">Balanças</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scale-model">Modelo da Balança</Label>
            <Select 
              value={scaleSettings.scaleModel}
              onValueChange={value => handleScaleChange('scaleModel', value)}
            >
              <SelectTrigger id="scale-model">
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scale1">Toledo Prix 4 Uno</SelectItem>
                <SelectItem value="scale2">Filizola CS15</SelectItem>
                <SelectItem value="scale3">Welmy W300</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scale-port">Porta de Comunicação</Label>
            <Select 
              value={scaleSettings.port}
              onValueChange={value => handleScaleChange('port', value)}
            >
              <SelectTrigger id="scale-port">
                <SelectValue placeholder="Selecione a porta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="port1">COM1</SelectItem>
                <SelectItem value="port2">COM2</SelectItem>
                <SelectItem value="port3">COM3</SelectItem>
                <SelectItem value="port4">COM4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Integração Automática</Label>
            <div className="text-sm text-gray-500">Capturar peso automaticamente ao selecionar produto</div>
          </div>
          <Switch 
            checked={scaleSettings.autoIntegration}
            onCheckedChange={value => handleScaleChange('autoIntegration', value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Leitura de Código de Barras da Balança</Label>
            <div className="text-sm text-gray-500">Ler etiquetas geradas pela balança</div>
          </div>
          <Switch 
            checked={scaleSettings.readBarcode}
            onCheckedChange={value => handleScaleChange('readBarcode', value)}
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          <h2 className="text-xl font-bold">Dispositivos USB</h2>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={scanDevices} 
            disabled={scanning}
            className="w-full"
          >
            {scanning ? "Detectando Dispositivos..." : "Detectar Dispositivos USB"}
          </Button>
          
          <div className="max-h-40 overflow-y-auto border rounded-md">
            {usbDevices.length > 0 ? (
              <ul className="divide-y">
                {usbDevices.map((device, index) => (
                  <li key={index} className="p-3 flex justify-between">
                    <span>{device}</span>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {scanning ? "Buscando dispositivos..." : "Nenhum dispositivo detectado"}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={saveDeviceSettings}>Salvar Alterações</Button>
      </div>
    </Card>
  );
};
