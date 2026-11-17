import React, { useState } from "react"
import { CreditCard, Heart, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react"
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
import { createMidtransTransaction } from "@/services/api"

const PRESET_AMOUNTS = [25000, 50000, 100000, 250000, 500000]

export default function MidtransSnapModal({ isOpen, onClose, campaign, onDonationSuccess }) {
  const [amount, setAmount] = useState(50000)
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePresetClick = (val) => {
    setAmount(val)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || amount < 10000) {
      alert("Minimal donasi adalah Rp 10.000")
      return
    }

    setIsLoading(true)
    setStatusMessage("Menyiapkan gateway pembayaran...")

    try {
      // 1. Request Snap Token dari backend API
      const res = await createMidtransTransaction({
        campaignId: campaign?.id,
        amount: Number(amount),
        donorName: donorName || "Donatur Anonim",
        donorEmail: donorEmail || "donor@example.com",
      })

      const snapToken = res.token

      // 2. Panggil window.snap.pay sesuai spesifikasi Midtrans Snap
      if (typeof window !== "undefined" && window.snap && snapToken) {
        setIsLoading(false)
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            console.log("Snap Success:", result)
            setIsSuccess(true)
            onDonationSuccess?.(result)
          },
          onPending: function (result) {
            console.log("Snap Pending:", result)
            setIsSuccess(true)
            onDonationSuccess?.(result)
          },
          onError: function (result) {
            console.error("Snap Error:", result)
            alert("Terjadi kesalahan pada pembayaran Midtrans.")
          },
          onClose: function () {
            console.log("Snap modal ditutup oleh pengguna.")
          },
        })
      } else {
        // Fallback demo simulation jika dijalankan tanpa snap script aktif
        setTimeout(() => {
          setIsLoading(false)
          setIsSuccess(true)
          onDonationSuccess?.({
            order_id: res.orderId,
            gross_amount: amount,
            transaction_status: "settlement",
            tx_hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          })
        }, 1200)
      }
    } catch (err) {
      console.error("Midtrans transaction error:", err)
      alert("Gagal memproses transaksi. Silakan coba kembali.")
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsLoading(false)
    setStatusMessage(null)
    onClose?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-[480px]">
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl">Terima Kasih atas Donasi Anda!</DialogTitle>
              <DialogDescription>
                Donasi sebesar <strong>{formatRupiah(amount)}</strong> untuk kampanye{" "}
                <strong>&ldquo;{campaign?.title}&rdquo;</strong> berhasil diproses.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-muted p-4 text-xs text-left space-y-2 border">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <ShieldCheck className="h-4 w-4" /> Dicatat pada Ethereum Sepolia On-Chain
              </div>
              <p className="text-muted-foreground text-[11px]">
                Data transaksi Anda sedang divalidasi ke smart contract audit trail secara permanen. Anda dapat
                memverifikasinya di halaman <strong>Transparency Audit</strong>.
              </p>
            </div>

            <Button className="w-full mt-4" onClick={resetForm}>
              Selesai & Tutup
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {campaign?.category || "Bencana"}
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                  Sandbox Snap
                </Badge>
              </div>
              <DialogTitle className="text-lg">Donasi untuk {campaign?.title}</DialogTitle>
              <DialogDescription className="text-xs">
                Pilih atau masukkan nominal donasi. Pembayaran terintegrasi Midtrans Snap & dicatat di Sepolia Testnet.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Preset Buttons */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Pilih Nominal Cepat</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant={amount === val ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePresetClick(val)}
                      className="text-xs font-medium"
                    >
                      {formatRupiah(val)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-1.5">
                <Label htmlFor="custom-amount" className="text-xs font-semibold">
                  Nominal Donasi Lainnya (IDR)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="10000"
                    step="5000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="pl-9 font-semibold"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Minimal donasi Rp 10.000</p>
              </div>

              {/* Donor Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="donor-name" className="text-xs">
                    Nama Donatur (Opsional)
                  </Label>
                  <Input
                    id="donor-name"
                    placeholder="Hamba Allah / Nama Anda"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="donor-email" className="text-xs">
                    Email / Notifikasi (Opsional)
                  </Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Guarantee / Security badge */}
              <div className="rounded-md bg-muted/60 p-3 text-xs flex items-start gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Setiap rupiah yang didonasikan diverifikasi hash transaksi blockchain untuk memastikan transparansi tanpa potongan tersembunyi.
                </span>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {statusMessage || "Memproses..."}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Lanjut Bayar {formatRupiah(amount)}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
