import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailAdmins } from '@/lib/notifications'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json().catch(() => ({}))

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

    // Tell the humans. Inert until RESEND_API_KEY is set; never blocks the reply.
    try {
      await emailAdmins(
        `[Contact] ${subject || 'General question'} — ${name.trim()}`,
        `From: ${name.trim()} <${email.trim()}>\nSubject: ${subject || 'General question'}\n\n${message.trim()}`,
        email.trim(),
      )
    } catch (err) {
      console.error('Contact email error:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
