import { prisma } from '../lib/prisma'
import {
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_TEST_LOGS,
  INITIAL_BOOKS,
  INITIAL_READING_LOGS,
  INITIAL_PAYMENTS,
} from '../lib/initialData'

async function main() {
  console.log('🌱 Seeding database for Sarıbay Özel Koçluk Sistemi...')

  // Clear existing records safely
  await prisma.payment.deleteMany()
  await prisma.readingLog.deleteMany()
  await prisma.book.deleteMany()
  await prisma.testLog.deleteMany()
  try {
    await (prisma as any).topicProgress.deleteMany()
    await (prisma as any).topic.deleteMany()
  } catch (err) {
    // Ignore topic model if purged
  }
  await prisma.subject.deleteMany()
  await prisma.student.deleteMany()

  // 1. Create Subjects
  for (const subj of INITIAL_SUBJECTS) {
    await prisma.subject.create({
      data: {
        id: subj.id,
        name: subj.name,
        code: subj.code,
        color: subj.color,
      },
    })
  }

  // 2. Create Students
  for (const std of INITIAL_STUDENTS) {
    await prisma.student.create({
      data: {
        id: std.id,
        name: std.name,
        surname: std.surname,
        grade: std.grade,
        targetExam: std.targetExam,
        schoolName: std.schoolName,
        phone: std.phone,
        parentName: std.parentName,
        parentPhone: std.parentPhone,
        status: std.status,
        pricingType: std.pricingType,
        pricingAmount: std.pricingAmount,
        targetWeeklyQuestions: std.targetWeeklyQuestions,
        notes: std.notes,
        createdAt: new Date(std.createdAt),
      },
    })
  }

  // 3. Create Test Logs
  for (const tlog of INITIAL_TEST_LOGS) {
    await prisma.testLog.create({
      data: {
        id: tlog.id,
        studentId: tlog.studentId,
        subjectId: tlog.subjectId,
        topicName: tlog.topicName,
        sourceBook: tlog.sourceBook,
        testDate: new Date(tlog.testDate),
        totalQuestions: tlog.totalQuestions,
        correct: tlog.correct,
        incorrect: tlog.incorrect,
        blank: tlog.blank,
        net: tlog.net,
        targetNet: tlog.targetNet,
        notes: tlog.notes,
      },
    })
  }

  // 4. Create Books
  for (const bk of INITIAL_BOOKS) {
    await prisma.book.create({
      data: {
        id: bk.id,
        studentId: bk.studentId,
        title: bk.title,
        author: bk.author,
        totalPages: bk.totalPages,
        status: bk.status,
        startDate: new Date(bk.startDate),
        endDate: bk.endDate ? new Date(bk.endDate) : null,
        notes: bk.notes,
      },
    })
  }

  // 5. Create Reading Logs
  for (const rlog of INITIAL_READING_LOGS) {
    await prisma.readingLog.create({
      data: {
        id: rlog.id,
        bookId: rlog.bookId,
        logDate: new Date(rlog.logDate),
        pagesRead: rlog.pagesRead,
        startPage: rlog.startPage,
        endPage: rlog.endPage,
        studentNotes: rlog.studentNotes,
      },
    })
  }

  // 6. Create Payments
  for (const pay of INITIAL_PAYMENTS) {
    await prisma.payment.create({
      data: {
        id: pay.id,
        studentId: pay.studentId,
        amount: pay.amount,
        status: pay.status,
        paymentMethod: pay.paymentMethod,
        pricingModel: pay.pricingModel,
        dueDate: new Date(pay.dueDate),
        paidDate: pay.paidDate ? new Date(pay.paidDate) : null,
        invoiceNote: pay.invoiceNote,
      },
    })
  }

  console.log('✅ Database successfully seeded with Turkish coaching data!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
