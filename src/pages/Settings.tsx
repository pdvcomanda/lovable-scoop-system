
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Store, 
  Printer, 
  Scale, 
  CreditCard, 
  Truck, 
  Database, 
  Lock, 
  BellRing, 
  Shield 
} from 'lucide-react';

const Settings = () => {
  return (
    <MainLayout title="Configurações">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger value="general" className="py-2 gap-2">
            <Store className="h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="devices" className="py-2 gap-2">
            <Printer className="h-4 w-4" /> Dispositivos
          </TabsTrigger>
          <TabsTrigger value="payment" className="py-2 gap-2">
            <CreditCard className="h-4 w-4" /> Pagamentos
          </TabsTrigger>
          <TabsTrigger value="delivery" className="py-2 gap-2">
            <Truck className="h-4 w-4" /> Entregas
          </TabsTrigger>
          <TabsTrigger value="backup" className="py-2 gap-2">
            <Database className="h-4 w-4" /> Backup
          </TabsTrigger>
          <TabsTrigger value="security" className="py-2 gap-2">
            <Lock className="h-4 w-4" /> Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications" className="py-2 gap-2">
            <BellRing className="h-4 w-4" /> Notificações
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="py-2 gap-2">
            <Shield className="h-4 w-4" /> Fiscal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Informações da Empresa</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" defaultValue="Açaí e Sorvetes Delícia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(11) 98765-4321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contato@acaidelicia.com.br" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" defaultValue="Rua dos Açaís, 123 - Jardim Tropical" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" defaultValue="São Paulo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select defaultValue="SP">
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
                  <Input id="zipcode" defaultValue="01234-567" />
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
                  <Select defaultValue="BRL">
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
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Taxa de serviço padrão</Label>
                    <div className="text-sm text-gray-500">Aplicar taxa de serviço automaticamente</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Input className="w-20" placeholder="10%" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup automático</Label>
                    <div className="text-sm text-gray-500">Realizar backup diário dos dados</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar Alterações</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Impressoras</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main-printer">Impressora Principal</Label>
                  <Select defaultValue="printer1">
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
                  <Select defaultValue="printer2">
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
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Via do Cliente</Label>
                  <div className="text-sm text-gray-500">Imprimir via do cliente automaticamente</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Via da Cozinha</Label>
                  <div className="text-sm text-gray-500">Imprimir via da cozinha automaticamente</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Balanças</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scale-model">Modelo da Balança</Label>
                  <Select defaultValue="scale1">
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
                  <Select defaultValue="port1">
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
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Leitura de Código de Barras da Balança</Label>
                  <div className="text-sm text-gray-500">Ler etiquetas geradas pela balança</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Métodos de Pagamento</h2>
            {/* Payment settings content */}
            <div className="p-8 text-center text-gray-500">
              Configurações de métodos de pagamento, como cartão, PIX, dinheiro e outras formas.
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Configurações de Entrega</h2>
            {/* Delivery settings content */}
            <div className="p-8 text-center text-gray-500">
              Configurações de entrega, incluindo taxas por região, tempo estimado e integração com aplicativos de entrega.
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Backup e Restauração</h2>
            {/* Backup settings content */}
            <div className="p-8 text-center text-gray-500">
              Configurações de backup automático, restauração e exportação de dados.
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Configurações de Segurança</h2>
            {/* Security settings content */}
            <div className="p-8 text-center text-gray-500">
              Configurações de segurança, incluindo política de senhas, autenticação de dois fatores e log de atividades.
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Configurações de Notificações</h2>
            {/* Notifications settings content */}
            <div className="p-8 text-center text-gray-500">
              Configurações de alertas e notificações para estoque baixo, novos pedidos e relatórios.
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="fiscal">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Configurações Fiscais</h2>
            {/* Fiscal settings content */}
            <div className="p-8 text-center text-gray-500">
              Configurações fiscais, incluindo NFC-e, SAT, certificados digitais e integração com contabilidade.
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
