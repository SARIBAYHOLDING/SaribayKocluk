'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  GraduationCap,
  ExternalLink,
  BookOpen,
  Trash2,
  Edit,
  LayoutGrid,
  List,
  Download,
  Upload,
  RotateCcw,
  MessageCircle,
  TrendingUp,
  FileSpreadsheet,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NewStudentModal } from '@/components/students/NewStudentModal'
import { EditStudentModal } from '@/components/students/EditStudentModal'
import { StudentData } from '@/lib/initialData'
import {
  getStoredStudents,
  deleteStudent,
  exportBackupJSON,
  importBackupJSON,
  resetStorageToDefaults,
  getStoredTestLogs,
} from '@/lib/storage'

export default function StudentManagementPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [testLogsCount, setTestLogsCount] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedExam, setSelectedExam] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null)
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const loadData = () => {
    const list = getStoredStudents()
    setStudents(list)
    const logs = getStoredTestLogs()
    setTestLogsCount(logs.length)
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [])

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${name} isimli öğrenciyi ve tüm kayıtlarını silmek istediğinize emin misiniz?`)) {
      deleteStudent(id)
      loadData()
    }
  }

  const handleExportBackup = () => {
    const dataStr = exportBackupJSON()
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `saribay_kocluk_yedek_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content && importBackupJSON(content)) {
        alert('Veri yedeği başarıyla yüklendi!')
        loadData()
      } else {
        alert('Yedek dosyası geçersiz veya okunamadı.')
      }
    }
    reader.readAsText(file)
  }

  const handleResetData = () => {
    if (confirm('Tüm verileri ilk örnek verilerine sıfırlamak istediğinize emin misiniz? (Mevcut değişiklikler silinir)')) {
      resetStorageToDefaults()
      loadData()
    }
  }

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      `${s.name} ${s.surname}`.toLowerCase().includes(search.toLowerCase()) ||
      (s.schoolName && s.schoolName.toLowerCase().includes(search.toLowerCase())) ||
      (s.phone && s.phone.includes(search))
    const matchesExam = selectedExam === 'ALL' || s.targetExam.includes(selectedExam)
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus
    return matchesSearch && matchesExam && matchesStatus
  })

  // Metric Calculations
  const activeCount = students.filter((s) => s.status === 'ACTIVE').length
  const totalWeeklyQuestions = students.reduce((acc, s) => acc + (s.targetWeeklyQuestions || 0), 0)
  const totalMonthlyIncome = students
    .filter((s) => s.status === 'ACTIVE' && s.pricingType === 'MONTHLY')
    .reduce((acc, s) => acc + s.pricingAmount, 0)

  return (
    <>
      <Header
        title="Öğrenci Yönetimi & Takip"
        subtitle="Kayıtlı öğrenciler, performans hedefleri, iletişim ve yerel veri yönetimi"
        onOpenNewStudent={() => setIsNewModalOpen(true)}
      />

      {/* LocalStorage Data Status Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/90 to-purple-900/90 text-white shadow-lg border border-indigo-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>Local Storage Veri Modu Aktif</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Tarayıcıda Saklanıyor
              </span>
            </div>
            <p className="text-[11px] text-indigo-200">
              {students.length} Kayıtlı Öğrenci | {testLogsCount} Test Kaydı | İnternetsiz %100 Çalışır
            </p>
          </div>
        </div>

        {/* Local Storage Backup & Restore Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportBackup}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/20 transition-colors"
            title="Tüm verileri JSON olarak bilgisayara indir"
          >
            <Download className="w-3.5 h-3.5 text-indigo-300" />
            <span>Yedek İndir</span>
          </button>

          <label className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/20 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-purple-300" />
            <span>Yedek Yükle</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={handleResetData}
            className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
            title="Örnek veriler ile sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-semibold">Aktif / Toplam Öğrenci</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {activeCount} / {students.length} Öğrenci
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-semibold">Haftalık Soru Hedef Toplamı</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {totalWeeklyQuestions.toLocaleString('tr-TR')} Soru/Hafta
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-semibold">Aylık Sabit Ciro Hedefi</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {totalMonthlyIncome.toLocaleString('tr-TR')} TL
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-semibold">YKS / LGS Dağılımı</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {students.filter((s) => s.targetExam.includes('YKS')).length} YKS | {students.filter((s) => s.targetExam.includes('LGS')).length} LGS
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Öğrenci adı, tel veya okul ara..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Dropdowns & View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span>Filtre:</span>
          </div>

          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">Tüm Sınavlar</option>
            <option value="YKS">YKS</option>
            <option value="LGS">LGS</option>
            <option value="KPSS">KPSS</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Pasif</option>
            <option value="COMPLETED">Mezun</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Kart Görünümü"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Liste/Tablo Görünümü"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Öğrenci</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((std) => {
            const wpStudentUrl = std.phone
              ? `https://wa.me/${std.phone.replace(/[^0-9]/g, '')}`
              : null
            const wpParentUrl = std.parentPhone
              ? `https://wa.me/${std.parentPhone.replace(/[^0-9]/g, '')}`
              : null

            return (
              <div
                key={std.id}
                className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-all group relative"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-base shadow-md">
                        {std.name[0]}
                        {std.surname[0]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {std.name} {std.surname}
                        </h3>
                        <div className="text-xs text-slate-500 font-medium">
                          {std.grade} | {std.schoolName || 'Okul Belirtilmedi'}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={std.status} type="student" />
                  </div>

                  <div className="space-y-2 my-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Hedef Sınav:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {std.targetExam}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Haftalık Soru Hedefi:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {std.targetWeeklyQuestions} Soru
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Koçluk Ücreti:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {std.pricingAmount.toLocaleString('tr-TR')} TL ({std.pricingType === 'MONTHLY' ? 'Aylık' : 'Seans Başı'})
                      </span>
                    </div>

                    {std.parentPhone && (
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Veli İletişim:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {std.parentPhone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {wpParentUrl && (
                      <a
                        href={wpParentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                        title="Veli WhatsApp Mesajı Gönder"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setEditingStudent(std)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      title="Profili Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(std.id, `${std.name} ${std.surname}`)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
                      title="Öğrenciyi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    href={`/dashboard/students/${std.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Detaylı Profil & Takip</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3">Öğrenci</th>
                  <th className="pb-3">Sınıf & Okul</th>
                  <th className="pb-3">Hedef Sınav</th>
                  <th className="pb-3">Haftalık Soru</th>
                  <th className="pb-3">Veli / İletişim</th>
                  <th className="pb-3">Ücret</th>
                  <th className="pb-3">Durum</th>
                  <th className="pb-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <Link
                        href={`/dashboard/students/${std.id}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {std.name} {std.surname}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {std.grade} ({std.schoolName || 'Okul Yok'})
                    </td>
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {std.targetExam}
                    </td>
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                      {std.targetWeeklyQuestions} Soru
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {std.parentName} ({std.parentPhone})
                    </td>
                    <td className="py-3 font-bold text-emerald-600">
                      {std.pricingAmount.toLocaleString('tr-TR')} TL
                    </td>
                    <td className="py-3">
                      <StatusBadge status={std.status} type="student" />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingStudent(std)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(std.id, `${std.name} ${std.surname}`)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/dashboard/students/${std.id}`}
                          className="p-1.5 rounded-lg bg-indigo-600 text-white font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewStudentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onStudentAdded={loadData}
      />
      <EditStudentModal
        isOpen={!!editingStudent}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onStudentUpdated={loadData}
      />
    </>
  )
}
