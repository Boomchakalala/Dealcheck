'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { CopyButton } from '@/components/CopyButton'
import type { EmailControls } from '@/types'

interface EmailGeneratorProps {
  roundId: string
  defaultControls?: EmailControls
}

export function EmailGenerator({ roundId, defaultControls }: EmailGeneratorProps) {
  const [tonePreference, setTonePreference] = useState<EmailControls['tone_preference']>(
    defaultControls?.tone_preference || 'balanced'
  )
  const [supplierRelationship, setSupplierRelationship] = useState<EmailControls['supplier_relationship']>(
    defaultControls?.supplier_relationship || 'unknown'
  )
  const [emailGoal, setEmailGoal] = useState<EmailControls['email_goal']>(
    defaultControls?.email_goal || 'negotiate'
  )
  const [userNotes, setUserNotes] = useState(defaultControls?.user_notes || '')
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/deal/${roundId}/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone_preference: tonePreference,
          supplier_relationship: supplierRelationship,
          email_goal: emailGoal,
          user_notes: userNotes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate email')
      }

      const data = await response.json()
      setGeneratedEmail(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Generate Email</h3>
        <p className="mt-1 text-sm text-gray-600">
          Customize the tone and approach for your supplier email
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select
            id="tone"
            value={tonePreference}
            onChange={(e) => setTonePreference(e.target.value as EmailControls['tone_preference'])}
          >
            <option value="soft">Soft - Warm and collaborative</option>
            <option value="balanced">Balanced - Professional and direct</option>
            <option value="firm">Firm - Assertive and businesslike</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Supplier Relationship</Label>
          <Select
            id="relationship"
            value={supplierRelationship}
            onChange={(e) => setSupplierRelationship(e.target.value as EmailControls['supplier_relationship'])}
          >
            <option value="new">New - First time engagement</option>
            <option value="existing">Existing - Current supplier</option>
            <option value="renewal">Renewal - Renewing contract</option>
            <option value="unknown">Unknown</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Email Goal</Label>
          <Select
            id="goal"
            value={emailGoal}
            onChange={(e) => setEmailGoal(e.target.value as EmailControls['email_goal'])}
          >
            <option value="clarify">Clarify - Request information</option>
            <option value="negotiate">Negotiate - Discuss terms</option>
            <option value="revise">Revise - Request changes</option>
            <option value="accept">Accept - Confirm with conditions</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Add any specific points or context for the email..."
          rows={3}
          className="resize-none"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? 'Generating...' : generatedEmail ? 'Regenerate Email' : 'Generate Email'}
      </Button>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {generatedEmail && (
        <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Subject
              </div>
              <div className="mt-1 font-medium text-gray-900">{generatedEmail.subject}</div>
            </div>
            <CopyButton text={generatedEmail.subject} label="Copy Subject" />
          </div>

          <div className="border-t border-emerald-200 pt-4">
            <div className="flex items-start justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Email Body
              </div>
              <CopyButton text={generatedEmail.body} label="Copy Email" />
            </div>
            <div className="mt-3 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm text-gray-900">
              {generatedEmail.body}
            </div>
          </div>

          <div className="text-xs text-emerald-700">
            You can regenerate this email with different settings as many times as you need.
          </div>
        </div>
      )}
    </div>
  )
}
