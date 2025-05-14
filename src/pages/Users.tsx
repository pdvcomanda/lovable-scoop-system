
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User,
  UserCheck,
  Shield,
  MoreVertical
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

// Sample users data
const usersData = [
  { id: 1, name: 'João Silva', email: 'joao.silva@exemplo.com', role: 'Administrador', active: true, lastLogin: '2023-05-14 08:32' },
  { id: 2, name: 'Maria Oliveira', email: 'maria.oliveira@exemplo.com', role: 'Supervisor', active: true, lastLogin: '2023-05-13 17:45' },
  { id: 3, name: 'Pedro Santos', email: 'pedro.santos@exemplo.com', role: 'Funcionário', active: true, lastLogin: '2023-05-14 09:12' },
  { id: 4, name: 'Ana Souza', email: 'ana.souza@exemplo.com', role: 'Funcionário', active: false, lastLogin: '2023-05-10 14:23' },
  { id: 5, name: 'Carlos Ferreira', email: 'carlos.ferreira@exemplo.com', role: 'Funcionário', active: true, lastLogin: '2023-05-13 10:05' },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users based on search term
  const filteredUsers = usersData.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return user.name.toLowerCase().includes(searchLower) || 
           user.email.toLowerCase().includes(searchLower) ||
           user.role.toLowerCase().includes(searchLower);
  });
  
  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Administrador':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'Supervisor':
        return <UserCheck className="h-4 w-4 text-amber-500" />;
      default:
        return <User className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <MainLayout title="Usuários">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-10 w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    {user.role}
                  </div>
                </TableCell>
                <TableCell>
                  {user.active ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Inativo
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.lastLogin)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        {user.active ? (
                          <>
                            <User className="h-4 w-4 mr-2" /> Desativar
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" /> Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </MainLayout>
  );
};

export default Users;
