// VIP email list — grants admin + Pro plan on first auth callback.
// Idempotent: runs every callback but only writes when email matches.

const VIP_EMAILS = new Set([
  'swann.vincent@nuvellis.tech',
])

export async function applyVipStatus(
  supabase: { from: (table: string) => { update: (data: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<unknown> } } },
  userId: string,
  email: string | null | undefined,
): Promise<void> {
  if (!email) return
  if (!VIP_EMAILS.has(email.toLowerCase())) return
  await supabase
    .from('profiles')
    .update({ is_admin: true, plan: 'pro' })
    .eq('id', userId)
}
