
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { Menu, MessageSquare } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
}

export const Header = ({ title = 'Dashboard', onMenuToggle }: HeaderProps) => {
  const { isMobile } = useMobile();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="flex h-14 items-center border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  );
};
