import React from 'react'
import { clsx } from 'clsx'

interface StatusBadgeProps {
  status: string
  type?: 'payment' | 'student' | 'book'
}

export function StatusBadge({ status, type = 'payment' }: StatusBadgeProps) {
  let label = status
  let styleClass = 'bg-slate-100 text-slate-700 border-slate-200'

  if (type === 'payment') {
    switch (status) {
      case 'PAID':
        label = 'Ödendi'
        styleClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 ring-1 ring-emerald-500/20'
        break
      case 'PENDING':
        label = 'Bekliyor'
        styleClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 ring-1 ring-amber-500/20'
        break
      case 'OVERDUE':
        label = 'Günü Geçti'
        styleClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 ring-1 ring-rose-500/20 animate-pulse'
        break
      case 'PARTIAL':
        label = 'Kısmi Ödeme'
        styleClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 ring-1 ring-blue-500/20'
        break
    }
  } else if (type === 'student') {
    switch (status) {
      case 'ACTIVE':
        label = 'Aktif'
        styleClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        break
      case 'INACTIVE':
        label = 'Pasif'
        styleClass = 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        break
      case 'COMPLETED':
        label = 'Mezun / Mezun Oldu'
        styleClass = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
        break
    }
  } else if (type === 'book') {
    switch (status) {
      case 'READING':
        label = 'Okunuyor'
        styleClass = 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
        break
      case 'COMPLETED':
        label = 'Bitti'
        styleClass = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        break
      case 'PAUSED':
        label = 'Ara Verildi'
        styleClass = 'bg-amber-500/10 text-amber-600 border-amber-500/20'
        break
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all',
        styleClass
      )}
    >
      {label}
    </span>
  )
}
