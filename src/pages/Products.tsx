
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Plus,
  Filter, 
  MoreVertical, 
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

// Sample product data
const productData = [
  { id: 1, code: 'A001', name: 'Açaí 300ml', category: 'Açaí', price: 15.90, stock: 100, unit: 'un', type: 'Produto Acabado' },
  { id: 2, code: 'A002', name: 'Açaí 500ml', category: 'Açaí', price: 20.90, stock: 75, unit: 'un', type: 'Produto Acabado' },
  { id: 3, code: 'A003', name: 'Açaí Puro', category: 'Insumos', price: 48.00, stock: 12.5, unit: 'kg', type: 'Insumo' },
  { id: 4, code: 'S001', name: 'Sorvete 1 Bola', category: 'Sorvetes', price: 8.00, stock: 150, unit: 'un', type: 'Produto Acabado' },
  { id: 5, code: 'S002', name: 'Sorvete 2 Bolas', category: 'Sorvetes', price: 12.00, stock: 120, unit: 'un', type: 'Produto Acabado' },
  { id: 6, code: 'C001', name: 'Granola', category: 'Complementos', price: 22.50, stock: 5.2, unit: 'kg', type: 'Insumo' },
  { id: 7, code: 'C002', name: 'Leite Condensado', category: 'Complementos', price: 8.90, stock: 24, unit: 'un', type: 'Insumo' },
  { id: 8, code: 'B001', name: 'Refrigerante Lata', category: 'Bebidas', price: 5.00, stock: 48, unit: 'un', type: 'Revenda' },
  { id: 9, code: 'B002', name: 'Água Mineral', category: 'Bebidas', price: 3.50, stock: 60, unit: 'un', type: 'Revenda' },
];

type ProductType = typeof productData[0];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Filter products based on search term and filters
  const filteredProducts = productData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesType = typeFilter ? product.type === typeFilter : true;
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  // Get unique categories and types for filters
  const categories = Array.from(new Set(productData.map(p => p.category)));
  const types = Array.from(new Set(productData.map(p => p.type)));
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getStockDisplay = (product: ProductType) => {
    return `${product.stock} ${product.unit}`;
  };
  
  const getStockStatusColor = (product: ProductType) => {
    // Simple logic for demonstration purposes
    if (product.stock <= 5 && product.unit === 'kg') return 'bg-red-100 text-red-800 border-red-200';
    if (product.stock <= 10 && product.unit === 'un') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <MainLayout title="Produtos">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Categoria</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                Todas
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Tipo</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                Todos
              </DropdownMenuItem>
              {types.map((type) => (
                <DropdownMenuItem key={type} onClick={() => setTypeFilter(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(categoryFilter || typeFilter) && (
            <div className="flex items-center gap-2">
              {categoryFilter && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  Categoria: {categoryFilter}
                  <button 
                    className="ml-1 text-gray-400 hover:text-gray-600" 
                    onClick={() => setCategoryFilter(null)}
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {typeFilter && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  Tipo: {typeFilter}
                  <button 
                    className="ml-1 text-gray-400 hover:text-gray-600" 
                    onClick={() => setTypeFilter(null)}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={getStockStatusColor(product)}>
                    {getStockDisplay(product)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </MainLayout>
  );
};

export default Products;
