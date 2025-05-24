'use client'

import { Moon, Sun, FileText, ArrowLeft } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onBackToUpload?: () => void
  showBackButton?: boolean
}

export function Header({ onBackToUpload, showBackButton = false }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToUpload}
                className="mr-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Upload
              </Button>
            )}
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">
              PPTX Templater
            </h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 p-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
} 