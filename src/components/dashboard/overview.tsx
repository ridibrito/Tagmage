'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface DashboardOverviewProps {
  hasConnection?: boolean
  connected?: boolean
  error?: string
}

interface KPIData {
  totalSpend: number
  totalImpressions: number
  totalClicks: number
  avgCTR: number
  totalLeads: number
  totalPurchases: number
  avgCPL: number | null
  avgCPA: number | null
  totalROAS: number | null
}

export function DashboardOverview({ hasConnection = false, connected, error }: DashboardOverviewProps) {
  const router = useRouter()
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (connected) {
      // Mostrar mensagem de sucesso temporariamente
      setTimeout(() => {
        router.replace('/dashboard')
      }, 3000)
    }
  }, [connected, router])

  useEffect(() => {
    if (hasConnection) {
      loadKPIs()
    } else {
      setLoading(false)
    }
  }, [hasConnection])

  const loadKPIs = async () => {
    try {
      const supabase = createClient()
      
      // Buscar tenant_id do usuário
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single()

      if (!userData?.tenant_id) return

      // Buscar insights dos últimos 30 dias
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const { data: insights, error } = await supabase
        .from('insights_daily')
        .select('spend, impressions, clicks, ctr, leads, purchases, cpl, cpa, roas')
        .eq('tenant_id', userData.tenant_id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])

      if (error) {
        console.error('Error loading KPIs:', error)
        return
      }

      if (!insights || insights.length === 0) {
        setLoading(false)
        return
      }

      // Calcular KPIs agregados
      const totalSpend = insights.reduce((sum, i) => sum + (parseFloat(i.spend?.toString() || '0') || 0), 0)
      const totalImpressions = insights.reduce((sum, i) => sum + (parseInt(i.impressions?.toString() || '0') || 0), 0)
      const totalClicks = insights.reduce((sum, i) => sum + (parseInt(i.clicks?.toString() || '0') || 0), 0)
      const totalLeads = insights.reduce((sum, i) => sum + (parseInt(i.leads?.toString() || '0') || 0), 0)
      const totalPurchases = insights.reduce((sum, i) => sum + (parseInt(i.purchases?.toString() || '0') || 0), 0)

      const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
      const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : null
      const avgCPA = totalPurchases > 0 ? totalSpend / totalPurchases : null

      // Calcular ROAS médio ponderado
      let totalRevenue = 0
      let totalSpendForROAS = 0
      for (const insight of insights) {
        const spend = parseFloat(insight.spend?.toString() || '0') || 0
        const roas = parseFloat(insight.roas?.toString() || '0') || 0
        if (roas > 0 && spend > 0) {
          totalRevenue += spend * roas
          totalSpendForROAS += spend
        }
      }
      const totalROAS = totalSpendForROAS > 0 ? totalRevenue / totalSpendForROAS : null

      setKpis({
        totalSpend,
        totalImpressions,
        totalClicks,
        avgCTR,
        totalLeads,
        totalPurchases,
        avgCPL,
        avgCPA,
        totalROAS,
      })
    } catch (err) {
      console.error('Error loading KPIs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Se não houver conexão, mostrar tela de conexão
  if (!hasConnection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe o desempenho das suas campanhas
          </p>
        </div>

        {connected && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-900">Conexão estabelecida com sucesso!</p>
                  <p className="text-sm text-green-700">Seus dados estão sendo sincronizados.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Conectar Meta Ads</CardTitle>
            <CardDescription>
              Conecte sua conta do Meta para começar a visualizar seus dados de campanhas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Para começar, você precisa conectar sua conta do Meta Ads. Isso permitirá que
              você visualize métricas, acompanhe performance e use o Chat AI para fazer perguntas
              sobre suas campanhas.
            </p>
            <Button onClick={() => router.push('/dashboard/connect')} size="lg">
              Conectar Meta Ads
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe o desempenho das suas campanhas
        </p>
      </div>

      {connected && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-900">Conexão estabelecida com sucesso!</p>
                <p className="text-sm text-green-700">Seus dados estão sendo sincronizados. Aguarde alguns minutos.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gasto Total (30 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <div className="text-2xl font-bold">R$ 0,00</div>
                <p className="text-xs text-gray-500 mt-1">Carregando...</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {kpis ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.totalSpend) : 'R$ 0,00'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Impressões</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500 mt-1">Carregando...</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {kpis ? new Intl.NumberFormat('pt-BR').format(kpis.totalImpressions) : '0'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cliques</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500 mt-1">Carregando...</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {kpis ? new Intl.NumberFormat('pt-BR').format(kpis.totalClicks) : '0'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>CTR Médio</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-gray-500 mt-1">Carregando...</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {kpis ? `${kpis.avgCTR.toFixed(2)}%` : '0%'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {kpis && (kpis.totalLeads > 0 || kpis.totalPurchases > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR').format(kpis.totalLeads)}
              </div>
              {kpis.avgCPL && (
                <p className="text-xs text-gray-500 mt-1">
                  CPL: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.avgCPL)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR').format(kpis.totalPurchases)}
              </div>
              {kpis.avgCPA && (
                <p className="text-xs text-gray-500 mt-1">
                  CPA: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.avgCPA)}
                </p>
              )}
            </CardContent>
          </Card>

          {kpis.totalROAS && (
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>ROAS Médio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kpis.totalROAS.toFixed(2)}x
                </div>
                <p className="text-xs text-gray-500 mt-1">Retorno sobre investimento</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Dados ainda não disponíveis</CardTitle>
          <CardDescription>
            Os dados das suas campanhas estão sendo sincronizados. Aguarde alguns minutos.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

