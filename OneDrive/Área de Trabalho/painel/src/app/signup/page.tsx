import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const errorMessage = searchParams.error
    ? {
        email_exists: 'Este e-mail já está cadastrado. Faça login ou recupere sua senha.',
        weak_password: 'A senha é muito fraca. Use pelo menos 6 caracteres.',
        invalid_email: 'E-mail inválido.',
        unexpected_error: 'Erro inesperado. Por favor, tente novamente.',
      }[searchParams.error] || `Erro: ${searchParams.error}`
    : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img 
              src="/logo_tagMage.png" 
              alt="Tagmage" 
              className="h-10 w-auto mx-auto"
            />
          </Link>
          <p className="text-gray-600">
            Crie sua conta para começar
          </p>
        </div>
        <SignupForm errorMessage={errorMessage} />
        <div className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <a href="/login" className="text-[#0090DB] hover:underline font-medium">
            Faça login
          </a>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <a href="/privacy" className="hover:text-[#0090DB] hover:underline">
              Privacidade
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-[#0090DB] hover:underline">
              Termos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

