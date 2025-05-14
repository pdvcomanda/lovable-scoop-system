
import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingCart, Printer, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

// Dados de exemplo
const categories = ["Açaí", "Sorvete", "Complementos", "Bebidas"];
const products = [
  { id: "1", name: "Açaí Tradicional", price: 10.00, category: "Açaí" },
  { id: "2", name: "Açaí com Banana", price: 12.00, category: "Açaí" },
  { id: "3", name: "Açaí com Granola", price: 14.00, category: "Açaí" },
  { id: "4", name: "Sorvete de Chocolate", price: 8.00, category: "Sorvete" },
  { id: "5", name: "Sorvete de Morango", price: 8.00, category: "Sorvete" },
  { id: "6", name: "Sorvete de Baunilha", price: 8.00, category: "Sorvete" },
  { id: "7", name: "Granola", price: 2.50, category: "Complementos" },
  { id: "8", name: "Banana", price: 1.50, category: "Complementos" },
  { id: "9", name: "Leite Condensado", price: 2.00, category: "Complementos" },
  { id: "10", name: "Água Mineral", price: 3.00, category: "Bebidas" },
  { id: "11", name: "Refrigerante", price: 5.00, category: "Bebidas" },
  { id: "12", name: "Suco Natural", price: 7.00, category: "Bebidas" },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
}

const POS = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [balance, setBalance] = useState(0);
  const [customerName, setCustomerName] = useState("");

  // Filtrar produtos por categoria e termo de busca
  const filteredProducts = products.filter(
    product => 
      product.category === activeCategory && 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adicionar item ao carrinho
  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, weight: 0.1 }]);
    }
  };

  // Atualizar quantidade de um item
  const updateQuantity = (id: string, amount: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    ));
  };

  // Atualizar peso de um item
  const updateWeight = (id: string, weight: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, weight: Math.max(0.1, parseFloat(weight.toFixed(3))) }
        : item
    ));
  };

  // Remover item do carrinho
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calcular valor total do carrinho
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity * item.weight, 0);
  };

  // Finalizar venda
  const processCheckout = () => {
    if (cart.length === 0) {
      toast.error("Adicione itens ao carrinho para finalizar a venda");
      return;
    }
    
    toast.success(`Venda finalizada com sucesso! Total: ${calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    setCart([]);
    setCustomerName("");
  };

  return (
    <MainLayout title="Ponto de Venda">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Produtos */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Buscar produtos..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          
          <Card>
            <CardHeader className="p-4">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4">
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-24 flex flex-col justify-center gap-2"
                    onClick={() => addToCart(product)}
                  >
                    <div className="font-semibold truncate w-full text-center">
                      {product.name}
                    </div>
                    <div>
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / kg
                    </div>
                  </Button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Nenhum produto encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Carrinho */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> 
                Carrinho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Nome do Cliente</Label>
                <Input 
                  id="customer" 
                  placeholder="Nome do cliente" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              {/* Itens do carrinho */}
              <div className="max-h-60 overflow-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    Carrinho vazio
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Peso(kg)</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="py-2">
                            <div className="font-medium">{item.name}</div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-1 text-red-600"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash className="h-3 w-3" />
                              <span className="ml-1 text-xs">Remover</span>
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={item.weight}
                              onChange={(e) => updateWeight(item.id, parseFloat(e.target.value) || 0.1)}
                              className="w-16 h-8 p-1 text-right ml-auto"
                              step="0.1"
                              min="0.1"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.price * item.weight).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              
              <Separator />
              
              {/* Balança simulada */}
              <div className="space-y-2">
                <Label htmlFor="balance">Balança (kg)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="balance" 
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                    step="0.001"
                    className="text-right"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (cart.length > 0) {
                        const lastItem = cart[cart.length - 1];
                        updateWeight(lastItem.id, balance);
                      }
                    }}
                  >
                    Usar
                  </Button>
                </div>
              </div>
              
              {/* Total e Checkout */}
              <div className="pt-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>
                    {calculateTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" onClick={() => setCart([])}>
                    Limpar
                  </Button>
                  <Button className="w-full" onClick={processCheckout}>
                    <Printer className="mr-2 h-4 w-4" />
                    Finalizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default POS;
