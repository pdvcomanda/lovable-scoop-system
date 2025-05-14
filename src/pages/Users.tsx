
import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmployeeForm } from "@/components/EmployeeForm";
import { toast } from "@/components/ui/sonner";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash, 
  UserCog, 
  Check, 
  X 
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  active: boolean;
}

const Users = () => {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Admin do Sistema", email: "admin@acaidelicia.com.br", role: "admin", active: true },
    { id: "2", name: "Carlos Gerente", email: "gerente@acaidelicia.com.br", role: "manager", active: true },
    { id: "3", name: "Maria Vendedora", email: "maria@acaidelicia.com.br", role: "employee", active: true },
    { id: "4", name: "João Vendedor", email: "joao@acaidelicia.com.br", role: "employee", active: false },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRef, setOpenDialogRef] = useState(false);
  
  // Verifique se devemos abrir o diálogo ao carregar a página
  useEffect(() => {
    if (location.state?.openAddDialog && !openDialogRef) {
      setOpenDialog(true);
      setOpenDialogRef(true);
    }
  }, [location.state, openDialogRef]);
  
  // Filtrar usuários com base na busca
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddUser = (values: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: values.fullName,
      email: values.email,
      role: values.role as 'admin' | 'manager' | 'employee',
      active: true
    };
    
    setUsers([...users, newUser]);
    setOpenDialog(false);
    toast.success(`Funcionário ${newUser.name} adicionado com sucesso!`);
  };
  
  const handleToggleActive = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, active: !user.active } : user
    ));
    
    const user = users.find(u => u.id === id);
    if (user) {
      toast.success(`Usuário ${user.name} ${user.active ? 'desativado' : 'ativado'} com sucesso!`);
    }
  };
  
  const handleDeleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'admin') {
      toast.error("Não é possível remover um usuário administrador");
      return;
    }
    
    setUsers(users.filter(user => user.id !== id));
    const deletedUser = users.find(u => u.id === id);
    if (deletedUser) {
      toast.success(`Usuário ${deletedUser.name} removido com sucesso!`);
    }
  };
  
  const roleLabels: Record<string, { label: string, className: string }> = {
    admin: { label: "Administrador", className: "bg-blue-100 text-blue-800" },
    manager: { label: "Gerente", className: "bg-purple-100 text-purple-800" },
    employee: { label: "Vendedor", className: "bg-green-100 text-green-800" },
  };

  return (
    <MainLayout title="Funcionários">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="w-full sm:w-1/2">
            <Input
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Funcionário</DialogTitle>
                <DialogDescription>
                  Preencha os dados para cadastrar um novo funcionário no sistema.
                </DialogDescription>
              </DialogHeader>
              
              <EmployeeForm onSubmit={handleAddUser} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={roleLabels[user.role].className}
                      >
                        {roleLabels[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.active ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" /> Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          <X className="mr-1 h-3 w-3" /> Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleActive(user.id)}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                        {user.role !== 'admin' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Nenhum funcionário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Users;
