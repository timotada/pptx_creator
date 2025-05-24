export interface ProcessTemplateResponse {
  success: boolean
  filename: string
  download_url: string
  message: string
}

/**
 * Send a PPTX template and associated data to the backend for processing.
 * @param file The PowerPoint template file.
 * @param companyName Company name to replace placeholders.
 * @param date Date of the presentation.
 * @param logo Optional logo image file.
 */
export async function processTemplate(
  file: File,
  companyName: string,
  date: Date,
  logo?: File
): Promise<ProcessTemplateResponse> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('company_name', companyName)
  formData.append('date', date.toISOString())
  if (logo) {
    formData.append('logo', logo)
  }

  const res = await fetch(`${API_BASE_URL}/process`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Failed to process template')
  }

  return (await res.json()) as ProcessTemplateResponse
}
