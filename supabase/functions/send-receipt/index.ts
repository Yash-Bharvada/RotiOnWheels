import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Config — set these in Supabase Dashboard → Settings → Edge Functions ──
const RESEND_API_KEY  = Deno.env.get('RESEND_API_KEY')   ?? ''   // https://resend.com
const FROM_EMAIL      = Deno.env.get('FROM_EMAIL')       ?? 'onboarding@resend.dev'
const FROM_NAME       = 'RotiOnWheels – Arham Yuva Seva Group'

interface Donor {
  name: string
  email: string
  mobile: string
  pan: string
  amount: number
}

interface Payload {
  donor: Donor
  reference: string
  pdfBase64: string   // PDF generated on the frontend, sent as base64 string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { donor, reference, pdfBase64 }: Payload = await req.json()
    const rotis = Math.floor(donor.amount / 10)
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    })

    const results: Record<string, string> = {}

    // ────────────────────────────────────────────────────────
    // SEND EMAIL via Resend (with PDF attachment)
    // ────────────────────────────────────────────────────────
    if (RESEND_API_KEY) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Donation Receipt</title>
        </head>
        <body style="margin:0;padding:0;background:#f7f0e7;font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

            <!-- Top bar -->
            <div style="height:5px;background:linear-gradient(90deg,#ea580c 0%,#f97316 55%,#f59e0b 100%);"></div>

            <!-- Header -->
            <div style="padding:32px 40px 24px;border-bottom:1px solid #f0e4d0;">
              <div style="display:flex;align-items:center;gap:14px;">
                <div style="width:48px;height:48px;background:#ea580c;border-radius:12px;display:flex;align-items:center;justify-content:center;">
                  <span style="color:#fff;font-weight:900;font-size:13px;">ROW</span>
                </div>
                <div>
                  <p style="margin:0;font-size:20px;font-weight:900;color:#1a1208;">RotiOnWheels</p>
                  <p style="margin:0;font-size:11px;color:#9a7c5a;font-weight:600;letter-spacing:.1em;">ARHAM YUVA SEVA GROUP · AHMEDABAD</p>
                </div>
                <div style="margin-left:auto;">
                  <span style="background:#f0fdf4;border:1px solid #86efac;color:#15803d;font-size:11px;font-weight:800;padding:4px 10px;border-radius:99px;">80G ELIGIBLE</span>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div style="padding:32px 40px;">
              <p style="font-size:16px;color:#1a1208;margin:0 0 8px;">Dear <strong>${donor.name}</strong>,</p>
              <p style="font-size:14px;color:#6b5236;line-height:1.7;margin:0 0 28px;">
                Thank you for your generous donation to RotiOnWheels. Your contribution
                directly sponsors nutritious meals for those in need. We are deeply grateful
                for your trust and kindness. 🙏
              </p>

              <!-- Amount box -->
              <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:.15em;color:#9a7c5a;">CONTRIBUTION RECEIVED</p>
                <p style="margin:8px 0 4px;font-size:42px;font-weight:900;color:#d4591a;">
                  ₹${donor.amount.toLocaleString('en-IN')}
                </p>
                <p style="margin:0;font-size:14px;color:#6b5236;">
                  Sponsors <strong>${rotis} nutritious rotis</strong> for neighbors in need
                </p>
              </div>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #f0e4d0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
                <tr style="background:#faf7f2;">
                  <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#9a7c5a;border-bottom:1px solid #f0e4d0;letter-spacing:.08em;">DONOR NAME</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#1a1208;border-bottom:1px solid #f0e4d0;">${donor.name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#9a7c5a;border-bottom:1px solid #f0e4d0;letter-spacing:.08em;">DATE</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#1a1208;border-bottom:1px solid #f0e4d0;">${dateStr}</td>
                </tr>
                <tr style="background:#faf7f2;">
                  <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#9a7c5a;border-bottom:1px solid #f0e4d0;letter-spacing:.08em;">PAN NUMBER</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#1a1208;border-bottom:1px solid #f0e4d0;">${donor.pan}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#9a7c5a;letter-spacing:.08em;">REFERENCE NO.</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:700;color:#d4591a;">${reference}</td>
                </tr>
              </table>

              <!-- 80G note -->
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 18px;margin-bottom:28px;">
                <p style="margin:0;font-size:12px;color:#78500a;line-height:1.7;">
                  <strong style="color:#d97706;">80G Tax Benefit:</strong>
                  This is an official provisional receipt under Section 80G of the Income Tax Act, 1961.
                  A verified 80G certificate will be dispatched to this email within
                  <strong>7 working days</strong> of payment confirmation.
                </p>
              </div>

              <p style="font-size:13px;color:#6b5236;line-height:1.7;margin:0;">
                The full donation receipt PDF is attached to this email. Please save it for
                your tax records.
              </p>
            </div>

            <!-- Footer -->
            <div style="padding:20px 40px;background:#faf7f2;border-top:1px solid #f0e4d0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9a7c5a;">
                With gratitude — <strong>Arham Yuva Seva Group</strong> · RotiOnWheels · Ahmedabad
              </p>
            </div>

            <!-- Bottom bar -->
            <div style="height:4px;background:linear-gradient(90deg,#ea580c 0%,#f97316 55%,#f59e0b 100%);"></div>
          </div>
        </body>
        </html>
      `

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [donor.email],
          subject: `Your RotiOnWheels Donation Receipt — ${reference}`,
          html: emailHtml,
          attachments: [
            {
              filename: `RotiOnWheels_Receipt_${reference}.pdf`,
              content: pdfBase64,   // base64 string from frontend jsPDF
            }
          ]
        })
      })

      const resendData = await resendRes.json()
      results.email = resendRes.ok
        ? `Sent to ${donor.email}`
        : `Email failed: ${JSON.stringify(resendData)}`
    } else {
      results.email = 'Skipped — RESEND_API_KEY not set'
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
