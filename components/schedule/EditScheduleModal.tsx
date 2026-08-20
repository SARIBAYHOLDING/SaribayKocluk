'use client'

import React, { useState, useEffect } from 'react'
import { X, Edit3, Save, CheckCircle2, Circle, Copy, Trash2 } from 'lucide-react'
import { StudentData, SubjectData, ScheduleItemData } from '@/lib/initialData'
import { updateScheduleItem, deleteScheduleItem, duplicateScheduleItem } from '@/lib/storage'

interface EditScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  item: ScheduleItemData | null
  students: StudentData[]
  subjects: SubjectData[]
  onScheduleUpdated?: () => void
}

const DAYS_OF_WEEK: ScheduleItemData['dayOfWeek'][] = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

export function EditScheduleModal({
  isOpen,
  onClose,
  item,
  students,
  subjects,
  onScheduleUpdated,
}: EditScheduleModalProps) {
  const [studentId, setStudentId] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState<ScheduleItemData['dayOfWeek']>('Pazartesi')
  const [timeSlot, setTimeSlot] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [topicName, setTopicName] = useState('')
  const [targetQuestions, setTargetQuestions] = useState('0')
  const [durationMinutes, setDurationMinutes] = useState('60')
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM')
  const [completed, setCompleted] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (item) {
      setStudentId(item.studentId)
      setDayOfWeek(item.dayOfWeek)
      setTimeSlot(item.timeSlot || '')
      setSubjectId(item.subjectId)
      setTopicName(item.topicName || '')
      setTargetQuestions(String(item.targetQuestions || 0))
      setDurationMinutes(String(item.durationMinutes || 60))
      setPriority(item.priority || 'MEDIUM')
      setCompleted(item.completed)
      setNotes(item.notes || '')
    }
  }, [item])

  if (!isOpen || !item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || !subjectId) return

    updateScheduleItem(item.id, {
      studentId,
      dayOfWeek,
      timeSlot,
      subjectId,
      topicName: topicName.trim() || undefined,
      targetQuestions: Number(targetQuestions) || 0,
      durationMinutes: Number(durationMinutes) || 60,
      priority,
      completed,
      notes: notes.trim() || undefined,
    })

    onScheduleUpdated?.()
    onClose()
  }

  const handleDuplicate = () => {
    duplicateScheduleItem(item.id)
    onScheduleUpdated?.()
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Bu ders oturumunu silmek istediğinizden emin misiniz?')) {
      deleteScheduleItem(item.id)
      onScheduleUpdated?.()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ders Oturumunu Düzenle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oturum gününü, saatini, konusunu ve soru hedefini güncelleyin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Student Selector */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Öğrenci *</label>
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            >
              {students.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} {std.surname} ({std.targetExam})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Day of Week */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Gün *</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Saat / Oturum</label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="Örn: 09:00 - 11:30"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Ders *</label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Name */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Konu / Ünite</label>
              <input
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="Örn: Türev ve İntegral Kampı"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Target Questions */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Hedef Soru</label>
              <input
                type="number"
                value={targetQuestions}
                onChange={(e) => setTargetQuestions(e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Süre (Dk)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="120"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              >
                <option value="HIGH">Yüksek 🔥</option>
                <option value="MEDIUM">Orta ⚡</option>
                <option value="LOW">Düşük 🌱</option>
              </select>
            </div>
          </div>

          {/* Completion Status Toggle */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Tamamlanma Durumu</span>
            <button
              type="button"
              onClick={() => setCompleted(!completed)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                completed
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Tamamlandı</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Devam Ediyor</span>
                </>
              )}
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Koç Notu / Talimat</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: 3D Yayınları 4 test bitirilecek..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDuplicate}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                title="Kopyala / Başka bir gün için çoğalt"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Çoğalt</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                title="Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sil</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold shadow-md shadow-indigo-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Kaydet</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
