
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { forwardRef } from "react";

export interface ReceiptProps {
  storeName: string;
  storeAddress?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    weight?: number;
  }[];
  date: Date;
  total: number;
  customerName?: string;
  paymentMethod?: string;
  amountPaid?: number;
  change?: number;
  orderNumber?: string;
  printable?: boolean;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ 
    storeName, 
    storeAddress, 
    items, 
    date, 
    total, 
    customerName, 
    paymentMethod,
    amountPaid,
    change,
    orderNumber = "0001",
    printable = false
  }, ref) => {
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    const formatCurrency = (value: number) => {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
      <div 
        ref={ref}
        className={`bg-white p-4 max-w-md mx-auto ${printable ? 'print:w-80 print:mx-0 print:p-0' : 'border border-gray-200 rounded-md shadow-sm'}`}
        style={{ fontFamily: printable ? 'monospace' : 'inherit' }}
      >
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg">{storeName}</h2>
          {storeAddress && <p className="text-sm text-gray-600">{storeAddress}</p>}
          <p className="text-sm mt-1">CUPOM NÃO FISCAL</p>
          <p className="text-sm">PEDIDO #{orderNumber}</p>
          <p className="text-sm">{formattedDate}</p>
        </div>

        <div className="border-t border-b border-dashed border-gray-300 py-2 my-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>Item</span>
            <div className="flex">
              <span className="w-16 text-right">Qtd</span>
              <span className="w-20 text-right">Valor</span>
              <span className="w-24 text-right">Total</span>
            </div>
          </div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm py-1">
            <span className="flex-1">{item.name}</span>
            <div className="flex">
              <span className="w-16 text-right">
                {item.quantity}
                {item.weight && item.weight > 0 ? ` x ${item.weight.toFixed(3)}kg` : ''}
              </span>
              <span className="w-20 text-right">{formatCurrency(item.price)}</span>
              <span className="w-24 text-right">
                {formatCurrency(item.price * item.quantity * (item.weight || 1))}
              </span>
            </div>
          </div>
        ))}

        <div className="border-t border-dashed border-gray-300 pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          {customerName && (
            <div className="text-sm mt-2">
              <span>Cliente: {customerName}</span>
            </div>
          )}

          {paymentMethod && (
            <div className="text-sm mt-2">
              <div className="flex justify-between">
                <span>Forma de Pagamento:</span>
                <span>{paymentMethod}</span>
              </div>
              
              {amountPaid !== undefined && (
                <div className="flex justify-between">
                  <span>Valor Recebido:</span>
                  <span>{formatCurrency(amountPaid)}</span>
                </div>
              )}
              
              {change !== undefined && (
                <div className="flex justify-between">
                  <span>Troco:</span>
                  <span>{formatCurrency(change)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-4 text-sm">
          <p>Agradecemos a preferência!</p>
          <p className="text-xs mt-1">www.acaidelicia.com.br</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = "Receipt";
