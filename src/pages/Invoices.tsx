
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar,
  FileText,
  MoreVertical,
  Eye,
  Download,
  Trash2
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

// Sample invoice data
const invoiceData = [
  { id: 1, number: 'NF-123456', supplier: 'Distribuidora de Açaí Norte', date: '2023-05-10', total: 1250.75, status: 'Paga', items: 12 },
  { id: 2, number: 'NF-123457', supplier: 'Sorvetes Premium Ltda', date: '2023-05-08', total: 875.30, status: 'Paga', items: 8 },
  { id: 3, number: 'NF-123458', supplier: 'Complementos & Cia', date: '2023-05-12', total: 345.60, status: 'Pendente', items: 15 },
  { id: 4, number: 'NF-123459', supplier: 'Bebidas Refrescantes SA', date: '2023-05-05', total: 520.90, status: 'Cancelada', items: 6 },
  { id: 5, number: 'NF-123460', supplier: 'Embalagens Descartáveis ME', date: '2023-05-11', total: 230.45, status: 'Paga', items: 5 },
];

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Filter invoices based on search term and filters
  const filteredInvoices = invoiceData.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get unique statuses for filter
  const statuses = Array.from(new Set(invoiceData.map(i => i.status)));
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paga':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paga</Badge>;
      case 'Pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'Cancelada':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout title="Notas de Compra">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar notas..."
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
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                Todos
              </DropdownMenuItem>
              {statuses.map((status) => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Período
          </Button>
          
          {statusFilter && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              Status: {statusFilter}
              <button 
                className="ml-1 text-gray-400 hover:text-gray-600" 
                onClick={() => setStatusFilter(null)}
              >
                ×
              </button>
            </Badge>
          )}
        </div>
        
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Nota de Compra
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.supplier}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell className="text-right">{invoice.items}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(invoice.total)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" /> Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="h-4 w-4 mr-2" /> Download XML
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600">
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

export default Invoices;
