
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';

export function GeneralSettings() {
  const { profile } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.tenant_id) {
      loadTenantInfo();
    }
  }, [profile]);

  const loadTenantInfo = async () => {
    if (!profile?.tenant_id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setStoreName(data.name || '');
        setLogoUrl(data.logo_url);
        // Aqui poderíamos carregar outros dados como telefone e endereço
        // quando adicionarmos essas colunas ao banco de dados
      }
    } catch (error) {
      console.error('Erro ao carregar informações da loja:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Cria preview temporário
      const objectUrl = URL.createObjectURL(file);
      setLogoUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!profile?.tenant_id) {
      toast.error('Nenhuma loja associada ao seu perfil');
      return;
    }
    
    setSaving(true);
    try {
      // Atualizar dados básicos da loja
      const updates: any = { 
        name: storeName,
        // Aqui poderíamos adicionar outros campos conforme necessário
      };
      
      // Fazer upload do logo se selecionado
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `tenant-${profile.tenant_id}-logo-${Date.now()}.${fileExt}`;
        
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
          
        updates.logo_url = data.publicUrl;
      }
      
      // Atualizar tenant
      const { error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', profile.tenant_id);
      
      if (error) throw error;
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Configurações Gerais</h2>
        <p className="text-muted-foreground">
          Configure as informações básicas da sua loja
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo da Loja</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt="Logo da loja" />
                ) : (
                  <AvatarFallback className="text-lg">
                    {storeName ? storeName.substring(0, 2).toUpperCase() : 'LJ'}
                  </AvatarFallback>
                )}
              </Avatar>
              <Input 
                id="logo" 
                type="file" 
                accept="image/*"
                onChange={handleLogoChange}
                className="max-w-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Recomendado: Imagem quadrada, pelo menos 200x200 pixels.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input 
              id="name" 
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Ex: Açaí Delícia"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
