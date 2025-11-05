'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(true)
  const [message, setMessage] = useState('Processando autenticação...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()

        // Verificar se há código na query string (confirmação de email)
        const code = searchParams.get('code')
        const type = searchParams.get('type') // 'signup' ou 'recovery'
        const error = searchParams.get('error')

        if (error) {
          router.push(`/login?error=${encodeURIComponent(error)}`)
          return
        }

        // Se houver código, trocar por sessão (confirmação de e-mail)
        if (code) {
          setMessage('Confirmando sua conta...')
          
          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error('Exchange error:', exchangeError)
              
              // Se o erro for sobre code verifier (PKCE), pode ser que o Supabase já processou
              // Verificar se há sessão mesmo assim
              const { data: { session: existingSession } } = await supabase.auth.getSession()
              
              if (existingSession) {
                setMessage('Conta confirmada! Redirecionando...')
                window.location.href = '/dashboard'
                return
              }
              
              router.push(`/login?error=confirmation_failed`)
              return
            }

            if (data?.session) {
              setMessage('Conta confirmada! Redirecionando...')
              // Aguardar um pouco para garantir que tudo foi processado
              await new Promise(resolve => setTimeout(resolve, 500))
              window.location.href = '/dashboard'
              return
            }
          } catch (exchangeErr) {
            console.error('Exchange exception:', exchangeErr)
            // Verificar se há sessão mesmo com erro
            const { data: { session: fallbackSession } } = await supabase.auth.getSession()
            if (fallbackSession) {
              window.location.href = '/dashboard'
              return
            }
            router.push(`/login?error=confirmation_failed`)
            return
          }
        }

        // Verificar se há hash na URL (magic link ou token direto)
        if (typeof window !== 'undefined' && window.location.hash) {
          setMessage('Processando token...')
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        // Verificar se há sessão válida
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
        }

        if (session) {
          setMessage('Redirecionando...')
          window.location.href = '/dashboard'
          return
        }

        // Verificar se há usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (user && !userError) {
          setMessage('Redirecionando...')
          window.location.href = '/dashboard'
          return
        }

        // Se chegou aqui, pode ser que o link expirou ou é inválido
        router.push('/login?error=invalid_or_expired_link')
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/login?error=unexpected_error')
      } finally {
        setProcessing(false)
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    )
  }

  return null
}

