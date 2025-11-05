import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Tagmage - Dashboard para Meta Ads',
  description: 'Acompanhe suas campanhas do Meta Ads com métricas essenciais e insights inteligentes',
  icons: {
    icon: '/icone.png',
    apple: '/icone.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}

