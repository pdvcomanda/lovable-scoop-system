
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
  
  // Load tenant data
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
          
          // Fetch users associated with this tenant
          // First get profiles with tenant_id
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, role, created_at, tenant_id")
            .eq("tenant_id", id);
            
          if (profilesError) throw profilesError;
          
          if (profilesData && profilesData.length > 0) {
            // Now get emails from auth.users table for these profiles
            // We'll need to use a separate query for each profile
            const usersData: TenantUser[] = [];
            
            for (const profile of profilesData) {
              // Get the user data from auth.users - this would normally use a more efficient join
              // but we're working within the limitations
              const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
              
              if (userData?.user) {
                usersData.push({
                  id: profile.id,
                  email: userData.user.email || "",
                  role: profile.role,
                  created_at: profile.created_at,
                  full_name: profile.full_name || ""
                });
              }
            }
            
            setUsers(usersData);
          }
        }
      } catch (error) {
        console.error("Error loading tenant:", error);
        toast.error("Failed to load store data.");
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
      
      toast.success("Store updated successfully!");
      
      // Update state
      setTenant(prev => prev ? { ...prev, ...formData } : null);
      
    } catch (error) {
      console.error("Error updating tenant:", error);
      toast.error("Failed to update store data.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (!tenant) return;
    
    try {
      setIsUpdating(true);
      
      // Check if there are associated users
      if (users.length > 0) {
        toast.error("Cannot delete a store with users. Remove the users first.");
        return;
      }
      
      const { error } = await supabase
        .from("tenants")
        .delete()
        .eq("id", tenant.id);
        
      if (error) throw error;
      
      toast.success("Store deleted successfully!");
      navigate("/admin/tenants");
      
    } catch (error) {
      console.error("Error deleting tenant:", error);
      toast.error("Failed to delete the store.");
    } finally {
      setIsUpdating(false);
      setDeleteDialogOpen(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg mb-4">Store not found</p>
        <Button onClick={() => navigate("/admin/tenants")}>
          Back to list
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
          Back to list
        </Button>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">
            <Building className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Unique Identifier</Label>
                  <Input 
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    pattern="[a-z0-9-]+"
                    title="Only lowercase letters, numbers and hyphens"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Unique identifier used for URLs and database
                  </p>
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Store Users</CardTitle>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/tenants/${tenant.id}/add-user`)}
              >
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No users registered for this store.
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
                            {user.role === 'admin' ? 'Administrator' : 'Employee'}
                          </span>
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        Manage
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
              <CardTitle>Store Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Actions that can permanently affect this store and its data
                </p>
                
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={users.length > 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Store
                </Button>
                
                {users.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    You need to remove all users before deleting the store
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              "{tenant.name}" store and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete store
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
