import { Card } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: 'Termos de Serviço - Tagmage',
  description: 'Termos de Serviço da plataforma Tagmage',
}

export default function TermsPage() {
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
            Termos de Serviço
          </h1>
          
          <p className="text-sm text-gray-600 mb-8">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma Tagmage ("Plataforma", "Serviço"), você concorda em cumprir 
                e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, 
                não deve usar nossa Plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Definições</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>"Nós", "Nosso", "Tagmage":</strong> Refere-se à plataforma e seus operadores</li>
                <li><strong>"Usuário", "Você":</strong> Refere-se à pessoa física ou jurídica que utiliza a Plataforma</li>
                <li><strong>"Conta":</strong> Refere-se à conta criada pelo Usuário na Plataforma</li>
                <li><strong>"Dados":</strong> Refere-se a qualquer informação fornecida ou coletada através da Plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Descrição do Serviço</h2>
              <p className="mb-3">
                O Tagmage é uma plataforma SaaS que oferece:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dashboard para acompanhamento de campanhas do Meta Ads</li>
                <li>Visualização de métricas e insights de campanhas publicitárias</li>
                <li>Filtros e análises de desempenho</li>
                <li>Chat AI para consultas sobre dados de campanhas</li>
                <li>Exportação de dados em formato CSV</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Registro e Conta</h2>
              
              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">4.1. Elegibilidade</h3>
              <p className="mb-3">
                Para usar a Plataforma, você deve:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ter pelo menos 18 anos de idade ou ter capacidade legal para contratar</li>
                <li>Ter uma conta válida do Meta/Facebook com acesso a contas de anúncios</li>
                <li>Fornecer informações precisas e completas durante o registro</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">4.2. Responsabilidades da Conta</h3>
              <p className="mb-3">
                Você é responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                <li>Garantir que todas as informações fornecidas sejam precisas e atualizadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Uso Aceitável</h2>
              <p className="mb-3">
                Você concorda em NÃO usar a Plataforma para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Qualquer atividade ilegal ou não autorizada</li>
                <li>Violar direitos de propriedade intelectual de terceiros</li>
                <li>Transmitir vírus, malware ou código malicioso</li>
                <li>Tentar acessar áreas restritas da Plataforma</li>
                <li>Interferir ou interromper o funcionamento da Plataforma</li>
                <li>Usar a Plataforma para spam ou atividades fraudulentas</li>
                <li>Reproduzir, copiar ou revender o Serviço sem autorização</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Integração com Meta/Facebook</h2>
              <p className="mb-3">
                Ao conectar sua conta do Meta/Facebook:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Você autoriza nossa Plataforma a acessar seus dados de campanhas através da API do Meta</li>
                <li>Você concorda em cumprir os <a href="https://www.facebook.com/terms" target="_blank" rel="noopener noreferrer" className="text-[#0090DB] hover:underline">Termos de Serviço do Facebook</a></li>
                <li>Você pode desconectar sua conta a qualquer momento</li>
                <li>Não modificamos ou alteramos suas campanhas no Meta - apenas lemos dados para exibição</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Propriedade Intelectual</h2>
              <p className="mb-3">
                A Plataforma e todo o conteúdo, incluindo mas não limitado a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Design, layout e interface</li>
                <li>Código-fonte e software</li>
                <li>Marcas, logotipos e nomes comerciais</li>
                <li>Documentação e materiais</li>
              </ul>
              <p className="mt-4">
                São de propriedade exclusiva do Tagmage e estão protegidos por leis de direitos autorais, 
                marcas registradas e outras leis de propriedade intelectual.
              </p>
              <p className="mt-4">
                Você não pode reproduzir, modificar, distribuir ou criar obras derivadas sem nossa autorização prévia por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Dados e Privacidade</h2>
              <p className="mb-3">
                Nosso tratamento de seus dados pessoais é regido por nossa 
                <Link href="/privacy" className="text-[#0090DB] hover:underline"> Política de Privacidade</Link>, 
                que faz parte integrante destes Termos.
              </p>
              <p className="mt-4">
                Você mantém todos os direitos sobre seus dados. Nós apenas os utilizamos para fornecer o Serviço 
                conforme descrito em nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">9. Disponibilidade e Modificações do Serviço</h2>
              <p className="mb-3">
                Reservamo-nos o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modificar, suspender ou descontinuar qualquer parte do Serviço a qualquer momento</li>
                <li>Realizar manutenção programada ou não programada</li>
                <li>Limitar o acesso ao Serviço em caso de uso indevido</li>
              </ul>
              <p className="mt-4">
                Embora nos esforcemos para manter a Plataforma disponível, não garantimos disponibilidade 100% 
                e não seremos responsáveis por interrupções ou perda de dados decorrentes de manutenção ou 
                problemas técnicos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">10. Limitação de Responsabilidade</h2>
              <p className="mb-3">
                NA MÁXIMA EXTENSÃO PERMITIDA POR LEI:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A Plataforma é fornecida "COMO ESTÁ" e "CONFORME DISPONÍVEL", sem garantias de qualquer tipo</li>
                <li>Não garantimos que o Serviço atenderá a todos os seus requisitos ou estará livre de erros</li>
                <li>Não seremos responsáveis por danos indiretos, incidentais, especiais ou consequenciais</li>
                <li>Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">11. Indenização</h2>
              <p>
                Você concorda em indenizar, defender e isentar o Tagmage de qualquer reclamação, 
                dano, perda, responsabilidade e despesa (incluindo honorários advocatícios) decorrentes de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Seu uso do Serviço</li>
                <li>Violation destes Termos</li>
                <li>Violation de direitos de terceiros</li>
                <li>Qualquer conteúdo que você forneça ou transmita através da Plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">12. Cancelamento e Encerramento</h2>
              
              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">12.1. Cancelamento pelo Usuário</h3>
              <p>
                Você pode cancelar sua conta a qualquer momento através das configurações da Plataforma ou 
                entrando em contato conosco. Após o cancelamento, seus dados serão excluídos conforme descrito 
                em nossa Política de Privacidade.
              </p>

              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">12.2. Encerramento por Nós</h3>
              <p>
                Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, se você violar estes Termos 
                ou se determinarmos que seu uso representa um risco para a Plataforma ou outros usuários.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">13. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos você sobre 
                mudanças significativas por e-mail ou através de um aviso na Plataforma. Seu uso continuado da 
                Plataforma após as modificações constitui sua aceitação dos novos Termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">14. Lei Aplicável e Jurisdição</h2>
              <p>
                Estes Termos são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes Termos será 
                submetida à jurisdição exclusiva dos tribunais competentes do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">15. Disposições Gerais</h2>
              
              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">15.1. Integridade</h3>
              <p>
                Se qualquer disposição destes Termos for considerada inválida, as demais disposições permanecerão 
                em pleno vigor e efeito.
              </p>

              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">15.2. Renúncia</h3>
              <p>
                Nossa falha em fazer valer qualquer direito ou disposição destes Termos não constitui uma renúncia 
                a esse direito ou disposição.
              </p>

              <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">15.3. Atribuição</h3>
              <p>
                Você não pode transferir ou ceder seus direitos ou obrigações sob estes Termos sem nossa autorização 
                prévia por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">16. Contato</h2>
              <p className="mb-3">
                Para questões sobre estes Termos de Serviço, entre em contato:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>E-mail:</strong> <a href="mailto:legal@tagmage.com" className="text-[#0090DB] hover:underline">legal@tagmage.com</a></li>
                <li><strong>Assunto:</strong> Termos de Serviço - Tagmage</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Ao usar a Plataforma Tagmage, você reconhece que leu, entendeu e concorda em estar vinculado 
              a estes Termos de Serviço e à nossa Política de Privacidade.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

