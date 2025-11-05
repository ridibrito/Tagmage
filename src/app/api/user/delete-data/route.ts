import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

/**
 * Endpoint para solicitar exclusão de dados do usuário
 * Conforme LGPD e políticas do Meta/Facebook
 */
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

    // Buscar tenant_id do usuário
    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!userData?.tenant_id) {
      return NextResponse.json(
        { error: 'User tenant not found' },
        { status: 404 }
      )
    }

    const tenantId = userData.tenant_id
    const serviceClient = createServiceClient()

    // Marcar dados para exclusão (ou excluir imediatamente)
    // Por segurança, vamos excluir imediatamente conforme solicitado

    // 1. Excluir conexões do Meta
    const { data: connections } = await serviceClient
      .from('provider_connections')
      .select('provider_id')
      .eq('tenant_id', tenantId)

    if (connections && connections.length > 0) {
      await serviceClient
        .from('provider_connections')
        .delete()
        .eq('tenant_id', tenantId)

      // Excluir providers
      await serviceClient
        .from('providers')
        .delete()
        .eq('tenant_id', tenantId)
    }

    // 2. Excluir insights e métricas
    await serviceClient
      .from('insights_campaign_daily')
      .delete()
      .eq('tenant_id', tenantId)

    await serviceClient
      .from('insights_campaign_hourly')
      .delete()
      .eq('tenant_id', tenantId)

    // 3. Excluir seleções de campanhas
    await serviceClient
      .from('campaign_selections')
      .delete()
      .eq('tenant_id', tenantId)

    // 4. Excluir usuário
    await serviceClient
      .from('users')
      .delete()
      .eq('id', user.id)

    // 5. Excluir tenant (se não houver outros usuários)
    const { count } = await serviceClient
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (count === 0) {
      await serviceClient
        .from('tenants')
        .delete()
        .eq('id', tenantId)
    }

    // 6. Desativar conta do Supabase Auth
    // Nota: A exclusão completa da conta do Supabase Auth pode requerer
    // ação manual ou uso da API de administração do Supabase

    return NextResponse.json({
      success: true,
      message: 'Solicitação de exclusão processada. Seus dados serão completamente removidos em até 30 dias.',
    })

  } catch (error: any) {
    console.error('Error processing data deletion request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

