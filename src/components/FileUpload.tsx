'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onTextExtracted: (text: string) => void
}

export function FileUpload({ onTextExtracted }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file')
      }

      onTextExtracted(data.extractedText)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center w-full h-40 px-4 transition-all
          border-2 border-dashed rounded-xl cursor-pointer
          ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
          {isProcessing ? (
            <>
              <Loader2 className="w-10 h-10 mb-3 text-emerald-500 animate-spin" />
              <p className="mb-2 text-sm text-gray-600 font-medium">
                Processing file...
              </p>
            </>
          ) : (
            <>
              {isDragging ? (
                <Upload className="w-10 h-10 mb-3 text-emerald-500" />
              ) : (
                <FileText className="w-10 h-10 mb-3 text-gray-400" />
              )}
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, PNG, JPG, or WEBP (max 10MB)
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,image/*,application/pdf"
          onChange={handleFileSelect}
          disabled={isProcessing}
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
