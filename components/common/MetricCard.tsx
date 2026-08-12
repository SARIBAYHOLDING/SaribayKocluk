import React from 'react'
import { LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendType = 'positive',
  icon: Icon,
  iconColor = 'from-indigo-500 to-purple-600',
}: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={clsx(
            'p-3 rounded-xl text-white shadow-md bg-gradient-to-tr',
            iconColor
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={clsx(
                'px-2 py-0.5 rounded-full font-bold',
                trendType === 'positive' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                trendType === 'negative' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                trendType === 'neutral' && 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
              )}
            >
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
