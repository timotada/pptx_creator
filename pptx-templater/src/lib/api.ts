export interface ProcessingResult {
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
): Promise<ProcessingResult> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("company_name", companyName)
  formData.append("date", date.toISOString())
  if (logo) {
    formData.append("logo", logo)
  }

  const res = await fetch("http://localhost:8000/process", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Processing failed: ${res.statusText}`)
  }

  return res.json()
}
