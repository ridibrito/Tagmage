import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirecionar se já estiver autenticado
  if (user) {
    redirect('/dashboard')
  }

  const errorMessage = searchParams.error
    ? {
        invalid_credentials: 'E-mail ou senha incorretos.',
        email_not_confirmed: 'Por favor, confirme seu e-mail antes de fazer login.',
        too_many_requests: 'Muitas tentativas. Aguarde alguns minutos.',
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
            Acesse sua conta para acompanhar suas campanhas
          </p>
        </div>
        <LoginForm errorMessage={errorMessage} />
        <div className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <a href="/signup" className="text-[#0090DB] hover:underline font-medium">
            Cadastre-se
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

