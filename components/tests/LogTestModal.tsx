'use client'

import React, { useState, useEffect } from 'react'
import { X, FileSpreadsheet, Calculator } from 'lucide-react'
import { StudentData, SubjectData } from '@/lib/initialData'
import { addTestLog } from '@/lib/storage'

interface LogTestModalProps {
  isOpen: boolean
  onClose: () => void
  students: StudentData[]
  subjects: SubjectData[]
  onTestLogged?: () => void
}

export function LogTestModal({
  isOpen,
  onClose,
  students,
  subjects,
  onTestLogged,
}: LogTestModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    topicName: '',
    sourceBook: '',
    totalQuestions: '40',
    correct: '34',
    incorrect: '4',
    blank: '2',
    targetNet: '35',
    notes: '',
  })

  useEffect(() => {
    if (students.length > 0 && !formData.studentId) {
      setFormData((prev) => ({ ...prev, studentId: students[0].id }))
    }
    if (subjects.length > 0 && !formData.subjectId) {
      setFormData((prev) => ({ ...prev, subjectId: subjects[0].id }))
    }
  }, [students, subjects])

  if (!isOpen) return null

  const correctNum = Math.max(0, Number(formData.correct) || 0)
  const incorrectNum = Math.max(0, Number(formData.incorrect) || 0)
  const calculatedNet = Math.max(0, correctNum - incorrectNum / 4.0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      addTestLog({
        studentId: formData.studentId,
        subjectId: formData.subjectId,
        topicName: formData.topicName,
        sourceBook: formData.sourceBook,
        totalQuestions: Number(formData.totalQuestions) || 0,
        correct: correctNum,
        incorrect: incorrectNum,
        blank: Number(formData.blank) || 0,
        targetNet: formData.targetNet ? Number(formData.targetNet) : undefined,
        testDate: new Date().toISOString(),
        notes: formData.notes,
      })

      onTestLogged?.()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Test kaydı sırasında hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Yeni Test / Soru Kaydı
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Çözülen test ve net sonucunu otomatik hesaplama ile sisteme işleyin (LocalStorage Kayıtlı).
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Öğrenci *</label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} {std.surname} ({std.targetExam})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Ders *</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name} ({subj.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Test / Deneme Adı</label>
              <input
                type="text"
                value={formData.topicName}
                onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                placeholder="Örn: TYT Matematik Denemesi #3"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Kaynak / Yayın Adı</label>
              <input
                type="text"
                value={formData.sourceBook}
                onChange={(e) => setFormData({ ...formData, sourceBook: e.target.value })}
                placeholder="Örn: 3D Yayınları TYT Mat Denemesi"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Correct / Incorrect / Blank Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Toplam Soru</label>
              <input
                type="number"
                value={formData.totalQuestions}
                onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-emerald-600 dark:text-emerald-400 mb-1">Doğru (D)</label>
              <input
                type="number"
                value={formData.correct}
                onChange={(e) => setFormData({ ...formData, correct: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-600 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-rose-600 dark:text-rose-400 mb-1">Yanlış (Y)</label>
              <input
                type="number"
                value={formData.incorrect}
                onChange={(e) => setFormData({ ...formData, incorrect: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 text-rose-600 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Boş (B)</label>
              <input
                type="number"
                value={formData.blank}
                onChange={(e) => setFormData({ ...formData, blank: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Automatic Net Calculator Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Otomatik Net Formülü
                </div>
                <div className="text-[11px] text-slate-500">
                  Net = Doğru - (Yanlış / 4)
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Hesaplanan Net</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {calculatedNet.toFixed(2)} Net
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Koçluk Değerlendirme Notu</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Örn: Soruların çoğu kavranmış, süre yönetimi iyi."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md shadow-emerald-500/20 transition-all"
            >
              <span>{loading ? 'Kaydediliyor...' : 'Testi Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
