
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Shield, FileCheck, Receipt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const FiscalSettings = () => {
  // Configurações SAT
  const [satEnabled, setSatEnabled] = useState(false);
  const [satModel, setSatModel] = useState("sat-fiscal");
  const [satPort, setSatPort] = useState("COM3");
  const [satCNPJ, setSatCNPJ] = useState("12.345.678/0001-90");
  const [satIsConnected, setSatIsConnected] = useState(false);
  
  // Configurações NFC-e
  const [nfceEnabled, setNfceEnabled] = useState(false);
  const [nfceCertificateFile, setNfceCertificateFile] = useState<File | null>(null);
  const [nfcePassword, setNfcePassword] = useState("");
  const [nfceEnvironment, setNfceEnvironment] = useState("test");
  
  // Configurações de impostos
  const [taxICMSRate, setTaxICMSRate] = useState(18);
  const [taxPISRate, setTaxPISRate] = useState(0.65);
  const [taxCOFINSRate, setTaxCOFINSRate] = useState(3);
  
  // Testar conexão com SAT
  const testSATConnection = () => {
    if (!satEnabled) {
      toast.error("Ative a integração com SAT primeiro.");
      return;
    }
    
    // Simulação de conexão
    toast.info("Testando conexão com o SAT...");
    
    setTimeout(() => {
      setSatIsConnected(true);
      toast.success("SAT conectado com sucesso!");
    }, 2000);
  };
  
  // Testar emissão
  const testFiscalEmission = () => {
    if (satEnabled && satIsConnected) {
      toast.info("Emitindo cupom fiscal de teste via SAT...");
      
      setTimeout(() => {
        toast.success("Cupom fiscal de teste emitido com sucesso!");
      }, 2000);
    } else if (nfceEnabled) {
      toast.info("Emitindo NFC-e de teste...");
      
      setTimeout(() => {
        toast.success("NFC-e de teste emitida com sucesso!");
      }, 2000);
    } else {
      toast.error("Nenhum método fiscal está configurado e ativo.");
    }
  };
  
  // Salvar configurações
  const saveFiscalSettings = () => {
    toast.success("Configurações fiscais salvas com sucesso!");
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-bold">Configurações Fiscais</h2>
        </div>
        
        <Tabs defaultValue="sat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sat" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              SAT Fiscal
            </TabsTrigger>
            <TabsTrigger value="nfce" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              NFC-e
            </TabsTrigger>
            <TabsTrigger value="taxes" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Impostos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sat" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar SAT Fiscal</Label>
                <div className="text-sm text-gray-500">
                  Integrar sistema com SAT para emissão de cupons fiscais
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  satIsConnected ? "bg-green-500" : "bg-red-500"
                )}></div>
                <Switch 
                  checked={satEnabled}
                  onCheckedChange={(checked) => {
                    setSatEnabled(checked);
                    if (!checked) setSatIsConnected(false);
                  }}
                />
              </div>
            </div>
            
            {satEnabled && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sat-model">Modelo do SAT</Label>
                    <Input 
                      id="sat-model"
                      value={satModel}
                      onChange={(e) => setSatModel(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sat-port">Porta do SAT</Label>
                    <Input 
                      id="sat-port"
                      value={satPort}
                      onChange={(e) => setSatPort(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sat-cnpj">CNPJ do Contribuinte</Label>
                  <Input 
                    id="sat-cnpj"
                    value={satCNPJ}
                    onChange={(e) => setSatCNPJ(e.target.value)}
                    placeholder="XX.XXX.XXX/XXXX-XX"
                  />
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={testSATConnection}>
                    Testar Conexão
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={testFiscalEmission}
                    disabled={!satIsConnected}
                  >
                    Emitir Teste
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nfce" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar NFC-e</Label>
                <div className="text-sm text-gray-500">
                  Configurar sistema para emissão de NFC-e
                </div>
              </div>
              <Switch 
                checked={nfceEnabled}
                onCheckedChange={setNfceEnabled}
              />
            </div>
            
            {nfceEnabled && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="nfce-certificate">Certificado Digital A1</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="nfce-certificate"
                      type="file"
                      onChange={(e) => setNfceCertificateFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecione o arquivo do certificado digital A1 (.pfx)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nfce-password">Senha do Certificado</Label>
                  <Input 
                    id="nfce-password"
                    type="password"
                    value={nfcePassword}
                    onChange={(e) => setNfcePassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Ambiente</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        id="env-test"
                        type="radio"
                        name="nfce-environment"
                        value="test"
                        checked={nfceEnvironment === "test"}
                        onChange={() => setNfceEnvironment("test")}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="env-test" className="text-sm font-normal">
                        Homologação (Testes)
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        id="env-prod"
                        type="radio"
                        name="nfce-environment"
                        value="prod"
                        checked={nfceEnvironment === "prod"}
                        onChange={() => setNfceEnvironment("prod")}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="env-prod" className="text-sm font-normal">
                        Produção
                      </Label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={testFiscalEmission}
                  disabled={!nfceCertificateFile || !nfcePassword}
                >
                  Emitir NFC-e de Teste
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="taxes" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações de Impostos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure as alíquotas padrão para cálculo de impostos.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-icms">ICMS (%)</Label>
                    <div className="flex">
                      <Input 
                        id="tax-icms"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={taxICMSRate}
                        onChange={(e) => setTaxICMSRate(parseFloat(e.target.value))}
                      />
                      <span className="ml-2 flex items-center text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-pis">PIS (%)</Label>
                    <div className="flex">
                      <Input 
                        id="tax-pis"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={taxPISRate}
                        onChange={(e) => setTaxPISRate(parseFloat(e.target.value))}
                      />
                      <span className="ml-2 flex items-center text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-cofins">COFINS (%)</Label>
                    <div className="flex">
                      <Input 
                        id="tax-cofins"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={taxCOFINSRate}
                        onChange={(e) => setTaxCOFINSRate(parseFloat(e.target.value))}
                      />
                      <span className="ml-2 flex items-center text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Calcular impostos automaticamente</Label>
                    <div className="text-sm text-gray-500">
                      Aplicar cálculo de impostos em todos os produtos
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exibir impostos no cupom</Label>
                    <div className="text-sm text-gray-500">
                      Mostrar valor aproximado de tributos no cupom fiscal
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={saveFiscalSettings}>Salvar Alterações</Button>
        </div>
      </div>
    </Card>
  );
};
