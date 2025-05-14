import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, LineChart, PieChart, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Calendar } from '@/components/ui/calendar';

// Sample data for reports
const salesData = [
  { date: '2023-05-01', sales: 1250.00, orders: 42 },
  { date: '2023-05-02', sales: 1340.50, orders: 45 },
  { date: '2023-05-03', sales: 1100.25, orders: 38 },
  { date: '2023-05-04', sales: 1420.75, orders: 48 },
  { date: '2023-05-05', sales: 1550.30, orders: 52 },
  { date: '2023-05-06', sales: 1780.90, orders: 58 },
  { date: '2023-05-07', sales: 2100.45, orders: 65 },
];

const productSalesData = [
  { name: 'Açaí 300ml', sales: 320, revenue: 5088.00, color: '#8884d8' },
  { name: 'Açaí 500ml', sales: 250, revenue: 5225.00, color: '#83a6ed' },
  { name: 'Sorvete 1 Bola', sales: 180, revenue: 1440.00, color: '#8dd1e1' },
  { name: 'Sorvete 2 Bolas', sales: 120, revenue: 1440.00, color: '#82ca9d' },
  { name: 'Refrigerantes', sales: 300, revenue: 1500.00, color: '#a4de6c' },
];

const paymentMethodsData = [
  { name: 'Cartão de Crédito', value: 45, color: '#8884d8' },
  { name: 'Cartão de Débito', value: 25, color: '#83a6ed' },
  { name: 'Dinheiro', value: 15, color: '#8dd1e1' },
  { name: 'PIX', value: 15, color: '#82ca9d' },
];

const Reports = () => {
  const [reportTab, setReportTab] = useState('sales');
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 4, 1), // May 1, 2023
    to: new Date(2023, 4, 7),   // May 7, 2023
  });
  const [timeFrame, setTimeFrame] = useState('daily');

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Get total sales for the period
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgTicket = totalSales / totalOrders;
  
  return (
    <MainLayout title="Relatórios">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <Tabs value={reportTab} onValueChange={setReportTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="sales" className="gap-2">
              <BarChart3 className="h-4 w-4" /> Vendas
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <PieChart className="h-4 w-4" /> Produtos
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <LineChart className="h-4 w-4" /> Pagamentos
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className="w-56 justify-start text-left font-normal"
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
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>
      
      <TabsContent value="sales" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">Faturamento Total</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-800">{formatCurrency(totalSales)}</span>
              </div>
              <div className="text-sm text-green-600 mt-2">+12.5% vs. semana anterior</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">Pedidos</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-800">{totalOrders}</span>
              </div>
              <div className="text-sm text-green-600 mt-2">+8.3% vs. semana anterior</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500">Ticket Médio</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-800">{formatCurrency(avgTicket)}</span>
              </div>
              <div className="text-sm text-green-600 mt-2">+3.7% vs. semana anterior</div>
            </div>
          </Card>
        </div>
        
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Vendas Diárias</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })} 
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => formatCurrency(value).replace('R$', '')} 
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  dataKey="orders" 
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'sales') return [formatCurrency(value), 'Vendas'];
                    return [value, 'Pedidos'];
                  }}
                  labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="sales" 
                  name="Vendas" 
                  fill="#8884d8" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="orders" 
                  name="Pedidos" 
                  fill="#82ca9d" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="products" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Produtos Mais Vendidos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productSalesData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value: number) => [value, 'Quantidade']} />
                  <Legend />
                  <Bar dataKey="sales" name="Quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Faturamento por Produto</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={productSalesData}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: ${formatCurrency(entry.revenue)}`}
                  >
                    {productSalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="payments" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Formas de Pagamento</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={paymentMethodsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Evolução de Vendas por Pagamento</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={salesData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })} 
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', '')} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Vendas" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </TabsContent>
    </MainLayout>
  );
};

export default Reports;
