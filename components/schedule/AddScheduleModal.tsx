'use client'

import React, { useState } from 'react'
import { X, CalendarPlus, Plus } from 'lucide-react'
import { StudentData, SubjectData, ScheduleItemData } from '@/lib/initialData'
import { addScheduleItem } from '@/lib/storage'

interface AddScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  students: StudentData[]
  subjects: SubjectData[]
  defaultStudentId?: string
  onScheduleAdded?: () => void
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

export function AddScheduleModal({
  isOpen,
  onClose,
  students,
  subjects,
  defaultStudentId,
  onScheduleAdded,
}: AddScheduleModalProps) {
  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || '')
  const [dayOfWeek, setDayOfWeek] = useState<ScheduleItemData['dayOfWeek']>('Pazartesi')
  const [timeSlot, setTimeSlot] = useState('09:00 - 11:30')
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '')
  const [topicName, setTopicName] = useState('')
  const [targetQuestions, setTargetQuestions] = useState('50')
  const [durationMinutes, setDurationMinutes] = useState('120')
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || !subjectId) return

    addScheduleItem({
      studentId,
      dayOfWeek,
      timeSlot,
      subjectId,
      topicName: topicName.trim() || undefined,
      targetQuestions: Number(targetQuestions) || 0,
      durationMinutes: Number(durationMinutes) || 60,
      priority,
      notes: notes.trim() || undefined,
    })

    setTopicName('')
    setNotes('')
    onScheduleAdded?.()
    onClose()
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
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
            <CalendarPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Çalışma Programı Slotu Ekle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Öğrencinin haftalık ders ve konu çalışma programına oturum tanımlayın
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

            {/* Time Slot / Period */}
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

            {/* Duration (mins) */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Süre (Dakika)</label>
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

          {/* Notes */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Koç Notu / Talimat</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: 3D Yayınları 4 test bitirilip takılan sorular işaretlenecek..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
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
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Programa Ekle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
