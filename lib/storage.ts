import {
  StudentData,
  SubjectData,
  TestLogData,
  BookData,
  ReadingLogData,
  PaymentData,
  TaskData,
  ScheduleItemData,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_TEST_LOGS,
  INITIAL_BOOKS,
  INITIAL_READING_LOGS,
  INITIAL_PAYMENTS,
  INITIAL_TASKS,
  INITIAL_SCHEDULE_ITEMS,
} from './initialData'

const STORAGE_KEY = 'saribay_coaching_storage_v2'

export interface StorageData {
  students: StudentData[]
  subjects: SubjectData[]
  testLogs: TestLogData[]
  books: BookData[]
  readingLogs: ReadingLogData[]
  payments: PaymentData[]
  tasks: TaskData[]
  scheduleItems: ScheduleItemData[]
  version: number
}

function getDefaultStorageData(): StorageData {
  return {
    students: INITIAL_STUDENTS,
    subjects: INITIAL_SUBJECTS,
    testLogs: INITIAL_TEST_LOGS,
    books: INITIAL_BOOKS,
    readingLogs: INITIAL_READING_LOGS,
    payments: INITIAL_PAYMENTS,
    tasks: INITIAL_TASKS,
    scheduleItems: INITIAL_SCHEDULE_ITEMS,
    version: 3,
  }
}

export function getStorageData(): StorageData {
  if (typeof window === 'undefined') {
    return getDefaultStorageData()
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = getDefaultStorageData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }

    const data = JSON.parse(raw) as StorageData
    // Ensure tasks exist in legacy data
    if (!data.tasks) {
      data.tasks = INITIAL_TASKS
    }
    if (!data.scheduleItems) {
      data.scheduleItems = INITIAL_SCHEDULE_ITEMS
    }
    return data
  } catch (err) {
    console.error('LocalStorage parse error:', err)
    return getDefaultStorageData()
  }
}

export function saveStorageData(data: StorageData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('saribay_storage_change'))
  } catch (err) {
    console.error('LocalStorage save error:', err)
  }
}

// Student CRUD
export function getStoredStudents(): StudentData[] {
  return getStorageData().students
}

export function addStudent(studentData: Omit<StudentData, 'id' | 'createdAt'>): StudentData {
  const data = getStorageData()
  const newStudent: StudentData = {
    ...studentData,
    id: `std-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  data.students.unshift(newStudent)
  saveStorageData(data)
  return newStudent
}

export function updateStudent(id: string, updates: Partial<StudentData>): StudentData | null {
  const data = getStorageData()
  const index = data.students.findIndex((s) => s.id === id)
  if (index === -1) return null

  data.students[index] = { ...data.students[index], ...updates }
  saveStorageData(data)
  return data.students[index]
}

export function deleteStudent(id: string): boolean {
  const data = getStorageData()
  const initialLength = data.students.length
  data.students = data.students.filter((s) => s.id !== id)
  data.testLogs = data.testLogs.filter((t) => t.studentId !== id)
  data.books = data.books.filter((b) => b.studentId !== id)
  data.payments = data.payments.filter((p) => p.studentId !== id)
  data.tasks = data.tasks.filter((tk) => tk.studentId !== id)
  saveStorageData(data)
  return data.students.length < initialLength
}

// TestLog CRUD
export function getStoredTestLogs(studentId?: string): TestLogData[] {
  const logs = getStorageData().testLogs
  return studentId ? logs.filter((l) => l.studentId === studentId) : logs
}

export function addTestLog(logInput: Omit<TestLogData, 'id' | 'net'>): TestLogData {
  const data = getStorageData()
  const net = Math.max(0, Number(logInput.correct) - Number(logInput.incorrect) / 4.0)
  const newLog: TestLogData = {
    ...logInput,
    id: `tlog-${Date.now()}`,
    net: Number(net.toFixed(2)),
  }
  data.testLogs.unshift(newLog)
  saveStorageData(data)
  return newLog
}

export function deleteTestLog(id: string): boolean {
  const data = getStorageData()
  const initialLength = data.testLogs.length
  data.testLogs = data.testLogs.filter((l) => l.id !== id)
  saveStorageData(data)
  return data.testLogs.length < initialLength
}

// Books & Reading Logs CRUD
export function getStoredBooks(studentId?: string): BookData[] {
  const books = getStorageData().books
  return studentId ? books.filter((b) => b.studentId === studentId) : books
}

export function addBook(bookInput: Omit<BookData, 'id' | 'currentPage'>): BookData {
  const data = getStorageData()
  const newBook: BookData = {
    ...bookInput,
    id: `bk-${Date.now()}`,
    currentPage: 0,
  }
  data.books.unshift(newBook)
  saveStorageData(data)
  return newBook
}

export function addReadingLog(logInput: Omit<ReadingLogData, 'id'>): ReadingLogData {
  const data = getStorageData()
  const pagesRead = Math.max(1, Number(logInput.endPage) - Number(logInput.startPage))
  const newLog: ReadingLogData = {
    ...logInput,
    id: `rlog-${Date.now()}`,
    pagesRead,
  }
  data.readingLogs.unshift(newLog)

  const bookIndex = data.books.findIndex((b) => b.id === logInput.bookId)
  if (bookIndex !== -1) {
    const book = data.books[bookIndex]
    book.currentPage = Math.max(book.currentPage, Number(logInput.endPage))
    if (book.currentPage >= book.totalPages) {
      book.status = 'COMPLETED'
    }
  }

  saveStorageData(data)
  return newLog
}

// Payments CRUD
export function getStoredPayments(studentId?: string): PaymentData[] {
  const payments = getStorageData().payments
  return studentId ? payments.filter((p) => p.studentId === studentId) : payments
}

export function addPayment(paymentInput: Omit<PaymentData, 'id'>): PaymentData {
  const data = getStorageData()
  const newPayment: PaymentData = {
    ...paymentInput,
    id: `pay-${Date.now()}`,
  }
  data.payments.unshift(newPayment)
  saveStorageData(data)
  return newPayment
}

export function updatePaymentStatus(id: string, status: PaymentData['status']): PaymentData | null {
  const data = getStorageData()
  const pay = data.payments.find((p) => p.id === id)
  if (!pay) return null

  pay.status = status
  if (status === 'PAID') {
    pay.paidDate = new Date().toISOString()
  }
  saveStorageData(data)
  return pay
}

export function deletePayment(id: string): boolean {
  const data = getStorageData()
  const initialLength = data.payments.length
  data.payments = data.payments.filter((p) => p.id !== id)
  saveStorageData(data)
  return data.payments.length < initialLength
}

// Tasks CRUD
export function getStoredTasks(studentId?: string): TaskData[] {
  const tasks = getStorageData().tasks || []
  return studentId ? tasks.filter((t) => t.studentId === studentId) : tasks
}

export function addTask(taskInput: Omit<TaskData, 'id' | 'completed' | 'createdAt'>): TaskData {
  const data = getStorageData()
  const newTask: TaskData = {
    ...taskInput,
    id: `task-${Date.now()}`,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  if (!data.tasks) data.tasks = []
  data.tasks.unshift(newTask)
  saveStorageData(data)
  return newTask
}

export function toggleTask(id: string): TaskData | null {
  const data = getStorageData()
  const task = data.tasks.find((t) => t.id === id)
  if (!task) return null

  task.completed = !task.completed
  if (task.completed && task.targetCount) {
    task.completedCount = task.targetCount
  }
  saveStorageData(data)
  return task
}

export function deleteTask(id: string): boolean {
  const data = getStorageData()
  const initialLength = data.tasks.length
  data.tasks = data.tasks.filter((t) => t.id !== id)
  saveStorageData(data)
  return data.tasks.length < initialLength
}
// Schedule Items CRUD
export function getStoredScheduleItems(studentId?: string): ScheduleItemData[] {
  const items = getStorageData().scheduleItems || []
  return studentId ? items.filter((i) => i.studentId === studentId) : items
}

export function addScheduleItem(
  itemInput: Omit<ScheduleItemData, 'id' | 'completed' | 'createdAt'>
): ScheduleItemData {
  const data = getStorageData()
  const newItem: ScheduleItemData = {
    ...itemInput,
    id: `sch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  if (!data.scheduleItems) data.scheduleItems = []
  data.scheduleItems.unshift(newItem)
  saveStorageData(data)
  return newItem
}

export function toggleScheduleItem(id: string): ScheduleItemData | null {
  const data = getStorageData()
  const item = (data.scheduleItems || []).find((i) => i.id === id)
  if (!item) return null

  item.completed = !item.completed
  saveStorageData(data)
  return item
}

export function deleteScheduleItem(id: string): boolean {
  const data = getStorageData()
  const initialLength = (data.scheduleItems || []).length
  data.scheduleItems = (data.scheduleItems || []).filter((i) => i.id !== id)
  saveStorageData(data)
  return data.scheduleItems.length < initialLength
}

export function applyPresetSchedule(
  studentId: string,
  presetType: 'YKS_SAY' | 'YKS_EA' | 'LGS' | 'KPSS'
): ScheduleItemData[] {
  const data = getStorageData()
  // Filter out existing schedule items for this student if any
  const existingOther = (data.scheduleItems || []).filter((i) => i.studentId !== studentId)

  let presetItems: Omit<ScheduleItemData, 'id' | 'studentId' | 'createdAt' | 'completed'>[] = []

  if (presetType === 'YKS_SAY') {
    presetItems = [
      { dayOfWeek: 'Pazartesi', timeSlot: '09:00 - 11:30', subjectId: 'subj-mat', topicName: 'AYT Türev & İntegral Kampı', targetQuestions: 90, durationMinutes: 150, priority: 'HIGH', notes: 'Soru bankasından 4 test bitirilecek' },
      { dayOfWeek: 'Pazartesi', timeSlot: '14:00 - 16:00', subjectId: 'subj-fiz', topicName: 'Elektromanyetizma', targetQuestions: 50, durationMinutes: 120, priority: 'MEDIUM', notes: 'Devre analizleri ve vektörler' },
      { dayOfWeek: 'Salı', timeSlot: '09:30 - 11:30', subjectId: 'subj-kim', topicName: 'Organik Kimya Giriş', targetQuestions: 60, durationMinutes: 120, priority: 'HIGH', notes: 'Alkanlar, alkenler reaksiyon mekanizmaları' },
      { dayOfWeek: 'Salı', timeSlot: '13:30 - 15:30', subjectId: 'subj-biy', topicName: 'Hücresel Solunum & Fotosentez', targetQuestions: 50, durationMinutes: 120, priority: 'MEDIUM', notes: 'Şema çizimleri ile ezber tekrarı' },
      { dayOfWeek: 'Çarşamba', timeSlot: '09:00 - 12:00', subjectId: 'subj-mat', topicName: 'Trigonometri & Analitik Geometri', targetQuestions: 80, durationMinutes: 180, priority: 'HIGH', notes: 'Çıkmış sorular taraması' },
      { dayOfWeek: 'Perşembe', timeSlot: '10:00 - 12:00', subjectId: 'subj-fiz', topicName: 'Optik ve Dalga Mekaniği', targetQuestions: 55, durationMinutes: 120, priority: 'MEDIUM', notes: 'Kırılma ve yansıma kuralları' },
      { dayOfWeek: 'Cuma', timeSlot: '09:00 - 12:30', subjectId: 'subj-mat', topicName: 'Genel AYT Alan Denemesi', targetQuestions: 40, durationMinutes: 210, priority: 'HIGH', notes: 'Gerçek sınav süresiyle tam deneme' },
      { dayOfWeek: 'Cumartesi', timeSlot: '10:00 - 12:00', subjectId: 'subj-trk', topicName: 'Paragraf Hız Çalışması', targetQuestions: 40, durationMinutes: 120, priority: 'LOW', notes: '30 dakikada 40 soru kronometreli' },
      { dayOfWeek: 'Pazar', timeSlot: '14:00 - 16:00', subjectId: 'subj-kim', topicName: 'Haftalık Yanlış Soru Analizi', targetQuestions: 30, durationMinutes: 120, priority: 'HIGH', notes: 'Eksik konuların tespiti ve koç değerlendirmesi' },
    ]
  } else if (presetType === 'YKS_EA') {
    presetItems = [
      { dayOfWeek: 'Pazartesi', timeSlot: '09:00 - 11:30', subjectId: 'subj-mat', topicName: 'TYT-AYT Matematik Problemler', targetQuestions: 75, durationMinutes: 150, priority: 'HIGH', notes: 'Hız ve yüzde problemleri yoğun çalışma' },
      { dayOfWeek: 'Pazartesi', timeSlot: '13:30 - 15:30', subjectId: 'subj-trk', topicName: 'Paragraf ve Anlam Bilgisi', targetQuestions: 50, durationMinutes: 120, priority: 'HIGH', notes: 'Ana fikir ve yardımcı düşünce soruları' },
      { dayOfWeek: 'Salı', timeSlot: '10:00 - 12:30', subjectId: 'subj-tar', topicName: 'Milli Mücadele ve İnkılap Tarihi', targetQuestions: 60, durationMinutes: 150, priority: 'HIGH', notes: 'Kronolojik zaman haritası çıkarma' },
      { dayOfWeek: 'Çarşamba', timeSlot: '09:30 - 11:30', subjectId: 'subj-cog', topicName: 'Harita Bilgisi ve İklim Tipleri', targetQuestions: 50, durationMinutes: 120, priority: 'MEDIUM', notes: 'Dilsiz harita üzerinde çalışma' },
      { dayOfWeek: 'Perşembe', timeSlot: '10:00 - 12:30', subjectId: 'subj-mat', topicName: 'Fonksiyonlar ve Polinomlar', targetQuestions: 70, durationMinutes: 150, priority: 'HIGH', notes: 'Kavramsal soru tipleri' },
      { dayOfWeek: 'Cuma', timeSlot: '14:00 - 16:30', subjectId: 'subj-tar', topicName: 'Türk Dili ve Edebiyatı Akımları', targetQuestions: 60, durationMinutes: 150, priority: 'HIGH', notes: 'Eser-Yazar eşleştirme kartları' },
      { dayOfWeek: 'Cumartesi', timeSlot: '09:30 - 12:30', subjectId: 'subj-mat', topicName: 'TYT Genel Deneme Çözümü', targetQuestions: 120, durationMinutes: 180, priority: 'HIGH', notes: 'Tam deneme ve süre yönetimi' },
    ]
  } else if (presetType === 'LGS') {
    presetItems = [
      { dayOfWeek: 'Pazartesi', timeSlot: '16:00 - 18:00', subjectId: 'subj-mat', topicName: 'Çarpanlar Katlar & Üslü İfadeler', targetQuestions: 50, durationMinutes: 120, priority: 'HIGH', notes: 'LGS yeni nesil şekilli sorular' },
      { dayOfWeek: 'Salı', timeSlot: '16:00 - 17:30', subjectId: 'subj-trk', topicName: 'Sözel Mantık ve Görsel Okuma', targetQuestions: 40, durationMinutes: 90, priority: 'HIGH', notes: 'Grafik ve tablo yorumlama' },
      { dayOfWeek: 'Çarşamba', timeSlot: '16:00 - 18:00', subjectId: 'subj-fiz', topicName: 'LGS Fen Bilimleri - Mevsimler & İklim', targetQuestions: 45, durationMinutes: 120, priority: 'MEDIUM', notes: 'Deney ve hipotez soruları' },
      { dayOfWeek: 'Perşembe', timeSlot: '16:00 - 18:00', subjectId: 'subj-mat', topicName: 'Kareköklü İfadeler Kampı', targetQuestions: 50, durationMinutes: 120, priority: 'HIGH', notes: 'Gerçek hayat problemleri' },
      { dayOfWeek: 'Cuma', timeSlot: '16:30 - 18:00', subjectId: 'subj-tar', topicName: 'T.C. İnkılap Tarihi ve Atatürkçülük', targetQuestions: 40, durationMinutes: 90, priority: 'MEDIUM', notes: 'Kavram haritası tekrarı' },
      { dayOfWeek: 'Cumartesi', timeSlot: '10:00 - 12:30', subjectId: 'subj-mat', topicName: 'LGS Sayısal Bölüm Alan Denemesi', targetQuestions: 40, durationMinutes: 150, priority: 'HIGH', notes: 'Matematik + Fen zamanlı çözüm' },
    ]
  } else {
    // KPSS
    presetItems = [
      { dayOfWeek: 'Pazartesi', timeSlot: '09:00 - 11:30', subjectId: 'subj-mat', topicName: 'KPSS Genel Matematik Problemler', targetQuestions: 60, durationMinutes: 150, priority: 'HIGH', notes: 'Sayısal mantık ve grafikler' },
      { dayOfWeek: 'Salı', timeSlot: '09:00 - 11:30', subjectId: 'subj-tar', topicName: 'Osmanlı Tarihi ve Islahatlar', targetQuestions: 70, durationMinutes: 150, priority: 'HIGH', notes: 'Detaylı konu anlatımı ve test' },
      { dayOfWeek: 'Çarşamba', timeSlot: '09:00 - 11:00', subjectId: 'subj-cog', topicName: 'Türkiye Coğrafyası Madenler & Enerji', targetQuestions: 50, durationMinutes: 120, priority: 'MEDIUM', notes: 'Haritalı çalışma' },
      { dayOfWeek: 'Perşembe', timeSlot: '09:00 - 11:30', subjectId: 'subj-trk', topicName: 'Sözel Mantık & Dil Bilgisi', targetQuestions: 50, durationMinutes: 150, priority: 'HIGH', notes: 'Tablo kurma teknikleri' },
      { dayOfWeek: 'Cuma', timeSlot: '09:00 - 12:00', subjectId: 'subj-mat', topicName: 'KPSS Genel Yetenek Denemesi', targetQuestions: 60, durationMinutes: 180, priority: 'HIGH', notes: 'Tam deneme çözümü' },
    ]
  }

  const generated: ScheduleItemData[] = presetItems.map((p, idx) => ({
    ...p,
    id: `sch-${Date.now()}-${idx}`,
    studentId,
    completed: false,
    createdAt: new Date().toISOString(),
  }))

  data.scheduleItems = [...generated, ...existingOther]
  saveStorageData(data)
  return generated
}

// Backup & Reset Helpers
export function exportBackupJSON(): string {
  return JSON.stringify(getStorageData(), null, 2)
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr)
    if (parsed && Array.isArray(parsed.students)) {
      saveStorageData(parsed)
      return true
    }
  } catch (err) {
    console.error('Import error:', err)
  }
  return false
}

export function resetStorageToDefaults(): void {
  saveStorageData(getDefaultStorageData())
}
