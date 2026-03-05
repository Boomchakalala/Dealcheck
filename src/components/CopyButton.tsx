'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'

interface CopyButtonProps {
  text: string
  label?: string
  variant?: 'default' | 'ghost' | 'outline'
}

export function CopyButton({ text, label = 'Copy', variant = 'outline' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)

    // Show toast
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top'
    toast.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="font-medium">Copied to clipboard</span>
    `
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
      setCopied(false)
    }, 2000)
  }

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size="sm"
      className={cn(
        "gap-2",
        copied && "bg-emerald-50 text-emerald-700 border-emerald-200"
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
