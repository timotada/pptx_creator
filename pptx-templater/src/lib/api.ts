export interface ProcessTemplateResponse {
  success: boolean;
  filename: string;
  download_url: string;
  message: string;
  processing_time?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function processTemplate(
  file: File,
  companyName: string,
  date: Date,
  logo?: File
): Promise<ProcessTemplateResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('company_name', companyName);
  formData.append('date', date.toISOString());
  if (logo) {
    formData.append('logo', logo);
  }

  const res = await fetch(`${API_URL}/process`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to process template');
  }

  return res.json();
}
