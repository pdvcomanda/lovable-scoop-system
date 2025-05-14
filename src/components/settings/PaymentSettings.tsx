import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, CreditCard, Pencil, Trash, Wallet } from "lucide-react";
import { CurrencyCircleDollar } from "@/components/icons/CurrencyCircleDollar";

type PaymentMethod = {
  id: string;
  name: string;
  type: "dinheiro" | "credito" | "debito" | "pix" | "outro";
  enabled: boolean;
  fee?: number;
};

export const PaymentSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", name: "Dinheiro", type: "dinheiro", enabled: true },
    { id: "2", name: "Cartão de Crédito", type: "credito", enabled: true, fee: 2.5 },
    { id: "3", name: "Cartão de Débito", type: "debito", enabled: true, fee: 1.5 },
    { id: "4", name: "PIX", type: "pix", enabled: true },
  ]);
  
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleToggleMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === id 
          ? { ...method, enabled: !method.enabled } 
          : method
      )
    );
  };
  
  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsDialogOpen(true);
  };
  
  const handleSaveMethod = (updatedMethod: PaymentMethod) => {
    if (updatedMethod.id) {
      // Update existing method
      setPaymentMethods(methods => 
        methods.map(method => 
          method.id === updatedMethod.id ? updatedMethod : method
        )
      );
    } else {
      // Add new method
      const newMethod = {
        ...updatedMethod,
        id: Date.now().toString()
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    }
    
    setIsDialogOpen(false);
    setEditingMethod(null);
    toast.success("Método de pagamento salvo com sucesso!");
  };
  
  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    toast.success("Método de pagamento removido com sucesso!");
  };
  
  const savePaymentSettings = () => {
    toast.success("Configurações de pagamento salvas com sucesso!");
  };
  
  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case "dinheiro": return <Wallet className="h-4 w-4" />;
      case "credito": return <CreditCard className="h-4 w-4" />;
      case "debito": return <CreditCard className="h-4 w-4" />;
      case "pix": return <CurrencyCircleDollar className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-bold">Métodos de Pagamento</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Configure os métodos de pagamento aceitos pelo seu estabelecimento.
            </p>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingMethod({
                  id: "", 
                  name: "", 
                  type: "outro", 
                  enabled: true
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Método
              </Button>
            </DialogTrigger>
          </div>
          
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods.map(method => (
                <TableRow key={method.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(method.type)}
                      <span>{method.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {method.fee ? `${method.fee}%` : "Sem taxa"}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={method.enabled} 
                      onCheckedChange={() => handleToggleMethod(method.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMethod(method)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {method.type !== "dinheiro" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteMethod(method.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMethod?.id ? "Editar Método de Pagamento" : "Novo Método de Pagamento"}
              </DialogTitle>
              <DialogDescription>
                Configure os detalhes do método de pagamento.
              </DialogDescription>
            </DialogHeader>
            
            {editingMethod && (
              <form 
                className="space-y-4" 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get("name") as string;
                  const type = formData.get("type") as PaymentMethod['type'];
                  const fee = formData.get("fee") ? parseFloat(formData.get("fee") as string) : undefined;
                  
                  handleSaveMethod({
                    ...editingMethod,
                    name,
                    type,
                    fee
                  });
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="payment-name">Nome do Método</Label>
                  <Input 
                    id="payment-name" 
                    name="name" 
                    defaultValue={editingMethod.name}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-type">Tipo</Label>
                  <select 
                    id="payment-type" 
                    name="type" 
                    defaultValue={editingMethod.type}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!!editingMethod.id}
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="credito">Cartão de Crédito</option>
                    <option value="debito">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-fee">Taxa (%)</Label>
                  <Input 
                    id="payment-fee" 
                    name="fee" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="100"
                    defaultValue={editingMethod.fee?.toString() || "0"}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe como 0 para métodos sem taxa.
                  </p>
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {editingMethod.id ? "Atualizar" : "Criar"} Método
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-medium">Configurações adicionais</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recusar pagamentos offline</Label>
              <div className="text-sm text-gray-500">
                Impede vendas quando o sistema não consegue validar pagamentos eletrônicos
              </div>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Permitir pagamentos múltiplos</Label>
              <div className="text-sm text-gray-500">
                Permite dividir o pagamento entre diferentes métodos
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Fechamento automático do caixa</Label>
              <div className="text-sm text-gray-500">
                Gera relatório automaticamente ao fechar o caixa
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={savePaymentSettings}>Salvar Alterações</Button>
        </div>
      </div>
    </Card>
  );
};
