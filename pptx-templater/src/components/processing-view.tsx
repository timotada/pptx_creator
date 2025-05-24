'use client'

import { motion } from 'framer-motion'
import { Cog, Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface ProcessingViewProps {
  progress: number
}

const processingMessages = [
  "Crushing slide masters... 🚀",
  "Replacing placeholders... ⚡",
  "Optimizing layouts... 🎨",
  "Adding your branding... ✨",
  "Finalizing your deck... 🎯"
]

export function ProcessingView({ progress }: ProcessingViewProps) {
  const messageIndex = Math.min(Math.floor(progress / 20), processingMessages.length - 1)
  const currentMessage = processingMessages[messageIndex]

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Animated Icon */}
        <div className="flex justify-center">
          <motion.div
            className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Cog className="w-12 h-12 text-primary" />
          </motion.div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Processing Your Presentation
          </h2>
          <p className="text-muted-foreground">
            Sit back and relax while we customize your PowerPoint template
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <Progress value={progress} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{progress}% complete</span>
            <span className="text-primary font-medium">
              {progress < 100 ? 'Processing...' : 'Complete!'}
            </span>
          </div>
        </div>

        {/* Dynamic Message */}
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-center space-x-2"
        >
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium text-foreground">
            {currentMessage}
          </span>
        </motion.div>

        {/* Estimated Time */}
        <div className="text-sm text-muted-foreground">
          Estimated time remaining: {Math.max(0, Math.ceil((100 - progress) / 33))} seconds
        </div>
      </motion.div>
    </div>
  )
} 