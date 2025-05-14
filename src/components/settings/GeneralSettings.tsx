
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const GeneralSettings = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: "Açaí e Sorvetes Delícia",
    cnpj: "12.345.678/0001-90",
    phone: "(11) 98765-4321",
    email: "contato@acaidelicia.com.br",
    address: "Rua dos Açaís, 123 - Jardim Tropical",
    city: "São Paulo",
    state: "SP",
    zipcode: "01234-567"
  });
  
  const [systemSettings, setSystemSettings] = useState({
    currency: "BRL",
    offlineMode: true,
    serviceCharge: false,
    serviceChargeValue: 10,
    automaticBackup: true
  });
  
  const handleCompanyInfoChange = (field: keyof typeof companyInfo, value: string) => {
    setCompanyInfo({
      ...companyInfo,
      [field]: value
    });
  };
  
  const handleSystemSettingChange = (field: keyof typeof systemSettings, value: any) => {
    setSystemSettings({
      ...systemSettings,
      [field]: value
    });
  };
  
  const saveSettings = () => {
    toast.success("Configurações gerais salvas com sucesso!");
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Informações da Empresa</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input 
              id="company-name" 
              value={companyInfo.name} 
              onChange={(e) => handleCompanyInfoChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input 
              id="cnpj" 
              value={companyInfo.cnpj}
              onChange={(e) => handleCompanyInfoChange("cnpj", e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              value={companyInfo.phone}
              onChange={(e) => handleCompanyInfoChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={companyInfo.email}
              onChange={(e) => handleCompanyInfoChange("email", e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input 
            id="address" 
            value={companyInfo.address}
            onChange={(e) => handleCompanyInfoChange("address", e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input 
              id="city" 
              value={companyInfo.city}
              onChange={(e) => handleCompanyInfoChange("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Select 
              value={companyInfo.state}
              onValueChange={(value) => handleCompanyInfoChange("state", value)}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="ES">Espírito Santo</SelectItem>
                <SelectItem value="PR">Paraná</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipcode">CEP</Label>
            <Input 
              id="zipcode" 
              value={companyInfo.zipcode}
              onChange={(e) => handleCompanyInfoChange("zipcode", e.target.value)}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações do Sistema</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="currency">Moeda</Label>
              <div className="text-sm text-gray-500">Selecione a moeda utilizada no sistema</div>
            </div>
            <Select 
              value={systemSettings.currency}
              onValueChange={(value) => handleSystemSettingChange("currency", value)}
            >
              <SelectTrigger id="currency" className="w-40">
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real (R$)</SelectItem>
                <SelectItem value="USD">Dólar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo offline</Label>
              <div className="text-sm text-gray-500">Permitir operação do sistema sem internet</div>
            </div>
            <Switch 
              checked={systemSettings.offlineMode}
              onCheckedChange={(value) => handleSystemSettingChange("offlineMode", value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Taxa de serviço padrão</Label>
              <div className="text-sm text-gray-500">Aplicar taxa de serviço automaticamente</div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={systemSettings.serviceCharge}
                onCheckedChange={(value) => handleSystemSettingChange("serviceCharge", value)}
              />
              <Input 
                className="w-20" 
                placeholder="10%" 
                value={`${systemSettings.serviceChargeValue}%`}
                onChange={(e) => {
                  const value = parseInt(e.target.value.replace('%', '')) || 0;
                  handleSystemSettingChange("serviceChargeValue", value);
                }}
                disabled={!systemSettings.serviceCharge}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup automático</Label>
              <div className="text-sm text-gray-500">Realizar backup diário dos dados</div>
            </div>
            <Switch 
              checked={systemSettings.automaticBackup}
              onCheckedChange={(value) => handleSystemSettingChange("automaticBackup", value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={saveSettings}>Salvar Alterações</Button>
        </div>
      </div>
    </>
  );
};
