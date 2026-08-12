'use client'

import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface ChartDataPoint {
  name: string
  net: number
  targetNet?: number
  questions: number
}

interface PerformanceChartProps {
  data: ChartDataPoint[]
  title?: string
}

export function PerformanceChart({
  data,
  title = 'Haftalık Soru & Net Başarı Trendi',
}: PerformanceChartProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Çözülen soru sayıları ve net gelişiminin zaman içindeki değişimi
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Bar
              yAxisId="right"
              dataKey="questions"
              name="Çözülen Soru"
              fill="#818cf8"
              radius={[6, 6, 0, 0]}
              barSize={24}
              opacity={0.7}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="net"
              name="Gerçekleşen Net"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981' }}
            />
            {data.some((d) => d.targetNet !== undefined) && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="targetNet"
                name="Hedef Net"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#f59e0b' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
