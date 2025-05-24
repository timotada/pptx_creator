'use client'

import { motion } from 'framer-motion'
import { Check, Upload, Edit3, Cog, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Step } from './pptx-templater'

interface StepIndicatorProps {
  currentStep: Step
}

const steps = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'data', label: 'Fill Data', icon: Edit3 },
  { id: 'processing', label: 'Process', icon: Cog },
  { id: 'download', label: 'Download', icon: Download },
] as const

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-lg">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const Icon = step.icon

            return (
              <motion.div
                key={step.id}
                className={cn(
                  'flex items-center space-x-3 text-sm',
                  isCurrent && 'text-primary font-medium',
                  isCompleted && 'text-muted-foreground',
                  !isCurrent && !isCompleted && 'text-muted-foreground/50'
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-primary/10',
                    !isCurrent && !isCompleted && 'border-muted-foreground/30'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
                <span>{step.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 