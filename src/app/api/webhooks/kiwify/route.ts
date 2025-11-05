import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-kiwify-signature')

    // Verificar assinatura do webhook
    if (process.env.KIWIFY_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.KIWIFY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex')

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const data = JSON.parse(body)
    const event = data.event || data.type

    // Processar eventos de compra (ajustar conforme API da Kiwify)
    if (event === 'order.approved' || event === 'ORDER_APPROVED') {
      const order = data.data || data
      const buyerEmail = order.customer?.email || order.buyer_email
      const orderId = order.id || order.order_id || order.transaction_id
      const productId = order.product?.id || order.product_id || order.sku

      if (!buyerEmail || !orderId) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      const supabase = createServiceClient()

      // Buscar ou criar tenant (mesma lógica do Hotmart)
      let { data: existingLicense } = await supabase
        .from('licenses')
        .select('tenant_id')
        .eq('provider', 'kiwify')
        .eq('external_purchase_id', orderId)
        .single()

      let tenantId = existingLicense?.tenant_id

      if (!tenantId) {
        const { data: newTenant, error: tenantError } = await supabase
          .from('tenants')
          .insert({
            name: buyerEmail.split('@')[0],
            plan: 'basic',
            status: 'active',
          })
          .select('id')
          .single()

        if (tenantError || !newTenant) {
          console.error('Error creating tenant:', tenantError)
          return NextResponse.json(
            { error: 'Failed to create tenant' },
            { status: 500 }
          )
        }

        tenantId = newTenant.id

        const { data: authUser, error: userError } = await supabase.auth.admin.createUser({
          email: buyerEmail,
          email_confirm: true,
        })

        if (userError || !authUser.user) {
          console.error('Error creating user:', userError)
        } else {
          await supabase.from('users').insert({
            id: authUser.user.id,
            tenant_id: tenantId,
            name: buyerEmail.split('@')[0],
            email: buyerEmail,
            role: 'owner',
          })
        }
      }

      const expiresAt = order.expires_at 
        ? new Date(order.expires_at).toISOString()
        : null

      await supabase.from('licenses').upsert({
        tenant_id: tenantId,
        provider: 'kiwify',
        external_purchase_id: orderId,
        sku: productId || null,
        status: 'approved',
        expires_at: expiresAt,
      }, {
        onConflict: 'provider,external_purchase_id',
      })

      return NextResponse.json({ 
        success: true,
        tenant_id: tenantId 
      })
    }

    // Processar outros eventos
    if (event === 'order.refunded' || event === 'ORDER_REFUNDED') {
      const order = data.data || data
      const orderId = order.id || order.order_id

      if (orderId) {
        const supabase = createServiceClient()
        await supabase
          .from('licenses')
          .update({ status: 'refunded' })
          .eq('provider', 'kiwify')
          .eq('external_purchase_id', orderId)
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ 
      message: 'Event not processed',
      event 
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

