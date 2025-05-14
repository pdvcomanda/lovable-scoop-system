import { useState } from "react";
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
import { CreditCard, Wallet } from "lucide-react";
import { CurrencyCircleDollar } from "@/components/icons/CurrencyCircleDollar";

interface PaymentFormProps {
  total: number;
  onComplete: (paymentData: {
    method: string;
    amountPaid: number;
    change: number;
  }) => void;
}

export const PaymentForm = ({ total, onComplete }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [amountPaid, setAmountPaid] = useState(total);
  
  // Calcular troco
  const change = Math.max(0, amountPaid - total);
  
  const handleComplete = () => {
    onComplete({
      method: paymentMethod,
      amountPaid: paymentMethod === "dinheiro" ? amountPaid : total,
      change: paymentMethod === "dinheiro" ? change : 0
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="payment-method">Forma de Pagamento</Label>
        <Select 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
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
      
      <Button 
        onClick={handleComplete} 
        className="w-full mt-4"
        disabled={paymentMethod === "dinheiro" && amountPaid < total}
      >
        Confirmar Pagamento
      </Button>
    </div>
  );
};
