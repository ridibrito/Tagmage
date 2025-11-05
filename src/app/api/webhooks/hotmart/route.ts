import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hotmart-signature')

    // Verificar assinatura do webhook
    if (process.env.HOTMART_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.HOTMART_WEBHOOK_SECRET)
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

    // Processar eventos de compra
    if (event === 'PURCHASE_APPROVED' || event === 'purchase.approved') {
      const purchase = data.data || data
      const buyerEmail = purchase.buyer?.email || purchase.buyer_email
      const purchaseId = purchase.id || purchase.purchase_id || purchase.transaction
      const sku = purchase.product?.id || purchase.product_id || purchase.sku

      if (!buyerEmail || !purchaseId) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      const supabase = createServiceClient()

      // Buscar ou criar tenant
      let { data: existingLicense } = await supabase
        .from('licenses')
        .select('tenant_id')
        .eq('provider', 'hotmart')
        .eq('external_purchase_id', purchaseId)
        .single()

      let tenantId = existingLicense?.tenant_id

      if (!tenantId) {
        // Criar novo tenant
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

        // Criar usuário owner
        const { data: authUser, error: userError } = await supabase.auth.admin.createUser({
          email: buyerEmail,
          email_confirm: true,
        })

        if (userError || !authUser.user) {
          console.error('Error creating user:', userError)
          // Continuar mesmo se falhar criação de usuário
        } else {
          await supabase.from('users').insert({
            id: authUser.user.id,
            tenant_id: tenantId,
            name: buyerEmail.split('@')[0],
            email: buyerEmail,
            role: 'owner',
          })
        }

        // Enviar e-mail de convite (implementar com serviço de e-mail)
        // TODO: Integrar com serviço de e-mail (SendGrid, Resend, etc.)
      }

      // Criar ou atualizar licença
      const expiresAt = purchase.expires_at 
        ? new Date(purchase.expires_at).toISOString()
        : null

      await supabase.from('licenses').upsert({
        tenant_id: tenantId,
        provider: 'hotmart',
        external_purchase_id: purchaseId,
        sku: sku || null,
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

    // Processar outros eventos (refund, cancel, etc.)
    if (event === 'PURCHASE_REFUNDED' || event === 'purchase.refunded') {
      const purchase = data.data || data
      const purchaseId = purchase.id || purchase.purchase_id

      if (purchaseId) {
        const supabase = createServiceClient()
        await supabase
          .from('licenses')
          .update({ status: 'refunded' })
          .eq('provider', 'hotmart')
          .eq('external_purchase_id', purchaseId)
      }

      return NextResponse.json({ success: true })
    }

    if (event === 'PURCHASE_CANCELLED' || event === 'purchase.cancelled') {
      const purchase = data.data || data
      const purchaseId = purchase.id || purchase.purchase_id

      if (purchaseId) {
        const supabase = createServiceClient()
        await supabase
          .from('licenses')
          .update({ status: 'cancelled' })
          .eq('provider', 'hotmart')
          .eq('external_purchase_id', purchaseId)
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

