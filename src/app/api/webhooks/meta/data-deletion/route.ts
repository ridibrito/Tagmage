import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Webhook para receber notificações de deleção de dados do Meta/Facebook
 * 
 * Conforme exigido pela política de aplicativos do Facebook:
 * https://developers.facebook.com/docs/apps/delete-data
 * 
 * O Facebook enviará uma requisição POST quando um usuário solicitar
 * a exclusão de dados através do Facebook.
 */
export async function POST(request: Request) {
  try {
    // Verificar assinatura HMAC do Facebook (se configurada)
    const signature = request.headers.get('x-hub-signature-256')
    const appSecret = process.env.META_APP_SECRET

    if (appSecret && signature) {
      const body = await request.text()
      const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(body)
        .digest('hex')
      const providedSignature = signature.replace('sha256=', '')

      if (expectedSignature !== providedSignature) {
        console.error('Invalid signature for data deletion webhook')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const payload = await request.json()

    // O payload do Facebook contém:
    // - signed_request: JWT assinado com informações do usuário
    if (payload.signed_request) {
      // Decodificar signed_request (simplificado - você pode usar uma biblioteca JWT)
      const [encodedSignature, encodedPayload] = payload.signed_request.split('.')
      
      // Decodificar payload (base64url)
      const decodedPayload = JSON.parse(
        Buffer.from(
          encodedPayload.replace(/-/g, '+').replace(/_/g, '/'),
          'base64'
        ).toString()
      )

      const userId = decodedPayload.user_id

      if (userId) {
        const supabase = createServiceClient()

        // Buscar conexão do Meta pelo meta_user_id
        const { data: connection } = await supabase
          .from('provider_connections')
          .select('tenant_id, provider_id')
          .eq('meta_user_id', userId)
          .single()

        if (connection) {
          const tenantId = connection.tenant_id

          // Excluir dados do tenant
          // 1. Excluir provider_connections
          await supabase
            .from('provider_connections')
            .delete()
            .eq('tenant_id', tenantId)
            .eq('provider_id', connection.provider_id)

          // 2. Excluir providers
          await supabase
            .from('providers')
            .delete()
            .eq('tenant_id', tenantId)
            .eq('type', 'meta')

          // 3. Excluir insights e métricas
          await supabase
            .from('insights_campaign_daily')
            .delete()
            .eq('tenant_id', tenantId)

          await supabase
            .from('insights_campaign_hourly')
            .delete()
            .eq('tenant_id', tenantId)

          // 4. Excluir seleções de campanhas
          await supabase
            .from('campaign_selections')
            .delete()
            .eq('tenant_id', tenantId)

          console.log(`Data deletion processed for Meta user: ${userId}, tenant: ${tenantId}`)
        } else {
          console.log(`No connection found for Meta user: ${userId}`)
        }
      }
    }

    // Responder com confirmação conforme exigido pelo Facebook
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/data-deletion`,
      confirmation_code: `deletion_${Date.now()}`,
    })

  } catch (error: any) {
    console.error('Error processing data deletion webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint para verificação do webhook pelo Facebook
 * O Facebook pode fazer uma requisição GET para verificar o endpoint
 */
export async function GET(request: Request) {
  const mode = request.nextUrl.searchParams.get('hub.mode')
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  const challenge = request.nextUrl.searchParams.get('hub.challenge')

  // Verificar token (configure um token secreto no Meta App Dashboard)
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  )
}

