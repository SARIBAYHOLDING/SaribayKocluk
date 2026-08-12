import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'Sarıbay Özel Koçluk Sistemi | Eğitmen & Takip Portalı',
  description:
    'Özel öğretmenler, koçlar ve danışmanlar için öğrenci takibi, müfredat matrisi, otomatik net hesabı, kitap okuma ve finans takibi. Powered by Sarıbay Yazılım.',
  keywords: [
    'Sarıbay Özel Koçluk Sistemi',
    'Sarıbay Yazılım',
    'Koçluk Otomasyonu',
    'YKS Koçluk',
    'LGS Takip',
    'Öğrenci Takip Sistemi',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  )
}
