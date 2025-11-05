# Tagmage - Dashboard para Meta Ads

SaaS para acompanhamento de campanhas do Meta Ads com métricas essenciais, filtros avançados e Chat AI (Gemini).

## 🚀 Tecnologias

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase (Postgres + Auth + RLS)
- **AI**: Google Gemini API
- **Gráficos**: Recharts
- **Deploy**: Vercel + Supabase

## 📁 Estrutura do Projeto

```
tagmage/
├── src/
│   ├── app/              # Next.js App Router (rotas e páginas)
│   │   ├── api/         # API Routes
│   │   ├── dashboard/   # Dashboard principal
│   │   ├── login/       # Página de login
│   │   ├── signup/      # Página de cadastro
│   │   ├── privacy/     # Política de Privacidade
│   │   ├── terms/       # Termos de Serviço
│   │   └── layout.tsx   # Layout raiz
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes shadcn/ui
│   │   ├── auth/       # Componentes de autenticação
│   │   └── dashboard/  # Componentes do dashboard
│   ├── lib/            # Utilitários e helpers
│   │   ├── supabase/   # Clientes Supabase
│   │   ├── meta/       # Cliente Meta API
│   │   └── crypto.ts   # Criptografia de tokens
│   └── types/          # TypeScript types
│       └── database.ts # Tipos do Supabase
├── public/             # Arquivos estáticos
├── supabase/           # Schema SQL
│   └── schema.sql      # Schema completo com RLS
├── middleware.ts       # Middleware Next.js (autenticação)
└── package.json
```

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Conta no Google Cloud (para Gemini API)
- App Meta/Facebook configurado

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd tagmage
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Criptografia
DB_ENCRYPTION_KEY=your_32_char_encryption_key

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Meta/Facebook
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=https://yourdomain.com/api/meta/oauth/callback
META_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Webhooks
HOTMART_WEBHOOK_SECRET=your_hotmart_secret
KIWIFY_WEBHOOK_SECRET=your_kiwify_secret

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

4. Execute o schema SQL no Supabase:
   - Acesse o SQL Editor no Supabase
   - Execute o arquivo `supabase/schema.sql`

5. Execute o projeto:
```bash
npm run dev
```

Acesse `http://localhost:3000`

## 🔐 Segurança

- **RLS (Row Level Security)**: Todas as tabelas têm políticas RLS por `tenant_id`
- **Criptografia**: Tokens OAuth são criptografados antes de armazenar
- **HTTPS**: Todas as comunicações são criptografadas

## 📊 Funcionalidades

- ✅ Autenticação por magic link (Supabase Auth)
- ✅ Schema completo do banco de dados
- ✅ Webhooks Hotmart/Kiwify
- ✅ OAuth Meta e wizard de conexão
- ✅ Sincronização de dados (backfill + cron)
- ✅ Dashboard com KPIs e gráficos
- ✅ Tela de campanhas com filtros
- ✅ Chat AI com Gemini

## 📝 Licença

Proprietário - Tagmage
