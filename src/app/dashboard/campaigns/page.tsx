
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CampaignsPage = () => {
  // Dados mockados para campanhas
  const campaigns = [
    { id: 1, name: 'Campanha de Verão 2024', status: 'Ativa', spend: 'R$ 1.200', leads: '120', cpl: 'R$ 10,00', startDate: '2024-01-01', endDate: '2024-01-31' },
    { id: 2, name: 'Campanha de Inverno 2023', status: 'Pausada', spend: 'R$ 800', leads: '80', cpl: 'R$ 10,00', startDate: '2023-07-01', endDate: '2023-07-31' },
    { id: 3, name: 'Campanha de Black Friday', status: 'Ativa', spend: 'R$ 2.500', leads: '200', cpl: 'R$ 12,50', startDate: '2024-11-01', endDate: '2024-11-30' },
    { id: 4, name: 'Campanha de Natal', status: 'Concluída', spend: 'R$ 1.500', leads: '150', cpl: 'R$ 10,00', startDate: '2023-12-01', endDate: '2023-12-25' },
    { id: 5, name: 'Campanha de Páscoa', status: 'Ativa', spend: 'R$ 500', leads: '50', cpl: 'R$ 10,00', startDate: '2024-03-01', endDate: '2024-03-31' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Campanhas</h1>

      <Card className="p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Input placeholder="Buscar campanha..." className="w-64" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Filtrar</Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Exportar CSV</Button>
            <Button>Nova Campanha</Button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome da Campanha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spend
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leads
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Início
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fim
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.spend}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.leads}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.cpl}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.endDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-[#0090DB] hover:text-[#0073AF]">Ver</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default CampaignsPage;
