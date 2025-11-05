
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Configurações</h1>

      {/* Gerenciamento de Conexões Meta */}
      <Card className="p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Conexões Meta</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="meta-connection">Status da Conexão Meta:</Label>
            <Input id="meta-connection" value="Conectado (última atualização: 2023-10-26)" readOnly className="mt-1" />
          </div>
          <Button variant="outline">Reconectar Meta</Button>
          <Button variant="destructive">Desconectar Meta</Button>
        </div>
      </Card>

      {/* Gerenciamento de Usuários */}
      <Card className="p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Gerenciamento de Usuários</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="invite-email">Convidar Novo Usuário:</Label>
            <div className="flex mt-1">
              <Input id="invite-email" type="email" placeholder="email@exemplo.com" className="flex-1 mr-2" />
              <Button>Convidar</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Usuários Ativos:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>ricardo.silva@example.com (Admin)</li>
              <li>ana.souza@example.com (Editor)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Outras Configurações */}
      <Card className="p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Outras Configurações</h2>
        <p className="text-gray-700">Outras opções de configuração serão adicionadas aqui, como alertas e vistas salvas.</p>
      </Card>
    </div>
  );
};

export default SettingsPage;
