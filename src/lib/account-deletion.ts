import type { SupabaseClient } from '@supabase/supabase-js'

const DOC_BUCKET = 'negotiation-documents'

export interface AccountDeletionResult {
  storageObjectsDeleted: number
  authUserDeleted: boolean
}

/**
 * Delete one account and everything it owns. Runs with the service role.
 *
 * Order matters. The auth user is the root of every cascade
 * (auth.users → profiles → deals → rounds, negotiation_requests, vendors,
 * vendor_notes, notifications, feedback; ai_usage_events.user_id → NULL),
 * so deleting it removes all owned rows in one transaction and, at the same
 * moment, revokes the ability to sign in. That is the one destructive step.
 *
 * Storage has no foreign key to auth.users, so the user's negotiation
 * documents are removed explicitly. They go first: if that fails the account
 * is still intact and usable, and the caller reports an error. If the auth
 * delete fails after the files are gone, the account is still usable and the
 * only loss is documents the user had asked us to keep for a negotiation —
 * an acceptable failure compared to the reverse (rows gone, login still works).
 */
export async function deleteAccount(admin: SupabaseClient, userId: string): Promise<AccountDeletionResult> {
  const storageObjectsDeleted = await deleteUserStorageObjects(admin, userId)

  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) throw new Error(`auth delete failed: ${error.message}`)

  return { storageObjectsDeleted, authUserDeleted: true }
}

/**
 * Remove every object under `{userId}/` in the negotiation-documents bucket.
 * Paths are `{userId}/{requestUuid}/{filename}`; the storage API lists one
 * level at a time, so walk the folder then each subfolder. Idempotent: an
 * empty or missing folder yields 0.
 */
export async function deleteUserStorageObjects(admin: SupabaseClient, userId: string): Promise<number> {
  const paths = await listObjectPaths(admin, userId)
  if (paths.length === 0) return 0
  const { data, error } = await admin.storage.from(DOC_BUCKET).remove(paths)
  if (error) throw new Error(`storage delete failed: ${error.message}`)
  return data?.length ?? paths.length
}

async function listObjectPaths(admin: SupabaseClient, prefix: string): Promise<string[]> {
  const { data: entries, error } = await admin.storage.from(DOC_BUCKET).list(prefix, { limit: 1000 })
  if (error) throw new Error(`storage list failed: ${error.message}`)
  const out: string[] = []
  for (const e of entries || []) {
    // Folders come back without an id; files carry one.
    if (e.id) out.push(`${prefix}/${e.name}`)
    else out.push(...(await listObjectPaths(admin, `${prefix}/${e.name}`)))
  }
  return out
}
