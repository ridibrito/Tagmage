-- Trigger para criar registro na tabela users quando um usuário se autentica pela primeira vez
-- Este trigger deve ser executado no Supabase após a migração inicial

-- Função para criar usuário na tabela users quando ele se autentica
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Verificar se já existe um registro na tabela users
  IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Buscar ou criar um tenant para o usuário
  -- Se não houver tenant, criar um temporário (será atualizado quando houver licença)
  SELECT id INTO v_tenant_id
  FROM public.tenants
  WHERE id IN (
    SELECT tenant_id FROM public.users WHERE email = NEW.email LIMIT 1
  )
  LIMIT 1;

  -- Se não encontrar tenant, criar um novo
  IF v_tenant_id IS NULL THEN
    INSERT INTO public.tenants (name, plan, status)
    VALUES (COALESCE(NEW.email, 'Novo Usuário'), 'basic', 'active')
    RETURNING id INTO v_tenant_id;
  END IF;

  -- Criar registro na tabela users
  INSERT INTO public.users (id, tenant_id, name, email, role, auth_provider)
  VALUES (
    NEW.id,
    v_tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'owner',
    'email'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que executa a função quando um novo usuário é criado no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

