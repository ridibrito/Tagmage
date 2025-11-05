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
    const businessId = searchParams.get('business_id')

    if (!businessId) {
      return NextResponse.json(
        { error: 'business_id is required' },
        { status: 400 }
      )
    }

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

    const accounts = await metaClient.getAdAccounts(businessId)

    return NextResponse.json({
      accounts: accounts.map((acc: any) => ({
        account_id: acc.account_id || acc.id,
        name: acc.name,
        currency: acc.currency,
        timezone: acc.timezone,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching ad accounts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ad accounts' },
      { status: 500 }
    )
  }
}

