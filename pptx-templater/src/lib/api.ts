export interface ProcessResult {
  download_url: string
  filename: string
}

export async function processTemplate(
  file: File,
  companyName: string,
  date: Date,
  logo?: File
): Promise<ProcessResult> {
  const formData = new FormData()
  formData.append('template', file)
  formData.append('companyName', companyName)
  formData.append('date', date.toISOString())
  if (logo) {
    formData.append('logo', logo)
  }

  const res = await fetch('/api/generate', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to generate presentation')
  }

  const blob = await res.blob()
  const disposition = res.headers.get('Content-Disposition')
  const filenameMatch = disposition?.match(/filename="?([^\"]+)"?/)
  const filename = filenameMatch ? filenameMatch[1] : 'presentation.pptx'
  const url = URL.createObjectURL(blob)

  return { download_url: url, filename }
}
