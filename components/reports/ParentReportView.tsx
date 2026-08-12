'use client'

import React from 'react'
import { Printer, GraduationCap, Award, BookOpen, CheckCircle, PhoneCall, ShieldCheck } from 'lucide-react'
import { StudentData, TestLogData, BookData, PaymentData, SubjectData } from '@/lib/initialData'

interface ParentReportViewProps {
  student: StudentData
  testLogs: TestLogData[]
  books: BookData[]
  payments: PaymentData[]
  subjects: SubjectData[]
}

export function ParentReportView({
  student,
  testLogs,
  books,
  payments,
  subjects,
}: ParentReportViewProps) {
  const handlePrint = () => {
    window.print()
  }

  // Calculate statistics for this student
  const studentLogs = testLogs.filter((l) => l.studentId === student.id)
  const totalQuestions = studentLogs.reduce((acc, l) => acc + l.totalQuestions, 0)
  const totalCorrect = studentLogs.reduce((acc, l) => acc + l.correct, 0)
  const totalIncorrect = studentLogs.reduce((acc, l) => acc + l.incorrect, 0)
  const avgNet = studentLogs.length > 0 ? studentLogs.reduce((acc, l) => acc + l.net, 0) / studentLogs.length : 0

  const studentBooks = books.filter((b) => b.studentId === student.id)
  const studentPayments = payments.filter((p) => p.studentId === student.id)

  const reportDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden on Print) */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-900 text-white shadow-lg print:hidden">
        <div>
          <h3 className="text-base font-bold">Veli Bilgilendirme Raporu Hazır</h3>
          <p className="text-xs text-indigo-200">
            Raporu yazdırabilir veya PDF olarak kaydedip veli görüşmesinde paylaşabilirsiniz.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all hover:scale-105"
        >
          <Printer className="w-4 h-4 text-indigo-600" />
          <span>Yazdır / PDF İndir</span>
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="rounded-3xl bg-white text-slate-900 p-8 shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0 space-y-8">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-900 text-white">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                Sarıbay Özel Koçluk Sistemi
              </h1>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
                Akademik & Gelişim Veli Bilgilendirme Raporu
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold text-slate-900">Tarih: {reportDate}</div>
            <div className="text-slate-500">Rapor No: #KOC-{student.id.toUpperCase()}</div>
          </div>
        </div>

        {/* Student Information Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block font-semibold">Öğrenci Adı Soyadı</span>
            <span className="text-sm font-black text-slate-900">
              {student.name} {student.surname}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Sınıf & Düzey</span>
            <span className="text-sm font-bold text-slate-800">{student.grade}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Hedef Sınav & Alan</span>
            <span className="text-sm font-bold text-indigo-700">{student.targetExam}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Veli İletişim</span>
            <span className="text-sm font-bold text-slate-800">
              {student.parentName || 'Veli'} ({student.parentPhone || 'Kayıtlı Değil'})
            </span>
          </div>
        </div>

        {/* Academic Performance KPI Summary */}
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            1. Akademik Soru & Net Performansı
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Toplam Çözülen Soru</span>
              <span className="text-xl font-black text-slate-900">{totalQuestions} Soru</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-700 font-semibold block">Toplam Doğru</span>
              <span className="text-xl font-black text-emerald-700">{totalCorrect}</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-xs text-rose-700 font-semibold block">Toplam Yanlış</span>
              <span className="text-xl font-black text-rose-700">{totalIncorrect}</span>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="text-xs text-indigo-700 font-semibold block">Ortalama Net Score</span>
              <span className="text-xl font-black text-indigo-700">{avgNet.toFixed(2)} Net</span>
            </div>
          </div>

          {/* Test Logs Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <th className="p-2.5">Ders</th>
                  <th className="p-2.5">Konu / Yayın</th>
                  <th className="p-2.5 text-center">Soru</th>
                  <th className="p-2.5 text-center">D / Y / B</th>
                  <th className="p-2.5 text-right">Net Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentLogs.slice(0, 5).map((log) => {
                  const subj = subjects.find((s) => s.id === log.subjectId)
                  return (
                    <tr key={log.id}>
                      <td className="p-2.5 font-bold text-slate-900">{subj?.name || log.subjectId}</td>
                      <td className="p-2.5 text-slate-600">
                        {log.topicName || log.sourceBook || 'Test Çözümü'}
                      </td>
                      <td className="p-2.5 text-center">{log.totalQuestions}</td>
                      <td className="p-2.5 text-center font-semibold">
                        <span className="text-emerald-600">{log.correct}D</span> /{' '}
                        <span className="text-rose-600">{log.incorrect}Y</span> / {log.blank}B
                      </td>
                      <td className="p-2.5 text-right font-black text-indigo-700">
                        {log.net.toFixed(2)} Net
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Book Reading & Habit Tracking */}
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            2. Kitap Okuma & Anlama Gelişimi
          </h3>

          {studentBooks.length > 0 ? (
            <div className="space-y-3 text-xs">
              {studentBooks.map((book) => {
                const percent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
                return (
                  <div key={book.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-900 mb-1">
                      <span>{book.title} ({book.author})</span>
                      <span>{percent}% Tamamlandı ({book.currentPage} / {book.totalPages} Sayfa)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Henüz aktif kitap okuma kaydı bulunmuyor.</p>
          )}
        </div>

        {/* Coach Evaluation Note */}
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs leading-relaxed">
          <h4 className="font-black text-indigo-950 uppercase mb-1">Koçluk Değerlendirme & Tavsiye Notu</h4>
          <p className="text-indigo-900 font-medium">{student.notes || 'Öğrencinin haftalık soru hedeflerine uyumu yüksek olup net grafiği yukarı yönlü ivmesini sürdürmektedir.'}</p>
        </div>

        {/* Mandatory Footer Signature & Contact */}
        <div className="pt-6 border-t-2 border-slate-900 flex items-center justify-between text-xs font-bold text-slate-700">
          <div>
            <div>Eğitmen & Öğrenci Koçu İmza</div>
            <div className="text-[11px] text-slate-400 font-normal mt-0.5">Sarıbay Özel Koçluk Sistemi</div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-indigo-700 font-black">
              <ShieldCheck className="w-4 h-4" />
              Powered by Sarıbay Yazılım
            </div>
            <div className="text-[11px] text-slate-500 font-normal">
              Destek Hattı & WhatsApp: 0551 031 10 29 | saribayholding.github.io/Saribay-Yazilim
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
