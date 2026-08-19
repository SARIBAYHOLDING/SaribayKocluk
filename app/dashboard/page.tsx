'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  FileSpreadsheet,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { MetricCard } from '@/components/common/MetricCard'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { FinancialChart } from '@/components/dashboard/FinancialChart'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NewStudentModal } from '@/components/students/NewStudentModal'
import { LogTestModal } from '@/components/tests/LogTestModal'
import { AddPaymentModal } from '@/components/payments/AddPaymentModal'
import { StudentData, SubjectData, TestLogData, PaymentData, BookData, ScheduleItemData } from '@/lib/initialData'
import {
  getStoredStudents,
  getStoredTestLogs,
  getStoredBooks,
  getStoredPayments,
  getStoredScheduleItems,
  getStorageData,
} from '@/lib/storage'

export default function OverviewDashboardPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [testLogs, setTestLogs] = useState<TestLogData[]>([])
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [books, setBooks] = useState<BookData[]>([])
  const [scheduleItems, setScheduleItems] = useState<ScheduleItemData[]>([])

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const loadData = () => {
    const store = getStorageData()
    setStudents(getStoredStudents())
    setSubjects(store.subjects)
    setTestLogs(getStoredTestLogs())
    setBooks(getStoredBooks())
    setPayments(getStoredPayments())
    setScheduleItems(getStoredScheduleItems())
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [])

  // Calculations
  const activeStudents = students.filter((s) => s.status === 'ACTIVE')
  const totalQuestions = testLogs.reduce((acc, t) => acc + t.totalQuestions, 0)
  const avgNet =
    testLogs.length > 0
      ? (testLogs.reduce((acc, t) => acc + t.net, 0) / testLogs.length).toFixed(1)
      : '0'

  const grossRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0)

  const overduePayments = payments.filter((p) => p.status === 'OVERDUE')

  // Prepare Chart Data
  const performanceChartData = testLogs.slice(0, 7).map((log, idx) => ({
    name: `Test #${idx + 1}`,
    net: log.net,
    targetNet: log.targetNet || log.net + 2,
    questions: log.totalQuestions,
  }))

  const financialChartData = [
    {
      name: 'Ağustos',
      paid: grossRevenue,
      pending: payments
        .filter((p) => p.status === 'PENDING')
        .reduce((acc, p) => acc + p.amount, 0),
      overdue: overduePayments.reduce((acc, p) => acc + p.amount, 0),
    },
  ]

  return (
    <>
      <Header
        title="Genel Bakış"
        subtitle="Öğrenci koçluğu, akademik başarı ve finansal durum özeti"
        onOpenNewStudent={() => setIsStudentModalOpen(true)}
        onOpenNewTest={() => setIsTestModalOpen(true)}
        onOpenNewPayment={() => setIsPaymentModalOpen(true)}
      />

      {/* Overdue Payment Alert Banner */}
      {overduePayments.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
            <div>
              <div className="text-xs font-bold">
                {overduePayments.length} Adet Ödeme Günü Geçti!
              </div>
              <div className="text-[11px] opacity-80">
                Tahsilat takibi yapmak için ödemeler sayfasını kontrol ediniz.
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/payments"
            className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
          >
            <span>İncele</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Aktif Öğrenci"
          value={`${activeStudents.length} Öğrenci`}
          subtitle="Toplam kayıtlı öğrenci"
          trend="+12%"
          trendType="positive"
          icon={Users}
          iconColor="from-indigo-500 to-blue-600"
        />
        <MetricCard
          title="Çözülen Soru Sayısı"
          value={totalQuestions.toLocaleString('tr-TR')}
          subtitle="Tüm öğrenciler haftalık toplam"
          trend="+24%"
          trendType="positive"
          icon={FileSpreadsheet}
          iconColor="from-emerald-500 to-teal-600"
        />
        <MetricCard
          title="Ortalama Net Score"
          value={`${avgNet} Net`}
          subtitle="Genel test net ortalaması"
          trend="+3.2 Net"
          trendType="positive"
          icon={TrendingUp}
          iconColor="from-purple-500 to-pink-600"
        />
        <MetricCard
          title="Tahsil Edilen Ciro"
          value={`${grossRevenue.toLocaleString('tr-TR')} TL`}
          subtitle="Ağustos ayı ciro toplamı"
          trend="Aktif"
          trendType="neutral"
          icon={CreditCard}
          iconColor="from-amber-500 to-orange-600"
        />
      </div>

      {/* Recharts Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={performanceChartData} />
        <FinancialChart data={financialChartData} />
      </div>

      {/* Lower Row: Recent Students & Books Reading Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Aktif Öğrenciler & Hedefler
              </h3>
              <p className="text-xs text-slate-500">Öğrenci profilleri ve son durumları</p>
            </div>
            <Link
              href="/dashboard/students"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-2">Öğrenci</th>
                  <th className="pb-2">Sınıf</th>
                  <th className="pb-2">Hedef Sınav</th>
                  <th className="pb-2">Haftalık Soru</th>
                  <th className="pb-2 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {students.slice(0, 5).map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <Link
                        href={`/dashboard/students/${std.id}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {std.name} {std.surname}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{std.grade}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                        {std.targetExam}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                      {std.targetWeeklyQuestions} Soru
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={std.status} type="student" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reading Books Quick Tracker */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Kitap Okuma Takibi
                </h3>
              </div>
              <Link
                href="/dashboard/books"
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                Tümü
              </Link>
            </div>

            <div className="space-y-4 text-xs">
              {books.slice(0, 3).map((book) => {
                const percent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
                return (
                  <div
                    key={book.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700"
                  >
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-1">
                      <span>{book.title}</span>
                      <span className="text-purple-600 dark:text-purple-400">{percent}%</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mb-2">{book.author}</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Hızlı Test / Soru Logu Gir</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <NewStudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onStudentAdded={loadData}
      />
      <LogTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        students={students}
        subjects={subjects}
        onTestLogged={loadData}
      />
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        students={students}
        onPaymentAdded={loadData}
      />
    </>
  )
}
