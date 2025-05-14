
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp, Package, DollarSign } from 'lucide-react';

const Dashboard = () => {
  // Sample data for demo
  const stats = [
    { title: 'Vendas Hoje', value: 'R$ 1.245,00', icon: <ShoppingCart className="h-6 w-6" />, change: '+12%', color: 'bg-blue-500' },
    { title: 'Produtos Vendidos', value: '42', icon: <Package className="h-6 w-6" />, change: '+5%', color: 'bg-green-500' },
    { title: 'Ticket Médio', value: 'R$ 29,64', icon: <DollarSign className="h-6 w-6" />, change: '+2%', color: 'bg-purple-500' },
    { title: 'Faturamento Mensal', value: 'R$ 24.320,00', icon: <TrendingUp className="h-6 w-6" />, change: '+8%', color: 'bg-amber-500' },
  ];
  
  const recentSales = [
    { id: 1, time: '14:25', items: 3, total: 'R$ 42,50', payment: 'Cartão de Crédito' },
    { id: 2, time: '14:10', items: 1, total: 'R$ 15,00', payment: 'Dinheiro' },
    { id: 3, time: '13:55', items: 2, total: 'R$ 28,90', payment: 'PIX' },
    { id: 4, time: '13:42', items: 4, total: 'R$ 56,80', payment: 'Cartão de Débito' },
    { id: 5, time: '13:30', items: 2, total: 'R$ 32,00', payment: 'PIX' },
  ];

  const lowStock = [
    { id: 1, name: 'Açaí Base', current: '4.2 kg', min: '5 kg' },
    { id: 2, name: 'Leite condensado', current: '3 un', min: '5 un' },
    { id: 3, name: 'Granola', current: '2 kg', min: '3 kg' },
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="pos-card">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-sm text-green-600 mt-1">{stat.change} vs. ontem</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="pos-card">
            <div className="pos-card-header">
              <h2 className="text-lg font-bold">Vendas Recentes</h2>
            </div>
            <div className="pos-card-body">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">#</th>
                      <th className="pb-2">Hora</th>
                      <th className="pb-2">Itens</th>
                      <th className="pb-2">Total</th>
                      <th className="pb-2">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{sale.id}</td>
                        <td className="py-3">{sale.time}</td>
                        <td className="py-3">{sale.items}</td>
                        <td className="py-3 font-medium">{sale.total}</td>
                        <td className="py-3">{sale.payment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">Ver Todas as Vendas</Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="pos-card">
            <div className="pos-card-header">
              <h2 className="text-lg font-bold">Estoque Baixo</h2>
            </div>
            <div className="pos-card-body">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Produto</th>
                      <th className="pb-2">Atual</th>
                      <th className="pb-2">Mín</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{item.name}</td>
                        <td className="py-3 text-red-600 font-medium">{item.current}</td>
                        <td className="py-3">{item.min}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">Gerenciar Estoque</Button>
              </div>
            </div>
          </Card>
          
          <Card className="pos-card mt-6">
            <div className="pos-card-header">
              <h2 className="text-lg font-bold">Acesso Rápido</h2>
            </div>
            <div className="pos-card-body">
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-16 bg-pos-primary hover:bg-pos-dark">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Iniciar Venda
                </Button>
                <Button variant="outline" className="h-16">
                  <Package className="mr-2 h-5 w-5" />
                  Adicionar Produto
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
