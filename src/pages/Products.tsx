
import { useState, useEffect, useRef } from 'react';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Package, Plus, Edit, Trash, AlertTriangle, ArrowUpDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define product type
interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  category?: string;
  minStock?: number;
}

// Dados de exemplo
const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Açaí Tradicional",
    price: 10.00,
    unit: "kg",
    stock: 50,
    category: "Açaí",
    minStock: 10
  },
  {
    id: "2",
    name: "Açaí com Banana",
    price: 12.00,
    unit: "kg",
    stock: 45,
    category: "Açaí",
    minStock: 10
  },
  {
    id: "3",
    name: "Açaí com Granola",
    price: 14.00,
    unit: "kg",
    stock: 30,
    category: "Açaí",
    minStock: 8
  },
  {
    id: "4",
    name: "Sorvete de Chocolate",
    price: 8.00,
    unit: "kg",
    stock: 20,
    category: "Sorvete",
    minStock: 5
  },
  {
    id: "5",
    name: "Sorvete de Morango",
    price: 8.00,
    unit: "kg",
    stock: 25,
    category: "Sorvete",
    minStock: 5
  },
];

// Categories 
const categories = ["Açaí", "Sorvete", "Complementos", "Bebidas"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  price: z.coerce.number().positive({
    message: "O preço deve ser um número positivo.",
  }),
  unit: z.string().min(1, {
    message: "A unidade é obrigatória.",
  }),
  stock: z.coerce.number().nonnegative({
    message: "O estoque não pode ser negativo.",
  }),
  category: z.string().min(1, {
    message: "A categoria é obrigatória.",
  }),
  minStock: z.coerce.number().nonnegative({
    message: "O estoque mínimo não pode ser negativo.",
  }).optional(),
});

// Formulário para ajuste de estoque
const stockFormSchema = z.object({
  quantity: z.coerce.number().int({
    message: "A quantidade deve ser um número inteiro.",
  }),
  type: z.enum(["add", "remove"]),
  reason: z.string().min(1, {
    message: "O motivo do ajuste é obrigatório.",
  }),
});

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [open, setOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const addDialogRef = useRef<boolean>(false);
  
  // Handle navigation state
  useEffect(() => {
    if (location.state?.openAddDialog && !addDialogRef.current) {
      setOpen(true);
      addDialogRef.current = true;
    }
    
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      unit: "kg",
      stock: 0,
      category: "Açaí",
      minStock: 0,
    },
  });
  
  const stockForm = useForm<z.infer<typeof stockFormSchema>>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      quantity: 0,
      type: "add",
      reason: "",
    },
  });

  // Resetar o formulário quando mudar editando/criando
  useEffect(() => {
    if (isEditing && selectedProduct) {
      form.reset({
        name: selectedProduct.name,
        price: selectedProduct.price,
        unit: selectedProduct.unit,
        stock: selectedProduct.stock,
        category: selectedProduct.category || "Açaí",
        minStock: selectedProduct.minStock || 0,
      });
    } else if (!isEditing) {
      form.reset({
        name: "",
        price: 0,
        unit: "kg",
        stock: 0,
        category: "Açaí",
        minStock: 0,
      });
    }
  }, [isEditing, selectedProduct, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && selectedProduct) {
      // Atualizar produto existente
      setProducts(products.map(product => 
        product.id === selectedProduct.id ? 
          { ...product, ...values } : 
          product
      ));
      toast.success("Produto atualizado com sucesso!");
    } else {
      // Criar novo produto
      const newProduct: Product = {
        id: Date.now().toString(),
        name: values.name,
        price: values.price,
        unit: values.unit,
        stock: values.stock,
        category: values.category,
        minStock: values.minStock,
      };
      setProducts([...products, newProduct]);
      toast.success("Produto adicionado com sucesso!");
    }
    setOpen(false);
    form.reset();
    setIsEditing(false);
    setSelectedProduct(null);
  };
  
  const onStockSubmit = (values: z.infer<typeof stockFormSchema>) => {
    if (!selectedProduct) return;
    
    const newStock = values.type === "add" 
      ? selectedProduct.stock + values.quantity
      : Math.max(0, selectedProduct.stock - values.quantity);
    
    setProducts(products.map(product => 
      product.id === selectedProduct.id ? 
        { ...product, stock: newStock } : 
        product
    ));
    
    toast.success(`Estoque ${values.type === "add" ? "adicionado" : "removido"} com sucesso!`);
    setStockDialogOpen(false);
    stockForm.reset();
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Produto excluído com sucesso!");
  };
  
  const handleStockAdjustment = (product: Product) => {
    setSelectedProduct(product);
    setStockDialogOpen(true);
  };
  
  // Ordenação de produtos
  const toggleSort = (field: keyof Product) => {
    setSortField(field);
    setSortDirection(currentDirection => 
      field === sortField && currentDirection === "asc" ? "desc" : "asc"
    );
  };
  
  const sortedProducts = [...products].sort((a, b) => {
    if (sortField === "name" || sortField === "unit" || sortField === "category") {
      const aValue = String(a[sortField] || "");
      const bValue = String(b[sortField] || "");
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      const aValue = Number(a[sortField] || 0);
      const bValue = Number(b[sortField] || 0);
      return sortDirection === "asc" 
        ? aValue - bValue
        : bValue - aValue;
    }
  });

  const filteredProducts = sortedProducts.filter(
    product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Produtos com estoque baixo
  const lowStockProducts = products.filter(
    product => product.stock < (product.minStock || 0)
  );

  // Componente para cabeçalho ordenável
  const SortableHeader = ({ field, label }: { field: keyof Product, label: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => toggleSort(field)}
    >
      <div className="flex items-center">
        {label}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <MainLayout title="Produtos">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Gerenciar Estoque
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Estoque Baixo ({lowStockProducts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
                    <DialogDescription>
                      {isEditing 
                        ? "Atualize os dados do produto." 
                        : "Preencha os dados do novo produto."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do produto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preço</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidade</FormLabel>
                              <FormControl>
                                <Input placeholder="kg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estoque</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="minStock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estoque Mínimo</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit">{isEditing ? "Atualizar" : "Salvar"}</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader field="name" label="Nome" />
                      <SortableHeader field="category" label="Categoria" />
                      <TableHead className="text-right">Preço</TableHead>
                      <SortableHeader field="unit" label="Unidade" />
                      <SortableHeader field="stock" label="Estoque" />
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">
                          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell className={
                          cn(
                            product.minStock && product.stock < product.minStock ? "text-red-600 font-medium" : ""
                          )
                        }>
                          {product.stock}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(product.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Buscar produtos para ajustar estoque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead className="text-right">Estoque Mínimo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className={
                        cn(
                          "text-right",
                          product.minStock && product.stock < product.minStock ? "text-red-600 font-medium" : ""
                        )
                      }>
                        {product.stock}
                      </TableCell>
                      <TableCell className="text-right">{product.minStock || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleStockAdjustment(product)}>
                          Ajustar Estoque
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajuste de Estoque</DialogTitle>
                    <DialogDescription>
                      {selectedProduct ? `Produto: ${selectedProduct.name}` : ''}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...stockForm}>
                    <form onSubmit={stockForm.handleSubmit(onStockSubmit)} className="space-y-4">
                      <FormField
                        control={stockForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Ajuste</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de ajuste" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="add">Entrada de Estoque</SelectItem>
                                <SelectItem value="remove">Saída de Estoque</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={stockForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={stockForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Confirmar Ajuste</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Estoque Atual</TableHead>
                      <TableHead className="text-right">Estoque Mínimo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right text-red-600 font-medium">{product.stock}</TableCell>
                        <TableCell className="text-right">{product.minStock}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleStockAdjustment(product)}>
                            Ajustar Estoque
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Não há produtos com estoque abaixo do mínimo.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Products;
