"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ConnectPage = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 5));
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Passo 1: Conectar ao Meta</h2>
            <p className="text-gray-700 mb-4">Clique no botão abaixo para iniciar o processo de conexão com sua conta do Meta.</p>
            <Button>Conectar com Meta</Button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Passo 2: Selecionar Business Manager</h2>
            <p className="text-gray-700 mb-4">Selecione o Business Manager que deseja conectar.</p>
            <select className="border p-2 rounded-md w-full">
              <option>Meu Business Manager 1</option>
              <option>Meu Business Manager 2</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Passo 3: Selecionar Contas de Anúncio</h2>
            <p className="text-gray-700 mb-4">Selecione as contas de anúncio que deseja sincronizar.</p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Conta de Anúncio 1
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Conta de Anúncio 2
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Conta de Anúncio 3
              </label>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Passo 4: Selecionar Campanhas</h2>
            <p className="text-gray-700 mb-4">Selecione as campanhas que deseja monitorar.</p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Campanha X
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Campanha Y
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Campanha Z
              </label>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Passo 5: Resumo e Confirmação</h2>
            <p className="text-gray-700 mb-4">Revise suas seleções e confirme a conexão.</p>
            <ul className="list-disc list-inside mb-4">
              <li>Business Manager: Meu Business Manager 1</li>
              <li>Contas de Anúncio: 3 selecionadas</li>
              <li>Campanhas: 3 selecionadas</li>
            </ul>
            <Button>Confirmar Conexão</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Wizard de Conexão Meta</h1>

      <Card className="p-6 shadow-sm max-w-2xl mx-auto">
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${s === step ? 'bg-[#0090DB] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {s}
            </div>
          ))}
        </div>

        {renderStepContent()}

        <div className="mt-6 flex justify-between">
          <Button onClick={handleBack} disabled={step === 1} variant="outline">
            Anterior
          </Button>
          <Button onClick={handleNext} disabled={step === 5}>
            {step === 5 ? 'Finalizar' : 'Próximo'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConnectPage;


