
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200',
        isActive
          ? 'bg-pos-primary text-white'
          : 'text-gray-700 hover:bg-pos-light hover:text-pos-primary'
      )
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <div className="flex items-center justify-center py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-pos-primary">Açaí POS</h1>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem to="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
        <NavItem to="/pos" icon={<ShoppingCart className="h-5 w-5" />} label="Ponto de Venda" />
        <NavItem to="/products" icon={<Package className="h-5 w-5" />} label="Produtos" />
        <NavItem to="/invoices" icon={<FileText className="h-5 w-5" />} label="Notas de Compra" />
        <NavItem to="/reports" icon={<BarChart3 className="h-5 w-5" />} label="Relatórios" />
        <NavItem to="/users" icon={<Users className="h-5 w-5" />} label="Usuários" />
        <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Configurações" />
      </nav>
      
      <div className="px-3 py-4 border-t border-gray-200">
        <button className="flex items-center w-full space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};
