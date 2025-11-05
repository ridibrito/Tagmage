import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { encrypt } from '@/lib/crypto'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state')
  const error = requestUrl.searchParams.get('error')

  if (error) {
    return redirect('/dashboard?error=oauth_cancelled')
  }

  if (!code || !state) {
    return redirect('/dashboard?error=invalid_oauth')
  }

  try {
    // Decodificar state
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    const { tenant_id, user_id } = stateData

    // Trocar code por access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${process.env.META_APP_ID}&` +
      `client_secret=${process.env.META_APP_SECRET}&` +
      `redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI || '')}&` +
      `code=${code}`,
      { method: 'GET' }
    )

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('Token exchange failed:', tokenData)
      return redirect('/dashboard?error=token_exchange_failed')
    }

    // Validar se as permissões solicitadas foram concedidas
    const requestedScopes = ['ads_read', 'business_management']
    const grantedScopes = tokenData.scopes || []
    
    const missingScopes = requestedScopes.filter(scope => !grantedScopes.includes(scope))
    if (missingScopes.length > 0) {
      console.warn('Missing required scopes:', missingScopes)
      // Continuar mesmo assim, mas avisar o usuário
    }

    // Obter informações do usuário Meta
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${tokenData.access_token}&fields=id,name,email`
    )
    const metaUser = await userResponse.json()

    const supabase = createServiceClient()

    // Buscar ou criar provider
    let { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('tenant_id', tenant_id)
      .eq('type', 'meta')
      .single()

    if (!provider) {
      const { data: newProvider, error: providerError } = await supabase
        .from('providers')
        .insert({
          tenant_id,
          type: 'meta',
          status: 'active',
        })
        .select('id')
        .single()

      if (providerError || !newProvider) {
        console.error('Error creating provider:', providerError)
        return redirect('/dashboard?error=provider_creation_failed')
      }

      provider = newProvider
    }

    // Criptografar tokens
    const accessTokenEncrypted = encrypt(tokenData.access_token)
    const refreshTokenEncrypted = tokenData.refresh_token
      ? encrypt(tokenData.refresh_token)
      : null

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null

    // Criar ou atualizar conexão
    await supabase.from('provider_connections').upsert({
      tenant_id,
      provider_id: provider.id,
      meta_user_id: metaUser.id,
      access_token_encrypted: accessTokenEncrypted,
      refresh_token_encrypted: refreshTokenEncrypted,
      token_expires_at: expiresAt,
      permissions: tokenData.scopes || [],
    }, {
      onConflict: 'tenant_id,provider_id',
    })

  } catch (error: any) {
    console.error('OAuth callback error:', error)
    console.error('OAuth callback error message:', error.message)
    console.error('OAuth callback error stack:', error.stack)
    return redirect('/dashboard?error=oauth_failed')
  }

  // Redirecionamento de sucesso movido para fora do try-catch
  return redirect('/dashboard/connect?step=2&connected=true')
}

