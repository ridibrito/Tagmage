import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Obter tenant_id do usuário
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.tenant_id) {
    return NextResponse.json(
      { error: 'User tenant not found. Please login first.' },
      { status: 400 }
    )
  }

  const tenantId = userData.tenant_id

  // Parâmetros OAuth do Meta
  const appId = process.env.META_APP_ID
  const redirectUri = encodeURIComponent(process.env.META_REDIRECT_URI || '')
  const state = Buffer.from(JSON.stringify({ 
    tenant_id: tenantId,
    user_id: user.id
  })).toString('base64')

  // Solicitar apenas permissões necessárias
  // Removido 'pages_read_engagement' pois não está sendo utilizado
  const scopes = [
    'ads_read',
    'business_management',
  ].join(',')

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}&response_type=code`

  return redirect(authUrl)
}

