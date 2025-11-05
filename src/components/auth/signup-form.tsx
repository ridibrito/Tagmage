'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface SignupFormProps {
  errorMessage?: string | null
}

export function SignupForm({ errorMessage }: SignupFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error('Signup error:', authError)
        
        let errorKey = 'unexpected_error'
        let errorMsg = authError.message || 'Erro ao criar conta'
        
        if (authError.message?.includes('already registered') ||
            authError.message?.includes('User already registered')) {
          errorKey = 'email_exists'
          errorMsg = 'Este e-mail já está cadastrado. Faça login ou recupere sua senha.'
        } else if (authError.message?.includes('Password') ||
                   authError.message?.includes('password')) {
          errorKey = 'weak_password'
          errorMsg = 'A senha é muito fraca. Use pelo menos 6 caracteres.'
        } else if (authError.message?.includes('email') ||
                   authError.message?.includes('Email')) {
          errorKey = 'invalid_email'
          errorMsg = 'E-mail inválido. Verifique o formato do e-mail.'
        } else if (authError.status === 400) {
          errorMsg = 'Erro ao criar conta. Verifique os dados informados.'
        }
        
        setError(errorMsg)
        router.push(`/signup?error=${errorKey}`)
        return
      }

      if (data.user) {
        setSuccess(true)
        // Limpar formulário
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/login?message=account_created')
        }, 2000)
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conta criada com sucesso!
              </h3>
              <p className="text-sm text-gray-600">
                Verifique seu e-mail para confirmar sua conta antes de fazer login.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Seu nome"
              autoComplete="name"
            />
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

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
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

