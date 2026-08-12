import React from 'react'
import { MessageCircle, Globe, ShieldCheck } from 'lucide-react'

export function Footer() {
  const whatsappUrl = `https://wa.me/905510311029?text=${encodeURIComponent(
    'Merhaba Sarıbay Yazılım, Koçluk Sistemi hakkında iletişime geçmek istiyorum.'
  )}`
  const websiteUrl = 'https://saribayholding.github.io/Saribay-Yazilim/'

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-4 px-6 text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Sarıbay Özel Koçluk Sistemi
          </span>
          <span className="text-slate-400">| Tüm Hakları Saklıdır © {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-4 font-bold">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Sarıbay Yazılım</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>0551 031 10 29</span>
          </a>

          <span className="text-slate-400 font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
            Powered by Sarıbay Yazılım
          </span>
        </div>
      </div>
    </footer>
  )
}
