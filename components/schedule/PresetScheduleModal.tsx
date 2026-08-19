'use client'

import React, { useState } from 'react'
import { X, Wand2, Sparkles, CheckCircle2 } from 'lucide-react'
import { StudentData } from '@/lib/initialData'
import { applyPresetSchedule } from '@/lib/storage'

interface PresetScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  students: StudentData[]
  defaultStudentId?: string
  onPresetApplied?: () => void
}

const PRESETS = [
  {
    id: 'YKS_SAY' as const,
    title: 'YKS Sayısal Yoğun Tempo Şablonu',
    description: 'Matematik (AYT Türev/İntegral), Fizik, Kimya ve Biyoloji ağırlıklı 7 günlük tam YKS Sayısal programı.',
    badge: 'YKS SAY',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    iconColor: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'YKS_EA' as const,
    title: 'YKS Eşit Ağırlık & Paragraf Şablonu',
    description: 'Matematik Problemler, Paragraf, Tarih, Coğrafya ve Edebiyat odaklı dengeli haftalık tempo.',
    badge: 'YKS EA',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    iconColor: 'from-purple-500 to-pink-600',
  },
  {
    id: 'LGS' as const,
    title: 'LGS Yeni Nesil Soru Kampı Şablonu',
    description: '8. Sınıf LGS öğrencileri için Matematik, Türkçe Sözel Mantık, Fen Bilimleri ve İnkılap Tarihi çalışma programı.',
    badge: 'LGS 8. Sınıf',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    iconColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'KPSS' as const,
    title: 'KPSS Genel Yetenek & Kültür Şablonu',
    description: 'Matematik, Tarih, Coğrafya, Vatandaşlık ve Sözel Mantık soru çözümlü KPSS hazırlık programı.',
    badge: 'KPSS',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    iconColor: 'from-amber-500 to-orange-600',
  },
]

export function PresetScheduleModal({
  isOpen,
  onClose,
  students,
  defaultStudentId,
  onPresetApplied,
}: PresetScheduleModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudentId || students[0]?.id || '')
  const [selectedPreset, setSelectedPreset] = useState<'YKS_SAY' | 'YKS_EA' | 'LGS' | 'KPSS'>('YKS_SAY')

  if (!isOpen) return null

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudentId) return

    applyPresetSchedule(selectedStudentId, selectedPreset)
    onPresetApplied?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Hazır Akıllı Çalışma Programı Yükle</span>
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sınav hedefine uygun 7 günlük optimize haftalık programı 1 tıkla öğrenciye atayın
            </p>
          </div>
        </div>

        <form onSubmit={handleApply} className="space-y-5">
          {/* Target Student */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Program Yüklenecek Öğrenci *
            </label>
            <select
              required
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {students.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} {std.surname} — ({std.targetExam} | {std.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Preset Cards Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Şablon Seçin
            </label>

            <div className="grid grid-cols-1 gap-3">
              {PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 relative ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500 dark:border-indigo-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-tr ${preset.iconColor} text-white shadow-sm shrink-0 mt-0.5`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {preset.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase ${preset.badgeColor}`}
                        >
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 absolute top-4 right-4" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
            💡 <strong>İpucu:</strong> Şablon yüklendiğinde öğrencinin haftalık takvimine haftalık çalışma oturumları otomatik yerleştirilir. Dilerseniz sonradan istediğiniz oturumu düzenleyebilir veya yeni oturumlar ekleyebilirsiniz.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Programı Oluştur & Yükle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
