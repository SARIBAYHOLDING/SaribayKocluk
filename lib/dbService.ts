import { prisma } from './prisma'
import {
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_TEST_LOGS,
  INITIAL_BOOKS,
  INITIAL_READING_LOGS,
  INITIAL_PAYMENTS,
  INITIAL_SCHEDULE_ITEMS,
  StudentData,
  SubjectData,
  TestLogData,
  BookData,
  ReadingLogData,
  PaymentData,
  ScheduleItemData,
} from './initialData'

export async function getStudents(): Promise<StudentData[]> {
  try {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' },
    })
    if (students.length > 0) {
      return students.map((s) => ({
        id: s.id,
        name: s.name,
        surname: s.surname,
        grade: s.grade,
        targetExam: s.targetExam,
        schoolName: s.schoolName || '',
        phone: s.phone || '',
        parentName: s.parentName || '',
        parentPhone: s.parentPhone || '',
        status: s.status as any,
        pricingType: s.pricingType as any,
        pricingAmount: s.pricingAmount,
        targetWeeklyQuestions: s.targetWeeklyQuestions,
        notes: s.notes || '',
        createdAt: s.createdAt.toISOString(),
      }))
    }
  } catch (err) {
    console.warn('Prisma getStudents fallback to initial data:', err)
  }
  return INITIAL_STUDENTS
}

export async function getStudentById(id: string): Promise<StudentData | null> {
  try {
    const s = await prisma.student.findUnique({ where: { id } })
    if (s) {
      return {
        id: s.id,
        name: s.name,
        surname: s.surname,
        grade: s.grade,
        targetExam: s.targetExam,
        schoolName: s.schoolName || '',
        phone: s.phone || '',
        parentName: s.parentName || '',
        parentPhone: s.parentPhone || '',
        status: s.status as any,
        pricingType: s.pricingType as any,
        pricingAmount: s.pricingAmount,
        targetWeeklyQuestions: s.targetWeeklyQuestions,
        notes: s.notes || '',
        createdAt: s.createdAt.toISOString(),
      }
    }
  } catch (err) {
    console.warn('Prisma getStudentById fallback:', err)
  }
  return INITIAL_STUDENTS.find((s) => s.id === id) || null
}

export async function createStudent(data: Omit<StudentData, 'id' | 'createdAt'>): Promise<StudentData> {
  const id = `std-${Date.now()}`
  try {
    const s = await prisma.student.create({
      data: {
        id,
        name: data.name,
        surname: data.surname,
        grade: data.grade,
        targetExam: data.targetExam,
        schoolName: data.schoolName,
        phone: data.phone,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        status: data.status,
        pricingType: data.pricingType,
        pricingAmount: Number(data.pricingAmount),
        targetWeeklyQuestions: Number(data.targetWeeklyQuestions),
        notes: data.notes,
      },
    })
    return {
      id: s.id,
      name: s.name,
      surname: s.surname,
      grade: s.grade,
      targetExam: s.targetExam,
      schoolName: s.schoolName || '',
      phone: s.phone || '',
      parentName: s.parentName || '',
      parentPhone: s.parentPhone || '',
      status: s.status as any,
      pricingType: s.pricingType as any,
      pricingAmount: s.pricingAmount,
      targetWeeklyQuestions: s.targetWeeklyQuestions,
      notes: s.notes || '',
      createdAt: s.createdAt.toISOString(),
    }
  } catch (err) {
    console.warn('Prisma createStudent fallback:', err)
    const newStudent: StudentData = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    }
    INITIAL_STUDENTS.push(newStudent)
    return newStudent
  }
}

export async function getSubjects(): Promise<SubjectData[]> {
  try {
    const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
    if (subjects.length > 0) {
      return subjects.map((sub) => ({
        id: sub.id,
        name: sub.name,
        code: sub.code,
        color: sub.color,
      }))
    }
  } catch (err) {
    console.warn('Prisma getSubjects fallback:', err)
  }
  return INITIAL_SUBJECTS
}

export async function getTestLogs(studentId?: string): Promise<TestLogData[]> {
  try {
    const logs = await prisma.testLog.findMany({
      where: studentId ? { studentId } : undefined,
      orderBy: { testDate: 'desc' },
    })
    if (logs.length > 0) {
      return logs.map((l) => ({
        id: l.id,
        studentId: l.studentId,
        subjectId: l.subjectId,
        topicName: l.topicName || '',
        sourceBook: l.sourceBook || '',
        testDate: l.testDate.toISOString(),
        totalQuestions: l.totalQuestions,
        correct: l.correct,
        incorrect: l.incorrect,
        blank: l.blank,
        net: l.net,
        targetNet: l.targetNet || undefined,
        notes: l.notes || '',
      }))
    }
  } catch (err) {
    console.warn('Prisma getTestLogs fallback:', err)
  }
  return studentId ? INITIAL_TEST_LOGS.filter((tl) => tl.studentId === studentId) : INITIAL_TEST_LOGS
}

export async function createTestLog(
  data: Omit<TestLogData, 'id' | 'net'>
): Promise<TestLogData> {
  const id = `tlog-${Date.now()}`
  const net = Math.max(0, Number(data.correct) - Number(data.incorrect) / 4.0)
  try {
    const tlog = await prisma.testLog.create({
      data: {
        id,
        studentId: data.studentId,
        subjectId: data.subjectId,
        topicName: data.topicName,
        sourceBook: data.sourceBook,
        testDate: new Date(data.testDate || Date.now()),
        totalQuestions: Number(data.totalQuestions),
        correct: Number(data.correct),
        incorrect: Number(data.incorrect),
        blank: Number(data.blank),
        net,
        targetNet: data.targetNet ? Number(data.targetNet) : null,
        notes: data.notes,
      },
    })
    return {
      id: tlog.id,
      studentId: tlog.studentId,
      subjectId: tlog.subjectId,
      topicName: tlog.topicName || '',
      sourceBook: tlog.sourceBook || '',
      testDate: tlog.testDate.toISOString(),
      totalQuestions: tlog.totalQuestions,
      correct: tlog.correct,
      incorrect: tlog.incorrect,
      blank: tlog.blank,
      net: tlog.net,
      targetNet: tlog.targetNet || undefined,
      notes: tlog.notes || '',
    }
  } catch (err) {
    console.warn('Prisma createTestLog fallback:', err)
    const newLog: TestLogData = {
      ...data,
      id,
      net,
    }
    INITIAL_TEST_LOGS.unshift(newLog)
    return newLog
  }
}

export async function getBooks(studentId?: string): Promise<BookData[]> {
  try {
    const books = await prisma.book.findMany({
      where: studentId ? { studentId } : undefined,
      include: { logs: true },
      orderBy: { startDate: 'desc' },
    })
    if (books.length > 0) {
      return books.map((b) => {
        const lastLog = b.logs.sort((a, c) => c.endPage - a.endPage)[0]
        const currentPage = lastLog ? lastLog.endPage : 0
        return {
          id: b.id,
          studentId: b.studentId,
          title: b.title,
          author: b.author,
          totalPages: b.totalPages,
          status: b.status as any,
          startDate: b.startDate.toISOString(),
          endDate: b.endDate ? b.endDate.toISOString() : undefined,
          currentPage,
          notes: b.notes || '',
        }
      })
    }
  } catch (err) {
    console.warn('Prisma getBooks fallback:', err)
  }
  return studentId ? INITIAL_BOOKS.filter((b) => b.studentId === studentId) : INITIAL_BOOKS
}

export async function createBook(data: Omit<BookData, 'id' | 'currentPage'>): Promise<BookData> {
  const id = `bk-${Date.now()}`
  try {
    const b = await prisma.book.create({
      data: {
        id,
        studentId: data.studentId,
        title: data.title,
        author: data.author,
        totalPages: Number(data.totalPages),
        status: data.status,
        startDate: new Date(data.startDate || Date.now()),
        notes: data.notes,
      },
    })
    return {
      id: b.id,
      studentId: b.studentId,
      title: b.title,
      author: b.author,
      totalPages: b.totalPages,
      status: b.status as any,
      startDate: b.startDate.toISOString(),
      currentPage: 0,
      notes: b.notes || '',
    }
  } catch (err) {
    console.warn('Prisma createBook fallback:', err)
    const newBook: BookData = {
      ...data,
      id,
      currentPage: 0,
    }
    INITIAL_BOOKS.unshift(newBook)
    return newBook
  }
}

export async function addReadingLog(
  data: Omit<ReadingLogData, 'id'>
): Promise<ReadingLogData> {
  const id = `rlog-${Date.now()}`
  const pagesRead = Number(data.endPage) - Number(data.startPage)
  try {
    const rlog = await prisma.readingLog.create({
      data: {
        id,
        bookId: data.bookId,
        logDate: new Date(data.logDate || Date.now()),
        pagesRead: Math.max(1, pagesRead),
        startPage: Number(data.startPage),
        endPage: Number(data.endPage),
        studentNotes: data.studentNotes,
      },
    })
    return {
      id: rlog.id,
      bookId: rlog.bookId,
      logDate: rlog.logDate.toISOString(),
      pagesRead: rlog.pagesRead,
      startPage: rlog.startPage,
      endPage: rlog.endPage,
      studentNotes: rlog.studentNotes || '',
    }
  } catch (err) {
    console.warn('Prisma addReadingLog fallback:', err)
    const newRlog: ReadingLogData = {
      ...data,
      id,
      pagesRead: Math.max(1, pagesRead),
    }
    INITIAL_READING_LOGS.unshift(newRlog)
    const book = INITIAL_BOOKS.find((b) => b.id === data.bookId)
    if (book) {
      book.currentPage = Math.max(book.currentPage, Number(data.endPage))
      if (book.currentPage >= book.totalPages) book.status = 'COMPLETED'
    }
    return newRlog
  }
}

export async function getPayments(studentId?: string): Promise<PaymentData[]> {
  try {
    const payments = await prisma.payment.findMany({
      where: studentId ? { studentId } : undefined,
      orderBy: { dueDate: 'desc' },
    })
    if (payments.length > 0) {
      return payments.map((p) => ({
        id: p.id,
        studentId: p.studentId,
        amount: p.amount,
        status: p.status as any,
        paymentMethod: p.paymentMethod as any,
        pricingModel: p.pricingModel as any,
        dueDate: p.dueDate.toISOString(),
        paidDate: p.paidDate ? p.paidDate.toISOString() : undefined,
        invoiceNote: p.invoiceNote || '',
      }))
    }
  } catch (err) {
    console.warn('Prisma getPayments fallback:', err)
  }
  return studentId ? INITIAL_PAYMENTS.filter((p) => p.studentId === studentId) : INITIAL_PAYMENTS
}

export async function createPayment(data: Omit<PaymentData, 'id'>): Promise<PaymentData> {
  const id = `pay-${Date.now()}`
  try {
    const p = await prisma.payment.create({
      data: {
        id,
        studentId: data.studentId,
        amount: Number(data.amount),
        status: data.status,
        paymentMethod: data.paymentMethod,
        pricingModel: data.pricingModel,
        dueDate: new Date(data.dueDate),
        paidDate: data.paidDate ? new Date(data.paidDate) : null,
        invoiceNote: '2 Seans Ücreti Alındı, Kalan 1 Seans Beklemede.',
      },
    })
    return {
      id: p.id,
      studentId: p.studentId,
      amount: p.amount,
      status: p.status as any,
      paymentMethod: p.paymentMethod as any,
      pricingModel: p.pricingModel as any,
      dueDate: p.dueDate.toISOString(),
      paidDate: p.paidDate ? p.paidDate.toISOString() : undefined,
      invoiceNote: p.invoiceNote || '',
    }
  } catch (err) {
    console.warn('Prisma createPayment fallback:', err)
    const newPay: PaymentData = {
      ...data,
      id,
    }
    INITIAL_PAYMENTS.unshift(newPay)
    return newPay
  }
}

export async function getScheduleItems(studentId?: string): Promise<ScheduleItemData[]> {
  try {
    const items = await (prisma as any).scheduleItem.findMany({
      where: studentId ? { studentId } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    if (items.length > 0) {
      return items.map((i: any) => ({
        id: i.id,
        studentId: i.studentId,
        dayOfWeek: i.dayOfWeek as any,
        timeSlot: i.timeSlot || undefined,
        subjectId: i.subjectId || '',
        topicName: i.topicName || undefined,
        targetQuestions: i.targetQuestions || 0,
        durationMinutes: i.durationMinutes || 60,
        completed: i.completed,
        priority: (i.priority as any) || 'MEDIUM',
        notes: i.notes || undefined,
        createdAt: i.createdAt ? i.createdAt.toISOString() : new Date().toISOString(),
      }))
    }
  } catch (err) {
    console.warn('Prisma getScheduleItems fallback:', err)
  }
  return studentId ? INITIAL_SCHEDULE_ITEMS.filter((i) => i.studentId === studentId) : INITIAL_SCHEDULE_ITEMS
}

