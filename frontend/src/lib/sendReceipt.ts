import jsPDF from 'jspdf'
import { supabase } from '@/lib/supabase'

type Donor = { name: string; email: string; mobile: string; pan: string; amount: number }

export async function buildReceiptPdfBase64(donor: Donor, reference: string): Promise<string> {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = pdf.internal.pageSize.getWidth()
  const H = pdf.internal.pageSize.getHeight()
  const margin = 16
  const contentW = W - margin * 2
  const rotis = Math.floor(donor.amount / 10)
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  const hexRgb = (hex: string): [number, number, number] => {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }

  const fillRect = (x: number, y: number, w: number, h: number, color: string) => {
    pdf.setFillColor(...hexRgb(color))
    pdf.rect(x, y, w, h, 'F')
  }

  const strokeRect = (x: number, y: number, w: number, h: number, color: string, lw = 0.3) => {
    pdf.setDrawColor(...hexRgb(color))
    pdf.setLineWidth(lw)
    pdf.rect(x, y, w, h, 'D')
  }

  const txt = (
    str: string,
    x: number,
    y: number,
    opts: { size?: number; color?: string; bold?: boolean; align?: 'left' | 'center' | 'right' } = {}
  ) => {
    pdf.setFontSize(opts.size ?? 10)
    pdf.setTextColor(...hexRgb(opts.color ?? '#1a1208'))
    pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal')
    pdf.text(str, x, y, { align: opts.align ?? 'left' })
  }

  let y = 0
  fillRect(0, 0, W * 0.55, 5, '#ea580c')
  fillRect(W * 0.55, 0, W * 0.45, 5, '#f59e0b')
  y = 5
  fillRect(0, y, W, H - y, '#ffffff')
  y += 11

  fillRect(margin, y, 18, 18, '#ea580c')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(255, 255, 255)
  pdf.text('ROW', margin + 3, y + 12)

  txt('RotiOnWheels', margin + 23, y + 7, { size: 17, color: '#1a1208', bold: true })
  txt('Arham Yuva Seva Group  |  Ahmedabad', margin + 23, y + 13.5, { size: 7.5, color: '#9a7c5a' })

  const bx = W - margin - 36, by = y + 1
  fillRect(bx, by, 36, 9, '#f0fdf4')
  strokeRect(bx, by, 36, 9, '#86efac', 0.4)
  txt('80G ELIGIBLE', bx + 18, by + 6, { size: 7, color: '#15803d', bold: true, align: 'center' })

  y += 26
  pdf.setDrawColor(...hexRgb('#f0e4d0'))
  pdf.setLineWidth(0.5)
  pdf.line(margin, y, W - margin, y)
  y += 11

  txt('DONATION CERTIFICATE', W / 2, y, { size: 22, color: '#1a1208', bold: true, align: 'center' })
  y += 8
  txt('Issued with gratitude  |  Arham Yuva Seva Group', W / 2, y, { size: 8.5, color: '#6b5236', align: 'center' })
  y += 13

  const heroH = 34
  fillRect(margin, y, contentW, heroH, '#fff7ed')
  strokeRect(margin, y, contentW, heroH, '#fed7aa', 0.5)
  txt('CONTRIBUTION RECEIVED', W / 2, y + 9, { size: 7.5, color: '#9a7c5a', bold: true, align: 'center' })
  txt(`Rs. ${donor.amount.toLocaleString('en-IN')}`, W / 2, y + 22, { size: 28, color: '#d4591a', bold: true, align: 'center' })
  txt(`Sponsors ${rotis} nutritious rotis for neighbors in need`, W / 2, y + 30, { size: 8.5, color: '#6b5236', align: 'center' })
  y += heroH + 9

  const fields: [string, string][] = [
    ['Donor Name',    donor.name],
    ['Date',          date],
    ['PAN Number',    donor.pan],
    ['Reference No.', reference],
    ['Email Address', donor.email],
    ['Mobile',        donor.mobile],
  ]
  const colW = contentW / 2
  const cellH = 22

  fields.forEach(([label, value], i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const cx = margin + col * colW
    const cy = y + row * cellH

    if (row % 2 === 1) fillRect(cx, cy, colW, cellH, '#faf7f2')
    strokeRect(cx, cy, colW, cellH, '#e8d9bf', 0.25)
    txt(label.toUpperCase(), cx + 4, cy + 8, { size: 6.5, color: '#9a7c5a', bold: true })
    pdf.setFontSize(9.5)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...hexRgb('#1a1208'))
    pdf.text(value || '-', cx + 4, cy + 17)
  })

  y += Math.ceil(fields.length / 2) * cellH + 10

  const legalText = `This is an official provisional receipt under Section 80G of the Income Tax Act, 1961. All donations to Arham Yuva Seva Group are eligible for tax deduction. A verified 80G certificate will be dispatched to ${donor.email} within 7 working days of receipt confirmation.`
  const legalLines = pdf.splitTextToSize(legalText, contentW - 10) as string[]
  const legalBoxH = 10 + legalLines.length * 4.5

  fillRect(margin, y, contentW, legalBoxH, '#fffbeb')
  strokeRect(margin, y, contentW, legalBoxH, '#fde68a', 0.4)
  txt('NOTE:', margin + 4, y + 8, { size: 8, color: '#d97706', bold: true })
  pdf.setFontSize(7.5)
  pdf.setTextColor(...hexRgb('#78500a'))
  pdf.setFont('helvetica', 'normal')
  pdf.text(legalLines, margin + 4, y + 15)
  y += legalBoxH + 9

  pdf.setDrawColor(...hexRgb('#e8d9bf'))
  pdf.setLineWidth(0.4)
  pdf.line(margin, y, W - margin, y)
  y += 6
  txt(`RotiOnWheels  |  ${new Date().getFullYear()}  |  Seva with Love  |  Arham Yuva Seva Group`, W / 2, y, { size: 7, color: '#c9a87a', align: 'center' })

  fillRect(0, H - 5, W * 0.55, 5, '#ea580c')
  fillRect(W * 0.55, H - 5, W * 0.45, 5, '#f59e0b')

  const pdfDataUri = pdf.output('datauristring')
  return pdfDataUri.split(',')[1]
}

export async function sendAutomaticReceiptEmail(donor: Donor, reference: string) {
  try {
    const pdfBase64 = await buildReceiptPdfBase64(donor, reference)
    const { data, error } = await supabase.functions.invoke('send-receipt', {
      body: { donor, reference, pdfBase64 }
    })
    if (error) {
      console.warn('Automatic receipt email warning:', error)
    } else {
      console.log('Automatic receipt email sent successfully:', data)
    }
  } catch (err) {
    console.warn('Automatic receipt email error handled:', err)
  }
}
