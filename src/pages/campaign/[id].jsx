import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Wallet,
  Copy,
  Check,
  ShieldCheck,
  HeartHandshake,
  Clock,
  ExternalLink,
  Users,
  Heart,
  CheckCircle2,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import MidtransSnapModal from "@/components/MidtransSnapModal"
import { fetchCampaignById, INITIAL_CAMPAIGNS } from "@/services/api"
import { getCampaignDonatursApi, getCampaignDisbursementsApi } from "@/services/campaign"
import { formatRupiah, formatAddress, formatDate, formatPercent } from "@/lib/formatters"
import { getAddressExplorerUrl } from "@/services/web3Provider"

export default function CampaignDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [campaign, setCampaign] = useState(null)
  const [donaturs, setDonaturs] = useState([])
  const [disbursements, setDisbursements] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (id) {
      // 1. Fetch Campaign Details
      fetchCampaignById(id).then((data) => {
        setCampaign(data || INITIAL_CAMPAIGNS[0])
      })

      // 2. Fetch Donaturs (GET /campaigns/{id}/donaturs)
      getCampaignDonatursApi(id).then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDonaturs(res.data)
        }
      })

      // 3. Fetch Disbursements (GET /campaigns/{id}/disbursements)
      getCampaignDisbursementsApi(id).then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDisbursements(res.data)
        }
      })
    }
  }, [id])

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-emerald-700 text-sm font-medium">
          <Clock className="h-4 w-4 animate-spin text-emerald-600" /> Memuat informasi kampanye bencana...
        </div>
      </div>
    )
  }

  const percent = formatPercent(campaign.collectedAmount, campaign.targetAmount)

  const copyWallet = () => {
    if (campaign.walletAddress) {
      navigator.clipboard.writeText(campaign.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 pl-0 font-medium">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Kampanye
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cerita & Detail Kampanye */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Image with Soft Emerald Frame */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-emerald-50 border border-emerald-100 shadow-sm shadow-emerald-500/5">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80"
              }}
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/95 backdrop-blur text-emerald-900 border-emerald-200 text-xs px-3 py-1 font-bold shadow-xs">
                {campaign.category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-emerald-950/80 text-emerald-200 border-emerald-700/50 text-xs backdrop-blur font-mono">
                {campaign.status}
              </Badge>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
              <Heart className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
              <span>Aksi Cepat Tanggap Kemanusiaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              {campaign.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {campaign.description}
            </p>
          </div>

          <Separator className="bg-emerald-100" />

          {/* Detail Cerita Bencana */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-emerald-600" /> Cerita Penggalangan Dana
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3">
              <p>{campaign.story}</p>
              <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 p-4 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Garansi Penyaluran Transparan
                </span>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-normal">
                  Setiap donasi melalui gateway Midtrans akan otomatis mencatat tanda terima (hash voucher) pada
                  jaringan <strong>Ethereum Sepolia</strong>. Dana ditampung di dompet resmi kampanye bencana yang diawasi
                  langsung oleh tim relawan lapangan.
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-emerald-100" />

          {/* Smart Contract & Wallet Transparency Card */}
          <Card className="rounded-2xl border-emerald-100 bg-white dark:bg-card shadow-sm shadow-emerald-600/5">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-950 dark:text-emerald-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Alamat Dompet Ethereum Kampanye (0x...)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Dompet transparan penerima dana yang terhubung langsung ke smart contract Sepolia.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 border border-emerald-100 dark:border-emerald-900/30 font-mono text-xs">
                <span className="break-all font-semibold text-emerald-950 dark:text-emerald-200 select-all">
                  {campaign.walletAddress}
                </span>
                <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                  <Button variant="ghost" size="sm" onClick={copyWallet} className="h-8 text-xs gap-1 font-semibold text-emerald-800 hover:bg-emerald-100/60">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                  <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1 border-emerald-200 font-semibold">
                    <a
                      href={getAddressExplorerUrl(campaign.walletAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Etherscan <ExternalLink className="h-3 w-3 text-emerald-600" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daftar Donatur Publik (GET /campaigns/{id}/donaturs) */}
          <Card className="rounded-2xl border-emerald-100 bg-white dark:bg-card shadow-sm">
            <CardHeader className="p-5 pb-3 border-b border-emerald-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <Users className="h-4 w-4 text-emerald-600" /> Daftar Donatur Terverifikasi
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
                  {donaturs.length} Donatur
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {donaturs.length === 0 ? (
                <div className="p-6 text-center space-y-1 bg-muted/30 rounded-xl">
                  <p className="text-xs font-semibold text-foreground">Belum ada donasi publik</p>
                  <p className="text-[11px] text-muted-foreground">Jadilah orang pertama yang berdonasi untuk posko bencana ini!</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {donaturs.map((don, idx) => (
                    <div key={don.id || idx} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-foreground">{don.donor_name || don.name || "Donatur Dermawan"}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">{formatAddress(don.donor_wallet || don.wallet_address)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-emerald-700">
                          {don.amount_eth ? `${don.amount_eth} ETH` : don.amount ? formatRupiah(don.amount) : "0 ETH"}
                        </div>
                        {don.tx_hash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${don.tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-600 hover:underline inline-flex items-center gap-1 font-mono"
                          >
                            Tx Sepolia <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Penyaluran & Pencairan Dana (GET /campaigns/{id}/disbursements) */}
          <Card className="rounded-2xl border-teal-100 bg-white dark:bg-card shadow-sm">
            <CardHeader className="p-5 pb-3 border-b border-teal-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <DollarSign className="h-4 w-4 text-teal-600" /> Penyaluran Dana Lapangan (Disbursements)
                </CardTitle>
                <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 text-xs">
                  {disbursements.length} Penyaluran
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {disbursements.length === 0 ? (
                <div className="p-6 text-center space-y-1 bg-muted/30 rounded-xl">
                  <p className="text-xs font-semibold text-foreground">Belum ada pencairan dana</p>
                  <p className="text-[11px] text-muted-foreground">Dana masih tersimpan aman di smart contract escrow.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {disbursements.map((dis, idx) => (
                    <div key={dis.id || idx} className="p-3 rounded-xl border border-teal-100 bg-teal-50/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-foreground">{dis.purpose || "Penyaluran Bantuan"}</div>
                        <div className="text-[11px] text-muted-foreground">Penerima: {dis.recipient || "Posko Tanggap Darurat"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-teal-700">
                          {dis.amount_eth ? `${dis.amount_eth} ETH` : dis.amount ? formatRupiah(dis.amount) : "0 ETH"}
                        </div>
                        {dis.tx_hash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${dis.tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-teal-600 hover:underline inline-flex items-center gap-1 font-mono"
                          >
                            Tx On-Chain <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Funding Widget & Action */}
        <div className="space-y-6">
          <Card className="sticky top-20 rounded-3xl border-emerald-200/90 bg-white dark:bg-card shadow-lg shadow-emerald-600/10 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
            <CardHeader className="p-6 pb-4">
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-extrabold">
                Progress Penyaluran Bantuan
              </span>
              <div className="mt-1.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-100">
                  {formatRupiah(campaign.collectedAmount)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  terkumpul dari target <strong className="text-foreground">{formatRupiah(campaign.targetAmount)}</strong>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-5">
              <div className="space-y-1.5">
                <Progress value={percent} className="h-3" />
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{percent}% Terkumpul</span>
                  <span className="flex items-center gap-1 font-medium text-emerald-800">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    Batas Waktu: {formatDate(campaign.deadline)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 p-4 text-xs space-y-2.5 border border-emerald-100/70 dark:border-emerald-900/30">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-600" /> Jaringan
                  </span>
                  <span className="font-semibold text-emerald-950 dark:text-emerald-100">Ethereum Sepolia</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Batas Waktu
                  </span>
                  <span className="font-semibold text-emerald-950 dark:text-emerald-100">{formatDate(campaign.deadline)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Saluran Donasi
                  </span>
                  <span className="font-semibold text-emerald-700">Midtrans Snap (QRIS/VA)</span>
                </div>
              </div>

              {/* Tombol Donasi Sekarang */}
              <Button
                size="lg"
                className="w-full text-base font-bold shadow-md shadow-emerald-600/25 gap-2 rounded-xl py-6"
                onClick={() => setIsModalOpen(true)}
              >
                <HeartHandshake className="h-5 w-5" /> Donasi Sekarang
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Transaksi instan & diverifikasi publik di Etherscan</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Midtrans Snap Modal */}
      <MidtransSnapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={campaign}
        onDonationSuccess={(result) => {
          setCampaign((prev) => ({
            ...prev,
            collectedAmount: prev.collectedAmount + (result?.gross_amount ? Number(result.gross_amount) : 50000),
          }))
        }}
      />
    </div>
  )
}
