import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ReceiptText, 
  Scale,
  ShoppingCart 
} from 'lucide-react';

// Sample data
const categories = [
  { id: 1, name: 'Açaí', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 2, name: 'Sorvetes', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 3, name: 'Complementos', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 4, name: 'Bebidas', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 5, name: 'Combos', color: 'bg-pink-100 text-pink-800 border-pink-200' },
];

const products = [
  { id: 1, name: 'Açaí 300ml', price: 15.90, category: 1, image: '/placeholder.svg' },
  { id: 2, name: 'Açaí 500ml', price: 20.90, category: 1, image: '/placeholder.svg' },
  { id: 3, name: 'Sorvete 1 Bola', price: 8.00, category: 2, image: '/placeholder.svg' },
  { id: 4, name: 'Sorvete 2 Bolas', price: 12.00, category: 2, image: '/placeholder.svg' },
  { id: 5, name: 'Granola', price: 2.50, category: 3, image: '/placeholder.svg' },
  { id: 6, name: 'Leite Condensado', price: 3.00, category: 3, image: '/placeholder.svg' },
  { id: 7, name: 'Refrigerante Lata', price: 5.00, category: 4, image: '/placeholder.svg' },
  { id: 8, name: 'Água Mineral', price: 3.50, category: 4, image: '/placeholder.svg' },
  { id: 9, name: 'Combo Açaí + Refri', price: 19.90, category: 5, image: '/placeholder.svg' },
];

// Interface for the cart item
interface CartItem {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isWeighed?: boolean;
  weight?: number;
}

const POS = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saleMode, setSaleMode] = useState<'fixed' | 'weight'>('fixed');
  const [weightValue, setWeightValue] = useState<string>('');
  
  // Filter products by category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Add product to cart
  const addToCart = (product: typeof products[0]) => {
    setCart(currentCart => {
      // Check if product is already in cart
      const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCart = [...currentCart];
        const item = updatedCart[existingItemIndex];
        updatedCart[existingItemIndex] = {
          ...item,
          quantity: item.quantity + 1,
          total: (item.quantity + 1) * item.unitPrice
        };
        return updatedCart;
      } else {
        // Add new item
        return [...currentCart, {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.price,
          total: product.price,
          isWeighed: false
        }];
      }
    });
  };
  
  // Add weighed product to cart
  const addWeighedToCart = (product: typeof products[0], weight: number) => {
    if (weight <= 0) return;
    
    const pricePerKg = product.price; // Assuming price is per kg
    const totalPrice = pricePerKg * weight;
    
    setCart(currentCart => [
      ...currentCart, 
      {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: totalPrice,
        isWeighed: true,
        weight
      }
    ]);
    
    // Reset weight input
    setWeightValue('');
  };
  
  // Update item quantity
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart(currentCart => currentCart.filter(item => item.id !== itemId));
      return;
    }
    
    setCart(currentCart => 
      currentCart.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            total: item.unitPrice * newQuantity
          };
        }
        return item;
      })
    );
  };
  
  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== itemId));
  };
  
  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <MainLayout title="Ponto de Venda">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-7rem)]">
        {/* Product selection area */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <div className="mb-4 flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs value={saleMode} onValueChange={(v) => setSaleMode(v as 'fixed' | 'weight')} className="w-auto">
                <TabsList>
                  <TabsTrigger value="fixed">Preço Fixo</TabsTrigger>
                  <TabsTrigger value="weight">Por Peso</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex overflow-x-auto pb-2 gap-2">
              <Button 
                variant="outline" 
                className={`shrink-0 ${selectedCategory === null ? 'bg-muted' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </Button>
              
              {categories.map(category => (
                <Button 
                  key={category.id}
                  variant="outline"
                  className={`shrink-0 ${selectedCategory === category.id ? category.color : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Card className="flex-1 overflow-hidden">
            <div className="p-4 h-full">
              <TabsContent value="fixed" className="h-full mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto h-full pb-16">
                  {filteredProducts.map(product => (
                    <button 
                      key={product.id}
                      className="pos-button h-32"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex flex-col items-center">
                        <img src={product.image} alt={product.name} className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium line-clamp-2">{product.name}</span>
                        <span className="text-pos-primary font-bold">{formatCurrency(product.price)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="weight" className="h-full mt-0">
                <div className="flex flex-col h-full">
                  <div className="mb-4 p-4 bg-pos-light rounded-lg">
                    <div className="flex items-center gap-4">
                      <Scale className="text-pos-primary h-10 w-10" />
                      <div className="flex-1">
                        <label htmlFor="weight" className="text-sm text-gray-600 block mb-1">
                          Informe o peso (kg)
                        </label>
                        <Input 
                          id="weight" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="0.00" 
                          value={weightValue}
                          onChange={(e) => setWeightValue(e.target.value)}
                          className="text-lg" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto flex-1 pb-16">
                    {filteredProducts.map(product => (
                      <button 
                        key={product.id}
                        className="pos-button h-32"
                        onClick={() => addWeighedToCart(product, parseFloat(weightValue))}
                        disabled={!weightValue || parseFloat(weightValue) <= 0}
                      >
                        <div className="flex flex-col items-center">
                          <img src={product.image} alt={product.name} className="w-12 h-12 mb-2" />
                          <span className="text-sm font-medium line-clamp-2">{product.name}</span>
                          <span className="text-pos-primary font-bold">{formatCurrency(product.price)}/kg</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Card>
        </div>
        
        {/* Cart and payment area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <div className="p-4 bg-pos-light border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Carrinho</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Limpar
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="h-12 w-12 mb-3" />
                  <p>Seu carrinho está vazio</p>
                  <p className="text-sm">Adicione produtos para iniciar a venda</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.id} className="flex items-center">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-gray-600">
                          {item.isWeighed ? (
                            <>Peso: {item.weight?.toFixed(3)} kg x {formatCurrency(item.unitPrice)}/kg</>
                          ) : (
                            <>{formatCurrency(item.unitPrice)} cada</>
                          )}
                        </div>
                      </div>
                      
                      {!item.isWeighed && (
                        <div className="flex items-center space-x-2 mx-3">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      <div className="text-right min-w-[80px]">
                        <div className="font-medium">{formatCurrency(item.total)}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 p-0 text-red-600 hover:text-red-800"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="border-t p-4 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-pos-primary">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  disabled={cart.length === 0}
                  className="h-14 bg-pos-success hover:bg-green-700"
                >
                  <Banknote className="mr-2 h-5 w-5" />
                  Dinheiro
                </Button>
                <Button
                  disabled={cart.length === 0}
                  className="h-14 bg-pos-primary hover:bg-pos-dark"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Cartão
                </Button>
                <Button
                  disabled={cart.length === 0}
                  className="h-14 bg-pos-secondary hover:bg-pos-dark"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  PIX
                </Button>
                <Button
                  disabled={cart.length === 0}
                  variant="outline"
                  className="h-14"
                >
                  <ReceiptText className="mr-2 h-5 w-5" />
                  Imprimir
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default POS;
