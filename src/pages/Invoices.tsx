
import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay, parseISO, startOfDay, endOfDay, subDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, FileText, Eye, Search, Receipt } from "lucide-react";
import { Receipt as ReceiptComponent, ReceiptProps } from '@/components/ui/receipt';
import { type DateRange } from "react-day-picker";

// Interface para compras de fornecedores
interface Purchase {
  id: string;
  supplier: string;
  date: string;
  total: number;
  invoiceNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  paid: boolean;
}

// Interface para vendas realizadas
interface Sale {
  id: string;
  customer: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    weight?: number;
  }[];
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  orderNumber: string;
}

// Dados de exemplo para compras
const dummyPurchases: Purchase[] = [
  {
    id: "p1",
    supplier: "Açaí Distribuidora",
    date: "2025-05-10T14:30:00",
    total: 1500.00,
    invoiceNumber: "NF-45678",
    items: [
      { name: "Açaí Grosso (10kg)", quantity: 5, price: 200 },
      { name: "Açaí Médio (10kg)", quantity: 3, price: 150 }
    ],
    paid: true
  },
  {
    id: "p2",
    supplier: "Distribuidora de Frutas",
    date: "2025-05-08T10:15:00",
    total: 800.00,
    invoiceNumber: "NF-12345",
    items: [
      { name: "Banana (caixa)", quantity: 4, price: 100 },
      { name: "Morango (caixa)", quantity: 5, price: 80 }
    ],
    paid: true
  },
  {
    id: "p3",
    supplier: "Insumos Gelados S.A.",
    date: "2025-05-05T09:45:00",
    total: 2300.00,
    invoiceNumber: "NF-98765",
    items: [
      { name: "Sorvete Base Chocolate (5L)", quantity: 10, price: 150 },
      { name: "Sorvete Base Morango (5L)", quantity: 8, price: 125 }
    ],
    paid: false
  }
];

// Dados de exemplo para vendas
const dummySales: Sale[] = [
  {
    id: "s1",
    customer: "Maria Silva",
    date: "2025-05-14T15:30:00",
    items: [
      { name: "Açaí Tradicional", quantity: 1, price: 10.00, weight: 0.5 },
      { name: "Complementos", quantity: 2, price: 2.50 }
    ],
    total: 10.00,
    paymentMethod: "Dinheiro",
    amountPaid: 20.00,
    change: 10.00,
    orderNumber: "V00123"
  },
  {
    id: "s2",
    customer: "João Costa",
    date: "2025-05-14T14:15:00",
    items: [
      { name: "Sorvete de Chocolate", quantity: 2, price: 8.00, weight: 0.3 },
      { name: "Complementos", quantity: 1, price: 2.50 }
    ],
    total: 7.30,
    paymentMethod: "Cartão de Crédito",
    amountPaid: 7.30,
    change: 0,
    orderNumber: "V00122"
  },
  {
    id: "s3",
    customer: "Ana Pereira",
    date: "2025-05-13T16:45:00",
    items: [
      { name: "Açaí com Banana", quantity: 1, price: 12.00, weight: 0.4 },
      { name: "Sorvete de Morango", quantity: 1, price: 8.00, weight: 0.3 }
    ],
    total: 7.20,
    paymentMethod: "PIX",
    amountPaid: 7.20,
    change: 0,
    orderNumber: "V00121"
  },
  {
    id: "s4",
    customer: "Carlos Souza",
    date: "2025-05-12T11:20:00",
    items: [
      { name: "Açaí Tradicional", quantity: 3, price: 10.00, weight: 0.3 }
    ],
    total: 9.00,
    paymentMethod: "Dinheiro",
    amountPaid: 10.00,
    change: 1.00,
    orderNumber: "V00120"
  },
];

// Componente principal
const Invoices = () => {
  const [purchaseTab, setPurchaseTab] = useState("purchases");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showSaleReceipt, setShowSaleReceipt] = useState(false);
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);

  // Filtrar compras por data e termo de busca
  const filteredPurchases = dummyPurchases.filter(purchase => {
    const purchaseDate = parseISO(purchase.date);
    const dateMatches = !date?.from || !date?.to || (
      purchaseDate >= startOfDay(date.from) &&
      purchaseDate <= endOfDay(date.to || date.from)
    );
    
    const searchMatches = 
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return dateMatches && searchMatches;
  });
  
  // Filtrar vendas por data e termo de busca
  const filteredSales = dummySales.filter(sale => {
    const saleDate = parseISO(sale.date);
    const dateMatches = !date?.from || !date?.to || (
      saleDate >= startOfDay(date.from) &&
      saleDate <= endOfDay(date.to || date.from)
    );
    
    const searchMatches = 
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return dateMatches && searchMatches;
  });

  // Exibir recibo de venda
  const showSaleDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowSaleReceipt(true);
  };
  
  // Exibir detalhes da compra
  const showPurchaseDetail = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setShowPurchaseDetails(true);
  };
  
  // Formatar dados do recibo
  const formatReceiptData = (sale: Sale): ReceiptProps => {
    return {
      storeName: "Açaí e Sorvetes Delícia",
      storeAddress: "Rua dos Açaís, 123 - Jardim Tropical",
      items: sale.items,
      date: parseISO(sale.date),
      total: sale.total,
      customerName: sale.customer,
      paymentMethod: sale.paymentMethod,
      amountPaid: sale.amountPaid,
      change: sale.change,
      orderNumber: sale.orderNumber
    };
  };

  return (
    <MainLayout title={purchaseTab === "purchases" ? "Compras" : "Vendas"}>
      <Tabs value={purchaseTab} onValueChange={setPurchaseTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Compras
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Vendas
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={purchaseTab === "purchases" ? "Buscar compras..." : "Buscar vendas..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[240px]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            
            {purchaseTab === "purchases" && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Compra
              </Button>
            )}
          </div>
        </div>
        
        <TabsContent value="purchases" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Notas de Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº da Nota</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.invoiceNumber}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>
                        {format(parseISO(purchase.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        {purchase.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          purchase.paid 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        )}>
                          {purchase.paid ? "Pago" : "Pendente"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => showPurchaseDetail(purchase)}>
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPurchases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma compra encontrada no período selecionado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Vendas Realizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.orderNumber}</TableCell>
                      <TableCell>{sale.customer || "Cliente não identificado"}</TableCell>
                      <TableCell>
                        {format(parseISO(sale.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => showSaleDetails(sale)}>
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma venda encontrada no período selecionado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para exibir detalhes da compra */}
      <Dialog open={showPurchaseDetails} onOpenChange={setShowPurchaseDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Compra</DialogTitle>
          </DialogHeader>
          
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fornecedor</p>
                  <p>{selectedPurchase.supplier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nº da Nota</p>
                  <p>{selectedPurchase.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p>{format(parseISO(selectedPurchase.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    selectedPurchase.paid 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  )}>
                    {selectedPurchase.paid ? "Pago" : "Pendente"}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Itens</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPurchase.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.quantity * item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Total:</span>
                <span className="font-bold">
                  {selectedPurchase.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPurchaseDetails(false)}>
                  Fechar
                </Button>
                <Button>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para exibir recibo de venda */}
      <Dialog open={showSaleReceipt} onOpenChange={setShowSaleReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recibo de Venda</DialogTitle>
          </DialogHeader>
          
          {selectedSale && (
            <div className="max-h-[70vh] overflow-auto">
              <ReceiptComponent {...formatReceiptData(selectedSale)} />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowSaleReceipt(false)}>
                  Fechar
                </Button>
                <Button>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Invoices;
