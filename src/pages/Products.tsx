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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus } from "lucide-react";

// Define product type
interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
}

// Dados de exemplo
const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Açaí Tradicional",
    price: 10.00,
    unit: "kg",
    stock: 50,
  },
  {
    id: "2",
    name: "Açaí com Banana",
    price: 12.00,
    unit: "kg",
    stock: 45,
  },
  {
    id: "3",
    name: "Açaí com Granola",
    price: 14.00,
    unit: "kg",
    stock: 30,
  },
  {
    id: "4",
    name: "Sorvete de Chocolate",
    price: 8.00,
    unit: "kg",
    stock: 20,
  },
  {
    id: "5",
    name: "Sorvete de Morango",
    price: 8.00,
    unit: "kg",
    stock: 25,
  },
];

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
});

const Products = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      unit: "kg",
      stock: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create new product with required fields
    const newProduct: Product = {
      id: Date.now().toString(),
      name: values.name,
      price: values.price,
      unit: values.unit,
      stock: values.stock,
    };
    setProducts([...products, newProduct]);
    setOpen(false);
    form.reset();
  };

  const filteredProducts = products.filter(
    product => product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Produtos">
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
                <DialogTitle>Adicionar Produto</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo produto.
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
                  <DialogFooter>
                    <Button type="submit">Salvar</Button>
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
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Products;
