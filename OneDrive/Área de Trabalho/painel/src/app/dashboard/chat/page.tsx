"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'AI', text: 'Olá! Como posso ajudar com suas campanhas hoje?' },
    { id: 2, sender: 'User', text: 'Quais foram os gastos da minha campanha de Black Friday no mês passado?' },
    { id: 3, sender: 'AI', text: 'Sua campanha de Black Friday gastou R$ 2.500 no mês passado, gerando 200 leads.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { id: messages.length + 1, sender: 'User', text: newMessage }]);
      setNewMessage('');
      // Simular resposta da AI
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, sender: 'AI', text: 'Entendi. Analisando sua solicitação...' },
        ]);
      }, 1000);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chat AI</h1>

      <Card className="p-6 shadow-sm max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'User'
                    ? 'bg-[#0090DB] text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <Input
            placeholder="Digite sua mensagem..."
            className="flex-1 mr-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
