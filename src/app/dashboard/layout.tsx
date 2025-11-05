"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, MessageSquare, Settings, Zap } from 'lucide-react';
import { UserMenu } from '@/components/dashboard/user-menu';
import { SidebarToggle } from '@/components/dashboard/sidebar-toggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Visão Geral' },
  { href: '/dashboard/campaigns', icon: BarChart2, label: 'Campanhas' },
  { href: '/dashboard/connect', icon: Zap, label: 'Conectar Meta' },
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat AI' },
  { href: '/dashboard/settings', icon: Settings, label: 'Configurações' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header - Largura total */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <SidebarToggle 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)} 
          />
          <div className="h-6 w-px bg-gray-300"></div>
          <Link href="/dashboard">
            <img 
              src="/logo_tagMage.png" 
              alt="Tagmage" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <UserMenu />
      </header>

      {/* Content Area - Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-white shadow-md flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className={`flex items-center px-3 py-2 rounded-md transition-colors group ${
                        isActive
                          ? 'bg-brand-50 text-[#0090DB] font-medium'
                          : 'text-gray-700 hover:bg-brand-50 hover:text-[#0090DB]'
                      }`}
                      onClick={() => {
                        // Fechar sidebar em mobile após clicar (opcional)
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        isActive 
                          ? 'text-[#0090DB]' 
                          : 'text-gray-500 group-hover:text-[#0090DB]'
                      }`} />
                      <span className={`text-sm font-medium whitespace-nowrap ${!sidebarOpen ? 'hidden' : ''}`}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-200 space-y-2 ${!sidebarOpen ? 'hidden' : ''}`}>
            <div className="text-xs text-gray-500">
              © 2024 Tagmage
            </div>
            <div className="flex flex-col gap-1">
              <Link 
                href="/privacy" 
                className="text-xs text-gray-500 hover:text-[#0090DB] hover:underline"
              >
                Política de Privacidade
              </Link>
              <Link 
                href="/terms" 
                className="text-xs text-gray-500 hover:text-[#0090DB] hover:underline"
              >
                Termos de Serviço
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
