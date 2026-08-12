'use client'

import React from 'react'
import { X, MessageCircle, ExternalLink, HelpCircle, PhoneCall, ShieldCheck } from 'lucide-react'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  if (!isOpen) return null

  const whatsappUrl = `https://wa.me/905510311029?text=${encodeURIComponent(
    'Merhaba Sarıbay Yazılım, Koçluk Sistemi hakkında destek ve bilgi almak istiyorum.'
  )}`
  const websiteUrl = 'https://saribayholding.github.io/Saribay-Yazilim/'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              İletişim & Destek
            </h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Sarıbay Yazılım Desteği
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Sarıbay Özel Koçluk Sistemi yazılım geliştirme, yeni modül talepleri ve teknik destek için doğrudan ekibimizle iletişime geçebilirsiniz.
        </p>

        <div className="space-y-3">
          {/* WhatsApp Direct Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20 transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm font-bold">WhatsApp İletişim Hattı</div>
                <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                  0551 031 10 29
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Official Website Link */}
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/20 transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm font-bold">Sarıbay Yazılım Resmi Sitesi</div>
                <div className="text-xs text-indigo-600/80 dark:text-indigo-400/80">
                  saribayholding.github.io/Saribay-Yazilim
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Footer info inside modal */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Powered by Sarıbay Yazılım
          </div>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  )
}
