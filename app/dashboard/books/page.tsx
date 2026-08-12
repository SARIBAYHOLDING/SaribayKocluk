'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusBadge } from '@/components/common/StatusBadge'
import { BookData, StudentData } from '@/lib/initialData'
import {
  getStoredStudents,
  getStoredBooks,
  addBook,
} from '@/lib/storage'

export default function BooksPage() {
  const [books, setBooks] = useState<BookData[]>([])
  const [students, setStudents] = useState<StudentData[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ALL')
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)

  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    author: '',
    totalPages: '300',
    notes: '',
  })

  const loadData = () => {
    const stds = getStoredStudents()
    setStudents(stds)
    setBooks(getStoredBooks())
    if (stds.length > 0 && !formData.studentId) {
      setFormData((prev) => ({ ...prev, studentId: stds[0].id }))
    }
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('saribay_storage_change', handleStorageChange)
    return () => window.removeEventListener('saribay_storage_change', handleStorageChange)
  }, [])

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.studentId) return

    addBook({
      studentId: formData.studentId,
      title: formData.title,
      author: formData.author,
      totalPages: Number(formData.totalPages) || 100,
      status: 'READING',
      startDate: new Date().toISOString(),
      notes: formData.notes,
    })

    setIsAddBookOpen(false)
    setFormData({ ...formData, title: '', author: '', notes: '' })
    loadData()
  }

  const filteredBooks = books.filter((b) =>
    selectedStudentId === 'ALL' ? true : b.studentId === selectedStudentId
  )

  return (
    <>
      <Header
        title="Kitap Okuma Takibi"
        subtitle="Öğrencilerin kitap okuma alışkanlıkları, okuma hızları ve özet notları"
      />

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Öğrenci:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
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
          onClick={() => setIsAddBookOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kitap Kaydet</span>
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const std = students.find((s) => s.id === book.studentId)
          const percent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))

          return (
            <div
              key={book.id}
              className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{book.author}</p>
                    </div>
                  </div>
                  <StatusBadge status={book.status} type="book" />
                </div>

                <div className="mt-4 mb-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">
                    Öğrenci: {std ? `${std.name} ${std.surname}` : book.studentId}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-black">{percent}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-xs text-slate-500 flex justify-between font-semibold">
                  <span>Mevcut: {book.currentPage} Sayfa</span>
                  <span>Toplam: {book.totalPages} Sayfa</span>
                </div>

                {book.notes && (
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 italic p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                    "{book.notes}"
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Simple Add Book Modal */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Yeni Kitap Kaydı (LocalStorage)
            </h3>
            <form onSubmit={handleCreateBook} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Öğrenci</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200"
                >
                  {students.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.name} {std.surname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Kitap Adı</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Suç ve Ceza"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Yazar</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Örn: Fyodor Dostoyevski"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Toplam Sayfa</label>
                <input
                  type="number"
                  required
                  value={formData.totalPages}
                  onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Notlar</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
