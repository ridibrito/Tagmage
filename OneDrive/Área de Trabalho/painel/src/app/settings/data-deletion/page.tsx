"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DataDeletionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // TODO: Implementar chamada à API para processar deleção de dados
      const response = await fetch('/api/user/delete-data', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erro ao processar solicitação')
      }

      setSubmitted(true)
    } catch (err) {
      setError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente ou entre em contato conosco.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-[#0090DB] hover:underline">
            ← Voltar para o dashboard
          </Link>
        </div>

        <Card className="p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Solicitação de Exclusão de Dados
          </h1>

          {!submitted ? (
            <>
              <div className="prose prose-sm max-w-none space-y-6 text-gray-700 mb-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">
                    Sobre a Exclusão de Dados
                  </h2>
                  <p>
                    Você pode solicitar a exclusão de todos os seus dados associados à sua conta no Tagmage. 
                    Isso inclui:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li>Dados da sua conta (nome, email, configurações)</li>
                    <li>Dados de campanhas sincronizados do Meta/Facebook</li>
                    <li>Métricas e insights armazenados</li>
                    <li>Histórico de uso da plataforma</li>
                    <li>Tokens de acesso ao Meta/Facebook</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">
                    Processo de Exclusão
                  </h2>
                  <p className="mb-3">
                    Quando você solicitar a exclusão de dados:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Sua solicitação será processada imediatamente</li>
                    <li>Seus dados serão marcados para exclusão</li>
                    <li>O processo de exclusão será concluído em até 30 dias</li>
                    <li>Você receberá uma confirmação por e-mail quando a exclusão for concluída</li>
                    <li>Após a exclusão, sua conta será permanentemente removida e não poderá ser recuperada</li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">
                    Exclusão de Dados do Facebook/Meta
                  </h2>
                  <p className="mb-3">
                    Se você conectou sua conta do Facebook/Meta, também podemos notificar o Facebook sobre sua 
                    solicitação de exclusão de dados, conforme exigido pela política de aplicativos do Facebook.
                  </p>
                  <p>
                    Você pode revogar o acesso do nosso aplicativo às suas informações do Facebook a qualquer momento 
                    através das <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer" className="text-[#0090DB] hover:underline">Configurações do Facebook</a>.
                  </p>
                </section>

                <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-800">
                    ⚠️ Atenção
                  </h3>
                  <p className="text-yellow-800">
                    Esta ação é <strong>irreversível</strong>. Após a exclusão, você não poderá recuperar seus dados 
                    ou reativar sua conta. Certifique-se de exportar quaisquer dados importantes antes de continuar.
                  </p>
                </section>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? 'Processando...' : 'Solicitar Exclusão de Dados'}
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-3 text-green-800">
                  ✓ Solicitação Recebida
                </h2>
                <p className="text-green-700 mb-4">
                  Sua solicitação de exclusão de dados foi recebida e será processada em até 30 dias.
                </p>
                <p className="text-sm text-green-600">
                  Você receberá uma confirmação por e-mail quando a exclusão for concluída.
                </p>
              </div>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Voltar para o Dashboard
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Precisa de ajuda?</strong>
            </p>
            <p className="text-sm text-gray-600">
              Entre em contato conosco em{' '}
              <a href="mailto:privacy@tagmage.com" className="text-[#0090DB] hover:underline">
                privacy@tagmage.com
              </a>
              {' '}ou consulte nossa{' '}
              <Link href="/privacy" className="text-[#0090DB] hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

