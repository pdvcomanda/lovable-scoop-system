
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Loader2 } from "lucide-react";
import { CurrencyCircleDollar } from "@/components/icons/CurrencyCircleDollar";
import { PaymentGateway, paymentGatewayService } from "@/services/paymentGatewayService";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentFormProps {
  total: number;
  onComplete: (paymentData: {
    method: string;
    amountPaid: number;
    change: number;
    transactionId?: string;
    gateway?: PaymentGateway;
  }) => void;
}

export const PaymentForm = ({ total, onComplete }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [amountPaid, setAmountPaid] = useState(total);
  const [installments, setInstallments] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("stone");
  const [availableGateways, setAvailableGateways] = useState<{id: PaymentGateway, name: string}[]>([]);
  
  // Carregar gateways disponíveis
  useEffect(() => {
    // Em produção, esses gateways viriam de uma configuração salva
    const gateways = [
      { id: 'stone' as PaymentGateway, name: 'Stone' },
      { id: 'getnet' as PaymentGateway, name: 'Getnet (Santander)' },
      { id: 'cielo' as PaymentGateway, name: 'Cielo' },
      { id: 'mercadopago' as PaymentGateway, name: 'Mercado Pago' },
      { id: 'pagseguro' as PaymentGateway, name: 'PagSeguro' },
    ];
    
    setAvailableGateways(gateways);
    
    // Selecionar o primeiro gateway disponível
    if (gateways.length > 0) {
      setSelectedGateway(gateways[0].id);
    }
  }, []);
  
  // Calcular troco
  const change = Math.max(0, amountPaid - total);
  
  const handleComplete = async () => {
    if (paymentMethod === "dinheiro" && amountPaid < total) {
      toast.error("O valor pago precisa ser maior ou igual ao total");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (paymentMethod === "dinheiro") {
        // Pagamento em dinheiro é processado localmente
        onComplete({
          method: paymentMethod,
          amountPaid: amountPaid,
          change: change
        });
      } else {
        // Para cartão ou PIX, integrar com gateway
        const gateway = paymentMethod === "pix" ? "pix" as PaymentGateway : selectedGateway;
        
        // Processar pagamento via gateway
        const result = await paymentGatewayService.processPayment({
          amount: total,
          orderId: `ORDER-${Date.now()}`,
          description: "Compra na loja",
          installments: paymentMethod === "cartao_credito" ? installments : 1,
          gateway: gateway
        });
        
        if (result.success) {
          toast.success("Pagamento processado com sucesso!");
          
          onComplete({
            method: paymentMethod,
            amountPaid: total,
            change: 0,
            transactionId: result.transactionId,
            gateway: gateway
          });
        } else {
          toast.error(`Falha no pagamento: ${result.errorMessage || 'Erro desconhecido'}`);
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error("Ocorreu um erro ao processar o pagamento");
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="payment-method">Forma de Pagamento</Label>
        <Select 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
          disabled={isProcessing}
        >
          <SelectTrigger id="payment-method" className="w-full">
            <SelectValue placeholder="Selecione o método de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dinheiro">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Dinheiro
              </div>
            </SelectItem>
            <SelectItem value="cartao_credito">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Cartão de Crédito
              </div>
            </SelectItem>
            <SelectItem value="cartao_debito">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Cartão de Débito
              </div>
            </SelectItem>
            <SelectItem value="pix">
              <div className="flex items-center gap-2">
                <CurrencyCircleDollar className="h-4 w-4" />
                PIX
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {paymentMethod === "dinheiro" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount-paid">Valor Recebido</Label>
            <Input
              id="amount-paid"
              type="number"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
              className="text-right"
              disabled={isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="change">Troco</Label>
            <Input
              id="change"
              type="text"
              value={change.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              readOnly
              className="text-right bg-muted"
            />
          </div>
        </div>
      )}
      
      {(paymentMethod === "cartao_credito" || paymentMethod === "cartao_debito") && (
        <div className="space-y-4 border rounded-md p-3">
          <div className="space-y-2">
            <Label>Operadora de Cartão</Label>
            <Select 
              value={selectedGateway} 
              onValueChange={(value) => setSelectedGateway(value as PaymentGateway)}
              disabled={isProcessing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a operadora" />
              </SelectTrigger>
              <SelectContent>
                {availableGateways.map((gateway) => (
                  <SelectItem key={gateway.id} value={gateway.id}>
                    {gateway.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {paymentMethod === "cartao_credito" && (
            <div className="space-y-2">
              <Label htmlFor="installments">Parcelas</Label>
              <Select 
                value={installments.toString()} 
                onValueChange={(value) => setInstallments(parseInt(value))}
                disabled={isProcessing}
              >
                <SelectTrigger id="installments">
                  <SelectValue placeholder="Selecione as parcelas" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x {num === 1 ? 'à vista' : `de ${(total / num).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
      
      {paymentMethod === "pix" && (
        <div className="border rounded-md p-3 flex items-center justify-center">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 p-4 mb-3 inline-block">
              <CurrencyCircleDollar className="h-24 w-24 mx-auto text-gray-400" />
            </div>
            <p className="text-sm">QR Code PIX será gerado ao confirmar o pagamento</p>
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleComplete} 
        className="w-full mt-4"
        disabled={isProcessing || (paymentMethod === "dinheiro" && amountPaid < total)}
      >
        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isProcessing ? "Processando..." : "Confirmar Pagamento"}
      </Button>
    </div>
  );
};
