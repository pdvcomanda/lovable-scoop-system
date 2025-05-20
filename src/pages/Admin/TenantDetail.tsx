
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Building, Users, Settings, Trash2 } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface TenantUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  full_name: string;
}

export default function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
  
  // Carregar dados do tenant
  useEffect(() => {
    async function fetchTenantData() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data: tenantData, error: tenantError } = await supabase
          .from("tenants")
          .select("*")
          .eq("id", id)
          .single();
          
        if (tenantError) throw tenantError;
        if (tenantData) {
          setTenant(tenantData);
          setFormData({
            name: tenantData.name,
            slug: tenantData.slug
          });
          
          // Buscar usuários associados a este tenant
          const { data: usersData, error: usersError } = await supabase
            .from("profiles")
            .select("id, full_name, role, created_at, auth.users(email)")
            .eq("tenant_id", id);
            
          if (usersError) throw usersError;
          
          if (usersData) {
            const formattedUsers = usersData.map(user => ({
              id: user.id,
              email: user.users?.email || "",
              role: user.role,
              created_at: user.created_at,
              full_name: user.full_name
            }));
            setUsers(formattedUsers);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar tenant:", error);
        toast.error("Falha ao carregar dados da loja.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTenantData();
  }, [id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenant) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from("tenants")
        .update({
          name: formData.name,
          slug: formData.slug,
          updated_at: new Date().toISOString()
        })
        .eq("id", tenant.id);
        
      if (error) throw error;
      
      toast.success("Loja atualizada com sucesso!");
      
      // Atualizar o state
      setTenant(prev => prev ? { ...prev, ...formData } : null);
      
    } catch (error) {
      console.error("Erro ao atualizar tenant:", error);
      toast.error("Falha ao atualizar dados da loja.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (!tenant) return;
    
    try {
      setIsUpdating(true);
      
      // Verificar se há usuários associados
      if (users.length > 0) {
        toast.error("Não é possível excluir uma loja com usuários. Remova os usuários primeiro.");
        return;
      }
      
      const { error } = await supabase
        .from("tenants")
        .delete()
        .eq("id", tenant.id);
        
      if (error) throw error;
      
      toast.success("Loja excluída com sucesso!");
      navigate("/admin/tenants");
      
    } catch (error) {
      console.error("Erro ao excluir tenant:", error);
      toast.error("Falha ao excluir a loja.");
    } finally {
      setIsUpdating(false);
      setDeleteDialogOpen(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando...</p>
      </div>
    );
  }
  
  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg mb-4">Loja não encontrada</p>
        <Button onClick={() => navigate("/admin/tenants")}>
          Voltar para a lista
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tenant.name}</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/tenants")}
        >
          Voltar para a lista
        </Button>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">
            <Building className="mr-2 h-4 w-4" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Usuários ({users.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Loja</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Identificador Único</Label>
                  <Input 
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    pattern="[a-z0-9-]+"
                    title="Apenas letras minúsculas, números e hífens"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Identificador único usado para URLs e banco de dados
                  </p>
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Usuários da Loja</CardTitle>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/tenants/${tenant.id}/add-user`)}
              >
                Adicionar Usuário
              </Button>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhum usuário cadastrado para esta loja.
                </p>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between border-b py-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs mt-1">
                          <span className="bg-muted px-2 py-0.5 rounded">
                            {user.role === 'admin' ? 'Administrador' : 'Funcionário'}
                          </span>
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        Gerenciar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Loja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Zona de Perigo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ações que podem afetar permanentemente esta loja e seus dados
                </p>
                
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={users.length > 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Loja
                </Button>
                
                {users.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Você precisa remover todos os usuários antes de excluir a loja
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a loja
              "{tenant.name}" e todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, excluir loja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
