import { NextResponse } from 'next/server'
import JSZip from 'jszip'

interface TemplateParams {
  companyName: string
  dateLong: string
  logo?: Buffer
}

function formatOrdinal(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? 'th'
      : { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th'
  const month = d.toLocaleString('en-US', { month: 'long' })
  return `${day}${suffix} ${month}, ${d.getFullYear()}`
}

function buildOutputName(companyName: string, dateStr: string) {
  const iso = dateStr.slice(0, 10).replace(/-/g, '')
  const safe = companyName.replace(/[\\/:*?"<>|]/g, '')
  return `${iso} ADA and ${safe} Meeting.pptx`
}

async function processPptx(template: Buffer, params: TemplateParams): Promise<Buffer> {
  const zip = await JSZip.loadAsync(template)

  const slideRegex = /^ppt\/slides\/slide\d+\.xml$/
  const files = Object.keys(zip.files).filter(p => slideRegex.test(p))
  await Promise.all(
    files.map(async p => {
      const xml = await zip.file(p)!.async('string')
      const replaced = xml
        .replace(/{{COMPANY_NAME}}/g, params.companyName)
        .replace(/{{DATE_LONG}}/g, params.dateLong)
        .replace(/{{LOGO}}/g, '')
      zip.file(p, replaced)
    })
  )

  // Logo insertion not fully implemented
  if (params.logo) {
    zip.file('ppt/media/logo.png', params.logo)
  }

  return await zip.generateAsync({ type: 'nodebuffer' })
}

export async function POST(req: Request) {
  const form = await req.formData()

  const templateFile = form.get('template') as File | null
  const companyName = form.get('companyName') as string | null
  const date = form.get('date') as string | null
  const logoFile = form.get('logo') as File | null

  if (!templateFile || !companyName || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const templateBuffer = Buffer.from(await templateFile.arrayBuffer())
  const logoBuffer = logoFile ? Buffer.from(await logoFile.arrayBuffer()) : undefined
  const dateLong = formatOrdinal(date)

  const output = await processPptx(templateBuffer, {
    companyName,
    dateLong,
    logo: logoBuffer,
  })

  const filename = buildOutputName(companyName, date)

  return new NextResponse(output, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
