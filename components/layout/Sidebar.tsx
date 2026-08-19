'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  BookMarked,
  CreditCard,
  Printer,
  HelpCircle,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Menu,
  Calendar,
  X,
} from 'lucide-react'
import { clsx } from 'clsx'
import { SupportModal } from '@/components/common/SupportModal'

const NAV_ITEMS = [
  { label: 'Genel Bakış', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Öğrenci Takibi', href: '/dashboard/students', icon: Users },
  { label: 'Çalışma Programı', href: '/dashboard/schedule', icon: Calendar },
  { label: 'Test & Net Takibi', href: '/dashboard/tests', icon: FileText },
  { label: 'Kitap Okuma', href: '/dashboard/books', icon: BookMarked },
  { label: 'Ödeme & Finans', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Veli Raporu Al', href: '/dashboard/reports', icon: Printer },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  const whatsappUrl = `https://wa.me/905510311029?text=${encodeURIComponent(
    'Merhaba Sarıbay Yazılım, Koçluk Sistemi hakkında bilgi almak istiyorum.'
  )}`

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-slate-900 text-white shadow-lg focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-30 h-screen w-72 bg-slate-900 text-slate-100 flex flex-col justify-between transition-transform duration-300 border-r border-slate-800 shadow-2xl lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Header / Branding */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-tight">
                Sarıbay Özel
              </h1>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Koçluk Sistemi
              </p>
            </div>
          </div>

          <div className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-[11px] text-indigo-300 font-medium flex items-center justify-between">
            <span>Eğitmen Paneli</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={clsx(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
              </Link>
            )
          })}
        </nav>

        {/* Support & Branding Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Support Trigger Button */}
          <button
            onClick={() => setIsSupportOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-950 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-300 border border-slate-700/60 text-xs font-semibold transition-all"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Destek & İletişim</span>
          </button>

          {/* Direct WhatsApp shortcut */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 text-[11px] font-semibold transition-all group"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WP Destek: 05510311029</span>
            </div>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
          </a>

          {/* Mandatory "Powered by Sarıbay Yazılım" Footer */}
          <div className="pt-2 text-center border-t border-slate-800/60">
            <a
              href="https://saribayholding.github.io/Saribay-Yazilim/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-indigo-400 transition-colors group"
            >
              <span>Powered by</span>
              <span className="text-indigo-400 group-hover:underline font-black">
                Sarıbay Yazılım
              </span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          </div>
        </div>
      </aside>

      {/* Support Modal */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  )
}
