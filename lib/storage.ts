import {
  StudentData,
  SubjectData,
  TestLogData,
  BookData,
  ReadingLogData,
  PaymentData,
  TaskData,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_TEST_LOGS,
  INITIAL_BOOKS,
  INITIAL_READING_LOGS,
  INITIAL_PAYMENTS,
  INITIAL_TASKS,
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
    version: 2,
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
