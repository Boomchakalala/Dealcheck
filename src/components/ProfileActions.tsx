'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileActionsProps {
  userId: string
  userEmail: string
}

export function ProfileActions({ userId, userEmail }: ProfileActionsProps) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      const response = await fetch('/auth/signout', {
        method: 'POST',
      })
      if (response.ok) {
        router.push('/login')
      }
    } catch (err) {
      console.error(err)
      setSigningOut(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    setDeleting(true)
    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      // Sign out and redirect
      await fetch('/auth/signout', { method: 'POST' })
      router.push('/')
    } catch (err) {
      toast.error('Failed to delete account. Please contact support.')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Sign Out */}
      <Button
        onClick={handleSignOut}
        disabled={signingOut}
        variant="outline"
        className="w-full justify-start"
      >
        {signingOut ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing out...
          </>
        ) : (
          'Sign Out'
        )}
      </Button>

      {/* Delete Account */}
      {!showDeleteConfirm ? (
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete Account
        </Button>
      ) : (
        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50 space-y-3">
          <div>
            <p className="text-sm font-semibold text-red-900 mb-1">Delete your account?</p>
            <p className="text-xs text-red-700 mb-3">
              This will permanently delete all your deals, rounds, and data. This action cannot be undone.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowDeleteConfirm(false)
                setDeleteConfirmText('')
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirmText !== 'DELETE'}
              size="sm"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Forever'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
