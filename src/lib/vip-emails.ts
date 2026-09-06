// VIP email list — grants admin on first auth callback.
// Idempotent: runs every callback but only writes when email matches.

const VIP_EMAILS = new Set([
  'swann.vincent@nuvellis.tech',
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function applyVipStatus(
  supabase: any,
  userId: string,
  email: string | null | undefined,
): Promise<void> {
  if (!email) return
  if (!VIP_EMAILS.has(email.toLowerCase())) return
  await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', userId)
}
