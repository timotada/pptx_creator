'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUpload } from './file-upload'
import { DataForm } from './data-form'
import { ProcessingView } from './processing-view'
import { DownloadView } from './download-view'
import { Header } from './header'
import { StepIndicator } from './step-indicator'
import { processTemplate } from '@/lib/api'

export type Step = 'upload' | 'data' | 'processing' | 'download'

export interface TemplateData {
  companyName: string
  date: Date
  logo?: File
}

export interface ProcessedFile {
  url: string
  filename: string
}

export function PPTXTemplater() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [templateData, setTemplateData] = useState<TemplateData>({
    companyName: '',
    date: new Date(),
  })
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file)
    setCurrentStep('data')
  }, [])

  const handleDataSubmit = useCallback(async (data: TemplateData) => {
    if (!uploadedFile) {
      setError('No file uploaded')
      return
    }

    setTemplateData(data)
    setCurrentStep('processing')
    setError(null)
    setProgress(0)

    try {
      // Show progress animation while waiting for API
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90)) // Don't go to 100% until complete
      }, 200)

      const result = await processTemplate(
        uploadedFile,
        data.companyName,
        data.date,
        data.logo
      )

      clearInterval(progressInterval)
      setProgress(100)

      // Set the processed file data
      setProcessedFile({
        url: result.download_url,
        filename: result.filename
      })

      // Move to download step after a brief delay to show 100% progress
      setTimeout(() => {
        setCurrentStep('download')
      }, 500)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Processing failed')
      setCurrentStep('data') // Go back to form on error
    }
  }, [uploadedFile])

  const handleStartOver = useCallback(() => {
    setCurrentStep('upload')
    setUploadedFile(null)
    setTemplateData({ companyName: '', date: new Date() })
    setProcessedFile(null)
    setProgress(0)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onBackToUpload={handleStartOver}
        showBackButton={currentStep !== 'upload' && currentStep !== 'data'}
      />
      <StepIndicator currentStep={currentStep} />
      
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileUpload onFileUpload={handleFileUpload} />
            </motion.div>
          )}

          {currentStep === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DataForm
                uploadedFile={uploadedFile}
                onSubmit={handleDataSubmit}
                initialData={templateData}
                onBackToUpload={handleStartOver}
                error={error}
              />
            </motion.div>
          )}

          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProcessingView progress={progress} />
            </motion.div>
          )}

          {currentStep === 'download' && (
            <motion.div
              key="download"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DownloadView
                processedFile={processedFile}
                onStartOver={handleStartOver}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

 