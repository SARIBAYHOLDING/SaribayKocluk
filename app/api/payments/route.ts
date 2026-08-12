import { NextResponse } from 'next/server'
import { getPayments, createPayment } from '@/lib/dbService'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId') || undefined
    const payments = await getPayments(studentId)
    return NextResponse.json({ success: true, data: payments })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ödeme verileri alınamadı.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.studentId || !body.amount || !body.dueDate) {
      return NextResponse.json({ success: false, error: 'Öğrenci, Tutar ve Son Ödeme Tarihi zorunludur.' }, { status: 400 })
    }
    const payment = await createPayment(body)
    return NextResponse.json({ success: true, data: payment })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ödeme kaydı eklenemedi.' }, { status: 500 })
  }
}
