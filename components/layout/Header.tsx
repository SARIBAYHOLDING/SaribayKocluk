'use client'

import React, { useState } from 'react'
import { Plus, MessageCircle, Calendar, Sparkles } from 'lucide-react'
import { SupportModal } from '@/components/common/SupportModal'
import { LogoutButton } from '@/components/auth/AuthGuard'

interface HeaderProps {
  title?: string
  subtitle?: string
  onOpenNewStudent?: () => void
  onOpenNewTest?: () => void
  onOpenNewPayment?: () => void
}

export function Header({
  title = 'Genel Bakış',
  subtitle = 'Öğrenci koçluğu ve akademik takip paneli',
  onOpenNewStudent,
  onOpenNewTest,
  onOpenNewPayment,
}: HeaderProps) {
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  const todayDate = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const whatsappUrl = `https://wa.me/905510311029?text=${encodeURIComponent(
    'Merhaba Sarıbay Yazılım, Koçluk Sistemi hakkında yardım almak istiyorum.'
  )}`

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Sarıbay v1.0
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          </div>

          {/* Right Actions & Utilities */}
          <div className="flex items-center gap-3">
            {/* Date Display */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{todayDate}</span>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
              title="Sarıbay Yazılım WhatsApp Destek (05510311029)"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Logout Button */}
            <LogoutButton />

            {/* Quick Action Button Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Hızlı Ekle</span>
              </button>

              {showQuickActions && (
                <div
                  onClick={() => setShowQuickActions(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  {onOpenNewStudent && (
                    <button
                      onClick={onOpenNewStudent}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      Yeni Öğrenci Kaydı
                    </button>
                  )}
                  {onOpenNewTest && (
                    <button
                      onClick={onOpenNewTest}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      Yeni Test / Net Kaydı
                    </button>
                  )}
                  {onOpenNewPayment && (
                    <button
                      onClick={onOpenNewPayment}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Yeni Ödeme Girişi
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  )
}
