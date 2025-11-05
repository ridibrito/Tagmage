'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
// Removido imports que não podem ser usados no cliente

interface ConnectWizardProps {
  tenantId: string
  userId: string
  initialStep?: number
  error?: string
}

type Step = 'connect' | 'business' | 'account' | 'campaigns' | 'summary'

interface Business {
  id: string
  name: string
}

interface AdAccount {
  account_id: string
  name: string
  currency?: string
  timezone?: string
}

interface Campaign {
  campaign_id: string
  name: string
  objective?: string
  status?: string
}

export function ConnectWizard({ tenantId, userId, initialStep = 1, error }: ConnectWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<number>(initialStep)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(error || null)

  // Estado do wizard
  const [providerId, setProviderId] = useState<string | null>(null)
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([])

  // Verificar se já existe conexão
  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    try {
      const supabase = createClient()
      
      // Buscar provider Meta
      const { data: provider } = await supabase
        .from('providers')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('type', 'meta')
        .single()

      if (provider) {
        setProviderId(provider.id)

        // Buscar conexão
        const { data: connection } = await supabase
          .from('provider_connections')
          .select('id, access_token_encrypted')
          .eq('tenant_id', tenantId)
          .eq('provider_id', provider.id)
          .single()

        if (connection) {
          setConnectionId(connection.id)
          // Se já tem conexão, pular para passo 2
          if (step === 1) {
            setStep(2)
            loadBusinesses()
          }
        }
      }
    } catch (err) {
      console.error('Error checking connection:', err)
    }
  }

  const handleConnectMeta = () => {
    window.location.href = '/api/meta/oauth/start'
  }

  const loadBusinesses = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/meta/businesses')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao carregar Business Managers')
      }

      const data = await response.json()
      setBusinesses(data.businesses || [])

      if (data.businesses.length === 0) {
        setErrorMessage('Nenhum Business Manager encontrado. Verifique as permissões da sua conta Meta.')
      }
    } catch (err: any) {
      console.error('Error loading businesses:', err)
      setErrorMessage(`Erro ao carregar Business Managers: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBusiness = async (businessId: string) => {
    setSelectedBusinessId(businessId)
    setLoading(true)

    try {
      const response = await fetch(`/api/meta/accounts?business_id=${businessId}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao carregar contas de anúncios')
      }

      const data = await response.json()
      setAdAccounts(data.accounts || [])

      // Salvar business selecionado
      const supabase = createClient()
      await supabase.from('meta_businesses').upsert({
        tenant_id: tenantId,
        provider_id: providerId!,
        business_id: businessId,
        name: businesses.find(b => b.id === businessId)?.name || businessId,
      }, {
        onConflict: 'tenant_id,business_id',
      })

      setStep(3)
    } catch (err: any) {
      console.error('Error loading ad accounts:', err)
      setErrorMessage(`Erro ao carregar contas de anúncios: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAccounts = async (accountIds: string[]) => {
    setSelectedAccountIds(accountIds)
    
    if (accountIds.length === 0) {
      setCampaigns([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/meta/campaigns?account_ids=${accountIds.join(',')}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao carregar campanhas')
      }

      const data = await response.json()
      setCampaigns(data.campaigns || [])

      // Salvar contas selecionadas
      const supabase = createClient()
      for (const accountId of accountIds) {
        const account = adAccounts.find(acc => acc.account_id === accountId)
        if (account) {
          await supabase.from('meta_ad_accounts').upsert({
            tenant_id: tenantId,
            provider_id: providerId!,
            business_id: selectedBusinessId || null,
            account_id: accountId,
            name: account.name,
            currency: account.currency || null,
            timezone: account.timezone || null,
          }, {
            onConflict: 'tenant_id,account_id',
          })
        }
      }

      setStep(4)
    } catch (err: any) {
      console.error('Error loading campaigns:', err)
      setErrorMessage(`Erro ao carregar campanhas: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Salvar campanhas selecionadas
      for (const campaignId of selectedCampaignIds) {
        const campaign = campaigns.find(c => c.campaign_id === campaignId)
        if (campaign) {
          // Assumir primeira conta (pode melhorar depois)
          const accountId = selectedAccountIds[0]
          if (accountId) {
            await supabase.from('meta_campaigns').upsert({
              tenant_id: tenantId,
              account_id: accountId,
              campaign_id: campaignId,
              name: campaign.name,
              objective: campaign.objective || null,
              status: campaign.status || null,
            }, {
              onConflict: 'tenant_id,account_id,campaign_id',
            })
          }
        }
      }

      // Disparar job de backfill inicial
      try {
        await fetch('/api/sync/kickoff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (err) {
        console.error('Error triggering sync:', err)
        // Continuar mesmo se falhar
      }

      router.push('/dashboard?connected=true')
    } catch (err: any) {
      console.error('Error finishing setup:', err)
      setErrorMessage(`Erro ao finalizar configuração: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Conectar Meta', description: 'Autorize o acesso à sua conta Meta' },
    { number: 2, title: 'Business Manager', description: 'Selecione o Business Manager' },
    { number: 3, title: 'Contas de Anúncios', description: 'Selecione as contas de anúncios' },
    { number: 4, title: 'Campanhas', description: 'Selecione as campanhas para monitorar' },
    { number: 5, title: 'Resumo', description: 'Confirme as seleções' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conectar Meta Ads</h1>
        <p className="text-gray-600">
          Configure sua conexão com o Meta Ads para começar a monitorar suas campanhas
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === s.number
                      ? 'bg-primary text-white'
                      : step > s.number
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.number ? '✓' : s.number}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-900">{s.title}</div>
                  <div className="text-xs text-gray-500">{s.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s.number ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
              {errorMessage}
            </div>
          )}

          {step === 1 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Conectar com Meta</h3>
              <p className="text-gray-600">
                Você será redirecionado para autorizar o acesso à sua conta Meta.
                Serão solicitadas apenas permissões de leitura para visualizar suas métricas.
              </p>
              <Button onClick={handleConnectMeta} size="lg">
                Conectar com Meta
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Selecione o Business Manager</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando Business Managers...</p>
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  Nenhum Business Manager encontrado.
                </div>
              ) : (
                <div className="space-y-2">
                  {businesses.map((business) => (
                    <button
                      key={business.id}
                      onClick={() => handleSelectBusiness(business.id)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                        selectedBusinessId === business.id
                          ? 'border-primary bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{business.name}</div>
                      <div className="text-sm text-gray-500">ID: {business.id}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Selecione as Contas de Anúncios</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando contas...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {adAccounts.map((account) => (
                      <label
                        key={account.account_id}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAccountIds.includes(account.account_id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAccountIds([...selectedAccountIds, account.account_id])
                            } else {
                              setSelectedAccountIds(
                                selectedAccountIds.filter((id) => id !== account.account_id)
                              )
                            }
                          }}
                          className="mr-3 w-5 h-5 text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-gray-500">
                            {account.account_id} {account.currency && `• ${account.currency}`}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {adAccounts.length > 0 && (
                    <Button
                      onClick={() => handleSelectAccounts(selectedAccountIds)}
                      disabled={selectedAccountIds.length === 0 || loading}
                      className="w-full mt-4"
                    >
                      Continuar ({selectedAccountIds.length} {selectedAccountIds.length === 1 ? 'conta selecionada' : 'contas selecionadas'})
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Selecione as Campanhas</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando campanhas...</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Buscar campanha..."
                      className="w-full px-3 py-2 border rounded-md"
                      onChange={(e) => {
                        // Implementar busca se necessário
                      }}
                    />
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {campaigns
                      .filter((c) => c.status === 'ACTIVE' || !c.status)
                      .slice(0, 100)
                      .map((campaign) => (
                        <label
                          key={campaign.campaign_id}
                          className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCampaignIds.includes(campaign.campaign_id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCampaignIds([...selectedCampaignIds, campaign.campaign_id])
                              } else {
                                setSelectedCampaignIds(
                                  selectedCampaignIds.filter((id) => id !== campaign.campaign_id)
                                )
                              }
                            }}
                            className="mr-3 w-5 h-5 text-primary"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-gray-500">
                              {campaign.objective && `• ${campaign.objective}`} {campaign.status && `• ${campaign.status}`}
                            </div>
                          </div>
                        </label>
                      ))}
                  </div>
                  {campaigns.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => {
                          // Selecionar todas as campanhas ativas
                          const activeCampaigns = campaigns
                            .filter((c) => c.status === 'ACTIVE' || !c.status)
                            .slice(0, 100)
                            .map((c) => c.campaign_id)
                          setSelectedCampaignIds(activeCampaigns)
                        }}
                        variant="outline"
                      >
                        Selecionar todas ativas
                      </Button>
                      <Button
                        onClick={() => setStep(5)}
                        disabled={selectedCampaignIds.length === 0 || loading}
                        className="flex-1"
                      >
                        Continuar ({selectedCampaignIds.length} {selectedCampaignIds.length === 1 ? 'campanha selecionada' : 'campanhas selecionadas'})
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Resumo da Configuração</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Manager</h4>
                  <p className="text-gray-600">
                    {businesses.find(b => b.id === selectedBusinessId)?.name || 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contas de Anúncios</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedAccountIds.map((accountId) => {
                      const account = adAccounts.find(a => a.account_id === accountId)
                      return (
                        <li key={accountId}>{account?.name || accountId}</li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Campanhas Selecionadas</h4>
                  <p className="text-gray-600">
                    {selectedCampaignIds.length} {selectedCampaignIds.length === 1 ? 'campanha' : 'campanhas'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setStep(4)}
                  variant="outline"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Finalizando...' : 'Finalizar Configuração'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

