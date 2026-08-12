'use client'

import React, { useState, useEffect } from 'react'
import { FileSpreadsheet, Plus, Filter, Trash2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { LogTestModal } from '@/components/tests/LogTestModal'
import { StudentData, SubjectData, TestLogData } from '@/lib/initialData'
import {
  getStoredStudents,
  getStoredTestLogs,
  getStorageData,
  deleteTestLog,
} from '@/lib/storage'

export default function TestsPage() {
  const [testLogs, setTestLogs] = useState<TestLogData[]>([])
  const [students, setStudents] = useState<StudentData[]>([])
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ALL')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    const store = getStorageData()
    setStudents(getStoredStudents())
    setSubjects(store.subjects)
    setTestLogs(getStoredTestLogs())
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Bu test kaydını silmek istediğinize emin misiniz?')) {
      deleteTestLog(id)
      loadData()
    }
  }

  const filteredLogs = testLogs.filter((log) => {
    const matchesStudent = selectedStudentId === 'ALL' || log.studentId === selectedStudentId
    const matchesSubject = selectedSubjectId === 'ALL' || log.subjectId === selectedSubjectId
    return matchesStudent && matchesSubject
  })

  return (
    <>
      <Header
        title="Test & Net Takibi"
        subtitle="Günlük ve haftalık çözülen testler, otomatik net hesabı ve deneme sonuçları"
        onOpenNewTest={() => setIsModalOpen(true)}
      />

      {/* Control & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Filter className="w-4 h-4 text-emerald-500" />
            <span>Filtre:</span>
          </div>

          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">Tüm Öğrenciler</option>
            {students.map((std) => (
              <option key={std.id} value={std.id}>
                {std.name} {std.surname}
              </option>
            ))}
          </select>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">Tüm Dersler</option>
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Test Kaydı Ekle</span>
        </button>
      </div>

      {/* Test Logs History Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="pb-3">Tarih</th>
                <th className="pb-3">Öğrenci</th>
                <th className="pb-3">Ders</th>
                <th className="pb-3">Kaynak / Yayın</th>
                <th className="pb-3 text-center">Toplam Soru</th>
                <th className="pb-3 text-center">Doğru / Yanlış / Boş</th>
                <th className="pb-3 text-right">Net Score</th>
                <th className="pb-3 text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredLogs.map((log) => {
                const std = students.find((s) => s.id === log.studentId)
                const subj = subjects.find((s) => s.id === log.subjectId)
                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 text-slate-500">
                      {new Date(log.testDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {std ? `${std.name} ${std.surname}` : log.studentId}
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: subj?.color || '#3b82f6' }}
                      >
                        {subj?.name || log.subjectId}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {log.sourceBook || log.topicName || 'Soru Çözümü'}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {log.totalQuestions}
                    </td>
                    <td className="py-3 text-center font-bold">
                      <span className="text-emerald-600">{log.correct}D</span> /{' '}
                      <span className="text-rose-600">{log.incorrect}Y</span> / {log.blank}B
                    </td>
                    <td className="py-3 text-right font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {log.net.toFixed(2)} Net
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                        title="Test kaydını sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <LogTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={students}
        subjects={subjects}
        onTestLogged={loadData}
      />
    </>
  )
}
