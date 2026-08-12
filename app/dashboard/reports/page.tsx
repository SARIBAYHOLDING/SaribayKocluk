'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { ParentReportView } from '@/components/reports/ParentReportView'
import { StudentData, TestLogData, BookData, PaymentData, SubjectData } from '@/lib/initialData'
import {
  getStoredStudents,
  getStoredTestLogs,
  getStoredBooks,
  getStoredPayments,
  getStorageData,
} from '@/lib/storage'

export default function ReportsPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [testLogs, setTestLogs] = useState<TestLogData[]>([])
  const [books, setBooks] = useState<BookData[]>([])
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [subjects, setSubjects] = useState<SubjectData[]>([])

  const loadData = () => {
    const store = getStorageData()
    const stds = getStoredStudents()
    setStudents(stds)
    if (stds.length > 0 && !selectedStudentId) {
      setSelectedStudentId(stds[0].id)
    }
    setSubjects(store.subjects)
    setTestLogs(getStoredTestLogs())
    setBooks(getStoredBooks())
    setPayments(getStoredPayments())
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [])

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  return (
    <>
      <Header
        title="Veli Bilgilendirme Raporu Al"
        subtitle="Veli toplantıları ve aylık öğrenci durum değerlendirmeleri için yazdırılabilir rapor oluşturucu (LocalStorage)"
      />

      {/* Student Selector Card (Hidden on Print) */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 print:hidden">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Rapor Oluşturulacak Öğrenci Seçin:
        </label>
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
        >
          {students.map((std) => (
            <option key={std.id} value={std.id}>
              {std.name} {std.surname} ({std.grade} - {std.targetExam})
            </option>
          ))}
        </select>
      </div>

      {selectedStudent ? (
        <ParentReportView
          student={selectedStudent}
          testLogs={testLogs}
          books={books}
          payments={payments}
          subjects={subjects}
        />
      ) : (
        <div className="p-8 text-center text-slate-500 text-xs font-semibold">
          Lütfen bir öğrenci seçiniz.
        </div>
      )}
    </>
  )
}
