'use client'

import React, { useState, useEffect } from 'react'
import {
  GraduationCap,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  LogOut,
  CheckCircle2,
} from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Giriş Doğrulanıyor...')

  useEffect(() => {
    // Check session storage on mount
    const token = sessionStorage.getItem('saribay_auth_token')
    if (token === 'true') {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password === 'AslanDayım') {
      setIsLoading(true)
      setLoadingProgress(15)
      setLoadingText('Giriş Şifresi Doğrulandı...')

      // Animated loading progress sequence
      setTimeout(() => {
        setLoadingProgress(45)
        setLoadingText('Öğrenci Profilleri & LocalStorage Verileri Yükleniyor...')
      }, 500)

      setTimeout(() => {
        setLoadingProgress(80)
        setLoadingText('Akademik Net Grafikleri Hazırlanıyor...')
      }, 1000)

      setTimeout(() => {
        setLoadingProgress(100)
        setLoadingText('Sarıbay Koçluk Sistemine Hoş Geldiniz!')
      }, 1500)

      setTimeout(() => {
        sessionStorage.setItem('saribay_auth_token', 'true')
        setIsAuthenticated(true)
        setIsLoading(false)
      }, 1800)
    } else {
      setErrorMsg('Hatalı Giriş Şifresi! Lütfen kontrol edip tekrar deneyiniz.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('saribay_auth_token')
    setIsAuthenticated(false)
    setPassword('')
  }

  // Prevent flash of unauthenticated content during SSR
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // If loading animation is active
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Mesh & Light Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center space-y-6">
          {/* Pulsing Logo Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-2xl shadow-indigo-500/50 animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-[23px] flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-indigo-400" />
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-spin" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Sarıbay Özel Koçluk Sistemi
            </h2>
            <p className="text-xs font-bold text-indigo-400 mt-1 uppercase tracking-widest">
              Sistem Hazırlanıyor
            </p>
          </div>

          {/* Progress Bar & Text */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-bold px-1">
              <span className="text-indigo-300">{loadingText}</span>
              <span className="text-purple-400">%{loadingProgress}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-indigo-500/50"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Güvenli Oturum Açılıyor | Powered by Sarıbay Yazılım</span>
          </div>
        </div>
      </div>
    )
  }

  // If Not Authenticated: Render Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative Ambient Lighting */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Login Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-md rounded-3xl bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl border border-slate-800 space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white shadow-xl shadow-indigo-500/30">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Sarıbay Özel
              </h1>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-0.5">
                Koçluk Sistemi Paneli
              </p>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Eğitmen ve Danışman girişi için lütfen sisteme giriş şifrenizi yazınız.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                  Giriş Şifresi
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Şifreli Giriş</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Giriş şifreniz..."
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Sisteme Giriş Yap</span>
            </button>
          </form>

          {/* Footer Branding */}
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold">
              <span>Powered by</span>
              <a
                href="https://saribayholding.github.io/Saribay-Yazilim/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline font-black"
              >
                Sarıbay Yazılım
              </a>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              WP Destek: 0551 031 10 29
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated State: Wrap children and provide Logout context
  return (
    <>
      {children}
    </>
  )
}

export function LogoutButton() {
  const handleLogout = () => {
    if (confirm('Sistemden çıkış yapmak istediğinize emin misiniz?')) {
      sessionStorage.removeItem('saribay_auth_token')
      window.location.reload()
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
      title="Sistemden Çıkış Yap"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Çıkış Yap</span>
    </button>
  )
}
