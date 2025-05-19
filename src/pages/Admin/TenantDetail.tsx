
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Icons } from '@/components/icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

const TenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('employee');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTenant();
      fetchTenantUsers();
    }
  }, [id]);

  const fetchTenant = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setTenant(data);
        setTenantName(data.name);
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
      }
    } catch (error: any) {
      console.error('Erro ao buscar loja:', error);
      toast.error('Não foi possível carregar as informações da loja');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('tenant_id', id);

      if (error) throw error;
      
      if (data) {
        // Buscar emails dos usuários
        const userIds = data.map(user => user.id);
        
        if (userIds.length > 0) {
          const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
            perPage: 100
          });
          
          if (authError) throw authError;
          
          const emailMap = new Map();
          authUsers?.users.forEach(user => {
            emailMap.set(user.id, user.email);
          });
          
          const usersWithEmail = data.map(user => ({
            ...user,
            email: emailMap.get(user.id) || 'Email não encontrado'
          }));
          
          setUsers(usersWithEmail);
        } else {
          setUsers([]);
        }
      }
    } catch (error: any) {
      console.error('Erro ao buscar usuários da loja:', error);
      toast.error('Não foi possível carregar os usuários da loja');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Cria uma URL temporária para preview
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!tenant) return;
    
    setSaving(true);
    try {
      // Atualizar nome do tenant
      if (tenantName !== tenant.name) {
        const { error: updateError } = await supabase
          .from('tenants')
          .update({ name: tenantName })
          .eq('id', tenant.id);
        
        if (updateError) throw updateError;
      }
      
      // Fazer upload do logo se selecionado
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${tenant.slug}-logo-${Date.now()}.${fileExt}`;
        
        // Criar bucket se não existir
        await supabase.storage.createBucket('tenant-logos', {
          public: true,
          fileSizeLimit: 1024000 // 1MB
        });
        
        // Fazer upload do logo
        const { error: uploadError } = await supabase.storage
          .from('tenant-logos')
          .upload(fileName, logoFile);
        
        if (uploadError) throw uploadError;
        
        // Obter URL pública
        const { data } = supabase.storage
          .from('tenant-logos')
          .getPublicUrl(fileName);
        
        // Atualizar tenant com a URL do logo
        const { error: logoUpdateError } = await supabase
          .from('tenants')
          .update({ logo_url: data.publicUrl })
          .eq('id', tenant.id);
        
        if (logoUpdateError) throw logoUpdateError;
      }
      
      toast.success('Loja atualizada com sucesso!');
      // Recarregar dados
      fetchTenant();
      
    } catch (error: any) {
      console.error('Erro ao atualizar loja:', error);
      toast.error('Erro ao atualizar loja');
    } finally {
      setSaving(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteRole || !tenant) return;
    
    setIsInviting(true);
    try {
      // Enviar convite para o usuário
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        data: {
          tenant_id: tenant.id,
          role: inviteRole,
          full_name: ''
        }
      });
      
      if (error) throw error;
      
      toast.success(`Convite enviado para ${inviteEmail}`);
      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('employee');
      
      // Recarregar usuários
      fetchTenantUsers();
      
    } catch (error: any) {
      console.error('Erro ao enviar convite:', error);
      toast.error(`Erro ao enviar convite: ${error.message}`);
    } finally {
      setIsInviting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Detalhes da Loja">
        <div className="flex justify-center py-8">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (!tenant) {
    return (
      <MainLayout title="Detalhes da Loja">
        <div className="text-center py-8">
          <p className="text-lg font-semibold mb-4">Loja não encontrada</p>
          <Button onClick={() => navigate('/admin/tenants')}>
            Voltar para Lista de Lojas
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Detalhes da Loja">
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/tenants')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lista de Lojas
        </Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Atualize as informações da loja {tenant.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Loja</Label>
                <Input
                  id="name"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Nome da loja"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="slug">Identificador (slug)</Label>
                <Input
                  id="slug"
                  value={tenant.slug}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  O identificador não pode ser alterado
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label>Logotipo da Loja</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    {logoPreview ? (
                      <AvatarImage src={logoPreview} alt={tenant.name} />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {tenant.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="grid gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recomendado: imagem quadrada, mínimo 200x200px
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>
                  Gerencie os usuários desta loja
                </CardDescription>
              </div>
              
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Convidar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convidar Usuário</DialogTitle>
                    <DialogDescription>
                      Envie um convite por email para um novo usuário.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={inviteEmail} 
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="usuario@exemplo.com" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="role">Função</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="manager">Gerente</SelectItem>
                          <SelectItem value="employee">Funcionário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      onClick={() => setIsInviteDialogOpen(false)} 
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSendInvite}
                      disabled={isInviting || !inviteEmail}
                    >
                      {isInviting ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Convite'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || '(Sem nome)'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role === 'admin' ? 'Administrador' : 
                           user.role === 'manager' ? 'Gerente' : 'Funcionário'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                  <p className="text-sm">Use o botão "Convidar Usuário" para adicionar membros à esta loja</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default TenantDetail;
