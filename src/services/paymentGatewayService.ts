
import { toast } from '@/components/ui/sonner';

export type PaymentGateway = 'stone' | 'getnet' | 'cielo' | 'pagseguro' | 'mercadopago' | 'pix' | 'dinheiro' | 'credito' | 'debito';

export interface PaymentParams {
  amount: number;
  orderId: string;
  description?: string;
  installments?: number;
  gateway: PaymentGateway;
  customerName?: string;
  customerDocument?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  receiptUrl?: string;
  errorMessage?: string;
  gatewayResponse?: any;
}

class PaymentGatewayService {
  private apiKeys: Record<PaymentGateway, string> = {
    stone: '',
    getnet: '',
    cielo: '',
    pagseguro: '',
    mercadopago: '',
    pix: '',
    dinheiro: '',
    credito: '',
    debito: ''
  };
  
  // Método para configurar as chaves de API
  setApiKey(gateway: PaymentGateway, key: string): void {
    this.apiKeys[gateway] = key;
    localStorage.setItem('payment_gateways', JSON.stringify(this.apiKeys));
  }
  
  // Carregar configurações salvas
  loadSavedApiKeys(): void {
    try {
      const saved = localStorage.getItem('payment_gateways');
      if (saved) {
        this.apiKeys = { ...this.apiKeys, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Erro ao carregar chaves de API:', error);
    }
  }
  
  constructor() {
    this.loadSavedApiKeys();
  }
  
  // Método para iniciar um pagamento com o gateway escolhido
  async processPayment(params: PaymentParams): Promise<PaymentResponse> {
    const { gateway, amount } = params;
    
    console.log(`Iniciando pagamento via ${gateway}. Valor: ${amount}`);
    
    // Para gateways offline (dinheiro)
    if (gateway === 'dinheiro') {
      return {
        success: true,
        transactionId: `CASH-${Date.now()}`,
        gatewayResponse: { paymentType: 'cash' }
      };
    }
    
    // Integração com gateway específico
    try {
      switch (gateway) {
        case 'stone':
          return await this.processStonePayment(params);
        case 'getnet':
          return await this.processGetnetPayment(params);
        case 'pix':
          return await this.processPixPayment(params);
        default:
          return await this.processGenericPayment(params);
      }
    } catch (error: any) {
      console.error(`Erro ao processar pagamento via ${gateway}:`, error);
      return {
        success: false,
        errorMessage: error.message || `Falha no processamento via ${gateway}`,
      };
    }
  }
  
  // Integração com Stone
  private async processStonePayment(params: PaymentParams): Promise<PaymentResponse> {
    // Simulação de integração com API da Stone
    // Em produção, usaria a SDK da Stone ou API REST
    
    console.log('Processando pagamento via Stone:', params);
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulação de resposta bem-sucedida
    return {
      success: true,
      transactionId: `STONE-${Date.now()}`,
      receiptUrl: 'https://api.stone.com.br/receipts/sample',
      gatewayResponse: {
        authorizationCode: '123456',
        nsu: '987654321',
        acquirer: 'Stone',
        installments: params.installments || 1
      }
    };
  }
  
  // Integração com Getnet (Santander)
  private async processGetnetPayment(params: PaymentParams): Promise<PaymentResponse> {
    // Simulação de integração com API da Getnet
    console.log('Processando pagamento via Getnet:', params);
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Simulação de resposta bem-sucedida
    return {
      success: true,
      transactionId: `GETNET-${Date.now()}`,
      receiptUrl: 'https://api.getnet.com.br/receipts/sample',
      gatewayResponse: {
        authorizationCode: 'GETNET123',
        nsu: '123456789',
        acquirer: 'Getnet',
        installments: params.installments || 1
      }
    };
  }
  
  // Processamento de PIX
  private async processPixPayment(params: PaymentParams): Promise<PaymentResponse> {
    console.log('Gerando QR Code PIX:', params);
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulação de resposta com QR Code
    return {
      success: true,
      transactionId: `PIX-${Date.now()}`,
      receiptUrl: 'https://api.example.com/pix/qrcode',
      gatewayResponse: {
        pixKey: 'pixkey@example.com',
        qrCodeUrl: 'https://api.example.com/pix/qrcode',
        expiresAt: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutos
      }
    };
  }
  
  // Método genérico para outros gateways
  private async processGenericPayment(params: PaymentParams): Promise<PaymentResponse> {
    console.log(`Processando pagamento via ${params.gateway}:`, params);
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulação de resposta bem-sucedida
    return {
      success: true,
      transactionId: `${params.gateway.toUpperCase()}-${Date.now()}`,
      gatewayResponse: {
        authorizationCode: '123456',
        acquirer: params.gateway
      }
    };
  }
  
  // Teste de conexão com gateway
  async testConnection(gateway: PaymentGateway): Promise<boolean> {
    console.log(`Testando conexão com gateway ${gateway}`);
    
    // Simulação de teste
    try {
      // Simular tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 90% de chance de sucesso no teste
      const success = Math.random() < 0.9;
      
      if (success) {
        toast.success(`Conexão com ${gateway} bem-sucedida!`);
      } else {
        toast.error(`Falha na conexão com ${gateway}`);
      }
      
      return success;
    } catch (error) {
      toast.error(`Erro ao testar conexão com ${gateway}`);
      return false;
    }
  }
  
  // Obter gateways configurados
  getConfiguredGateways(): PaymentGateway[] {
    return Object.entries(this.apiKeys)
      .filter(([_, value]) => value !== '')
      .map(([key]) => key as PaymentGateway);
  }
}

// Singleton para uso em toda a aplicação
export const paymentGatewayService = new PaymentGatewayService();
