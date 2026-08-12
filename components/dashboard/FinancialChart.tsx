'use client'

import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface FinancialDataPoint {
  name: string
  paid: number
  pending: number
  overdue: number
}

interface FinancialChartProps {
  data: FinancialDataPoint[]
}

export function FinancialChart({ data }: FinancialChartProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Aylık Finansal Dağılım (TL)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tahsil edilen ciro, bekleyen ve günü geçen ödeme dengesi
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(val: any) => [`${Number(val).toLocaleString('tr-TR')} TL`, '']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Bar dataKey="paid" name="Tahsil Edilen (Ödendi)" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Bekleyen Ödeme" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="overdue" name="Günü Geçti (Gecikmiş)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
