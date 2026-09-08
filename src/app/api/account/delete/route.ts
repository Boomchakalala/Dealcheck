import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { deleteAccount } from '@/lib/account-deletion'

/**
 * Delete the signed-in user's account and all of their data.
 *
 * Why this route looked like it worked and didn't (fixed 2026-09-08): the
 * old version deleted deals with the session client, then the profile with
 * the same client — silently a no-op, `profiles` has no DELETE policy — and
 * then called auth.admin.deleteUser on the anon-key client, which cannot
 * call admin endpoints. Result: deals gone, login still worked.
 *
 * Now: the session client only proves who is asking. Everything destructive
 * runs in lib/account-deletion with the service role, where the auth-user
 * delete cascades through profiles to every owned row.
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await deleteAccount(createAdminClient(), user.id)
    console.log(`[account-delete] user removed; storage objects deleted: ${result.storageObjectsDeleted}`)

    // The session cookie is now for a user that no longer exists; drop it.
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Failed to delete account. Please contact support.' }, { status: 500 })
  }
}
