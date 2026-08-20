'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Plus,
  Wand2,
  Printer,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Trash2,
  Edit3,
  Copy,
  Sparkles,
  Filter,
  Layers,
  BarChart3,
  Award,
  RotateCcw,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { Header } from '@/components/layout/Header'
import { AddScheduleModal } from '@/components/schedule/AddScheduleModal'
import { EditScheduleModal } from '@/components/schedule/EditScheduleModal'
import { PresetScheduleModal } from '@/components/schedule/PresetScheduleModal'
import { StudentData, SubjectData, ScheduleItemData } from '@/lib/initialData'
import {
  getStoredStudents,
  getStorageData,
  getStoredScheduleItems,
  toggleScheduleItem,
  deleteScheduleItem,
  duplicateScheduleItem,
  clearStudentSchedule,
} from '@/lib/storage'

const DAYS_OF_WEEK: ScheduleItemData['dayOfWeek'][] = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

export default function SchedulePage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [scheduleItems, setScheduleItems] = useState<ScheduleItemData[]>([])
  
  // Filters & State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-1')
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix')
  const [filterDay, setFilterDay] = useState<string>('ALL')

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItemData | null>(null)

  const loadData = () => {
    const store = getStorageData()
    const stds = getStoredStudents()
    setStudents(stds)
    setSubjects(store.subjects)

    if (stds.length > 0 && !stds.some((s) => s.id === selectedStudentId)) {
      setSelectedStudentId(stds[0].id)
    }

    setScheduleItems(getStoredScheduleItems())
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [])

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  // Filter items for selected student and day
  const studentItems = scheduleItems.filter((i) =>
    selectedStudentId === 'ALL' ? true : i.studentId === selectedStudentId
  )

  const filteredItems = studentItems.filter((i) =>
    filterDay === 'ALL' ? true : i.dayOfWeek === filterDay
  )

  // Handle Toggle Completion
  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = toggleScheduleItem(id)
    if (updated && updated.completed) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        })
      } catch (err) {
        console.log('Confetti error:', err)
      }
    }
    loadData()
  }

  // Handle Quick Duplicate
  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateScheduleItem(id)
    loadData()
  }

  // Handle Delete
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Bu ders oturumunu silmek istediğinizden emin misiniz?')) {
      deleteScheduleItem(id)
      loadData()
    }
  }

  // Handle Clear Schedule for Current Filter
  const handleClearSchedule = () => {
    const targetName = selectedStudent
      ? `${selectedStudent.name} ${selectedStudent.surname}`
      : 'Tüm Öğrencilerin'
    const dayName = filterDay !== 'ALL' ? `${filterDay} gününe ait` : 'tüm haftalık'

    if (confirm(`${targetName} ${dayName} çalışma oturumlarını temizlemek istediğinizden emin misiniz?`)) {
      clearStudentSchedule(selectedStudentId, filterDay)
      loadData()
    }
  }

  // Handle Print / Export
  const handlePrint = () => {
    window.print()
  }

  // Calculations for summary banner
  const totalPlannedMinutes = studentItems.reduce((acc, i) => acc + (i.durationMinutes || 60), 0)
  const totalPlannedHours = (totalPlannedMinutes / 60).toFixed(1)
  const totalTargetQuestions = studentItems.reduce((acc, i) => acc + (i.targetQuestions || 0), 0)
  const completedItemsCount = studentItems.filter((i) => i.completed).length
  const totalItemsCount = studentItems.length
  const completionPercentage =
    totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0

  const getSubject = (subjectId: string) => subjects.find((s) => s.id === subjectId)

  return (
    <>
      {/* Printable CSS style overlay */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-area {
            display: block !important;
          }
          .schedule-card {
            border: 1px solid #cbd5e1 !important;
            break-inside: avoid;
            background: #f8fafc !important;
            color: #0f172a !important;
          }
        }
      `}</style>

      {/* Screen Header */}
      <div className="no-print">
        <Header
          title="Haftalık Çalışma Programı"
          subtitle="Öğrenci bazlı 7 günlük ders çalışma programı, soru hedefleri ve konu takvimi"
        />
      </div>

      <div className="space-y-6">
        {/* Top Control Bar & Student Selection */}
        <div className="no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Student Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
              <Filter className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Öğrenci Programı Seç
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Tüm Öğrenciler (Genel Görünüm)</option>
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} {std.surname} ({std.targetExam} - {std.grade})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsPresetModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Hazır Şablon Yükle</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ders Oturumu Ekle</span>
            </button>

            {studentItems.length > 0 && (
              <button
                onClick={handleClearSchedule}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all border border-rose-200 dark:border-rose-800"
                title="Programı Temizle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF</span>
            </button>
          </div>
        </div>

        {/* Selected Student Banner & Weekly Performance Overview */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-extrabold text-indigo-300 uppercase tracking-widest">
                  {selectedStudent ? selectedStudent.targetExam : 'GENEL PROGRAM'}
                </span>
                {selectedStudent && (
                  <span className="text-xs font-semibold text-slate-300">
                    {selectedStudent.grade} • {selectedStudent.schoolName || 'Anadolu Lisesi'}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{selectedStudent ? `${selectedStudent.name} ${selectedStudent.surname}` : 'Tüm Öğrencilerin Haftalık Programı'}</span>
                {completionPercentage === 100 && (
                  <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
                )}
              </h2>

              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {selectedStudent?.notes || 'Haftalık ders ve hedef soru takvimi. Kartın üzerine tıklayarak düzenleyebilir veya oturumu tamamlayabilirsiniz.'}
              </p>
            </div>

            {/* Metrics Widget */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Planlanan</span>
                </div>
                <div className="text-lg font-black text-white mt-1">{totalPlannedHours} Sa</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hedef Soru</span>
                </div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {totalTargetQuestions}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tamamlanma</span>
                </div>
                <div className="text-lg font-black text-amber-400 mt-1">
                  %{completionPercentage}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-4">
            <div className="text-xs font-bold text-slate-300 min-w-[120px]">
              Haftalık İlerleme ({completedItemsCount}/{totalItemsCount} Oturum)
            </div>
            <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Mode & Day Filter Switcher */}
        <div className="no-print flex items-center justify-between gap-4">
          {/* Day Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setFilterDay('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterDay === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Tüm Günler (7 Gün)
            </button>
            {DAYS_OF_WEEK.map((day) => {
              const dayCount = studentItems.filter((i) => i.dayOfWeek === day).length
              return (
                <button
                  key={day}
                  onClick={() => setFilterDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    filterDay === day
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{day}</span>
                  {dayCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800/30 dark:bg-slate-200/20 font-black">
                      {dayCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Matrix vs List Toggle */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Haftalık Tablo</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Liste Görünümü</span>
            </button>
          </div>
        </div>

        {/* 7-DAY WEEKLY MATRIX VIEW */}
        {viewMode === 'matrix' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map((day) => {
              const dayItems = filteredItems.filter((i) => i.dayOfWeek === day)
              const isFilteredDayOut = filterDay !== 'ALL' && filterDay !== day

              if (isFilteredDayOut) return null

              return (
                <div
                  key={day}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 shadow-sm flex flex-col justify-between min-h-[380px]"
                >
                  {/* Day Column Header */}
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {day}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                        {dayItems.length} Oturum
                      </span>
                    </div>

                    {/* Day Cards List */}
                    <div className="space-y-2.5">
                      {dayItems.length === 0 ? (
                        <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          Serbest Çalışma / Dinlenme
                        </div>
                      ) : (
                        dayItems.map((item) => {
                          const sub = getSubject(item.subjectId)
                          const color = sub?.color || '#6366f1'

                          return (
                            <div
                              key={item.id}
                              onClick={() => setEditingItem(item)}
                              className={`schedule-card group relative cursor-pointer p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                                item.completed
                                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700/80 hover:border-indigo-400'
                              }`}
                              title="Düzenlemek için tıklayın"
                            >
                              {/* Left Colored Accent Bar */}
                              <div
                                className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                                style={{ backgroundColor: color }}
                              />

                              {/* Time Slot & Quick Action Buttons */}
                              <div className="flex items-center justify-between mb-1.5 pl-2">
                                <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{item.timeSlot || 'Oturum'}</span>
                                </span>

                                <div className="flex items-center gap-1">
                                  {/* Edit Trigger Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingItem(item)
                                    }}
                                    className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-opacity"
                                    title="Düzenle"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Quick Duplicate Button */}
                                  <button
                                    onClick={(e) => handleDuplicate(item.id, e)}
                                    className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-purple-600 transition-opacity"
                                    title="Çoğalt"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={(e) => handleDelete(item.id, e)}
                                    className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Toggle Completion */}
                                  <button
                                    onClick={(e) => handleToggle(item.id, e)}
                                    className="no-print p-0.5 focus:outline-none"
                                  >
                                    {item.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 shrink-0 transition-colors" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Subject Badge & Topic */}
                              <div className="pl-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[10px] font-black text-white"
                                    style={{ backgroundColor: color }}
                                  >
                                    {sub?.code || 'DERS'}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                    {sub?.name || 'Ders'}
                                  </span>
                                </div>

                                {item.topicName && (
                                  <div
                                    className={`text-[11px] font-medium leading-tight mb-2 line-clamp-2 ${
                                      item.completed
                                        ? 'line-through text-slate-400'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {item.topicName}
                                  </div>
                                )}

                                {/* Question & Duration Metrics */}
                                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                                  {item.targetQuestions ? (
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                                      🎯 {item.targetQuestions} Soru
                                    </span>
                                  ) : (
                                    <span>⏱️ {item.durationMinutes || 60} Dk</span>
                                  )}

                                  {item.priority === 'HIGH' && (
                                    <span className="text-rose-500 font-bold">🔥 Yüksek</span>
                                  )}
                                </div>

                                {item.notes && (
                                  <div className="mt-1 text-[10px] text-slate-400 italic line-clamp-1">
                                    "{item.notes}"
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Add Slot Quick Trigger for this Day */}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="no-print mt-3 w-full py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-400 hover:text-indigo-600 text-[11px] font-bold border border-slate-200/60 dark:border-slate-800 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Oturum Ekle</span>
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          /* DETAILED LIST VIEW */
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3">Durum</th>
                    <th className="pb-3">Gün</th>
                    <th className="pb-3">Saat / Oturum</th>
                    <th className="pb-3">Ders</th>
                    <th className="pb-3">Konu / Detay</th>
                    <th className="pb-3 text-center">Hedef Soru</th>
                    <th className="pb-3 text-center">Süre</th>
                    <th className="pb-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Henüz eklenmiş bir ders oturumu bulunmuyor. Dilerseniz hazır şablon yükleyebilirsiniz.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const sub = getSubject(item.subjectId)
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setEditingItem(item)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                        >
                          <td className="py-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleToggle(item.id, e)}
                              className="focus:outline-none"
                            >
                              {item.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 font-bold text-slate-900 dark:text-white">
                            {item.dayOfWeek}
                          </td>
                          <td className="py-3 text-slate-500">{item.timeSlot || 'Serbest'}</td>
                          <td className="py-3 font-bold">
                            <span
                              className="px-2 py-0.5 rounded text-white text-[10px]"
                              style={{ backgroundColor: sub?.color || '#3b82f6' }}
                            >
                              {sub?.name || 'Ders'}
                            </span>
                          </td>
                          <td className="py-3 text-slate-800 dark:text-slate-200">
                            {item.topicName || '-'}
                          </td>
                          <td className="py-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
                            {item.targetQuestions ? `${item.targetQuestions} Soru` : '-'}
                          </td>
                          <td className="py-3 text-center text-slate-500">
                            {item.durationMinutes ? `${item.durationMinutes} Dk` : '60 Dk'}
                          </td>
                          <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Düzenle"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDuplicate(item.id, e)}
                                className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                                title="Çoğalt"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(item.id, e)}
                                className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        students={students}
        subjects={subjects}
        defaultStudentId={selectedStudentId !== 'ALL' ? selectedStudentId : undefined}
        onScheduleAdded={loadData}
      />

      <EditScheduleModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        students={students}
        subjects={subjects}
        onScheduleUpdated={loadData}
      />

      <PresetScheduleModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        students={students}
        defaultStudentId={selectedStudentId !== 'ALL' ? selectedStudentId : undefined}
        onPresetApplied={loadData}
      />
    </>
  )
}
