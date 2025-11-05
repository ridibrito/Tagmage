"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  // Dados mockados para KPIs
  const kpis = [
    { title: 'Spend', value: 'R$ 12.345,67', change: '+12%', trend: 'up' },
    { title: 'Impressions', value: '1.2M', change: '+8%', trend: 'up' },
    { title: 'Clicks', value: '50K', change: '+15%', trend: 'up' },
    { title: 'CTR', value: '4.1%', change: '+0.5%', trend: 'up' },
    { title: 'CPC', value: 'R$ 0,25', change: '-5%', trend: 'down' },
    { title: 'CPM', value: 'R$ 10,00', change: '+2%', trend: 'up' },
    { title: 'Leads', value: '1.500', change: '+20%', trend: 'up' },
    { title: 'CPL', value: 'R$ 8,23', change: '-10%', trend: 'down' },
    { title: 'CPA', value: 'R$ 15,00', change: '-8%', trend: 'down' },
  ];

  // Dados mockados para o gráfico de tendência
  const chartData = [
    { name: 'Jan', Spend: 4000, Impressions: 120000, Clicks: 5000 },
    { name: 'Fev', Spend: 3000, Impressions: 90000, Clicks: 3800 },
    { name: 'Mar', Spend: 2000, Impressions: 60000, Clicks: 2500 },
    { name: 'Abr', Spend: 2780, Impressions: 85000, Clicks: 3200 },
    { name: 'Mai', Spend: 1890, Impressions: 55000, Clicks: 2100 },
    { name: 'Jun', Spend: 2390, Impressions: 72000, Clicks: 2800 },
    { name: 'Jul', Spend: 3490, Impressions: 105000, Clicks: 4200 },
  ];

  // Dados mockados para Top 5 Campanhas
  const topCampaigns = [
    { id: 1, name: 'Campanha de Lançamento Produto X', spend: 'R$ 5.000', leads: '500', cpl: 'R$ 10,00' },
    { id: 2, name: 'Campanha de Remarketing', spend: 'R$ 3.000', leads: '300', cpl: 'R$ 10,00' },
    { id: 3, name: 'Campanha de Aquisição Google', spend: 'R$ 2.500', leads: '200', cpl: 'R$ 12,50' },
    { id: 4, name: 'Campanha de Branding', spend: 'R$ 1.500', leads: '50', cpl: 'R$ 30,00' },
    { id: 5, name: 'Campanha de Engajamento', spend: 'R$ 1.000', leads: '100', cpl: 'R$ 10,00' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      {/* Filtros de Período */}
      <div className="mb-6 flex space-x-2">
        <Button variant="outline">7 Dias</Button>
        <Button variant="outline">14 Dias</Button>
        <Button variant="default">30 Dias</Button>
        <Button variant="outline">Mês Atual</Button>
        <Button variant="outline">Custom</Button>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, index) => (
          <Card key={index} className="p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            <p className={`text-sm mt-1 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {kpi.change} vs. período anterior
            </p>
          </Card>
        ))}
      </div>

      {/* Gráfico de Tendência */}
      <Card className="p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tendência de Gastos</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '']}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="Spend" 
                stroke="#0090DB" 
                strokeWidth={2}
                dot={{ fill: '#0090DB', r: 4 }}
                activeDot={{ r: 6 }}
                name="Gastos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top 5 Campanhas */}
      <Card className="p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top 5 Campanhas</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campanha
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.spend}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.leads}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.cpl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default DashboardPage;
