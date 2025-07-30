"use client"

import React, { useState } from 'react';
import { Trophy, Bell, Menu, X, Volleyball, LogOut, Calendar } from 'lucide-react';
import Image from 'next/image';

import logoIfsports from "@/assets/ifsports-logo.png"
import { usePathname } from 'next/navigation';

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

export default function OrganizerLayout({ children }: OrganizerLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/organizador/modalidades',
      icon: Volleyball,
      label: 'Modalidades',
      path: '/organizador/modalidades'
    },
    {
      href: '/organizador/competicoes',
      icon: Trophy,
      label: 'Competições',
      path: '/organizador/competicoes'
    },
    {
      href: '/organizador/partidas',
      icon: Calendar,
      label: 'Partidas',
      path: '/organizador/partidas'
    },
    {
      href: '/organizador/solicitacoes',
      icon: Bell,
      label: 'Solicitações',
      path: '/organizador/solicitacoes'
    }
  ];

  const isActiveRoute = (itemPath: string) => {
    return pathname === itemPath || pathname.startsWith(itemPath);
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 text-gray-800">
        
        <nav className="hidden xl:flex bg-white max-w-xs w-full border-r border-gray-200 min-h-screen p-6 flex-col">
          <div className="flex items-center justify-between gap-8 mb-6">
            <Image src={logoIfsports} alt="Logo" width={150} height={100} />
            <button className="cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mb-3 mt-6">Menu</p>
          
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <div key={item.path} className="relative">
                  
                  {isActive && (
                    <div className="absolute -left-6 top-1/2 h-full w-1 -translate-y-1/2 rounded-tr-full rounded-br-full bg-[#062601]"></div>
                  )}

                  <a
                    href={item.href}
                    className={`
                      flex w-full items-center gap-3 rounded-md px-4 py-3 font-medium transition-colors duration-200
                      ${isActive 
                        ? 'bg-[#062601] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </nav>

        <div 
          className={`
            xl:hidden fixed inset-0 bg-white z-50 transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-sm">
            <div className="flex items-center justify-between gap-8 mb-6">
              <Image src={logoIfsports} alt="Logo" width={150} height={100} />
              <button className="cursor-pointer">
                <LogOut size={18} />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mb-3 mt-6">Menu</p>
            
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                
                return (
                  <a
                    key={item.path}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors duration-200
                      ${isActive 
                        ? 'bg-[#062601] text-white' 
                        : 'text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Icon size={20} className="min-w-[30px]" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={toggleMobileMenu}
                className={`
                  xl:hidden border-0 bg-transparent text-xl cursor-pointer z-50
                  ${isMobileMenuOpen ? 'fixed' : ''}
                `}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <p className="text-gray-700">
                Olá, <span className="font-medium">organizador</span>
              </p>
            </div>
          </header>

          <main className="px-6 py-8 pb-12 flex-1 bg-[#F5F6FA]">
            {children}
          </main>
        </div>
      </div>

      <footer className="bg-[#062601]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-white text-sm text-center xl:text-left leading-relaxed">
            Copyright © 2024 | Instituto Federal de Educação, Ciência e Tecnologia
            do Rio Grande do Norte
          </p>
        </div>
      </footer>
    </>
  );
};
