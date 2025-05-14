
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Database, Clock, Save, Upload, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export const BackupSettings = () => {
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupTime, setBackupTime] = useState("00:00");
  const [backupDate, setBackupDate] = useState<Date | undefined>(new Date());
  const [backupProgress, setBackupProgress] = useState<number | null>(null);
  const [restoreProgress, setRestoreProgress] = useState<number | null>(null);
  
  // Lista de backups fictícios
  const backupList = [
    { id: "1", name: "Backup Automático", date: "2025-05-14 00:00:00", size: "24.5 MB" },
    { id: "2", name: "Backup Automático", date: "2025-05-13 00:00:00", size: "24.3 MB" },
    { id: "3", name: "Backup Manual", date: "2025-05-12 15:30:45", size: "24.2 MB" },
  ];
  
  // Simular backup manual
  const handleManualBackup = () => {
    setBackupProgress(0);
    toast.info("Iniciando backup manual...");
    
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          toast.success("Backup concluído com sucesso!");
          setTimeout(() => setBackupProgress(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Simular restauração de backup
  const handleRestoreBackup = (id: string) => {
    setRestoreProgress(0);
    toast.info(`Iniciando restauração do backup ${id}...`);
    
    const interval = setInterval(() => {
      setRestoreProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          toast.success("Restauração concluída com sucesso!");
          setTimeout(() => setRestoreProgress(null), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };
  
  // Simular download de backup
  const handleDownloadBackup = (id: string) => {
    toast.success(`Backup ${id} disponível para download!`);
    // Em um app real, aqui seria gerado um arquivo para download
  };
  
  const saveBackupSettings = () => {
    toast.success("Configurações de backup salvas com sucesso!");
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <h2 className="text-xl font-bold">Backup e Restauração</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Automático</Label>
              <div className="text-sm text-gray-500">
                Realizar backup automático do sistema
              </div>
            </div>
            <Switch 
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>
          
          {autoBackup && (
            <div className="space-y-4 p-4 border rounded-md bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Frequência</Label>
                  <Select
                    value={backupFrequency}
                    onValueChange={setBackupFrequency}
                  >
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {backupFrequency === "weekly" && (
                  <div className="space-y-2">
                    <Label htmlFor="backup-day">Dia da Semana</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="backup-day">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Segunda-feira</SelectItem>
                        <SelectItem value="2">Terça-feira</SelectItem>
                        <SelectItem value="3">Quarta-feira</SelectItem>
                        <SelectItem value="4">Quinta-feira</SelectItem>
                        <SelectItem value="5">Sexta-feira</SelectItem>
                        <SelectItem value="6">Sábado</SelectItem>
                        <SelectItem value="0">Domingo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {backupFrequency === "monthly" && (
                  <div className="space-y-2">
                    <Label>Dia do Mês</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !backupDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {backupDate ? (
                            format(backupDate, "dd 'de' MMMM", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={backupDate}
                          onSelect={setBackupDate}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-time">Horário</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="backup-time"
                    type="time"
                    value={backupTime}
                    onChange={(e) => setBackupTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Backup Manual</h3>
              <Button onClick={handleManualBackup} disabled={backupProgress !== null}>
                <Save className="mr-2 h-4 w-4" />
                {backupProgress !== null ? "Fazendo Backup..." : "Fazer Backup Agora"}
              </Button>
            </div>
            
            {backupProgress !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Backups Disponíveis</h3>
            
            <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
              {backupList.map((backup) => (
                <div key={backup.id} className="p-3 flex items-center justify-between bg-card">
                  <div>
                    <div className="font-medium">{backup.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Data: {new Date(backup.date).toLocaleString('pt-BR')} | Tamanho: {backup.size}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadBackup(backup.id)}
                      disabled={restoreProgress !== null}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleRestoreBackup(backup.id)}
                      disabled={restoreProgress !== null}
                    >
                      <Upload className="mr-1 h-4 w-4" />
                      Restaurar
                    </Button>
                  </div>
                </div>
              ))}
              
              {backupList.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum backup disponível.
                </div>
              )}
            </div>
            
            {restoreProgress !== null && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Restaurando backup</span>
                  <span>{restoreProgress}%</span>
                </div>
                <Progress value={restoreProgress} />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={saveBackupSettings}>Salvar Alterações</Button>
        </div>
      </div>
    </Card>
  );
};
