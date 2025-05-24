export interface ProcessResponse {
  success: boolean
  filename: string
  download_url: string
  message: string
  processing_time?: number
}

export async function processTemplate(
  file: File,
  companyName: string,
  date: Date,
  logo?: File
): Promise<ProcessResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('company_name', companyName)
  formData.append('date', date.toISOString().slice(0, 10))
  if (logo) {
    formData.append('logo', logo)
  }

  const res = await fetch('http://localhost:8000/process', {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(detail || 'Failed to process template')
  }

  return res.json() as Promise<ProcessResponse>
}
