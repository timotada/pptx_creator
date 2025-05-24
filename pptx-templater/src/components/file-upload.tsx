'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FileUploadProps {
  onFileUpload: (file: File) => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        setError('File too large. Maximum size is 50MB.')
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        setError('Invalid file type. Please upload a PowerPoint (.pptx) file.')
      } else {
        setError('Invalid file. Please try again.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      onFileUpload(file)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          One-click PPTX
          <br />
          <span className="text-primary">personalisation</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your PowerPoint template, fill in your details, and download a 
          customized deck in seconds. Perfect for investor presentations, sales decks, 
          and company pitches.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-0 overflow-hidden">
        <div
          {...getRootProps()}
          className={`
            relative cursor-pointer border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
            ${isDragActive && !isDragReject 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50'
            }
            ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <motion.div
              className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
              animate={{
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 10 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              {isDragReject ? (
                <AlertCircle className="w-8 h-8 text-destructive" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </motion.div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isDragActive
                  ? isDragReject
                    ? 'Invalid file type'
                    : 'Drop your PPTX file here'
                  : 'Drop your PowerPoint template here'
                }
              </h3>
              <p className="text-muted-foreground">
                or <span className="text-primary font-medium">browse</span> to choose a file
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>.pptx only</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span>Max 50MB</span>
            </div>
          </div>

          {/* Glow effect */}
          {isDragActive && !isDragReject && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Template-Based</h3>
          <p className="text-sm text-muted-foreground">
            Upload your existing PowerPoint template and we'll customize it with your data
          </p>
        </div>
        
                  <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
          <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
          <p className="text-sm text-muted-foreground">
            Process your presentation in under 3 seconds, no matter the complexity
          </p>
        </div>
        
                  <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
          <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">
            Files are automatically deleted after 30 seconds for maximum privacy
          </p>
        </div>
      </div>
    </div>
  )
} 