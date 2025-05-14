
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  BarChart, 
  Users, 
  Settings,
  X,
  Pizza
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar = ({ open = false, onClose }: SidebarProps) => {
  const { isMobile } = useMobile();
  const { profile } = useAuth();
  
  const isAdmin = profile?.role === 'admin';
  
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'PDV',
      href: '/pos',
      icon: ShoppingCart,
    },
    {
      title: 'Produtos',
      href: '/products',
      icon: Package,
    },
    {
      title: 'Compras',
      href: '/invoices',
      icon: FileText,
    },
    {
      title: 'Relatórios',
      href: '/reports',
      icon: BarChart,
    },
    ...(isAdmin ? [
      {
        title: 'Usuários',
        href: '/users',
        icon: Users,
      }
    ] : []),
    {
      title: 'Configurações',
      href: '/settings',
      icon: Settings,
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <Pizza className="h-6 w-6" />
          <span className="text-lg font-bold">Açaí POS</span>
        </NavLink>
        {isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent',
                  isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Pizza className="h-4 w-4" />
          <div>
            <p className="font-medium">Açaí POS v1.0</p>
            <p>©2025 Lovable</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden border-r bg-background lg:block lg:w-[240px]">
      <SidebarContent />
    </aside>
  );
};
