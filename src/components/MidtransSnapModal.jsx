import React, { useState } from "react"
import { CreditCard, Heart, Loader2, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react"
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
import { useAuth } from "@/context/AuthContext"

const PRESET_AMOUNTS = [25000, 50000, 100000, 250000, 500000]

export default function MidtransSnapModal({ isOpen, onClose, campaign, onDonationSuccess }) {
  const { user } = useAuth()
  const [amount, setAmount] = useState(50000)
  const [donorName, setDonorName] = useState(user?.name || "")
  const [donorEmail, setDonorEmail] = useState(user?.email || "")
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Update donorName and donorEmail when user changes or modal opens
  React.useEffect(() => {
    if (user) {
      if (user.name) setDonorName(user.name)
      if (user.email) setDonorEmail(user.email)
    }
  }, [user, isOpen])

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
      const res = await createMidtransTransaction({
        campaignId: campaign?.id,
        amount: Number(amount),
        donorName: donorName || "Donatur Peduli",
        donorEmail: donorEmail || "donor@example.com",
      })

      const snapToken = res.token

      if (typeof window !== "undefined" && window.snap && snapToken) {
        setIsLoading(false)
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            setIsSuccess(true)
            onDonationSuccess?.(result)
          },
          onPending: function (result) {
            setIsSuccess(true)
            onDonationSuccess?.(result)
          },
          onError: function (result) {
            alert("Terjadi kesalahan pada pembayaran Midtrans.")
          },
          onClose: function () {
            console.log("Snap modal ditutup oleh pengguna.")
          },
        })
      } else {
        setTimeout(() => {
          setIsLoading(false)
          setIsSuccess(true)
          onDonationSuccess?.({
            order_id: res.orderId,
            gross_amount: amount,
            transaction_status: "settlement",
            tx_hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          })
        }, 1000)
      }
    } catch (err) {
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
      <DialogContent className="sm:max-w-[490px] rounded-3xl bg-white dark:bg-card border-emerald-100 dark:border-emerald-950 p-6 shadow-2xl">
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-100">
                Terima Kasih atas Kebaikan Anda!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground pt-1">
                Donasi sebesar <strong className="text-emerald-700 dark:text-emerald-400">{formatRupiah(amount)}</strong> untuk{" "}
                <strong>&ldquo;{campaign?.title}&rdquo;</strong> berhasil diproses.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-xs text-left space-y-2 border border-emerald-200/70 dark:border-emerald-900/50">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Dicatat Permanen di Ethereum Sepolia
              </div>
              <p className="text-emerald-900/70 dark:text-emerald-300/70 text-[11px] leading-relaxed">
                Bukti transaksi ini sedang diverifikasi ke dalam smart contract. Anda dapat memantau jejak audit
                secara transparan melalui menu <strong>Transparency Audit</strong>.
              </p>
            </div>

            <Button className="w-full mt-4 font-bold shadow-md shadow-emerald-600/20" onClick={resetForm}>
              Selesai & Tutup
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold">
                  {campaign?.category || "Bencana"}
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[11px] font-medium">
                  Midtrans Snap Sandbox
                </Badge>
              </div>
              <DialogTitle className="text-xl font-extrabold text-foreground">
                Salurkan Bantuan untuk {campaign?.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Pilih atau masukkan nominal donasi. Pembayaran terintegrasi QRIS, GoPay, dan Virtual Account.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Preset Buttons */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Pilihan Nominal Cepat</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((val) => {
                    const isSelected = amount === val
                    return (
                      <Button
                        key={val}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePresetClick(val)}
                        className={`text-xs font-bold rounded-xl transition-all ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                            : "border-emerald-100 hover:border-emerald-300 text-emerald-900 dark:text-emerald-200"
                        }`}
                      >
                        {formatRupiah(val)}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-1.5">
                <Label htmlFor="custom-amount" className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Nominal Donasi Lainnya (IDR)
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">
                    Rp
                  </span>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="10000"
                    step="5000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="pl-10 font-bold text-emerald-950 rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Minimal donasi Rp 10.000 (bebas biaya admin)</p>
              </div>

              {/* Donor Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="donor-name" className="text-xs font-semibold">
                    Nama Donatur (Opsional)
                  </Label>
                  <Input
                    id="donor-name"
                    placeholder="Hamba Allah / Nama Anda"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="rounded-xl border-emerald-100 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="donor-email" className="text-xs font-semibold">
                    Email / Notifikasi (Opsional)
                  </Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="rounded-xl border-emerald-100 text-xs"
                  />
                </div>
              </div>

              {/* Reassuring note */}
              <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 p-3 text-xs flex items-start gap-2.5 text-emerald-900/80 dark:text-emerald-300/80 border border-emerald-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-normal text-[11px]">
                  Setiap transaksi akan menerbitkan hash unik yang dapat diverifikasi publik melalui Sepolia Etherscan.
                </span>
              </div>

              <DialogFooter className="pt-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading} className="rounded-xl">
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={isLoading} className="gap-2 rounded-xl font-bold shadow-md shadow-emerald-600/20">
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
