"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  name: string
  email: string
  role?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/login')
        return
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', authUser.id)
        .single()

      if (userError) {
        setError('Erro ao carregar perfil')
        setLoading(false)
        return
      }

      if (userData) {
        setUser(userData)
        setName(userData.name || '')
        setEmail(userData.email || authUser.email || '')
      } else {
        // Fallback para dados do auth
        setUser({
          id: authUser.id,
          name: authUser.user_metadata?.name || '',
          email: authUser.email || '',
        })
        setName(authUser.user_metadata?.name || '')
        setEmail(authUser.email || '')
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        setError('Usuário não autenticado')
        setSaving(false)
        return
      }

      // Atualizar dados na tabela users
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id)

      if (updateError) {
        // Se não existir na tabela users, criar
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            name,
            email: authUser.email || email,
          })

        if (insertError) {
          setError('Erro ao atualizar perfil')
          setSaving(false)
          return
        }
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Recarregar dados do usuário
      const { data: userData } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', authUser.id)
        .single()

      if (userData) {
        setUser(userData)
      }
    } catch (err: any) {
      setError('Erro ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
        </div>

        <Card className="p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="seu@email.com"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">
                O e-mail não pode ser alterado. Entre em contato com o suporte se precisar alterar.
              </p>
            </div>

            {user?.role && (
              <div>
                <Label htmlFor="role">Função</Label>
                <Input
                  id="role"
                  type="text"
                  value={user.role}
                  className="mt-1"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">
                  Função atribuída pelo administrador
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md text-sm bg-green-50 text-green-800 border border-green-200">
                Perfil atualizado com sucesso!
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="bg-[#0090DB] hover:bg-[#0073AF] text-white">
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-sm mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Informações da Conta</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID do Usuário:</span>
              <span className="text-gray-800 font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Membro desde:</span>
              <span className="text-gray-800">
                {user ? new Date().toLocaleDateString('pt-BR') : '-'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

