
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Store, 
  Printer, 
  Scale, 
  CreditCard, 
  Truck, 
  Database, 
  Lock, 
  BellRing, 
  Shield,
  Link 
} from 'lucide-react';

// Import settings components
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { DeviceSettings } from '@/components/settings/DeviceSettings';
import { PaymentSettings } from '@/components/settings/PaymentSettings';
import { DeliverySettings } from '@/components/settings/DeliverySettings';
import { BackupSettings } from '@/components/settings/BackupSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';
import { FiscalSettings } from '@/components/settings/FiscalSettings';
import { PrinterSettings } from '@/components/settings/PrinterSettings';
import { APIIntegrationSettings } from '@/components/settings/APIIntegrationSettings';
import { WhatsAppConnection } from '@/components/whatsapp/WhatsAppConnection';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  
  // Extract tab from URL if present
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings?tab=${value}`, { replace: true });
  };

  return (
    <MainLayout title="Configurações">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 h-auto">
          <TabsTrigger value="general" className="py-2 gap-2">
            <Store className="h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="printers" className="py-2 gap-2">
            <Printer className="h-4 w-4" /> Impressoras
          </TabsTrigger>
          <TabsTrigger value="devices" className="py-2 gap-2">
            <Scale className="h-4 w-4" /> Dispositivos
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
          <TabsTrigger value="api" className="py-2 gap-2">
            <Link className="h-4 w-4" /> API
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="py-2 gap-2">
            <MessageSquare className="h-4 w-4" /> WhatsApp
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="printers">
          <PrinterSettings />
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <DeviceSettings />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>
        
        <TabsContent value="delivery">
          <DeliverySettings />
        </TabsContent>
        
        <TabsContent value="backup">
          <BackupSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSettings />
        </TabsContent>
        
        <TabsContent value="fiscal">
          <FiscalSettings />
        </TabsContent>
        
        <TabsContent value="api">
          <APIIntegrationSettings />
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <WhatsAppConnection />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
