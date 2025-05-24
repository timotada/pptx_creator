'use client'

import { motion } from 'framer-motion'
import { Download, CheckCircle, RotateCcw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ProcessedFile } from './pptx-templater'

interface DownloadViewProps {
  processedFile: ProcessedFile | null
  onStartOver: () => void
}

export function DownloadView({ processedFile, onStartOver }: DownloadViewProps) {
  const handleDownload = () => {
    if (processedFile?.url) {
      // In a real implementation, this would trigger the actual download
      const link = document.createElement('a')
      link.href = processedFile.url
      link.download = processedFile.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <motion.div
            className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Your Presentation is Ready!
          </h2>
          <p className="text-muted-foreground">
            Your customized PowerPoint deck has been generated successfully
          </p>
        </div>

        {/* File Info */}
        {processedFile && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{processedFile.filename}</p>
                    <p className="text-sm text-muted-foreground">PowerPoint Presentation</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Ready to download
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownload}
            size="lg"
            className="min-w-[200px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Deck
          </Button>
          
          <Button
            onClick={onStartOver}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Again
          </Button>
        </div>

        {/* Upsell */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 p-6 bg-muted/50 rounded-lg border border-border"
        >
          <h3 className="font-semibold text-foreground mb-2">
            Need 100s of decks?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Automate your presentation workflow with our bulk processing API
          </p>
          <Button variant="ghost" size="sm" className="text-primary">
            Talk to sales
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </motion.div>

        {/* Privacy Notice */}
        <div className="text-xs text-muted-foreground">
          🔒 Your files will be automatically deleted in 30 seconds for privacy
        </div>
      </motion.div>
    </div>
  )
} 