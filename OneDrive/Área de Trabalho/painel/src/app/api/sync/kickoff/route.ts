import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import { MetaClient, createMetaClientFromConnection } from '@/lib/meta/client'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!userData?.tenant_id) {
      return NextResponse.json(
        { error: 'User tenant not found' },
        { status: 400 }
      )
    }

    const serviceSupabase = createServiceClient()

    // Buscar conexão Meta
    const { data: provider } = await serviceSupabase
      .from('providers')
      .select('id')
      .eq('tenant_id', userData.tenant_id)
      .eq('type', 'meta')
      .single()

    if (!provider) {
      return NextResponse.json(
        { error: 'Meta provider not found' },
        { status: 400 }
      )
    }

    const { data: connection } = await serviceSupabase
      .from('provider_connections')
      .select('access_token_encrypted')
      .eq('tenant_id', userData.tenant_id)
      .eq('provider_id', provider.id)
      .single()

    if (!connection) {
      return NextResponse.json(
        { error: 'Meta connection not found' },
        { status: 400 }
      )
    }

    // Buscar contas de anúncios
    const { data: adAccounts } = await serviceSupabase
      .from('meta_ad_accounts')
      .select('account_id')
      .eq('tenant_id', userData.tenant_id)

    if (!adAccounts || adAccounts.length === 0) {
      return NextResponse.json(
        { error: 'No ad accounts found' },
        { status: 400 }
      )
    }

    // Criar cliente Meta
    const metaClient = await createMetaClientFromConnection({
      access_token_encrypted: connection.access_token_encrypted,
    })

    // Sincronizar dados para cada conta (backfill inicial)
    // Limitar a 90 dias para não sobrecarregar
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 90)

    let totalInsights = 0

    for (const account of adAccounts) {
      try {
        // Buscar insights diários
        const insights = await metaClient.getInsights(
          'campaign',
          account.account_id,
          {
            since: startDate.toISOString().split('T')[0],
            until: endDate.toISOString().split('T')[0],
          },
          ['spend', 'impressions', 'clicks', 'reach', 'actions', 'action_values'],
          'all_days'
        )

        // Processar e salvar insights
        for (const insight of insights) {
          const date = insight.date_start || insight.date
          if (!date) continue

          // Extrair métricas
          const spend = parseFloat(insight.spend || '0')
          const impressions = parseInt(insight.impressions || '0')
          const clicks = parseInt(insight.clicks || '0')
          const reach = parseInt(insight.reach || '0')
          
          // Extrair ações (leads, purchases, etc.)
          const actions = insight.actions || []
          let leads = 0
          let purchases = 0
          
          for (const action of actions) {
            if (action.action_type === 'lead' || action.action_type === 'offsite_conversion.fb_pixel_lead') {
              leads += parseInt(action.value || '0')
            }
            if (action.action_type === 'purchase' || action.action_type === 'offsite_conversion.fb_pixel_purchase') {
              purchases += parseInt(action.value || '0')
            }
          }

          // Calcular métricas derivadas
          const cpm = impressions > 0 ? (spend / impressions) * 1000 : null
          const cpc = clicks > 0 ? spend / clicks : null
          const ctr = impressions > 0 ? (clicks / impressions) * 100 : null
          const cpl = leads > 0 ? spend / leads : null
          const cpa = purchases > 0 ? spend / purchases : null

          // Calcular ROAS se houver action_values
          const actionValues = insight.action_values || []
          let revenue = 0
          for (const av of actionValues) {
            if (av.action_type === 'purchase' || av.action_type === 'offsite_conversion.fb_pixel_purchase') {
              revenue += parseFloat(av.value || '0')
            }
          }
          const roas = revenue > 0 && spend > 0 ? revenue / spend : null

          // Salvar insight diário
          await serviceSupabase.from('insights_daily').upsert({
            tenant_id: userData.tenant_id,
            date: date,
            level: 'campaign',
            account_id: account.account_id,
            campaign_id: insight.campaign_id || null,
            spend: spend,
            impressions: impressions,
            clicks: clicks,
            reach: reach,
            leads: leads,
            purchases: purchases,
            cpm: cpm,
            cpc: cpc,
            ctr: ctr,
            cpl: cpl,
            cpa: cpa,
            roas: roas,
            objective: insight.objective || null,
          }, {
            onConflict: 'tenant_id,date,level,account_id,campaign_id,adset_id,ad_id',
          })

          totalInsights++
        }
      } catch (err) {
        console.error(`Error syncing account ${account.account_id}:`, err)
        // Continuar com outras contas
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sincronização iniciada. ${totalInsights} insights processados.`,
      insightsProcessed: totalInsights,
    })
  } catch (error) {
    console.error('Sync kickoff error:', error)
    return NextResponse.json(
      { error: 'Failed to start sync' },
      { status: 500 }
    )
  }
}

