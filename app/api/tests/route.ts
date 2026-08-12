import { NextResponse } from 'next/server'
import { getTestLogs, createTestLog } from '@/lib/dbService'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId') || undefined
    const logs = await getTestLogs(studentId)
    return NextResponse.json({ success: true, data: logs })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Test kayıtları alınamadı.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.studentId || !body.subjectId || body.correct === undefined || body.incorrect === undefined) {
      return NextResponse.json({ success: false, error: 'Öğrenci, Ders, Doğru ve Yanlış alanları zorunludur.' }, { status: 400 })
    }
    const log = await createTestLog(body)
    return NextResponse.json({ success: true, data: log })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Test kaydı eklenemedi.' }, { status: 500 })
  }
}
