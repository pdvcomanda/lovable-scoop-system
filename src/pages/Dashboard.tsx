
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ShoppingCart, Package, BarChart, Settings, Receipt, ArrowRight } from 'lucide-react';
import { useAppNavigation } from '@/hooks/use-navigation';

const Dashboard = () => {
  // Usar hooks de navegação para os botões
  const navigation = useAppNavigation();
  
  // Estado com valores zerados conforme solicitado
  const [stats] = useState({
    dailySales: 0,
    monthSales: 0,
    productCount: 0,
    lowStock: 0
  });

  return (
    <MainLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Dia</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.dailySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {`0 pedidos hoje`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {`0 pedidos neste mês`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCount}</div>
            <p className="text-xs text-muted-foreground">
              Produtos cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              Produtos com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Iniciar Venda</CardTitle>
              <CardDescription>
                Registrar nova venda no PDV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShoppingCart className="h-10 w-10 text-primary opacity-80" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={navigation.goToPos}
              >
                Acessar PDV <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Adicionar Produto</CardTitle>
              <CardDescription>
                Cadastrar novo produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Package className="h-10 w-10 text-primary opacity-80" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={navigation.goToAddProduct}
              >
                Cadastrar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Gerenciar Estoque</CardTitle>
              <CardDescription>
                Verificar e ajustar estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Package className="h-10 w-10 text-primary opacity-80" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={navigation.goToInventory}
              >
                Gerenciar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Configurações</CardTitle>
              <CardDescription>
                Ajustar configurações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Settings className="h-10 w-10 text-primary opacity-80" />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigation.goToSettings()}
              >
                Configurar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Vendas Recentes</h2>
          <Button 
            variant="link" 
            className="font-medium text-primary" 
            onClick={navigation.goToAllSales}
          >
            Ver todas as vendas
          </Button>
        </div>
        <div className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma venda recente para exibir.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
