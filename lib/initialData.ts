export interface StudentData {
  id: string;
  name: string;
  surname: string;
  grade: string;
  targetExam: string;
  schoolName: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  pricingType: 'MONTHLY' | 'HOURLY' | 'PER_SESSION';
  pricingAmount: number;
  targetWeeklyQuestions: number;
  notes: string;
  createdAt: string;
}

export interface SubjectData {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface TaskData {
  id: string;
  studentId: string;
  title: string;
  subjectId?: string;
  targetCount?: number;
  completedCount?: number;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface TestLogData {
  id: string;
  studentId: string;
  subjectId: string;
  topicName: string;
  sourceBook: string;
  testDate: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  blank: number;
  net: number;
  targetNet?: number;
  notes?: string;
}

export interface BookData {
  id: string;
  studentId: string;
  title: string;
  author: string;
  totalPages: number;
  status: 'READING' | 'COMPLETED' | 'PAUSED';
  startDate: string;
  endDate?: string;
  currentPage: number;
  notes?: string;
}

export interface ReadingLogData {
  id: string;
  bookId: string;
  logDate: string;
  pagesRead: number;
  startPage: number;
  endPage: number;
  studentNotes?: string;
}

export interface PaymentData {
  id: string;
  studentId: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  paymentMethod?: 'EFT' | 'CASH' | 'CREDIT_CARD';
  pricingModel: 'MONTHLY' | 'HOURLY' | 'PER_SESSION';
  dueDate: string;
  paidDate?: string;
  invoiceNote?: string;
}

export const INITIAL_SUBJECTS: SubjectData[] = [
  { id: 'subj-mat', name: 'Matematik', code: 'MAT', color: '#3b82f6' },
  { id: 'subj-fiz', name: 'Fizik', code: 'FIZ', color: '#8b5cf6' },
  { id: 'subj-kim', name: 'Kimya', code: 'KIM', color: '#ec4899' },
  { id: 'subj-biy', name: 'Biyoloji', code: 'BIY', color: '#10b981' },
  { id: 'subj-trk', name: 'Türkçe', code: 'TRK', color: '#f59e0b' },
  { id: 'subj-tar', name: 'Tarih', code: 'TAR', color: '#ef4444' },
  { id: 'subj-cog', name: 'Coğrafya', code: 'COG', color: '#06b6d4' },
];

export const INITIAL_STUDENTS: StudentData[] = [
  {
    id: 'std-1',
    name: 'Zeynep',
    surname: 'Yılmaz',
    grade: '12. Sınıf',
    targetExam: 'YKS (SAY)',
    schoolName: 'Atatürk Anadolu Lisesi',
    phone: '0532 111 22 33',
    parentName: 'Mehmet Yılmaz',
    parentPhone: '0532 999 88 77',
    status: 'ACTIVE',
    pricingType: 'MONTHLY',
    pricingAmount: 4500,
    targetWeeklyQuestions: 800,
    notes: 'Hedef: Hacettepe Tıp. Matematik ve Fizik netlerini artırmamız gerekiyor.',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'std-2',
    name: 'Emre',
    surname: 'Demir',
    grade: '12. Sınıf',
    targetExam: 'YKS (EA)',
    schoolName: 'Kardeşler Fen Lisesi',
    phone: '0544 222 33 44',
    parentName: 'Ayşe Demir',
    parentPhone: '0544 888 77 66',
    status: 'ACTIVE',
    pricingType: 'MONTHLY',
    pricingAmount: 4000,
    targetWeeklyQuestions: 650,
    notes: 'Hedef: Boğaziçi İşletme. Paragraf ve Matematik problem sürelerini kısaltıyoruz.',
    createdAt: '2026-01-15T11:30:00.000Z',
  },
  {
    id: 'std-3',
    name: 'Elif',
    surname: 'Kaya',
    grade: '8. Sınıf',
    targetExam: 'LGS',
    schoolName: 'Cumhuriyet Ortaokulu',
    phone: '0555 333 44 55',
    parentName: 'Murat Kaya',
    parentPhone: '0555 777 66 55',
    status: 'ACTIVE',
    pricingType: 'MONTHLY',
    pricingAmount: 3500,
    targetWeeklyQuestions: 500,
    notes: 'Hedef: Galatasaray Lisesi. Yeni nesil soru çözümlerine ağırlık veriyoruz.',
    createdAt: '2026-02-01T09:00:00.000Z',
  },
  {
    id: 'std-4',
    name: 'Burak',
    surname: 'Öztürk',
    grade: 'Mezun',
    targetExam: 'YKS (SAY)',
    schoolName: 'Gazi Anadolu Lisesi',
    phone: '0505 444 55 66',
    parentName: 'Hasan Öztürk',
    parentPhone: '0505 666 55 44',
    status: 'ACTIVE',
    pricingType: 'MONTHLY',
    pricingAmount: 5000,
    targetWeeklyQuestions: 900,
    notes: 'Hedef: İTÜ Bilgisayar Mühendisliği. AYT Kimya ve Biyoloji eksikleri tamamlanıyor.',
    createdAt: '2026-02-05T14:20:00.000Z',
  },
  {
    id: 'std-5',
    name: 'Selin',
    surname: 'Şahin',
    grade: '11. Sınıf',
    targetExam: 'YKS (EA)',
    schoolName: 'Özel Bilim Koleji',
    phone: '0533 555 66 77',
    parentName: 'Fatma Şahin',
    parentPhone: '0533 444 33 22',
    status: 'ACTIVE',
    pricingType: 'PER_SESSION',
    pricingAmount: 750,
    targetWeeklyQuestions: 400,
    notes: 'Hedef: Bilkent Hukuk. TYT Temel oturtma çalışması yürütülüyor.',
    createdAt: '2026-02-10T16:00:00.000Z',
  },
];

export const INITIAL_TASKS: TaskData[] = [
  {
    id: 'task-1',
    studentId: 'std-1',
    title: 'Matematik 100 Türev Sorusu Çözümü',
    subjectId: 'subj-mat',
    targetCount: 100,
    completedCount: 100,
    completed: true,
    dueDate: '2026-08-15',
    createdAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'task-2',
    studentId: 'std-1',
    title: 'Fizik Elektrik Denemesi Analizi',
    subjectId: 'subj-fiz',
    targetCount: 1,
    completedCount: 0,
    completed: false,
    dueDate: '2026-08-16',
    createdAt: '2026-08-11T12:00:00.000Z',
  },
  {
    id: 'task-3',
    studentId: 'std-2',
    title: 'Paragraf 40 Soru / 30 Dakika Süre Çalışması',
    subjectId: 'subj-trk',
    targetCount: 40,
    completedCount: 40,
    completed: true,
    dueDate: '2026-08-14',
    createdAt: '2026-08-09T09:00:00.000Z',
  },
  {
    id: 'task-4',
    studentId: 'std-3',
    title: 'LGS Yeni Nesil Çarpanlar Katlar 50 Soru',
    subjectId: 'subj-mat',
    targetCount: 50,
    completedCount: 25,
    completed: false,
    dueDate: '2026-08-17',
    createdAt: '2026-08-12T08:00:00.000Z',
  },
];

export const INITIAL_TEST_LOGS: TestLogData[] = [
  {
    id: 'tlog-1',
    studentId: 'std-1',
    subjectId: 'subj-mat',
    topicName: 'Fonksiyonlar',
    sourceBook: '3D Yayınları TYT Matematik',
    testDate: '2026-08-10T00:00:00.000Z',
    totalQuestions: 40,
    correct: 34,
    incorrect: 4,
    blank: 2,
    net: 33.0,
    targetNet: 35.0,
    notes: '2 yanlış dikkatsizlikten gitti.',
  },
  {
    id: 'tlog-2',
    studentId: 'std-1',
    subjectId: 'subj-fiz',
    topicName: 'Elektrik',
    sourceBook: 'Bilgi Sarmal AYT Fizik',
    testDate: '2026-08-11T00:00:00.000Z',
    totalQuestions: 20,
    correct: 16,
    incorrect: 3,
    blank: 1,
    net: 15.25,
    targetNet: 17.0,
    notes: 'Devre analizinde 1 boş var.',
  },
  {
    id: 'tlog-3',
    studentId: 'std-2',
    subjectId: 'subj-trk',
    topicName: 'Paragraf',
    sourceBook: 'Paragrafın Ritmi',
    testDate: '2026-08-10T00:00:00.000Z',
    totalQuestions: 30,
    correct: 27,
    incorrect: 2,
    blank: 1,
    net: 26.5,
    targetNet: 28.0,
    notes: 'Süre 28 dakika tutuldu.',
  },
  {
    id: 'tlog-4',
    studentId: 'std-3',
    subjectId: 'subj-mat',
    topicName: 'LGS Çarpanlar ve Katlar',
    sourceBook: 'Okyanus Master LGS',
    testDate: '2026-08-12T00:00:00.000Z',
    totalQuestions: 20,
    correct: 18,
    incorrect: 2,
    blank: 0,
    net: 17.5,
    targetNet: 18.0,
    notes: 'Yeni nesil sorular çözüldü.',
  },
  {
    id: 'tlog-5',
    studentId: 'std-4',
    subjectId: 'subj-kim',
    topicName: 'Kimyasal Hesaplamalar',
    sourceBook: 'Palme AYT Kimya',
    testDate: '2026-08-09T00:00:00.000Z',
    totalQuestions: 25,
    correct: 22,
    incorrect: 2,
    blank: 1,
    net: 21.5,
    targetNet: 23.0,
    notes: 'Mol kavramı pekişti.',
  },
];

export const INITIAL_BOOKS: BookData[] = [
  {
    id: 'bk-1',
    studentId: 'std-1',
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    totalPages: 687,
    status: 'READING',
    startDate: '2026-08-01T00:00:00.000Z',
    currentPage: 340,
    notes: 'Psikolojik analiz ve karakter derinliği üzerine yorumlar yazıldı.',
  },
  {
    id: 'bk-2',
    studentId: 'std-2',
    title: 'Saatleri Ayarlama Enstitüsü',
    author: 'Ahmet Hamdi Tanpınar',
    totalPages: 382,
    status: 'READING',
    startDate: '2026-08-05T00:00:00.000Z',
    currentPage: 210,
    notes: 'Doğu-Batı sentezi üzerine değerlendirmeler yapılıyor.',
  },
  {
    id: 'bk-3',
    studentId: 'std-3',
    title: 'Simyacı',
    author: 'Paulo Coelho',
    totalPages: 184,
    status: 'COMPLETED',
    startDate: '2026-07-20T00:00:00.000Z',
    endDate: '2026-08-02T00:00:00.000Z',
    currentPage: 184,
    notes: 'Kişisel menkıbe teması üzerine 1 sayfa özet teslim edildi.',
  },
  {
    id: 'bk-4',
    studentId: 'std-4',
    title: 'Nutuk',
    author: 'Mustafa Kemal Atatürk',
    totalPages: 544,
    status: 'READING',
    startDate: '2026-08-02T00:00:00.000Z',
    currentPage: 290,
    notes: 'Kurtuluş Savaşı ve kongreler dönemi bölümleri okunuyor.',
  },
];

export const INITIAL_READING_LOGS: ReadingLogData[] = [
  {
    id: 'rlog-1',
    bookId: 'bk-1',
    logDate: '2026-08-10T00:00:00.000Z',
    pagesRead: 40,
    startPage: 300,
    endPage: 340,
    studentNotes: "Raskolnikov'un vicdan azabı sahneleri etkileyiciydi.",
  },
  {
    id: 'rlog-2',
    bookId: 'bk-2',
    logDate: '2026-08-11T00:00:00.000Z',
    pagesRead: 30,
    startPage: 180,
    endPage: 210,
    studentNotes: 'Halit Ayarcı karakteri tahlil edildi.',
  },
];

export const INITIAL_PAYMENTS: PaymentData[] = [
  {
    id: 'pay-1',
    studentId: 'std-1',
    amount: 4500,
    status: 'PAID',
    paymentMethod: 'EFT',
    pricingModel: 'MONTHLY',
    dueDate: '2026-08-05T00:00:00.000Z',
    paidDate: '2026-08-04T10:30:00.000Z',
    invoiceNote: 'Ağustos 2026 Koçluk Ücreti Ödendi.',
  },
  {
    id: 'pay-2',
    studentId: 'std-2',
    amount: 4000,
    status: 'PENDING',
    pricingModel: 'MONTHLY',
    dueDate: '2026-08-15T00:00:00.000Z',
    invoiceNote: 'Ağustos 2026 Taksit Son Ödeme Tarihi Yaklaşıyor.',
  },
  {
    id: 'pay-3',
    studentId: 'std-3',
    amount: 3500,
    status: 'OVERDUE',
    pricingModel: 'MONTHLY',
    dueDate: '2026-08-01T00:00:00.000Z',
    invoiceNote: 'Temmuz/Ağustos Dönem Ödemesi Günü Geçti.',
  },
  {
    id: 'pay-4',
    studentId: 'std-4',
    amount: 5000,
    status: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    pricingModel: 'MONTHLY',
    dueDate: '2026-08-10T00:00:00.000Z',
    paidDate: '2026-08-09T18:15:00.000Z',
    invoiceNote: 'Ağustos Koçluk Paketi Tamamlandı.',
  },
  {
    id: 'pay-5',
    studentId: 'std-5',
    amount: 1500,
    status: 'PARTIAL',
    paymentMethod: 'CASH',
    pricingModel: 'PER_SESSION',
    dueDate: '2026-08-12T00:00:00.000Z',
    paidDate: '2026-08-12T14:00:00.000Z',
    invoiceNote: '2 Seans Ücreti Alındı, Kalan 1 Seans Beklemede.',
  },
];
