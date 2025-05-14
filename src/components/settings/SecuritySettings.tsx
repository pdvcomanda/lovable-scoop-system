
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Shield, KeyRound, Eye, EyeOff, LockKeyhole, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SecuritySettings = () => {
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [passwordRequireNumbers, setPasswordRequireNumbers] = useState(true);
  const [passwordRequireSymbols, setPasswordRequireSymbols] = useState(true);
  const [passwordRequireUppercase, setPasswordRequireUppercase] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    
    // Length
    if (newPassword.length >= passwordMinLength) strength += 1;
    
    // Numbers
    if (/\d/.test(newPassword)) strength += 1;
    
    // Uppercase
    if (/[A-Z]/.test(newPassword)) strength += 1;
    
    // Symbols
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) strength += 1;
    
    return strength;
  };
  
  const getPasswordStrengthText = () => {
    const strength = passwordStrength();
    if (strength === 0) return "Muito fraca";
    if (strength === 1) return "Fraca";
    if (strength === 2) return "Média";
    if (strength === 3) return "Forte";
    return "Muito forte";
  };
  
  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-green-400";
    return "bg-green-500";
  };
  
  const saveSecuritySettings = () => {
    toast.success("Configurações de segurança salvas com sucesso!");
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-bold">Configurações de Segurança</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Políticas de Senha</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password-length">Comprimento Mínimo</Label>
                  <div className="flex">
                    <Input 
                      id="password-length"
                      type="number"
                      min={6}
                      max={16}
                      value={passwordMinLength}
                      onChange={(e) => setPasswordMinLength(parseInt(e.target.value))}
                    />
                    <span className="ml-2 flex items-center text-sm text-muted-foreground">caracteres</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tempo de Sessão</Label>
                  <Select 
                    value={sessionTimeout}
                    onValueChange={setSessionTimeout}
                  >
                    <SelectTrigger id="session-timeout">
                      <SelectValue placeholder="Selecione o tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="480">8 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Exigir números</Label>
                  <div className="text-sm text-gray-500">
                    A senha deve conter pelo menos um número
                  </div>
                </div>
                <Switch 
                  checked={passwordRequireNumbers}
                  onCheckedChange={setPasswordRequireNumbers}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Exigir símbolos</Label>
                  <div className="text-sm text-gray-500">
                    A senha deve conter pelo menos um símbolo especial
                  </div>
                </div>
                <Switch 
                  checked={passwordRequireSymbols}
                  onCheckedChange={setPasswordRequireSymbols}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Exigir letras maiúsculas</Label>
                  <div className="text-sm text-gray-500">
                    A senha deve conter pelo menos uma letra maiúscula
                  </div>
                </div>
                <Switch 
                  checked={passwordRequireUppercase}
                  onCheckedChange={setPasswordRequireUppercase}
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Autenticação de Dois Fatores</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar autenticação de dois fatores</Label>
                <div className="text-sm text-gray-500">
                  Aumenta a segurança exigindo código de verificação no login
                </div>
              </div>
              <Switch 
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            
            {twoFactorAuth && (
              <div className="mt-4 p-4 border rounded-md bg-muted/20">
                <p className="text-sm mb-4">
                  Para ativar a autenticação de dois fatores, escaneie o QR code abaixo com seu aplicativo de autenticação.
                </p>
                
                <div className="bg-white p-4 mx-auto w-40 h-40 flex items-center justify-center text-sm text-gray-500 border">
                  QR Code simulado para 2FA
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="verification-code">Código de Verificação</Label>
                  <div className="flex gap-2">
                    <Input id="verification-code" placeholder="000000" maxLength={6} />
                    <Button>Verificar</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Teste de Senha</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use esta ferramenta para testar se uma senha atende aos requisitos configurados.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-password">Senha de teste</Label>
                <div className="relative">
                  <Input 
                    id="test-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Digite uma senha para testar"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {newPassword && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Força da senha: {getPasswordStrengthText()}</span>
                      <span>{passwordStrength()}/4</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength() / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm gap-2">
                      {newPassword.length >= passwordMinLength ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>Mínimo de {passwordMinLength} caracteres</span>
                    </li>
                    
                    {passwordRequireNumbers && (
                      <li className="flex items-center text-sm gap-2">
                        {/\d/.test(newPassword) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span>Contém números</span>
                      </li>
                    )}
                    
                    {passwordRequireSymbols && (
                      <li className="flex items-center text-sm gap-2">
                        {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span>Contém símbolos especiais</span>
                      </li>
                    )}
                    
                    {passwordRequireUppercase && (
                      <li className="flex items-center text-sm gap-2">
                        {/[A-Z]/.test(newPassword) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span>Contém letras maiúsculas</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={saveSecuritySettings}>Salvar Alterações</Button>
        </div>
      </div>
    </Card>
  );
};
