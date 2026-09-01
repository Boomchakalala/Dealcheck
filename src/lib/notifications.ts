import { createAdminClient } from '@/lib/supabase/server'

export type NotificationType =
  | 'negotiation_new_request'
  | 'negotiation_waiting_on_client'
  | 'negotiation_closed'

interface NotificationPayload {
  type: NotificationType
  title: string
  body?: string
  link?: string
}

/**
 * Sends a transactional notification email. Inert until RESEND_API_KEY is
 * configured — logs and returns instead of failing, so notification triggers
 * are safe to call today and start actually sending the moment a key is added.
 * Swap RESEND_FROM_EMAIL once a sending domain is verified with Resend.
 */
async function sendNotificationEmail(to: string, subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(`[email] (inert — no RESEND_API_KEY) would send to ${to}: "${subject}"`)
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'TermLift <notifications@termlift.com>',
        to,
        subject,
        text: body,
      }),
    })
    if (!res.ok) {
      console.error('[email] Resend send failed:', await res.text())
    }
  } catch (err) {
    console.error('[email] Resend send error:', err)
  }
}

/** Inserts an in-app notification and (inertly, until configured) emails one user. */
export async function notifyUser(userId: string, payload: NotificationPayload) {
  const admin = createAdminClient()

  const { data: profile } = await admin.from('profiles').select('email').eq('id', userId).single()

  await admin.from('notifications').insert({
    user_id: userId,
    type: payload.type,
    title: payload.title,
    body: payload.body || null,
    link: payload.link || null,
  })

  if (profile?.email) {
    await sendNotificationEmail(profile.email, payload.title, payload.body || payload.title)
  }
}

/** Same as notifyUser, but fans out to every admin profile. */
export async function notifyAdmins(payload: NotificationPayload) {
  const admin = createAdminClient()
  const { data: admins } = await admin.from('profiles').select('id, email').eq('is_admin', true)

  for (const a of admins || []) {
    await admin.from('notifications').insert({
      user_id: a.id,
      type: payload.type,
      title: payload.title,
      body: payload.body || null,
      link: payload.link || null,
    })
    if (a.email) {
      await sendNotificationEmail(a.email, payload.title, payload.body || payload.title)
    }
  }
}
