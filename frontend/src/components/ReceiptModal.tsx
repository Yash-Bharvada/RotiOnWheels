import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Download,
  Mail,
  MessageCircle,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Send,
  CheckCheck,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui'
import { supabase } from '@/lib/supabase'

type Donor = { name: string; email: string; mobile: string; pan: string; amount: number }

interface ReceiptModalProps {
  open: boolean
  onClose: () => void
  donor: Donor
  reference: string
}

// ─────────────────────────────────────────
// The printable / PDF-able receipt card
// ─────────────────────────────────────────
function ReceiptCard({
  donor,
  reference,
  innerRef
}: {
  donor: Donor
  reference: string
  innerRef?: React.RefObject<HTMLDivElement>
}) {
  const rotis = Math.floor(donor.amount / 10)
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div
      ref={innerRef}
      id="receipt-card"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff' }}
      className="relative w-full overflow-hidden rounded-none bg-white text-[#1a1208]"
    >
      {/* ── Top accent bar ── */}
      <div
        style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f97316 50%, #f59e0b 100%)' }}
        className="h-2 w-full"
      />

      <div className="p-5 sm:p-10">
        {/* ── Header row ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[#f0e4d0] pb-6">
          <div className="flex items-center gap-3">
            {/* Logo block */}
            <div
              style={{ background: 'linear-gradient(135deg, #ea580c, #f59e0b)' }}
              className="flex h-12 w-12 sm:h-14 sm:w-14 flex-col items-center justify-center rounded-2xl shadow-lg shrink-0"
            >
              <span className="text-base sm:text-lg font-black leading-none text-white">रोटी</span>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black tracking-tight text-[#1a1208]">
                Roti<span style={{ color: '#ea580c' }}>On</span>Wheels
              </p>
              <p className="mt-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#9a7c5a]">
                Arham Yuva Seva Group · Ahmedabad
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              80G Eligible
            </span>
            <p className="mt-1.5 sm:mt-2 text-[10px] text-[#9a7c5a]">Provisional Certificate</p>
          </div>
        </div>

        {/* ── Seal + title ── */}
        <div className="py-7 text-center">
          <div
            style={{ background: '#f0fdf4', border: '2px solid #86efac' }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm"
          >
            <CheckCircle2 className="h-9 w-9" style={{ color: '#16a34a' }} />
          </div>
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif", color: '#1a1208' }}
            className="text-[28px] font-black tracking-tight"
          >
            Donation Certificate
          </h2>
          <p className="mt-1.5 text-sm text-[#6b5236]">
            Issued with gratitude · Arham Yuva Seva Group
          </p>
        </div>

        {/* ── Amount hero ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)',
            border: '1.5px solid #fed7aa'
          }}
          className="rounded-2xl px-8 py-6 text-center mb-6"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9a7c5a]">
            Contribution Received
          </p>
          <p
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              background: 'linear-gradient(135deg, #ea580c, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            className="mt-1 text-[52px] font-black leading-none tracking-tight"
          >
            ₹{donor.amount.toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#6b5236]">
            Sponsors{' '}
            <span className="font-black" style={{ color: '#ea580c' }}>
              {rotis} nutritious rotis
            </span>{' '}
            for neighbors in need
          </p>
        </div>

        {/* ── Donor details grid ── */}
        <div
          style={{ border: '1px solid #f0e4d0' }}
          className="grid grid-cols-2 overflow-hidden rounded-2xl"
        >
          {[
            ['Donor Name', donor.name],
            ['Date', date],
            ['PAN Number', donor.pan],
            ['Reference No.', reference],
            ['Email Address', donor.email, true],
            ['Mobile', donor.mobile]
          ].map(([label, value, wide], i) => (
            <div
              key={label as string}
              className={`px-5 py-4 ${wide ? 'col-span-2' : ''} ${i % 2 === 0 && !wide ? 'border-r border-[#f0e4d0]' : ''} ${i >= 2 ? 'border-t border-[#f0e4d0]' : ''}`}
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-[#9a7c5a]">
                {label as string}
              </p>
              <p className="mt-1 text-sm font-bold text-[#1a1208]">{value as string}</p>
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-[#fffbeb] px-4 py-3.5 border border-[#fde68a]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#d97706' }} />
          <p className="text-[11px] leading-relaxed text-[#78500a]">
            This is an official provisional receipt under Section 80G of the Income Tax Act. A
            verified certificate will be dispatched to{' '}
            <span className="font-bold">{donor.email}</span> within 7 working days.
          </p>
        </div>

        {/* ── Divider + watermark ── */}
        <div className="mt-7 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: '#f0e4d0' }} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a87a]">
            RotiOnWheels · {new Date().getFullYear()} · Seva with Love
          </p>
          <div className="h-px flex-1" style={{ background: '#f0e4d0' }} />
        </div>
      </div>

      {/* ── Bottom accent bar ── */}
      <div
        style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f97316 50%, #f59e0b 100%)' }}
        className="h-1.5 w-full"
      />
    </div>
  )
}

// ─────────────────────────────────────────
// The modal shell
// ─────────────────────────────────────────
export function ReceiptModal({ open, onClose, donor, reference }: ReceiptModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sendResults, setSendResults] = useState<{ email?: string; sms?: string } | null>(null)

  const rotis = Math.floor(donor.amount / 10)

  // ── Build jsPDF and return both the doc and base64 string ──
  const buildPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W = 210
      const H = 297
      const margin = 14
      const contentW = W - margin * 2
      const rotis = Math.floor(donor.amount / 10)
      const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      })

      // ── Helpers ──
      const hexRgb = (h: string): [number, number, number] => [
        parseInt(h.slice(1, 3), 16),
        parseInt(h.slice(3, 5), 16),
        parseInt(h.slice(5, 7), 16)
      ]
      const fillRect = (x: number, y: number, w: number, h: number, color: string) => {
        pdf.setFillColor(...hexRgb(color))
        pdf.rect(x, y, w, h, 'F')
      }
      const strokeRect = (x: number, y: number, w: number, h: number, color: string, lw = 0.3) => {
        pdf.setDrawColor(...hexRgb(color))
        pdf.setLineWidth(lw)
        pdf.rect(x, y, w, h)
      }
      const txt = (
        str: string, x: number, y: number,
        opts: { size?: number; color?: string; bold?: boolean; align?: 'left' | 'center' | 'right' } = {}
      ) => {
        pdf.setFontSize(opts.size ?? 10)
        pdf.setTextColor(...hexRgb(opts.color ?? '#1a1208'))
        pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal')
        pdf.text(str, x, y, { align: opts.align ?? 'left' })
      }

      let y = 0

      // ── Top accent bar (orange → amber) ──
      fillRect(0, 0, W * 0.55, 5, '#ea580c')
      fillRect(W * 0.55, 0, W * 0.45, 5, '#f59e0b')
      y = 5

      // ── White page background ──
      fillRect(0, y, W, H - y, '#ffffff')
      y += 11

      // ── Logo ──
      fillRect(margin, y, 18, 18, '#ea580c')
      // Inner rounded feel: draw a slightly smaller white border inside
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255)
      pdf.text('ROW', margin + 3, y + 12)

      txt('RotiOnWheels', margin + 23, y + 7, { size: 17, color: '#1a1208', bold: true })
      txt('Arham Yuva Seva Group  |  Ahmedabad', margin + 23, y + 13.5, {
        size: 7.5, color: '#9a7c5a'
      })

      // ── 80G badge ──
      const bx = W - margin - 36, by = y + 1
      fillRect(bx, by, 36, 9, '#f0fdf4')
      strokeRect(bx, by, 36, 9, '#86efac', 0.4)
      txt('80G ELIGIBLE', bx + 18, by + 6, { size: 7, color: '#15803d', bold: true, align: 'center' })

      y += 26

      // ── Horizontal divider ──
      pdf.setDrawColor(...hexRgb('#f0e4d0'))
      pdf.setLineWidth(0.5)
      pdf.line(margin, y, W - margin, y)
      y += 11

      // ── Certificate title ──
      txt('DONATION CERTIFICATE', W / 2, y, { size: 22, color: '#1a1208', bold: true, align: 'center' })
      y += 8
      txt('Issued with gratitude  |  Arham Yuva Seva Group', W / 2, y, {
        size: 8.5, color: '#6b5236', align: 'center'
      })
      y += 13

      // ── Amount hero ──
      const heroH = 34
      fillRect(margin, y, contentW, heroH, '#fff7ed')
      strokeRect(margin, y, contentW, heroH, '#fed7aa', 0.5)
      txt('CONTRIBUTION RECEIVED', W / 2, y + 9, {
        size: 7.5, color: '#9a7c5a', bold: true, align: 'center'
      })
      txt(`Rs. ${donor.amount.toLocaleString('en-IN')}`, W / 2, y + 22, {
        size: 28, color: '#d4591a', bold: true, align: 'center'
      })
      txt(`Sponsors ${rotis} nutritious rotis for neighbors in need`, W / 2, y + 30, {
        size: 8.5, color: '#6b5236', align: 'center'
      })
      y += heroH + 9

      // ── Donor details grid (2-column, 3 rows) ──
      const fields: [string, string][] = [
        ['Donor Name',    donor.name],
        ['Date',          date],
        ['PAN Number',    donor.pan],
        ['Reference No.', reference],
        ['Email Address', donor.email],   // rendered as plain text — no hyperlink
        ['Mobile',        donor.mobile],
      ]
      const colW = contentW / 2
      const cellH = 22

      fields.forEach(([label, value], i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        const cx = margin + col * colW
        const cy = y + row * cellH

        // Light fill on odd rows for zebra effect
        if (row % 2 === 1) fillRect(cx, cy, colW, cellH, '#faf7f2')
        strokeRect(cx, cy, colW, cellH, '#e8d9bf', 0.25)

        txt(label.toUpperCase(), cx + 4, cy + 8, { size: 6.5, color: '#9a7c5a', bold: true })

        // Force text color to dark explicitly — prevents jsPDF from auto-coloring emails/URLs
        pdf.setFontSize(9.5)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(...hexRgb('#1a1208'))   // <-- explicit dark, overrides any auto-link blue
        pdf.text(value || '-', cx + 4, cy + 17)
      })

      y += Math.ceil(fields.length / 2) * cellH + 10

      // ── Legal note box ──
      const legalText = `This is an official provisional receipt under Section 80G of the Income Tax Act, 1961. All donations to Arham Yuva Seva Group are eligible for tax deduction. A verified 80G certificate will be dispatched to ${donor.email} within 7 working days of receipt confirmation.`
      const legalLines = pdf.splitTextToSize(legalText, contentW - 10) as string[]
      const legalBoxH = 10 + legalLines.length * 4.5

      fillRect(margin, y, contentW, legalBoxH, '#fffbeb')
      strokeRect(margin, y, contentW, legalBoxH, '#fde68a', 0.4)

      // "NOTE:" label in bold amber — no emoji
      txt('NOTE:', margin + 4, y + 8, { size: 8, color: '#d97706', bold: true })

      // Legal text body
      pdf.setFontSize(7.5)
      pdf.setTextColor(...hexRgb('#78500a'))
      pdf.setFont('helvetica', 'normal')
      pdf.text(legalLines, margin + 4, y + 15)
      y += legalBoxH + 9

      // ── Footer divider + watermark ──
      pdf.setDrawColor(...hexRgb('#e8d9bf'))
      pdf.setLineWidth(0.4)
      pdf.line(margin, y, W - margin, y)
      y += 6
      txt(
        `RotiOnWheels  |  ${new Date().getFullYear()}  |  Seva with Love  |  Arham Yuva Seva Group`,
        W / 2, y,
        { size: 7, color: '#c9a87a', align: 'center' }
      )

      // ── Bottom accent bar ──
      fillRect(0, H - 5, W * 0.55, 5, '#ea580c')
      fillRect(W * 0.55, H - 5, W * 0.45, 5, '#f59e0b')

      pdf.save(`RotiOnWheels_Receipt_${reference}.pdf`)
      return pdf
    } catch (err) {
      console.error('PDF build failed:', err)
      return null
    }
  }

  // ── Download PDF ──
  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    try {
      const pdf = await buildPDF()
      pdf?.save(`RotiOnWheels_Receipt_${reference}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Could not generate PDF. Please use the Print option instead.')
    } finally {
      setPdfLoading(false)
    }
  }

  // ── Send Email + SMS via Supabase Edge Function ──
  const handleSendNotifications = async () => {
    setSendState('sending')
    try {
      // 1. Build the PDF in memory
      const pdf = await buildPDF()
      if (!pdf) throw new Error('PDF build failed')

      // 2. Export as base64 string (no file download)
      const pdfBase64 = pdf.output('datauristring').split(',')[1]

      // 3. Call the Edge Function
      const { data, error } = await supabase.functions.invoke('send-receipt', {
        body: { donor, reference, pdfBase64 }
      })

      if (error) throw error

      setSendResults(data?.results ?? {})
      setSendState('sent')
    } catch (err) {
      console.error('Send notifications failed:', err)
      setSendState('error')
    }
  }

  // ── Print ──
  const handlePrint = () => {
    const content = document.getElementById('receipt-card')
    if (!content) return
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return
    win.document.write(`
      <html>
        <head>
          <title>RotiOnWheels Receipt — ${reference}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Fraunces:wght@700;900&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `)
    win.document.close()
    win.onload = () => {
      win.focus()
      win.print()
      win.close()
    }
  }

  // ── WhatsApp ──
  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `🙏 *RotiOnWheels Donation Confirmed!*\n\n` +
      `Donor: *${donor.name}*\n` +
      `Amount: *₹${donor.amount.toLocaleString('en-IN')}*\n` +
      `Rotis Sponsored: *${rotis}*\n` +
      `Reference: *${reference}*\n` +
      `Date: *${new Date().toLocaleDateString('en-IN')}*\n\n` +
      `📄 80G provisional receipt issued. Detailed certificate sent to ${donor.email}.\n\n` +
      `_Arham Yuva Seva Group · RotiOnWheels_`
    )
    // If mobile is provided, send directly; else open WhatsApp
    const phone = donor.mobile.replace(/\D/g, '')
    const url = phone.length >= 10
      ? `https://wa.me/91${phone.slice(-10)}?text=${msg}`
      : `https://wa.me/?text=${msg}`
    window.open(url, '_blank')
  }

  // ── Email fallback (mailto) ──
  const handleEmailFallback = () => {
    const subject = encodeURIComponent(`Your RotiOnWheels Donation Receipt — ${reference}`)
    const body = encodeURIComponent(
      `Dear ${donor.name},\n\n` +
      `Thank you for your generous donation to RotiOnWheels!\n\n` +
      `DONATION DETAILS\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Amount:          Rs.${donor.amount.toLocaleString('en-IN')}\n` +
      `Rotis Sponsored: ${rotis}\n` +
      `Reference No.:   ${reference}\n` +
      `Date:            ${new Date().toLocaleDateString('en-IN')}\n` +
      `PAN:             ${donor.pan}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Your contribution is 80G eligible. An official tax certificate will be mailed to you within 7 working days.\n\n` +
      `With gratitude,\nArham Yuva Seva Group\nRotiOnWheels · Ahmedabad`
    )
    window.location.href = `mailto:${donor.email}?subject=${subject}&body=${body}`
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
              {/* Modal header */}
              <div className="flex items-center justify-between border-b px-6 py-4 bg-amber-50/60">
                <div>
                  <p className="font-black text-base text-foreground">Official Receipt</p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Ref: {reference}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable receipt */}
              <div className="flex-1 overflow-y-auto">
                <ReceiptCard donor={donor} reference={reference} innerRef={cardRef} />
              </div>

              {/* Action buttons */}
              <div className="border-t bg-white px-5 py-4 space-y-3">
                {/* Primary: Download PDF */}
                <Button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="w-full h-11 font-bold glow-orange gap-2 rounded-xl"
                  size="lg"
                >
                  {pdfLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating PDF…</>
                  ) : (
                    <><Download className="h-4 w-4" /> Download Receipt (PDF)</>
                  )}
                </Button>

                {/* Send via Email — calls Edge Function */}
                <Button
                  onClick={handleSendNotifications}
                  disabled={sendState === 'sending' || sendState === 'sent'}
                  variant="outline"
                  className="w-full h-11 font-bold gap-2 rounded-xl border-primary/30 hover:bg-orange-50"
                  size="lg"
                >
                  {sendState === 'sending' && <><Loader2 className="h-4 w-4 animate-spin" /> Sending Email…</>}
                  {sendState === 'sent'    && <><CheckCheck className="h-4 w-4 text-green-600" /> Email Sent!</>}
                  {sendState === 'error'   && <><AlertCircle className="h-4 w-4 text-red-500" /> Retry Sending Email</>}
                  {sendState === 'idle'    && <><Send className="h-4 w-4" /> Send Receipt via Email</>}
                </Button>

                {/* Status banner */}
                {sendState === 'sent' && sendResults && (
                  <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 space-y-1">
                    <p className="text-[11px] font-black text-green-800 uppercase tracking-wide">Delivery Status</p>
                    <p className="text-xs text-green-700">
                      <span className="font-bold">Email:</span> {sendResults.email}
                    </p>
                  </div>
                )}
                {sendState === 'error' && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-xs text-red-700 font-semibold">Could not send automatically. Use the buttons below as fallback.</p>
                  </div>
                )}

                {/* Fallback secondary row */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border py-3 text-[11px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[11px] font-bold transition-all"
                    style={{ borderColor: '#dcfce7', background: '#f0fdf4', color: '#15803d' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#f0fdf4')}
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={handleEmailFallback}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 py-3 text-[11px] font-bold text-blue-700 transition-all hover:bg-blue-100"
                  >
                    <Mail className="h-4 w-4" />
                    Fallback
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
