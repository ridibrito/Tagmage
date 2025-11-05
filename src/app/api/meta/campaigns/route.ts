import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import { createMetaClientFromConnection } from '@/lib/meta/client'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    // TEMPORARIAMENTE: Não retornar erro se não houver usuário (para debug)
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const accountIds = searchParams.get('account_ids')

    if (!accountIds) {
      return NextResponse.json(
        { error: 'account_ids is required' },
        { status: 400 }
      )
    }

    const accountIdsArray = accountIds.split(',')

    let tenantId = null

    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single()
      
      tenantId = userData?.tenant_id || null
    } else if (session?.user) {
      const { data: tempUserData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', session.user.id)
        .single()
      
      if (tempUserData?.tenant_id) {
        tenantId = tempUserData.tenant_id
      }
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'User tenant not found. Please login first.' },
        { status: 400 }
      )
    }

    const serviceSupabase = createServiceClient()

    // Buscar provider e conexão
    const { data: provider } = await serviceSupabase
      .from('providers')
      .select('id')
      .eq('tenant_id', tenantId)
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
      .eq('tenant_id', tenantId)
      .eq('provider_id', provider.id)
      .single()

    if (!connection) {
      return NextResponse.json(
        { error: 'Meta connection not found' },
        { status: 400 }
      )
    }

    const metaClient = await createMetaClientFromConnection({
      access_token_encrypted: connection.access_token_encrypted,
    })

    // Buscar campanhas de todas as contas
    const allCampaigns: any[] = []

    for (const accountId of accountIdsArray) {
      try {
        const campaigns = await metaClient.getCampaigns(accountId)
        allCampaigns.push(...campaigns.map((c: any) => ({
          campaign_id: c.id,
          name: c.name,
          objective: c.objective,
          status: c.status,
          account_id: accountId,
        })))
      } catch (err) {
        console.error(`Error loading campaigns for account ${accountId}:`, err)
      }
    }

    return NextResponse.json({
      campaigns: allCampaigns,
    })
  } catch (error: any) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

