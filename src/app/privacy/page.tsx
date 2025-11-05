import { Card } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade - Tagmage',
  description: 'Política de Privacidade da plataforma Tagmage',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-[#0090DB] hover:underline">
            ← Voltar para o início
          </Link>
        </div>

        <Card className="p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Política de Privacidade
          </h1>
          
          <p className="text-sm text-gray-600 mb-8">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introdução</h2>
              <p>
                O Tagmage ("nós", "nosso", "aplicativo") respeita sua privacidade e está comprometida em proteger seus dados pessoais. 
                Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações quando você usa nossa 
                plataforma de acompanhamento de campanhas do Meta Ads.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Dados que Coletamos</h2>
              
              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">2.1. Dados do Facebook/Meta</h3>
              <p className="mb-3">
                Quando você conecta sua conta do Meta através do nosso aplicativo, coletamos as seguintes informações:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dados de Autenticação:</strong> ID do usuário do Facebook, nome e email (quando disponível)</li>
                <li><strong>Dados de Campanhas:</strong> Informações sobre suas campanhas publicitárias, incluindo:
                  <ul className="list-circle list-inside ml-6 mt-2">
                    <li>Nomes e IDs de campanhas, ad sets e ads</li>
                    <li>Métricas de desempenho (gastos, impressões, cliques, alcance)</li>
                    <li>Objetivos e status das campanhas</li>
                    <li>Orçamentos e configurações</li>
                  </ul>
                </li>
                <li><strong>Dados de Business Manager:</strong> Lista de Business Managers e contas de anúncios associadas</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">2.2. Dados de Uso</h3>
              <p className="mb-3">
                Coletamos automaticamente informações sobre como você usa nossa plataforma:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Endereço IP e informações do navegador</li>
                <li>Páginas visitadas e ações realizadas</li>
                <li>Data e hora de acesso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Como Usamos Seus Dados</h2>
              <p className="mb-3">
                Usamos os dados coletados exclusivamente para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Fornecer Funcionalidades:</strong> Exibir suas campanhas, métricas e insights em nosso dashboard</li>
                <li><strong>Melhorar o Serviço:</strong> Analisar padrões de uso para melhorar a experiência do usuário</li>
                <li><strong>Comunicação:</strong> Enviar notificações importantes sobre o serviço</li>
                <li><strong>Segurança:</strong> Detectar e prevenir fraudes ou uso indevido</li>
              </ul>
              <p className="mt-4">
                <strong>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Armazenamento e Segurança</h2>
              <p className="mb-3">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Criptografia:</strong> Tokens de acesso são criptografados antes de serem armazenados</li>
                <li><strong>Row Level Security (RLS):</strong> Seus dados são isolados por tenant, garantindo que apenas você tenha acesso</li>
                <li><strong>HTTPS:</strong> Todas as comunicações são criptografadas usando SSL/TLS</li>
                <li><strong>Backups Seguros:</strong> Dados são armazenados em servidores seguros com backups regulares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Compartilhamento de Dados</h2>
              <p className="mb-3">
                Compartilhamos seus dados apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Prestadores de Serviços:</strong> Com provedores que nos ajudam a operar (ex: Supabase para hospedagem de banco de dados, Vercel para hospedagem)</li>
                <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Com seu Consentimento:</strong> Quando você autoriza explicitamente</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Retenção de Dados</h2>
              <p className="mb-3">
                Mantemos seus dados enquanto:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Você tiver uma conta ativa em nossa plataforma</li>
                <li>For necessário para cumprir obrigações legais</li>
                <li>For necessário para resolver disputas ou fazer cumprir nossos acordos</li>
              </ul>
              <p className="mt-4">
                Quando você solicita a exclusão de sua conta, removemos seus dados pessoais dentro de 30 dias, 
                exceto quando a retenção for necessária por obrigações legais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Seus Direitos</h2>
              <p className="mb-3">
                Você tem os seguintes direitos sobre seus dados:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acesso:</strong> Solicitar uma cópia dos dados que temos sobre você</li>
                <li><strong>Correção:</strong> Solicitar correção de dados incorretos</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados (veja seção 8)</li>
                <li><strong>Portabilidade:</strong> Solicitar exportação de seus dados em formato estruturado</li>
                <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados em determinadas circunstâncias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Exclusão de Dados</h2>
              <p className="mb-3">
                Você pode solicitar a exclusão de seus dados a qualquer momento através de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acessando a página de <Link href="/settings/data-deletion" className="text-[#0090DB] hover:underline">Exclusão de Dados</Link> em sua conta</li>
                <li>Enviando um e-mail para: <a href="mailto:privacy@tagmage.com" className="text-[#0090DB] hover:underline">privacy@tagmage.com</a></li>
              </ul>
              <p className="mt-4">
                Processaremos sua solicitação dentro de 30 dias e confirmaremos quando os dados forem excluídos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">9. Cookies e Tecnologias Similares</h2>
              <p className="mb-3">
                Usamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter você logado em nossa plataforma</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar o uso da plataforma</li>
              </ul>
              <p className="mt-4">
                Você pode gerenciar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">10. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade ocasionalmente. Notificaremos você sobre mudanças 
                significativas por e-mail ou através de um aviso em nossa plataforma. A data da última atualização 
                está indicada no topo desta página.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">11. Contato</h2>
              <p className="mb-3">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>E-mail:</strong> <a href="mailto:privacy@tagmage.com" className="text-[#0090DB] hover:underline">privacy@tagmage.com</a></li>
                <li><strong>Assunto:</strong> Política de Privacidade - Tagmage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">12. Permissões do Facebook/Meta</h2>
              <p className="mb-3">
                Nossa aplicação solicita as seguintes permissões do Facebook/Meta:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>ads_read:</strong> Usado para ler dados de suas campanhas publicitárias, incluindo métricas de desempenho, 
                  para exibir em nosso dashboard. Não modificamos ou alteramos suas campanhas.</li>
                <li><strong>business_management:</strong> Usado para listar seus Business Managers e contas de anúncios, 
                  permitindo que você selecione quais contas deseja monitorar em nossa plataforma.</li>
              </ul>
              <p className="mt-4">
                Essas permissões são usadas exclusivamente para fornecer as funcionalidades descritas acima. 
                Você pode revogar essas permissões a qualquer momento através das configurações do Facebook ou 
                desconectando sua conta em nossa plataforma.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Esta política está em conformidade com a LGPD (Lei Geral de Proteção de Dados) e as políticas 
              do Facebook/Meta para aplicativos terceiros.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

