'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface LoginFormProps {
  errorMessage?: string | null
}

export function LoginForm({ errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError('Erro ao enviar link. Verifique o e-mail e tente novamente.')
        return
      }

      setMagicLinkSent(true)
    } catch (err: any) {
      setError('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        if (authError.message?.includes('Invalid login credentials') || 
            authError.message?.includes('Invalid email or password') ||
            authError.status === 400) {
          setError('E-mail ou senha incorretos. Verifique suas credenciais.')
        } else if (authError.message?.includes('Email not confirmed') ||
                   authError.message?.includes('email address is not confirmed')) {
          setError('Por favor, confirme seu e-mail antes de fazer login.')
        } else if (authError.message?.includes('Too many requests')) {
          setError('Muitas tentativas. Aguarde alguns minutos.')
        } else {
          setError('Erro ao fazer login. Verifique suas credenciais.')
        }
        return
      }

      if (data.session) {
        window.location.href = '/dashboard'
      } else {
        setError('Não foi possível criar a sessão. Verifique suas credenciais.')
      }
    } catch (err: any) {
      setError('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0090DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Link enviado!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Verifique seu e-mail ({email}) e clique no link para fazer login.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setMagicLinkSent(false)
                  setEmail('')
                }}
                className="w-full"
              >
                Enviar novo link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          {useMagicLink 
            ? 'Digite seu e-mail para receber um link de acesso' 
            : 'Digite seu e-mail e senha para acessar'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={useMagicLink ? handleMagicLink : handlePasswordLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0090DB] focus:border-transparent"
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          {!useMagicLink && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0090DB] focus:border-transparent"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
              {errorMessage}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-[#0090DB] hover:bg-[#0073AF] text-white" disabled={loading}>
            {loading 
              ? (useMagicLink ? 'Enviando...' : 'Entrando...') 
              : (useMagicLink ? 'Enviar Link de Acesso' : 'Entrar')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setUseMagicLink(!useMagicLink)
                setError('')
                setPassword('')
              }}
              className="text-sm text-[#0090DB] hover:underline"
            >
              {useMagicLink 
                ? 'Usar senha em vez de link' 
                : 'Entrar sem senha (link por e-mail)'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
