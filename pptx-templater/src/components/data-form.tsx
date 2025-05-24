'use client'

import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import { Calendar, Upload, Eye, Building2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { TemplateData } from './pptx-templater'

interface DataFormProps {
  uploadedFile: File | null
  onSubmit: (data: TemplateData) => void
  initialData: TemplateData
  onBackToUpload?: () => void
  error?: string | null
}

export function DataForm({ uploadedFile, onSubmit, initialData, onBackToUpload, error }: DataFormProps) {
  const [formData, setFormData] = useState<TemplateData>(initialData)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompanyNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, companyName: e.target.value }))
  }, [])

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))
  }, [])

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, or SVG)')
        return
      }

      // Validate file size (max 10MB for logo)
      if (file.size > 10 * 1024 * 1024) {
        alert('Logo file too large. Maximum size is 10MB.')
        return
      }

      setFormData(prev => ({ ...prev, logo: file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyName.trim()) {
      alert('Please enter a company name')
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }, [formData, onSubmit])

  const formatDateForInput = (date: Date) => {
    return format(date, 'yyyy-MM-dd')
  }

  // Ordinal helper functions for date formatting
  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  const formatOrdinalDate = (d: Date) => {
    return `${ordinal(d.getDate())} ${d.toLocaleString("en-GB", { month: "long" })}, ${d.getFullYear()}`
  }

  const generateFilename = () => {
    if (!formData.companyName) return '20250521 ADA and Your Company Meeting.pptx'
    
    // ISO date format (YYYYMMDD) for filename
    const iso = formData.date.toISOString().slice(0, 10).replace(/-/g, "")
    return `${iso} ADA and ${formData.companyName} Meeting.pptx`
  }

  const btnClass = "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted/40"

  return (
    <section className="container relative mx-auto pt-10">
      {/* Back button – absolute so it doesn't push the heading off-centre */}
      {onBackToUpload && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToUpload}
          className={`${btnClass} absolute left-0 -top-2 inline-flex shrink-0`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upload
        </Button>
      )}

      {/* Heading block – full-width, perfectly centred */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center">
          Customize Your Presentation
        </h1>
        <p className="mt-1 text-muted-foreground text-center">
          Fill in your details to personalise your PowerPoint template
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 max-w-3xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <span className="text-sm font-medium">Error: {error}</span>
            </div>
          </div>
        </div>
      )}

      {/* ROW 3+ ─ form card, centered */}
      <div className="mt-10 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Template: {uploadedFile?.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                type="text"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleCompanyNameChange}
                className="text-lg h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary"
              />
              <p className="text-sm text-muted-foreground">
                This will replace all {`{{COMPANY_NAME}}`} placeholders in your template
              </p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Presentation Date</Label>
              <div className="flex space-x-4 items-center">
                <Input
                  id="date"
                  type="date"
                  value={formatDateForInput(formData.date)}
                  onChange={handleDateChange}
                  className="w-auto h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary"
                />
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Preview: {formatOrdinalDate(formData.date)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This will replace all {`{{DATE_LONG}}`} placeholders with the formatted date
              </p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo (Optional)</Label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium hover:file:bg-primary/90"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload PNG, JPG, or SVG. Will replace {`{{LOGO}}`} placeholders.
                  </p>
                </div>
                {logoPreview && (
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Preview
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filename Preview */}
            <div className="bg-muted/30 border border-muted-foreground/20 p-6 rounded-xl">
              <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">Output Filename Preview</h4>
              <code className="text-sm text-primary bg-background px-3 py-2 rounded-lg border border-border font-mono">
                {generateFilename()}
              </code>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !formData.companyName.trim()}
                className="min-w-[220px] h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-3" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-3" />
                    Generate Presentation
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Make sure your PowerPoint template contains placeholders like{' '}
            <code className="text-primary bg-muted px-1 rounded">{`{{COMPANY_NAME}}`}</code>,{' '}
            <code className="text-primary bg-muted px-1 rounded">{`{{DATE_LONG}}`}</code>, and{' '}
            <code className="text-primary bg-muted px-1 rounded">{`{{LOGO}}`}</code>
          </p>
        </div>
      </div>
    </section>
  )
} 