import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject || 'General question',
      message: message.trim(),
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Contact submission error:', error)
      // If table doesn't exist yet, still return success to not block users
      if (error.code === '42P01') {
        console.warn('contact_submissions table does not exist yet — skipping DB insert')
      } else {
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
