export interface ProcessTemplateResult {
  download_url: string
  filename: string
}

/**
 * Call the backend API to process a PPTX template.
 * @param file PPTX file to process
 * @param companyName Company name to insert
 * @param date Date of presentation
 * @param logo Optional logo image
 */
export async function processTemplate(
  file: File,
  companyName: string,
  date: Date,
  logo?: File
): Promise<ProcessTemplateResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
  const formData = new FormData()
  formData.append('file', file)
  formData.append('company_name', companyName)
  formData.append('date', date.toISOString().slice(0, 10))
  if (logo) {
    formData.append('logo', logo)
  }

  const res = await fetch(`${apiUrl}/process`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `API request failed with status ${res.status}`)
  }

  const data = await res.json()
  return {
    download_url: data.download_url,
    filename: data.filename
  }
}
