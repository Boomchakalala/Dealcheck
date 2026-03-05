'use client'

import { useState } from 'react'
import { Plus, CheckCircle2 } from 'lucide-react'
import { CloseDealModal } from './CloseDealModal'

interface DealActionBarProps {
  dealId: string
  currentTotal?: string
  dealStatus?: string
  roundCount?: number
  onDealClosed?: () => void
}

export function DealActionBar({ dealId, currentTotal, dealStatus, roundCount, onDealClosed }: DealActionBarProps) {
  const [showCloseModal, setShowCloseModal] = useState(false)
  const isClosed = dealStatus?.startsWith('closed_')

  if (isClosed) {
    return null // Don't show action bar if deal is already closed
  }

  const handleAddRound = () => {
    const addRoundElement = document.getElementById('add-round')
    if (addRoundElement) {
      addRoundElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Keep the momentum going
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddRound}
                className="px-4 py-2.5 text-sm font-semibold rounded-lg border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Round
              </button>
              <button
                onClick={() => setShowCloseModal(true)}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                Close Deal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind the action bar */}
      <div className="h-20" />

      {/* Close Deal Modal */}
      {showCloseModal && (
        <CloseDealModal
          dealId={dealId}
          currentTotal={currentTotal}
          onClose={() => setShowCloseModal(false)}
          onSuccess={() => {
            setShowCloseModal(false)
            if (onDealClosed) {
              onDealClosed()
            }
            // Reload the page to show updated deal status
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
