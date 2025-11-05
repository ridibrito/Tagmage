-- ============================================
-- Painel Campanha Pronta™ - Schema SQL
-- Supabase Postgres com RLS
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELAS CORE
-- ============================================

-- Tenants (Workspaces)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'basic',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  auth_provider TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- Licenças (Hotmart/Kiwify)
CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('hotmart', 'kiwify')),
  external_purchase_id TEXT NOT NULL,
  sku TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'refunded', 'cancelled', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, external_purchase_id)
);

-- Providers (tipos de integração)
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('meta')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conexões de Providers (tokens OAuth)
CREATE TABLE provider_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  meta_user_id TEXT,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  permissions TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business Managers do Meta
CREATE TABLE meta_businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, business_id)
);

-- Contas de Anúncios do Meta
CREATE TABLE meta_ad_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  business_id TEXT,
  account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  currency TEXT,
  timezone TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, account_id)
);

-- Campanhas do Meta
CREATE TABLE meta_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  objective TEXT,
  status TEXT,
  start_time TIMESTAMPTZ,
  stop_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, account_id, campaign_id)
);

-- AdSets do Meta
CREATE TABLE meta_adsets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  adset_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  optimization_goal TEXT,
  daily_budget NUMERIC(10,2),
  status TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, account_id, adset_id)
);

-- Anúncios do Meta
CREATE TABLE meta_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  ad_id TEXT NOT NULL,
  adset_id TEXT,
  name TEXT NOT NULL,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, account_id, ad_id)
);

-- Insights Diários
CREATE TABLE insights_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('campaign', 'adset', 'ad')),
  account_id TEXT NOT NULL,
  campaign_id TEXT,
  adset_id TEXT,
  ad_id TEXT,
  spend NUMERIC(10,2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  reach BIGINT DEFAULT 0,
  leads BIGINT DEFAULT 0,
  purchases BIGINT DEFAULT 0,
  cpm NUMERIC(10,2),
  cpc NUMERIC(10,2),
  ctr NUMERIC(5,2),
  cpl NUMERIC(10,2),
  cpa NUMERIC(10,2),
  roas NUMERIC(10,2),
  objective TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insights Horários (últimas 48h)
CREATE TABLE insights_hourly (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  level TEXT NOT NULL CHECK (level IN ('campaign', 'adset', 'ad')),
  account_id TEXT NOT NULL,
  campaign_id TEXT,
  adset_id TEXT,
  ad_id TEXT,
  spend NUMERIC(10,2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  leads BIGINT DEFAULT 0,
  cpm NUMERIC(10,2),
  cpc NUMERIC(10,2),
  ctr NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vistas Salvas (filtros favoritos)
CREATE TABLE saved_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Logs de Auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  meta_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_licenses_tenant_id ON licenses(tenant_id);
CREATE INDEX idx_providers_tenant_id ON providers(tenant_id);
CREATE INDEX idx_provider_connections_tenant_id ON provider_connections(tenant_id);
CREATE INDEX idx_meta_businesses_tenant_id ON meta_businesses(tenant_id);
CREATE INDEX idx_meta_ad_accounts_tenant_id ON meta_ad_accounts(tenant_id);
CREATE INDEX idx_meta_campaigns_tenant_id ON meta_campaigns(tenant_id);
CREATE INDEX idx_meta_campaigns_account_id ON meta_campaigns(account_id);
CREATE INDEX idx_insights_daily_tenant_date ON insights_daily(tenant_id, date DESC);
CREATE INDEX idx_insights_daily_campaign ON insights_daily(tenant_id, campaign_id, date DESC);
CREATE INDEX idx_insights_hourly_tenant_date ON insights_hourly(tenant_id, date DESC, hour DESC);
CREATE INDEX idx_saved_views_tenant_user ON saved_views(tenant_id, user_id);
CREATE INDEX idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at DESC);

-- Índices únicos funcionais para insights (usando COALESCE)
CREATE UNIQUE INDEX insights_daily_unique_idx 
ON insights_daily(tenant_id, date, level, account_id, COALESCE(campaign_id, ''), COALESCE(adset_id, ''), COALESCE(ad_id, ''));

CREATE UNIQUE INDEX insights_hourly_unique_idx 
ON insights_hourly(tenant_id, date, hour, level, account_id, COALESCE(campaign_id, ''), COALESCE(adset_id, ''), COALESCE(ad_id, ''));

-- ============================================
-- VIEWS SEGURAS PARA CHAT AI
-- ============================================

-- View agregada de insights diários por campanha
CREATE OR REPLACE VIEW vw_insights_campaign_daily AS
SELECT 
  tenant_id,
  date,
  account_id,
  campaign_id,
  SUM(spend) as spend,
  SUM(impressions) as impressions,
  SUM(clicks) as clicks,
  SUM(reach) as reach,
  SUM(leads) as leads,
  SUM(purchases) as purchases,
  AVG(cpm) as cpm,
  AVG(cpc) as cpc,
  AVG(ctr) as ctr,
  AVG(cpl) as cpl,
  AVG(cpa) as cpa,
  AVG(roas) as roas,
  MAX(objective) as objective
FROM insights_daily
WHERE level = 'campaign'
GROUP BY tenant_id, date, account_id, campaign_id;

-- View agregada por período
CREATE OR REPLACE VIEW vw_insights_by_period AS
SELECT 
  tenant_id,
  DATE_TRUNC('day', date) as period_start,
  account_id,
  campaign_id,
  SUM(spend) as total_spend,
  SUM(impressions) as total_impressions,
  SUM(clicks) as total_clicks,
  SUM(leads) as total_leads,
  SUM(purchases) as total_purchases,
  CASE 
    WHEN SUM(impressions) > 0 THEN (SUM(spend) / SUM(impressions)) * 1000
    ELSE 0
  END as calculated_cpm,
  CASE 
    WHEN SUM(clicks) > 0 THEN SUM(spend) / SUM(clicks)
    ELSE 0
  END as calculated_cpc,
  CASE 
    WHEN SUM(impressions) > 0 THEN (SUM(clicks)::NUMERIC / SUM(impressions)) * 100
    ELSE 0
  END as calculated_ctr,
  CASE 
    WHEN SUM(leads) > 0 THEN SUM(spend) / SUM(leads)
    ELSE 0
  END as calculated_cpl,
  CASE 
    WHEN SUM(purchases) > 0 THEN SUM(spend) / SUM(purchases)
    ELSE 0
  END as calculated_cpa
FROM insights_daily
WHERE level = 'campaign'
GROUP BY tenant_id, DATE_TRUNC('day', date), account_id, campaign_id;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_adsets ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights_hourly ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Função helper para obter tenant_id do usuário autenticado
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Políticas RLS para Tenants
CREATE POLICY "Users can view own tenant" ON tenants
  FOR SELECT USING (id = get_user_tenant_id());

-- Políticas RLS para Users
CREATE POLICY "Users can view own tenant users" ON users
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Políticas RLS para Licenses
CREATE POLICY "Users can view own tenant licenses" ON licenses
  FOR SELECT USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Providers
CREATE POLICY "Users can manage own tenant providers" ON providers
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Provider Connections
CREATE POLICY "Users can manage own tenant connections" ON provider_connections
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Meta Businesses
CREATE POLICY "Users can view own tenant businesses" ON meta_businesses
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage own tenant businesses" ON meta_businesses
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Meta Ad Accounts
CREATE POLICY "Users can view own tenant ad accounts" ON meta_ad_accounts
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage own tenant ad accounts" ON meta_ad_accounts
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Meta Campaigns
CREATE POLICY "Users can view own tenant campaigns" ON meta_campaigns
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage own tenant campaigns" ON meta_campaigns
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Meta AdSets
CREATE POLICY "Users can view own tenant adsets" ON meta_adsets
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage own tenant adsets" ON meta_adsets
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Meta Ads
CREATE POLICY "Users can view own tenant ads" ON meta_ads
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can manage own tenant ads" ON meta_ads
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Políticas RLS para Insights Daily
CREATE POLICY "Users can view own tenant insights" ON insights_daily
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Service role can insert/update insights" ON insights_daily
  FOR ALL USING (true); -- Service role bypass via service_role key

-- Políticas RLS para Insights Hourly
CREATE POLICY "Users can view own tenant hourly insights" ON insights_hourly
  FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Service role can insert/update hourly insights" ON insights_hourly
  FOR ALL USING (true);

-- Políticas RLS para Saved Views
CREATE POLICY "Users can manage own views" ON saved_views
  FOR ALL USING (tenant_id = get_user_tenant_id() AND user_id = auth.uid());

-- Políticas RLS para Audit Logs
CREATE POLICY "Users can view own tenant audit logs" ON audit_logs
  FOR SELECT USING (tenant_id = get_user_tenant_id());

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para calcular métricas derivadas
CREATE OR REPLACE FUNCTION calculate_metrics(
  p_spend NUMERIC,
  p_impressions BIGINT,
  p_clicks BIGINT,
  p_leads BIGINT,
  p_purchases BIGINT
)
RETURNS TABLE (
  cpm NUMERIC,
  cpc NUMERIC,
  ctr NUMERIC,
  cpl NUMERIC,
  cpa NUMERIC
) AS $$
BEGIN
  RETURN QUERY SELECT
    CASE WHEN p_impressions > 0 THEN (p_spend / p_impressions) * 1000 ELSE 0 END,
    CASE WHEN p_clicks > 0 THEN p_spend / p_clicks ELSE 0 END,
    CASE WHEN p_impressions > 0 THEN (p_clicks::NUMERIC / p_impressions) * 100 ELSE 0 END,
    CASE WHEN p_leads > 0 THEN p_spend / p_leads ELSE 0 END,
    CASE WHEN p_purchases > 0 THEN p_spend / p_purchases ELSE 0 END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas com updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_connections_updated_at BEFORE UPDATE ON provider_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_businesses_updated_at BEFORE UPDATE ON meta_businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_ad_accounts_updated_at BEFORE UPDATE ON meta_ad_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_campaigns_updated_at BEFORE UPDATE ON meta_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_adsets_updated_at BEFORE UPDATE ON meta_adsets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_ads_updated_at BEFORE UPDATE ON meta_ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insights_daily_updated_at BEFORE UPDATE ON insights_daily
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_views_updated_at BEFORE UPDATE ON saved_views
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

