import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  CreditCard,
  Heart,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Wallet,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Coins,
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
import { formatRupiah, formatAddress } from "@/lib/formatters"
import { createDonationApi, getDonationLimitApi } from "@/services/campaign"
import { getWalletApi, createTopupApi } from "@/services/wallet"
import { useAuth } from "@/context/AuthContext"

const PRESET_AMOUNTS_IDR = [25000, 50000, 100000, 250000, 500000]

export default function MidtransSnapModal({ isOpen, onClose, campaign, onDonationSuccess }) {
  const { user, token, isAuthenticated } = useAuth()
  const [amountIdr, setAmountIdr] = useState(50000)
  const [amountEth, setAmountEth] = useState("0.005")
  const [donationMethod, setDonationMethod] = useState("WALLET") // "WALLET" | "MIDTRANS"

  const [walletData, setWalletData] = useState(null)
  const [donationLimit, setDonationLimit] = useState(null)
  const [isLoadingLimit, setIsLoadingLimit] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successResult, setSuccessResult] = useState(null)

  // Rate konversi fallback
  const idrPerEth = walletData?.idr_per_eth || 10000000

  // Load donation limit and wallet info when modal opens
  useEffect(() => {
    if (isOpen && campaign?.id && isAuthenticated) {
      setIsLoadingLimit(true)
      setErrorMessage("")
      setSuccessResult(null)

      Promise.allSettled([
        getDonationLimitApi(campaign.id, token),
        getWalletApi(token),
      ]).then(([limitRes, walletRes]) => {
        if (limitRes.status === "fulfilled" && limitRes.value?.success && limitRes.value.data) {
          setDonationLimit(limitRes.value.data)
        }
        if (walletRes.status === "fulfilled" && walletRes.value?.success && walletRes.value.data) {
          setWalletData(walletRes.value.data)
        }
        setIsLoadingLimit(false)
      })
    }
  }, [isOpen, campaign?.id, isAuthenticated, token])

  const handlePresetClick = (val) => {
    setAmountIdr(val)
    const ethVal = (val / idrPerEth).toFixed(4)
    setAmountEth(ethVal)
  }

  const handleEthChange = (e) => {
    const val = e.target.value
    setAmountEth(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num > 0) {
      setAmountIdr(Math.round(num * idrPerEth))
    }
  }

  const handleIdrChange = (e) => {
    const val = Number(e.target.value)
    setAmountIdr(val)
    if (val > 0) {
      setAmountEth((val / idrPerEth).toFixed(4))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!amountEth || Number(amountEth) <= 0) {
      setErrorMessage("Nominal donasi harus lebih dari 0 ETH")
      return
    }

    setIsLoading(true)
    setStatusMessage("Memproses donasi on-chain ke smart contract...")

    try {
      if (donationMethod === "WALLET") {
        // 1. Direct on-chain donation via POST /campaigns/{id}/donations
        const res = await createDonationApi(
          campaign.id,
          { amount: String(amountEth) },
          token
        )

        if (res.success && res.data) {
          setSuccessResult(res.data)
          onDonationSuccess?.(res.data)
        } else {
          const errText = typeof res.errors === "string" ? res.errors : res.message
          setErrorMessage(errText || "Gagal memproses donasi on-chain. Periksa saldo dompet Anda.")
        }
      } else {
        // 2. Gateway top-up & payment via POST /wallet/topup
        const res = await createTopupApi({ amount: amountIdr }, token)
        if (res.success && res.data) {
          if (res.data.payment_url) {
            window.open(res.data.payment_url, "_blank", "noopener,noreferrer")
          }
          setSuccessResult(res.data)
          onDonationSuccess?.(res.data)
        } else {
          setErrorMessage(res.message || "Gagal menerbitkan invoice pembayaran.")
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat menghubungi server.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSuccessResult(null)
    setIsLoading(false)
    setStatusMessage(null)
    setErrorMessage("")
    onClose?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-[490px] rounded-lg bg-white border border-slate-200 p-6 shadow-lg">
        {successResult ? (
          <div className="py-4 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Donasi Berhasil Disalurkan!
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 pt-1">
                Kontribusi sebesar{" "}
                <strong className="text-slate-900">{formatRupiah(successResult.amount || amountIdr)}</strong> (
                <span className="font-mono text-emerald-700 font-semibold">{successResult.amount_eth || amountEth} ETH</span>) untuk{" "}
                <strong>&ldquo;{campaign?.title}&rdquo;</strong> telah berhasil dicatat.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-slate-50 p-4 text-xs text-left space-y-2 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">No. Order / Transaksi:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {successResult.order_id || successResult.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status Transaksi:</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold rounded-md">
                  {successResult.status || "CONFIRMED"}
                </Badge>
              </div>
              {(successResult.tx_url || successResult.tx_hash) && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Bukti On-Chain:</span>
                  <a
                    href={successResult.tx_url || `https://sepolia.etherscan.io/tx/${successResult.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-mono text-[11px] font-semibold"
                  >
                    Sepolia Etherscan <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <Button
              className="w-full font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none"
              onClick={resetForm}
            >
              Selesai & Tutup
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold rounded-md">
                  {campaign?.category || "Tanggap Bencana"}
                </Badge>
                <Badge className="bg-emerald-600 text-white text-[10px] font-semibold rounded-md">
                  Sepolia Verified
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Salurkan Bantuan Kemanusiaan
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 line-clamp-1">
                Program: {campaign?.title}
              </DialogDescription>
            </DialogHeader>

            {!isAuthenticated ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Wallet className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Masuk untuk Berdonasi</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Setiap donasi dicatat langsung pada smart contract Ethereum Sepolia yang terhubung dengan akun Anda.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1 font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none">
                    <Link href="/auth/login">Masuk ke Akun</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 text-xs font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Link href="/auth/register">Daftar Baru</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {errorMessage && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-900 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Info Saldo & Batas Donasi On-Chain */}
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Saldo Dompet Anda:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {walletData?.balance_eth || "0.0"} ETH ({formatRupiah(walletData?.balance_idr || 0)})
                    </span>
                  </div>
                  {donationLimit && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Batas Maksimal Donasi:</span>
                      <span className="font-mono font-semibold text-emerald-700">
                        {donationLimit.max_donation_eth} ETH
                      </span>
                    </div>
                  )}
                </div>

                {/* Pilihan Nominal Cepat */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Pilihan Nominal Cepat</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS_IDR.map((val) => {
                      const isSelected = amountIdr === val
                      return (
                        <Button
                          key={val}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePresetClick(val)}
                          className={`text-xs h-9 font-semibold rounded-lg transition-colors ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-none"
                              : "border-slate-200 hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          {formatRupiah(val)}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Input Nominal Dual: IDR & ETH */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="custom-amount-idr" className="text-xs font-semibold text-slate-700">
                      Nominal (IDR)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                        Rp
                      </span>
                      <Input
                        id="custom-amount-idr"
                        type="number"
                        min="10000"
                        step="5000"
                        value={amountIdr}
                        onChange={handleIdrChange}
                        className="pl-9 font-semibold text-slate-900 rounded-lg border-slate-200 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="custom-amount-eth" className="text-xs font-semibold text-slate-700">
                      Nilai Setara (ETH)
                    </Label>
                    <div className="relative">
                      <Input
                        id="custom-amount-eth"
                        type="text"
                        value={amountEth}
                        onChange={handleEthChange}
                        className="font-mono font-semibold text-emerald-700 rounded-lg border-slate-200 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Metode Pembayaran / Eksekusi */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Metode Penyaluran</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDonationMethod("WALLET")}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        donationMethod === "WALLET"
                          ? "border-emerald-600 bg-emerald-50/50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Saldo Dompet
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Potong saldo on-chain langsung</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDonationMethod("MIDTRANS")}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        donationMethod === "MIDTRANS"
                          ? "border-emerald-600 bg-emerald-50/50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> Top Up / Midtrans
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">QRIS, GoPay, Virtual Account</div>
                    </button>
                  </div>
                </div>

                <DialogFooter className="pt-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    disabled={isLoading}
                    className="rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading}
                    className="gap-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-none flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {statusMessage || "Memproses..."}
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4" />
                        Konfirmasi Donasi {amountEth} ETH
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
