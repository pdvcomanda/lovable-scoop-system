
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/sonner';
import { CurrencyCircleDollar } from '@/components/icons/CurrencyCircleDollar';
import { Icons } from '@/components/icons';
import { Plus, Minus, Trash2, Receipt, CreditCard, Banknote } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Açaí 300ml', price: 14.90, category: 'açaí' },
  { id: '2', name: 'Açaí 500ml', price: 19.90, category: 'açaí' },
  { id: '3', name: 'Açaí 700ml', price: 24.90, category: 'açaí' },
  { id: '4', name: 'Sorvete de Chocolate', price: 12.90, category: 'sorvete' },
  { id: '5', name: 'Sorvete de Morango', price: 12.90, category: 'sorvete' },
  { id: '6', name: 'Sorvete de Baunilha', price: 12.90, category: 'sorvete' },
  { id: '7', name: 'Milkshake de Chocolate', price: 16.90, category: 'milkshake' },
  { id: '8', name: 'Milkshake de Morango', price: 16.90, category: 'milkshake' },
  { id: '9', name: 'Milkshake de Baunilha', price: 16.90, category: 'milkshake' },
  { id: '10', name: 'Água Mineral', price: 4.50, category: 'bebidas' },
  { id: '11', name: 'Refrigerante Lata', price: 6.00, category: 'bebidas' },
  { id: '12', name: 'Suco Natural', price: 8.90, category: 'bebidas' },
];

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('açaí');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories = ['açaí', 'sorvete', 'milkshake', 'bebidas'];
  
  const filteredProducts = searchTerm
    ? mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : mockProducts.filter(p => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1,
        };
        return newCart;
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    toast.success(`${product.name} adicionado ao pedido`);
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    setCart(prev => {
      const newCart = [...prev];
      newCart[index] = { ...newCart[index], quantity };
      return newCart;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = async (paymentMethod: string) => {
    setIsLoading(true);
    
    try {
      // Simulando processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Limpar carrinho após pagamento bem-sucedido
      setCart([]);
      setIsCheckoutOpen(false);
      toast.success(`Pagamento de R$ ${calculateTotal().toFixed(2)} concluído via ${paymentMethod}!`);
    } catch (error) {
      toast.error('Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Ponto de Venda">
      <div className="flex h-full gap-4 flex-col lg:flex-row">
        {/* Painel Esquerdo - Produtos */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="mb-4">
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            
            {!searchTerm && (
              <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="w-full grid grid-cols-4">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => addToCart(product)}
              >
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="font-bold text-lg">R$ {product.price.toFixed(2)}</p>
                  <Badge variant="secondary" className="mt-1 capitalize">{product.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Painel Direito - Carrinho */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <Card className="w-full h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Pedido Atual</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <CurrencyCircleDollar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">Carrinho Vazio</h3>
                  <p className="text-muted-foreground mt-2">
                    Adicione produtos ao carrinho para iniciar um pedido.
                  </p>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 px-3">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b">
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              updateItemQuantity(index, item.quantity - 1); 
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              updateItemQuantity(index, item.quantity + 1); 
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-red-500 hover:text-red-600"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              removeFromCart(index); 
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-xl">
                        R$ {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-2" 
                      size="lg"
                      disabled={cart.length === 0}
                      onClick={() => setIsCheckoutOpen(true)}
                    >
                      Finalizar Pedido
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modal de Pagamento */}
      <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Finalizar Pedido</SheetTitle>
            <SheetDescription>
              Total: <span className="font-bold">R$ {calculateTotal().toFixed(2)}</span>
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Escolha a forma de pagamento</h3>
            
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-auto py-6 text-left"
                disabled={isLoading}
                onClick={() => handleCheckout('Cartão de Crédito/Débito')}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-semibold">Cartão de Crédito/Débito</p>
                  <p className="text-sm text-muted-foreground">Pagamento via máquina de cartão</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-6 text-left"
                disabled={isLoading}
                onClick={() => handleCheckout('Dinheiro')}
              >
                <Banknote className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-semibold">Dinheiro</p>
                  <p className="text-sm text-muted-foreground">Pagamento em espécie</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-6 text-left"
                disabled={isLoading}
                onClick={() => handleCheckout('Pix')}
              >
                <Receipt className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-semibold">Pix</p>
                  <p className="text-sm text-muted-foreground">Pagamento via transferência Pix</p>
                </div>
              </Button>
            </div>
            
            {isLoading && (
              <div className="flex justify-center my-4">
                <Icons.spinner className="h-8 w-8 animate-spin" />
              </div>
            )}
            
            <Button 
              variant="ghost"
              className="w-full" 
              onClick={() => setIsCheckoutOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
};

export default POS;
