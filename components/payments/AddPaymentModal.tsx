'use client'

import React, { useState, useEffect } from 'react'
import { X, CreditCard, DollarSign } from 'lucide-react'
import { StudentData } from '@/lib/initialData'
import { addPayment } from '@/lib/storage'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  students: StudentData[]
  onPaymentAdded?: () => void
}

export function AddPaymentModal({
  isOpen,
  onClose,
  students,
  onPaymentAdded,
}: AddPaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '4500',
    status: 'PAID' as 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL',
    paymentMethod: 'EFT' as 'EFT' | 'CASH' | 'CREDIT_CARD',
    pricingModel: 'MONTHLY' as 'MONTHLY' | 'HOURLY' | 'PER_SESSION',
    dueDate: new Date().toISOString().split('T')[0],
    paidDate: new Date().toISOString().split('T')[0],
    invoiceNote: '',
  })

  useEffect(() => {
    if (students.length > 0 && !formData.studentId) {
      setFormData((prev) => ({
        ...prev,
        studentId: students[0].id,
        amount: String(students[0].pricingAmount || 4500),
      }))
    }
  }, [students])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      addPayment({
        studentId: formData.studentId,
        amount: Number(formData.amount) || 0,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        pricingModel: formData.pricingModel,
        dueDate: new Date(formData.dueDate).toISOString(),
        paidDate: formData.status === 'PAID' ? new Date(formData.paidDate).toISOString() : undefined,
        invoiceNote: formData.invoiceNote,
      })
      onPaymentAdded?.()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Ödeme kaydı sırasında bir hata oluştu.')
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
          <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Yeni Ödeme Girişi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Öğrenci koçluk ücreti veya seans ödemesini finansal kayıtlara işleyin (LocalStorage Kayıtlı).
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Öğrenci *</label>
              <select
                value={formData.studentId}
                onChange={(e) => {
                  const s = students.find((std) => std.id === e.target.value)
                  setFormData({
                    ...formData,
                    studentId: e.target.value,
                    amount: s ? String(s.pricingAmount) : formData.amount,
                  })
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} {std.surname} ({std.pricingAmount} TL)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Tutar (TL) *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Ödeme Durumu</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="PAID">Ödendi</option>
                <option value="PENDING">Bekliyor</option>
                <option value="OVERDUE">Günü Geçti</option>
                <option value="PARTIAL">Kısmi Ödeme</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Ödeme Yöntemi</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="EFT">Havale / EFT</option>
                <option value="CASH">Nakit</option>
                <option value="CREDIT_CARD">Kredi Kartı</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Fiyat Modeli</label>
              <select
                value={formData.pricingModel}
                onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="MONTHLY">Aylık Sabit</option>
                <option value="HOURLY">Saatlik Ücret</option>
                <option value="PER_SESSION">Seans Başı</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Son Ödeme Tarihi *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            {formData.status === 'PAID' && (
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Ödendiği Tarih</label>
                <input
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Açıklama / Makbuz Notu</label>
            <textarea
              rows={2}
              value={formData.invoiceNote}
              onChange={(e) => setFormData({ ...formData, invoiceNote: e.target.value })}
              placeholder="Örn: Ağustos 2026 Dönemi Koçluk Hizmeti Ödemesi"
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
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              <span>{loading ? 'Kaydediliyor...' : 'Ödemeyi Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
