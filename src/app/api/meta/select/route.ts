import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

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

    const body = await request.json()
    const { businessId, accountIds, campaignIds } = body

    const serviceSupabase = createServiceClient()

    // Buscar provider
    const { data: provider } = await serviceSupabase
      .from('providers')
      .select('id')
      .eq('tenant_id', userData.tenant_id)
      .eq('type', 'meta')
      .single()

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 400 }
      )
    }

    // Salvar Business Manager
    if (businessId) {
      await serviceSupabase.from('meta_businesses').upsert({
        tenant_id: userData.tenant_id,
        provider_id: provider.id,
        business_id: businessId,
        name: body.businessName || businessId,
      }, {
        onConflict: 'tenant_id,business_id',
      })
    }

    // Salvar Contas de Anúncios
    if (accountIds && Array.isArray(accountIds)) {
      for (const account of accountIds) {
        await serviceSupabase.from('meta_ad_accounts').upsert({
          tenant_id: userData.tenant_id,
          provider_id: provider.id,
          business_id: businessId || null,
          account_id: account.account_id || account,
          name: account.name || account.account_id || account,
          currency: account.currency || null,
          timezone: account.timezone || null,
        }, {
          onConflict: 'tenant_id,account_id',
        })
      }
    }

    // Salvar Campanhas
    if (campaignIds && Array.isArray(campaignIds)) {
      for (const campaign of campaignIds) {
        const accountId = campaign.account_id || accountIds?.[0]?.account_id || accountIds?.[0]
        if (accountId) {
          await serviceSupabase.from('meta_campaigns').upsert({
            tenant_id: userData.tenant_id,
            account_id: accountId,
            campaign_id: campaign.campaign_id || campaign,
            name: campaign.name || campaign.campaign_id || campaign,
            objective: campaign.objective || null,
            status: campaign.status || null,
          }, {
            onConflict: 'tenant_id,account_id,campaign_id',
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving selections:', error)
    return NextResponse.json(
      { error: 'Failed to save selections' },
      { status: 500 }
    )
  }
}

