import { NextResponse } from 'next/server'
import { getStudents, createStudent } from '@/lib/dbService'

export async function GET() {
  try {
    const students = await getStudents()
    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Öğrenci listesi alınamadı.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.name || !body.surname || !body.targetExam) {
      return NextResponse.json({ success: false, error: 'Ad, Soyad ve Hedef Sınav zorunludur.' }, { status: 400 })
    }
    const student = await createStudent(body)
    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Öğrenci kaydedilemedi.' }, { status: 500 })
  }
}
