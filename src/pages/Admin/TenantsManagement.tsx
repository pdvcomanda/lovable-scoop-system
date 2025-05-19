
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Plus, Pencil } from 'lucide-react';
import { Icons } from '@/components/icons';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
}

const TenantsManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('name');

      if (error) throw error;
      setTenants(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar lojas:', error);
      toast.error('Não foi possível carregar as lojas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenantName || !newTenantSlug) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([
          { name: newTenantName, slug: newTenantSlug }
        ])
        .select();

      if (error) throw error;

      toast.success('Loja criada com sucesso!');
      setTenants([...tenants, data[0] as Tenant]);
      setIsAddDialogOpen(false);
      setNewTenantName('');
      setNewTenantSlug('');
    } catch (error: any) {
      console.error('Erro ao criar loja:', error);
      toast.error('Erro ao criar loja');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Converte o valor para um slug válido (minúsculas, sem espaços, sem caracteres especiais)
    const value = e.target.value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setNewTenantSlug(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTenantName(e.target.value);
    // Se o slug ainda não foi editado manualmente, gera-o automaticamente
    if (!newTenantSlug) {
      const autoSlug = e.target.value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setNewTenantSlug(autoSlug);
    }
  };

  return (
    <MainLayout title="Gerenciamento de Lojas">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lojas</CardTitle>
            <CardDescription>
              Gerencie as lojas do sistema Ice Flow PDV
            </CardDescription>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Loja
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Loja</DialogTitle>
                <DialogDescription>
                  Preencha as informações da nova loja.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Loja</Label>
                  <Input 
                    id="name" 
                    value={newTenantName} 
                    onChange={handleNameChange}
                    placeholder="Ex: Açaí Delícia" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="slug">Identificador Único (slug)</Label>
                  <Input 
                    id="slug" 
                    value={newTenantSlug} 
                    onChange={handleSlugChange}
                    placeholder="Ex: acai-delicia" 
                  />
                  <p className="text-xs text-muted-foreground">
                    O identificador será usado em URLs e deve ser único.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => setIsAddDialogOpen(false)} 
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateTenant}
                  disabled={isSubmitting || !newTenantName || !newTenantSlug}
                >
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Loja'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tenants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.slug}</TableCell>
                    <TableCell>
                      {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Nenhuma loja encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default TenantsManagement;
