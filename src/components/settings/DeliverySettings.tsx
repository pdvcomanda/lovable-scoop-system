
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
import { Pencil, Plus, Trash, Truck, Link, UserPlus } from "lucide-react";

type DeliveryZone = {
  id: string;
  name: string;
  distance: number;
  fee: number;
  estimatedTime: number;
};

type DeliveryPerson = {
  id: string;
  name: string;
  contact: string;
  vehicle: string;
  active: boolean;
};

export const DeliverySettings = () => {
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([
    { id: "1", name: "Zona 1", distance: 2, fee: 5, estimatedTime: 30 },
    { id: "2", name: "Zona 2", distance: 5, fee: 8, estimatedTime: 45 },
    { id: "3", name: "Zona 3", distance: 10, fee: 12, estimatedTime: 60 },
  ]);
  
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([
    { id: "1", name: "João Silva", contact: "(11) 98765-4321", vehicle: "Moto", active: true },
    { id: "2", name: "Maria Santos", contact: "(11) 91234-5678", vehicle: "Bicicleta", active: true },
  ]);
  
  const [catalogLink, setCatalogLink] = useState("https://cardapio.acaidelicia.com.br");
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [editingPerson, setEditingPerson] = useState<DeliveryPerson | null>(null);
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [personDialogOpen, setPersonDialogOpen] = useState(false);
  
  const handleSaveZone = (zone: DeliveryZone) => {
    if (zone.id) {
      // Update existing zone
      setDeliveryZones(zones => 
        zones.map(z => z.id === zone.id ? zone : z)
      );
    } else {
      // Add new zone
      const newZone = {
        ...zone,
        id: Date.now().toString()
      };
      setDeliveryZones([...deliveryZones, newZone]);
    }
    
    setZoneDialogOpen(false);
    setEditingZone(null);
    toast.success("Zona de entrega salva com sucesso!");
  };
  
  const handleDeleteZone = (id: string) => {
    setDeliveryZones(zones => zones.filter(zone => zone.id !== id));
    toast.success("Zona de entrega removida com sucesso!");
  };
  
  const handleSavePerson = (person: DeliveryPerson) => {
    if (person.id) {
      // Update existing person
      setDeliveryPeople(people => 
        people.map(p => p.id === person.id ? person : p)
      );
    } else {
      // Add new person
      const newPerson = {
        ...person,
        id: Date.now().toString()
      };
      setDeliveryPeople([...deliveryPeople, newPerson]);
    }
    
    setPersonDialogOpen(false);
    setEditingPerson(null);
    toast.success("Entregador salvo com sucesso!");
  };
  
  const handleDeletePerson = (id: string) => {
    setDeliveryPeople(people => people.filter(person => person.id !== id));
    toast.success("Entregador removido com sucesso!");
  };
  
  const handleTogglePersonActive = (id: string) => {
    setDeliveryPeople(people => 
      people.map(person => 
        person.id === id 
          ? { ...person, active: !person.active } 
          : person
      )
    );
  };
  
  const handleSaveCatalogLink = () => {
    toast.success("Link do catálogo virtual salvo com sucesso!");
  };
  
  const saveDeliverySettings = () => {
    toast.success("Configurações de entrega salvas com sucesso!");
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {/* Zonas de Entrega */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <h2 className="text-xl font-bold">Zonas de Entrega</h2>
            </div>
            
            <Dialog open={zoneDialogOpen} onOpenChange={setZoneDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setEditingZone({
                    id: "", 
                    name: "", 
                    distance: 0, 
                    fee: 0, 
                    estimatedTime: 30
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Zona
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingZone?.id ? "Editar Zona de Entrega" : "Nova Zona de Entrega"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure os detalhes da zona de entrega.
                  </DialogDescription>
                </DialogHeader>
                
                {editingZone && (
                  <form 
                    className="space-y-4" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      
                      handleSaveZone({
                        id: editingZone.id,
                        name: formData.get("name") as string,
                        distance: parseFloat(formData.get("distance") as string),
                        fee: parseFloat(formData.get("fee") as string),
                        estimatedTime: parseInt(formData.get("estimatedTime") as string),
                      });
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="zone-name">Nome da Zona</Label>
                      <Input 
                        id="zone-name" 
                        name="name" 
                        defaultValue={editingZone.name}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zone-distance">Distância (km)</Label>
                        <Input 
                          id="zone-distance" 
                          name="distance" 
                          type="number" 
                          step="0.1"
                          min="0"
                          defaultValue={editingZone.distance}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zone-fee">Taxa (R$)</Label>
                        <Input 
                          id="zone-fee" 
                          name="fee" 
                          type="number" 
                          step="0.01"
                          min="0"
                          defaultValue={editingZone.fee}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zone-time">Tempo Estimado (min)</Label>
                      <Input 
                        id="zone-time" 
                        name="estimatedTime" 
                        type="number"
                        min="1"
                        defaultValue={editingZone.estimatedTime}
                        required
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">
                        {editingZone.id ? "Atualizar" : "Criar"} Zona
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Distância</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Tempo Est.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryZones.map(zone => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>{zone.distance} km</TableCell>
                  <TableCell>
                    {zone.fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell>{zone.estimatedTime} min</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingZone(zone);
                          setZoneDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {deliveryZones.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma zona de entrega cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Entregadores */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <h2 className="text-xl font-bold">Entregadores</h2>
            </div>
            
            <Dialog open={personDialogOpen} onOpenChange={setPersonDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setEditingPerson({
                    id: "", 
                    name: "", 
                    contact: "", 
                    vehicle: "", 
                    active: true
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Entregador
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingPerson?.id ? "Editar Entregador" : "Novo Entregador"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure os dados do entregador.
                  </DialogDescription>
                </DialogHeader>
                
                {editingPerson && (
                  <form 
                    className="space-y-4" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      
                      handleSavePerson({
                        id: editingPerson.id,
                        name: formData.get("name") as string,
                        contact: formData.get("contact") as string,
                        vehicle: formData.get("vehicle") as string,
                        active: true
                      });
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="person-name">Nome</Label>
                      <Input 
                        id="person-name" 
                        name="name" 
                        defaultValue={editingPerson.name}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="person-contact">Contato</Label>
                      <Input 
                        id="person-contact" 
                        name="contact" 
                        defaultValue={editingPerson.contact}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="person-vehicle">Veículo</Label>
                      <select 
                        id="person-vehicle"
                        name="vehicle"
                        defaultValue={editingPerson.vehicle}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Moto">Moto</option>
                        <option value="Bicicleta">Bicicleta</option>
                        <option value="Carro">Carro</option>
                        <option value="A pé">A pé</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">
                        {editingPerson.id ? "Atualizar" : "Adicionar"} Entregador
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryPeople.map(person => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.contact}</TableCell>
                  <TableCell>{person.vehicle}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={person.active} 
                      onCheckedChange={() => handleTogglePersonActive(person.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingPerson(person);
                          setPersonDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleDeletePerson(person.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {deliveryPeople.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum entregador cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Catálogo Virtual */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            <h2 className="text-xl font-bold">Catálogo Virtual</h2>
          </div>
          
          <p className="text-muted-foreground">
            Configure o link para o catálogo virtual de vendas online.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="catalog-link">Link do Catálogo</Label>
            <div className="flex gap-2">
              <Input 
                id="catalog-link" 
                value={catalogLink}
                onChange={(e) => setCatalogLink(e.target.value)}
                placeholder="https://seu-catalogo.com"
              />
              <Button onClick={handleSaveCatalogLink}>Salvar</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Este link será utilizado para integração com vendas online.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="space-y-0.5">
              <Label>Integração com WhatsApp</Label>
              <div className="text-sm text-gray-500">
                Enviar informações de pedidos automaticamente via WhatsApp
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        
        {/* Botão de salvar */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={saveDeliverySettings}>Salvar Alterações</Button>
        </div>
      </div>
    </Card>
  );
};
