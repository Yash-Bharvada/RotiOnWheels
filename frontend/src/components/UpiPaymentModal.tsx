import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, QrCode, CreditCard, Landmark, ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Badge } from './ui'

interface UpiPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  donorName: string
  donorEmail: string
  onPaymentSuccess: () => void
}

export function UpiPaymentModal({
  isOpen,
  onClose,
  amount,
  donorName,
  donorEmail,
  onPaymentSuccess,
}: UpiPaymentModalProps) {
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI')
  const [processing, setProcessing] = useState(false)

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      })
      onPaymentSuccess()
    }, 1200)
  }

  if (!isOpen) return null

  // Generate UPI payment URL for QR Code rendering
  const upiUrl = `upi://pay?pa=rotionwheels@sbi&pn=RotiOnWheels&am=${amount}&cu=INR&tn=Donation%20by%20${encodeURIComponent(donorName)}`
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 sm:p-8 rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm">
                रोटी
              </span>
              <div>
                <DialogTitle className="text-xl font-bold font-display">Secure Checkout</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Arham Yuva Seva Group · 80G Tax Exempt
                </DialogDescription>
              </div>
            </div>
            <Badge className="bg-orange-100 text-primary border-orange-200 font-bold">
              ₹{amount.toLocaleString('en-IN')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-secondary p-1.5 rounded-2xl">
            <button
              onClick={() => setMethod('UPI')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                method === 'UPI' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> UPI / QR
            </button>
            <button
              onClick={() => setMethod('CARD')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                method === 'CARD' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> Card
            </button>
            <button
              onClick={() => setMethod('NETBANKING')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                method === 'NETBANKING' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Landmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> Banking
            </button>
          </div>

          {/* UPI QR View */}
          {method === 'UPI' && (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto w-48 h-48 bg-white p-3 rounded-2xl border-2 border-orange-200 shadow-md relative group">
                <img src={qrImage} alt="Scan UPI QR Code" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Scan with Google Pay, PhonePe, Paytm or BHIM</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">UPI ID: rotionwheels@sbi</p>
              </div>
            </div>
          )}

          {/* Card View */}
          {method === 'CARD' && (
            <div className="space-y-3 py-2">
              <div className="p-3 bg-secondary/50 rounded-xl border text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Mock Card Checkout</p>
                <p>Accepts Visa, Mastercard, RuPay & American Express.</p>
              </div>
            </div>
          )}

          {/* Netbanking View */}
          {method === 'NETBANKING' && (
            <div className="space-y-3 py-2">
              <div className="p-3 bg-secondary/50 rounded-xl border text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Mock NetBanking Checkout</p>
                <p>Supports SBI, HDFC, ICICI, Axis & all major Indian banks.</p>
              </div>
            </div>
          )}

          {/* Guarantee pill */}
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>256-bit Encrypted Mock Gateway · 80G Receipt Promise</span>
          </div>

          <Button
            size="lg"
            className="w-full text-base font-bold shadow-lg"
            onClick={handlePay}
            disabled={processing}
          >
            {processing ? 'Confirming Donation Payment…' : `Simulate Pay ₹${amount.toLocaleString('en-IN')}`}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Demonstration mode: No actual bank account will be debited.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
