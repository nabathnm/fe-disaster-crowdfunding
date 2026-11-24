import React, { useState } from "react"
import {
  Wallet,
  Coins,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  CreditCard,
  QrCode,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/formatters"
import { createTopupApi } from "@/services/wallet"

const PRESET_AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000]

export default function TopupModal({ isOpen, onClose, idrPerEth = 10000000, onTopupSuccess }) {
  const [amount, setAmount] = useState(50000)
  const [customAmount, setCustomAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [topupResult, setTopupResult] = useState(null)

  const activeAmount = customAmount ? Number(customAmount) : amount
  const estimatedEth = idrPerEth > 0 ? (activeAmount / idrPerEth).toFixed(6) : "0.000000"

  const handlePresetSelect = (val) => {
    setAmount(val)
    setCustomAmount("")
    setErrorMessage("")
  }

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, "")
    setCustomAmount(val)
    setErrorMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!activeAmount || activeAmount < 10000) {
      setErrorMessage("Nominal top-up minimal adalah Rp 10.000")
      return
    }

    if (activeAmount > 100000000) {
      setErrorMessage("Nominal top-up maksimal adalah Rp 100.000.000")
      return
    }

    setIsLoading(true)

    try {
      const res = await createTopupApi({ amount: activeAmount })
      if (res.success && res.data) {
        setTopupResult(res.data)
        // If payment_url exists, attempt to open it in a new window/tab
        if (res.data.payment_url) {
          window.open(res.data.payment_url, "_blank", "noopener,noreferrer")
        }
        if (onTopupSuccess) {
          onTopupSuccess(res.data)
        }
      } else {
        const errorText = typeof res.errors === "string" ? res.errors : res.message
        setErrorMessage(errorText || "Gagal membuat transaksi top-up")
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat menghubungi server top-up")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTopupResult(null)
    setErrorMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 rounded-3xl border-emerald-200/90 shadow-2xl bg-white dark:bg-card">
        {topupResult ? (
          /* Success Screen with Midtrans Payment Link */
          <div className="space-y-4">
            <DialogHeader className="text-center pt-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <DialogTitle className="text-xl font-extrabold text-emerald-950 dark:text-emerald-100">
                Instruksi Pembayaran Diterbitkan
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Selesaikan pembayaran melalui tautan Midtrans Snap yang telah dibuat.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 p-4 border border-emerald-200/80 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">No. Order (ID):</span>
                <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">
                  {topupResult.order_id}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Total Tagihan:</span>
                <span className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
                  {formatRupiah(topupResult.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Estimasi Konversi ETH:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {topupResult.amount_eth || estimatedEth} ETH
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] font-bold">
                  {topupResult.status || "PENDING"}
                </Badge>
              </div>
            </div>

            {topupResult.payment_url && (
              <Button
                asChild
                className="w-full font-bold shadow-md shadow-emerald-600/20 rounded-xl py-5 text-sm gap-2"
              >
                <a href={topupResult.payment_url} target="_blank" rel="noopener noreferrer">
                  Buka Halaman Pembayaran Midtrans <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}

            <p className="text-[11px] text-center text-muted-foreground">
              Mendukung GoPay, QRIS, Virtual Account BCA/Mandiri/BRI, dan Kartu Kredit melalui sandbox simulator Midtrans.
            </p>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full text-xs font-semibold rounded-xl border-emerald-200"
              >
                Selesai & Periksa Saldo
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Form Input Top-up */
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Coins className="h-4.5 w-4.5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-emerald-950 dark:text-emerald-100">
                    Top Up Saldo Dompet
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Isi saldo dompet fiat Anda via gateway pembayaran resmi Midtrans.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {errorMessage && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pilihan Nominal Cepat */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Pilih Nominal Cepat
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((val) => {
                  const isSelected = !customAmount && amount === val
                  return (
                    <Button
                      key={val}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handlePresetSelect(val)}
                      className={`text-xs h-10 font-bold rounded-xl transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 border-emerald-600"
                          : "border-emerald-200 hover:border-emerald-400 text-emerald-950"
                      }`}
                    >
                      {formatRupiah(val)}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Input Nominal Kustom */}
            <div className="space-y-1.5">
              <Label htmlFor="customTopup" className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Atau Masukkan Nominal Sendiri (IDR)
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-emerald-700">
                  Rp
                </span>
                <Input
                  id="customTopup"
                  type="text"
                  placeholder="Contoh: 150000"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="pl-10 text-xs font-bold rounded-xl border-emerald-200 focus-visible:ring-emerald-500 bg-emerald-50/20"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Minimal Rp 10.000 • Maksimal Rp 100.000.000
              </p>
            </div>

            {/* Estimasi Konversi On-Chain */}
            <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 p-3 border border-emerald-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Estimasi Nilai ETH:</span>
              </div>
              <div className="font-mono font-bold text-emerald-950 dark:text-emerald-100">
                ≈ {estimatedEth} ETH
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 font-bold shadow-md shadow-emerald-600/20 rounded-xl py-5 text-xs gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Menyiapkan Pembayaran...
                  </>
                ) : (
                  <>
                    Lanjutkan ke Midtrans <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
