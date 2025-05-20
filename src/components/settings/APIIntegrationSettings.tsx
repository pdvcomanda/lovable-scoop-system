
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { 
  Link, 
  Zap, 
  ShoppingCart, 
  RefreshCw,
  Check,
  Database,
  Globe
} from "lucide-react";

export function APIIntegrationSettings() {
  const [integrationTab, setIntegrationTab] = useState<string>("catalog");
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [connected, setConnected] = useState<{
    catalog: boolean;
    payment: boolean;
    custom: boolean;
  }>({
    catalog: false,
    payment: false,
    custom: false,
  });
  
  const [apiSettings, setApiSettings] = useState({
    catalogUrl: "https://catalog.example.com/api",
    catalogToken: "",
    paymentGatewayUrl: "https://payments.example.com/api",
    paymentGatewayToken: "",
    customApiUrl: "",
    customApiToken: "",
    syncInventory: true,
    syncPrices: true,
    syncOrders: true,
    webhookUrl: `${window.location.origin}/api/webhook`,
  });
  
  const handleSettingChange = (key: keyof typeof apiSettings, value: string | boolean) => {
    setApiSettings(prev => ({ ...prev, [key]: value }));
    
    // Save to localStorage
    localStorage.setItem('apiIntegrationSettings', JSON.stringify({
      ...apiSettings,
      [key]: value
    }));
    
    toast.success("Configuration saved");
  };
  
  const testConnection = (type: 'catalog' | 'payment' | 'custom') => {
    setTestingConnection(true);
    
    // Simulate API connection test
    setTimeout(() => {
      setTestingConnection(false);
      
      // Simulate success for demo
      setConnected(prev => ({ ...prev, [type]: true }));
      toast.success(`Connection to ${type === 'catalog' ? 'catalog' : type === 'payment' ? 'payment gateway' : 'custom API'} successful!`);
    }, 2000);
  };
  
  const disconnectApi = (type: 'catalog' | 'payment' | 'custom') => {
    setConnected(prev => ({ ...prev, [type]: false }));
    
    if (type === 'catalog') {
      setApiSettings(prev => ({ ...prev, catalogToken: "" }));
    } else if (type === 'payment') {
      setApiSettings(prev => ({ ...prev, paymentGatewayToken: "" }));
    } else {
      setApiSettings(prev => ({ ...prev, customApiToken: "" }));
    }
    
    toast.success(`Disconnected from ${type === 'catalog' ? 'catalog' : type === 'payment' ? 'payment gateway' : 'custom API'}`);
  };
  
  // Load saved settings
  useState(() => {
    const savedSettings = localStorage.getItem('apiIntegrationSettings');
    if (savedSettings) {
      setApiSettings(JSON.parse(savedSettings));
    }
    
    // Check for existing connections
    const savedConnections = localStorage.getItem('apiConnections');
    if (savedConnections) {
      setConnected(JSON.parse(savedConnections));
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" /> API Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={integrationTab} onValueChange={setIntegrationTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Virtual Catalog
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Payment Gateway
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Custom API
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="catalog">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Virtual Catalog Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to your virtual catalog to sync products, inventory and orders.
                </p>
                
                {connected.catalog ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-green-50 text-green-800">
                    <Check className="h-4 w-4" />
                    <span>Connected to Virtual Catalog</span>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={() => disconnectApi('catalog')}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="space-y-2">
                      <Label htmlFor="catalogUrl">Catalog API URL</Label>
                      <Input 
                        id="catalogUrl"
                        value={apiSettings.catalogUrl}
                        onChange={e => handleSettingChange('catalogUrl', e.target.value)}
                        placeholder="https://catalog.example.com/api"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="catalogToken">API Token</Label>
                      <Input 
                        id="catalogToken"
                        type="password"
                        value={apiSettings.catalogToken}
                        onChange={e => handleSettingChange('catalogToken', e.target.value)}
                        placeholder="Enter your API token"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => testConnection('catalog')}
                      disabled={testingConnection || !apiSettings.catalogToken}
                    >
                      {testingConnection ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Testing Connection...
                        </>
                      ) : "Test Connection"}
                    </Button>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h4 className="text-medium font-medium">Sync Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="syncInventory" className="block">Sync Inventory</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep inventory levels synchronized between POS and catalog
                      </p>
                    </div>
                    <Switch 
                      id="syncInventory"
                      checked={apiSettings.syncInventory}
                      onCheckedChange={(checked) => handleSettingChange('syncInventory', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="syncPrices" className="block">Sync Prices</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep product prices synchronized
                      </p>
                    </div>
                    <Switch 
                      id="syncPrices"
                      checked={apiSettings.syncPrices}
                      onCheckedChange={(checked) => handleSettingChange('syncPrices', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="syncOrders" className="block">Sync Orders</Label>
                      <p className="text-sm text-muted-foreground">
                        Import orders from virtual catalog to POS
                      </p>
                    </div>
                    <Switch 
                      id="syncOrders"
                      checked={apiSettings.syncOrders}
                      onCheckedChange={(checked) => handleSettingChange('syncOrders', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <div className="flex">
                    <Input 
                      id="webhookUrl"
                      value={apiSettings.webhookUrl}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button 
                      variant="outline"
                      className="rounded-l-none"
                      onClick={() => {
                        navigator.clipboard.writeText(apiSettings.webhookUrl);
                        toast.success("Webhook URL copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure this URL in your catalog to receive notifications
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payment">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Gateway Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to your payment gateway to process payments from virtual catalog.
                </p>
                
                {connected.payment ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-green-50 text-green-800">
                    <Check className="h-4 w-4" />
                    <span>Connected to Payment Gateway</span>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={() => disconnectApi('payment')}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentGatewayUrl">Payment Gateway API URL</Label>
                      <Input 
                        id="paymentGatewayUrl"
                        value={apiSettings.paymentGatewayUrl}
                        onChange={e => handleSettingChange('paymentGatewayUrl', e.target.value)}
                        placeholder="https://payments.example.com/api"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentGatewayToken">API Token</Label>
                      <Input 
                        id="paymentGatewayToken"
                        type="password"
                        value={apiSettings.paymentGatewayToken}
                        onChange={e => handleSettingChange('paymentGatewayToken', e.target.value)}
                        placeholder="Enter your API token"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => testConnection('payment')}
                      disabled={testingConnection || !apiSettings.paymentGatewayToken}
                    >
                      {testingConnection ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Testing Connection...
                        </>
                      ) : "Test Connection"}
                    </Button>
                  </div>
                )}
                
                <Alert>
                  <AlertDescription>
                    <p className="font-medium">Supported Payment Methods</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Credit/Debit Cards</li>
                      <li>• PIX</li>
                      <li>• Bank Transfer</li>
                      <li>• Digital Wallets</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Custom API Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to any other custom API service.
                </p>
                
                {connected.custom ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-green-50 text-green-800">
                    <Check className="h-4 w-4" />
                    <span>Connected to Custom API</span>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={() => disconnectApi('custom')}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="space-y-2">
                      <Label htmlFor="customApiUrl">Custom API URL</Label>
                      <Input 
                        id="customApiUrl"
                        value={apiSettings.customApiUrl}
                        onChange={e => handleSettingChange('customApiUrl', e.target.value)}
                        placeholder="https://api.example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customApiToken">API Token</Label>
                      <Input 
                        id="customApiToken"
                        type="password"
                        value={apiSettings.customApiToken}
                        onChange={e => handleSettingChange('customApiToken', e.target.value)}
                        placeholder="Enter your API token"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => testConnection('custom')}
                      disabled={testingConnection || !apiSettings.customApiToken || !apiSettings.customApiUrl}
                    >
                      {testingConnection ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Testing Connection...
                        </>
                      ) : "Test Connection"}
                    </Button>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="customApiDocumentation">Custom API Documentation</Label>
                  <Textarea
                    id="customApiDocumentation"
                    placeholder="Paste your API documentation or notes here..."
                    rows={5}
                  />
                </div>
                
                <Alert>
                  <AlertDescription className="flex items-start gap-2">
                    <Database className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Need help with custom integrations?</p>
                      <p className="text-sm mt-1">
                        Contact our support team for assistance with setting up 
                        custom API integrations for your specific needs.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
