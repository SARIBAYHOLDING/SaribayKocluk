'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard, Plus, Filter, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { MetricCard } from '@/components/common/MetricCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { AddPaymentModal } from '@/components/payments/AddPaymentModal'
import { PaymentData, StudentData } from '@/lib/initialData'
import {
  getStoredStudents,
  getStoredPayments,
  updatePaymentStatus,
  deletePayment,
} from '@/lib/storage'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [students, setStudents] = useState<StudentData[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    setStudents(getStoredStudents())
    setPayments(getStoredPayments())
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [])

  const handleToggleStatus = (id: string, currentStatus: PaymentData['status']) => {
    const nextStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID'
    updatePaymentStatus(id, nextStatus)
    loadData()
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu ödeme kaydını silmek istediğinize emin misiniz?')) {
      deletePayment(id)
      loadData()
    }
  }

  // KPI Financial totals
  const totalGrossPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0)

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, p) => acc + p.amount, 0)

  const totalOverdue = payments
    .filter((p) => p.status === 'OVERDUE')
    .reduce((acc, p) => acc + p.amount, 0)

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus
    const matchesStudent = selectedStudentId === 'ALL' || p.studentId === selectedStudentId
    return matchesStatus && matchesStudent
  })

  return (
    <>
      <Header
        title="Ödeme & Finans Takibi"
        subtitle="Tahsil edilen cirolar, bekleyen ödemeler ve vadesi geçmiş alacak takibi (LocalStorage)"
        onOpenNewPayment={() => setIsModalOpen(true)}
      />

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Tahsil Edilen Toplam Ciro"
          value={`${totalGrossPaid.toLocaleString('tr-TR')} TL`}
          subtitle="Ödenmiş kayıtlar toplamı"
          trend="Ödendi"
          trendType="positive"
          icon={CheckCircle}
          iconColor="from-emerald-500 to-teal-600"
        />
        <MetricCard
          title="Bekleyen Ödemeler"
          value={`${totalPending.toLocaleString('tr-TR')} TL`}
          subtitle="Günü yaklaşan tahsilatlar"
          trend="Bekliyor"
          trendType="neutral"
          icon={Clock}
          iconColor="from-amber-500 to-orange-600"
        />
        <MetricCard
          title="Günü Geçen Ödemeler"
          value={`${totalOverdue.toLocaleString('tr-TR')} TL`}
          subtitle="Gecikmiş ve takip gereken alacak"
          trend="Kritik"
          trendType="negative"
          icon={AlertCircle}
          iconColor="from-rose-500 to-red-600"
        />
      </div>

      {/* Control & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filtre:</span>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="PAID">Ödendi</option>
            <option value="PENDING">Bekliyor</option>
            <option value="OVERDUE">Günü Geçti</option>
            <option value="PARTIAL">Kısmi Ödeme</option>
          </select>

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
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ödeme Girişi</span>
        </button>
      </div>

      {/* Payment Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="pb-3">Son Ödeme Tarihi</th>
                <th className="pb-3">Öğrenci</th>
                <th className="pb-3">Tutar (TL)</th>
                <th className="pb-3">Model</th>
                <th className="pb-3">Yöntem</th>
                <th className="pb-3">Açıklama / Makbuz Notu</th>
                <th className="pb-3 text-center">Durum (Değiştir)</th>
                <th className="pb-3 text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredPayments.map((p) => {
                const std = students.find((s) => s.id === p.studentId)
                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 text-slate-500">
                      {new Date(p.dueDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {std ? `${std.name} ${std.surname}` : p.studentId}
                    </td>
                    <td className="py-3 font-black text-slate-900 dark:text-white text-sm">
                      {p.amount.toLocaleString('tr-TR')} TL
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {p.pricingModel === 'MONTHLY' ? 'Aylık Sabit' : p.pricingModel === 'HOURLY' ? 'Saatlik' : 'Seans Başı'}
                    </td>
                    <td className="py-3 text-slate-500 font-semibold">
                      {p.paymentMethod || 'EFT'}
                    </td>
                    <td className="py-3 text-slate-500 italic max-w-xs truncate">
                      {p.invoiceNote || 'Koçluk Ödemesi'}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        title="Tıkla ve durumu Ödendi / Bekliyor olarak değiştir"
                      >
                        <StatusBadge status={p.status} type="payment" />
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                        title="Ödeme kaydını sil"
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

      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={students}
        onPaymentAdded={loadData}
      />
    </>
  )
}
