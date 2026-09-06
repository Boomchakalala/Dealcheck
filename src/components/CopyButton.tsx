'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'

interface CopyButtonProps {
  text: string
  label?: string
  variant?: 'default' | 'ghost' | 'outline'
  onCopy?: () => void
}

export function CopyButton({ text, label = 'Copy', variant = 'outline', onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')

    // Call the onCopy callback if provided
    if (onCopy) {
      onCopy()
    }

    setTimeout(() => {
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
        copied && "bg-green-soft text-green-deep border-green-line"
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
