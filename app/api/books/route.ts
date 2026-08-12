import { NextResponse } from 'next/server'
import { getBooks, createBook, addReadingLog } from '@/lib/dbService'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId') || undefined
    const books = await getBooks(studentId)
    return NextResponse.json({ success: true, data: books })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Kitap bilgileri alınamadı.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.type === 'READING_LOG') {
      const log = await addReadingLog(body)
      return NextResponse.json({ success: true, data: log })
    } else {
      if (!body.studentId || !body.title || !body.totalPages) {
        return NextResponse.json({ success: false, error: 'Öğrenci, Kitap Adı ve Sayfa Sayısı zorunludur.' }, { status: 400 })
      }
      const book = await createBook(body)
      return NextResponse.json({ success: true, data: book })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Kitap kaydı eklenemedi.' }, { status: 500 })
  }
}
