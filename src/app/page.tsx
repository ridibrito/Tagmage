import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Tagmage - Dashboard para Meta Ads',
  description: 'Acompanhe suas campanhas do Meta Ads com métricas essenciais, filtros avançados e insights inteligentes',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo_tagMage.png" 
                alt="Tagmage" 
                className="h-8 w-auto"
              />
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/login" className="text-gray-600 hover:text-[#0090DB] transition-colors">
                Entrar
              </Link>
              <Link href="/signup">
              <Button className="bg-[#0090DB] hover:bg-[#0073AF] text-white">
                Começar Grátis
              </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Acompanhe suas campanhas do<br />
            <span className="text-[#0090DB]">Meta Ads em um só lugar</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Dashboard completo com métricas essenciais, filtros avançados e insights inteligentes 
            para otimizar suas campanhas publicitárias do Facebook e Instagram.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-[#0090DB] hover:bg-[#0073AF] text-white text-lg px-8">
                Começar Agora
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Recursos Principais
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 shadow-sm">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0090DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Dashboard Completo</h3>
            <p className="text-gray-600">
              Visualize todas as métricas importantes em um só lugar: spend, impressões, cliques, 
              CTR, CPC, CPM, leads, CPL e CPA.
            </p>
          </Card>

          <Card className="p-6 shadow-sm">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0090DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Filtros Avançados</h3>
            <p className="text-gray-600">
              Filtre campanhas por período, Business Manager, conta, campanha, adset ou ad. 
              Exporte dados em CSV para análises externas.
            </p>
          </Card>

          <Card className="p-6 shadow-sm">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0090DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Chat AI Inteligente</h3>
            <p className="text-gray-600">
              Faça perguntas em linguagem natural sobre suas campanhas. Nossa IA com Gemini 
              responde com insights baseados em seus dados reais.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0090DB] text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para otimizar suas campanhas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comece a usar o Tagmage hoje e tenha controle total sobre suas campanhas do Meta Ads.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-[#0090DB] hover:bg-gray-100 text-lg px-8">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2024 Tagmage. Todos os direitos reservados.
            </div>
            <nav className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-[#0090DB] transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-[#0090DB] transition-colors">
                Termos de Serviço
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
