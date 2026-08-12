'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Phone,
  GraduationCap,
  FileSpreadsheet,
  BookOpen,
  CreditCard,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit,
  CheckSquare,
  MessageCircle,
  Save,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ParentReportView } from '@/components/reports/ParentReportView'
import { LogTestModal } from '@/components/tests/LogTestModal'
import { EditStudentModal } from '@/components/students/EditStudentModal'
import { AddTaskModal } from '@/components/students/AddTaskModal'
import { AddPaymentModal } from '@/components/payments/AddPaymentModal'
import {
  StudentData,
  TestLogData,
  BookData,
  PaymentData,
  SubjectData,
  TaskData,
} from '@/lib/initialData'
import {
  getStoredStudents,
  getStoredTestLogs,
  getStoredBooks,
  getStoredPayments,
  getStoredTasks,
  getStorageData,
  deleteTestLog,
  deletePayment,
  toggleTask,
  deleteTask,
  updateStudent,
  updatePaymentStatus,
} from '@/lib/storage'

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params?.id as string

  const [student, setStudent] = useState<StudentData | null>(null)
  const [testLogs, setTestLogs] = useState<TestLogData[]>([])
  const [books, setBooks] = useState<BookData[]>([])
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [coachNotes, setCoachNotes] = useState('')

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'tests' | 'books' | 'payments' | 'report'>('overview')

  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const loadStudentData = () => {
    if (!studentId) return
    const allStudents = getStoredStudents()
    const found = allStudents.find((s) => s.id === studentId) || null
    setStudent(found)
    if (found) setCoachNotes(found.notes || '')

    const store = getStorageData()
    setSubjects(store.subjects)
    setTestLogs(getStoredTestLogs(studentId))
    setBooks(getStoredBooks(studentId))
    setPayments(getStoredPayments(studentId))
    setTasks(getStoredTasks(studentId))
  }

  useEffect(() => {
    loadStudentData()
    const handleStorageChange = () => loadStudentData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [studentId])

  const handleSaveNotes = () => {
    if (!student) return
    updateStudent(student.id, { notes: coachNotes })
    alert('Notlar kaydedildi!')
  }

  const handleDeleteTest = (id: string) => {
    if (confirm('Bu test kaydını silmek istediğinize emin misiniz?')) {
      deleteTestLog(id)
      loadStudentData()
    }
  }

  const handleDeletePaymentItem = (id: string) => {
    if (confirm('Bu ödeme kaydını silmek istediğinize emin misiniz?')) {
      deletePayment(id)
      loadStudentData()
    }
  }

  const handleToggleTaskItem = (id: string) => {
    toggleTask(id)
    loadStudentData()
  }

  const handleDeleteTaskItem = (id: string) => {
    deleteTask(id)
    loadStudentData()
  }

  const handleTogglePaymentStatus = (id: string, currentStatus: PaymentData['status']) => {
    const nextStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID'
    updatePaymentStatus(id, nextStatus)
    loadStudentData()
  }

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500 font-semibold">
        <p>Öğrenci yükleniyor veya bulunamadı...</p>
        <Link href="/dashboard/students" className="text-indigo-600 font-bold text-xs mt-2 inline-block">
          Öğrenci Listesine Dön
        </Link>
      </div>
    )
  }

  const totalQuestions = testLogs.reduce((acc, t) => acc + t.totalQuestions, 0)
  const avgNet =
    testLogs.length > 0
      ? (testLogs.reduce((acc, t) => acc + t.net, 0) / testLogs.length).toFixed(2)
      : '0'

  const completedTasks = tasks.filter((t) => t.completed).length
  const taskProgressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const wpParentUrl = student.parentPhone
    ? `https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Sayın ${student.parentName || 'Veli'}, ${student.name} ${student.surname}'in koçluk durum özetini paylaşmak istiyorum.`
      )}`
    : null

  return (
    <>
      <Header title={`${student.name} ${student.surname}`} subtitle={`${student.grade} | ${student.targetExam}`} />

      {/* Back Button & Main Info Card */}
      <div className="space-y-4">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Öğrenci Listesine Dön</span>
        </Link>

        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              {student.name[0]}
              {student.surname[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {student.name} {student.surname}
                </h2>
                <StatusBadge status={student.status} type="student" />
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600 text-xs font-bold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Düzenle</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {student.schoolName || 'Okul Belirtilmedi'} | Öğrenci Tel: {student.phone || 'Kayıtlı Değil'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-700 dark:text-slate-300 flex-wrap">
                <span className="bg-indigo-500/10 text-indigo-600 px-2.5 py-0.5 rounded-full">
                  Veli: {student.parentName || 'Belirtilmedi'} ({student.parentPhone})
                </span>
                <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full">
                  Hedef: {student.targetWeeklyQuestions} Soru/Hafta
                </span>
                <span className="bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full">
                  Ücret: {student.pricingAmount.toLocaleString('tr-TR')} TL ({student.pricingType === 'MONTHLY' ? 'Aylık' : 'Seans'})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {wpParentUrl && (
              <a
                href={wpParentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Veli WhatsApp</span>
              </a>
            )}
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Test Logu Ekle</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span>Veli Raporu Al</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Genel Özet
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Haftalık Ödev & Görevler ({tasks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'tests'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Test Logları ({testLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'books'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Kitap Okuma ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'payments'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Ödeme Kayıtları ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'report'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Veli Raporu Önizleme
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-500 block mb-1">Toplam Çözülen Soru</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {totalQuestions.toLocaleString('tr-TR')} Soru
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-500 block mb-1">Ortalama Net Score</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {avgNet} Net
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-500 block mb-1">Görev Tamamlama Oranı</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                %{taskProgressPercent} ({completedTasks}/{tasks.length})
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-500 block mb-1">Okunan Kitap Sayısı</span>
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {books.length} Kitap
              </span>
            </div>
          </div>

          {/* Coach Notes Editor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Koçluk Değerlendirme & Özel Notlar</span>
              </h3>
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Notu Kaydet</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              placeholder="Öğrencinin haftalık gelişimi, zayıf/güçlü yönleri ve koçluk tavsiyelerinizi buraya yazın..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Weekly Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Haftalık Çalışma & Ödev Programı
                </h3>
                <p className="text-xs text-slate-500">
                  Tamamlanma Oranı: %{taskProgressPercent} ({completedTasks} / {tasks.length} Görev)
                </p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Görev Ekle</span>
              </button>
            </div>

            {/* Task Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>

            {/* Task List */}
            <div className="space-y-2 text-xs">
              {tasks.length === 0 ? (
                <div className="p-6 text-center text-slate-400 italic">
                  Henüz tanımlanmış haftalık görev bulunmuyor.
                </div>
              ) : (
                tasks.map((task) => {
                  const subj = subjects.find((s) => s.id === task.subjectId)
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-80'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleTaskItem(task.id)}
                          className="text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div>
                          <div
                            className={`font-bold ${
                              task.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            {subj && (
                              <span
                                className="px-2 py-0.5 rounded text-[10px] text-white font-bold"
                                style={{ backgroundColor: subj.color }}
                              >
                                {subj.name}
                              </span>
                            )}
                            {task.targetCount && <span>Hedef: {task.targetCount} Soru</span>}
                            {task.dueDate && <span>Son Tarih: {task.dueDate}</span>}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTaskItem(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Test Logs */}
      {activeTab === 'tests' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Test & Net Geçmişi
            </h3>
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Test Ekle</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-2">Tarih</th>
                  <th className="pb-2">Ders</th>
                  <th className="pb-2">Test / Yayın</th>
                  <th className="pb-2 text-center">Toplam Soru</th>
                  <th className="pb-2 text-center">D / Y / B</th>
                  <th className="pb-2 text-right">Net</th>
                  <th className="pb-2 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {testLogs.map((log) => {
                  const subj = subjects.find((s) => s.id === log.subjectId)
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 text-slate-500">
                        {new Date(log.testDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {subj?.name || log.subjectId}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">
                        {log.sourceBook || log.topicName || 'Genel Test'}
                      </td>
                      <td className="py-3 text-center font-bold">{log.totalQuestions}</td>
                      <td className="py-3 text-center font-bold">
                        <span className="text-emerald-600">{log.correct}D</span> /{' '}
                        <span className="text-rose-600">{log.incorrect}Y</span> / {log.blank}B
                      </td>
                      <td className="py-3 text-right font-black text-indigo-600 dark:text-indigo-400">
                        {log.net.toFixed(2)} Net
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteTest(log.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Books */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          {books.map((b) => {
            const percent = Math.min(100, Math.round((b.currentPage / b.totalPages) * 100))
            return (
              <div key={b.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                  <span className="text-sm">{b.title} ({b.author})</span>
                  <StatusBadge status={b.status} type="book" />
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>İlerleme: %{percent}</span>
                  <span>{b.currentPage} / {b.totalPages} Sayfa</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                </div>
                {b.notes && <p className="text-slate-500 pt-1">{b.notes}</p>}
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 5: Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ödeme Kaydı</span>
            </button>
          </div>

          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {p.amount.toLocaleString('tr-TR')} TL
                  </span>
                  <p className="text-slate-500">{p.invoiceNote || 'Koçluk Ödemesi'}</p>
                  <p className="text-[11px] text-slate-400">
                    Son Tarih: {new Date(p.dueDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePaymentStatus(p.id, p.status)}
                    className="cursor-pointer"
                  >
                    <StatusBadge status={p.status} type="payment" />
                  </button>
                  <button
                    onClick={() => handleDeletePaymentItem(p.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Parent Report */}
      {activeTab === 'report' && (
        <ParentReportView
          student={student}
          testLogs={testLogs}
          books={books}
          payments={payments}
          subjects={subjects}
        />
      )}

      {/* Modals */}
      <LogTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        students={[student]}
        subjects={subjects}
        onTestLogged={loadStudentData}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        student={student}
        onClose={() => setIsEditModalOpen(false)}
        onStudentUpdated={loadStudentData}
      />
      <AddTaskModal
        isOpen={isTaskModalOpen}
        studentId={student.id}
        subjects={subjects}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskAdded={loadStudentData}
      />
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        students={[student]}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentAdded={loadStudentData}
      />
    </>
  )
}
