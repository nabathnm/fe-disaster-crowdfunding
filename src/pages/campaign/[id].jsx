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
        <div className="inline-flex items-center gap-2 text-slate-600 text-sm font-medium">
          <Clock className="h-4 w-4 animate-spin text-emerald-600" /> Memuat data kampanye bencana...
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
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-slate-600 hover:text-emerald-700 hover:bg-slate-50 pl-0 font-medium">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cerita & Detail Kampanye */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80">
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
              <Badge className="bg-white/95 text-slate-900 border-slate-200/80 text-xs px-3 py-1 font-semibold shadow-xs">
                {campaign.category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-slate-900/80 text-white border-transparent text-xs font-mono">
                {campaign.status}
              </Badge>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              <Heart className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
              <span>Aksi Tanggap Bencana Kemanusiaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {campaign.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {campaign.description}
            </p>
          </div>

          <Separator className="bg-slate-100" />

          {/* Detail Cerita Bencana */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-emerald-600" /> Cerita Penggalangan Bantuan
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-3">
              <p>{campaign.story}</p>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Pencatatan Transparan di Blockchain
                </span>
                <p className="text-xs text-slate-500 leading-normal">
                  Setiap donasi melalui Midtrans otomatis mencatat tanda terima bukti hash pada jaringan <strong>Ethereum Sepolia</strong>. Dana tersimpan aman di dompet resmi kampanye.
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Smart Contract & Wallet Transparency Card */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-none">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Alamat Dompet On-Chain Kampanye
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Dompet transparan yang diawasi langsung oleh smart contract Sepolia.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 border border-slate-100 font-mono text-xs">
                <span className="break-all font-semibold text-slate-800 select-all">
                  {campaign.walletAddress}
                </span>
                <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                  <Button variant="ghost" size="sm" onClick={copyWallet} className="h-8 text-xs gap-1 font-semibold text-slate-600 hover:bg-slate-100">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                  <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1 border-slate-200 font-semibold">
                    <a
                      href={getAddressExplorerUrl(campaign.walletAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Etherscan <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daftar Donatur Publik (GET /campaigns/{id}/donaturs) */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-none">
            <CardHeader className="p-5 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                  <Users className="h-4 w-4 text-emerald-600" /> Daftar Donatur Terverifikasi
                </CardTitle>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                  {donaturs.length} Donatur
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {donaturs.length === 0 ? (
                <div className="p-6 text-center space-y-1 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Belum ada donasi publik</p>
                  <p className="text-[11px] text-slate-500">Jadilah donatur pertama untuk program kemanusiaan ini.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {donaturs.map((don, idx) => (
                    <div key={don.id || idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{don.donor_name || don.name || "Donatur Dermawan"}</div>
                        <div className="font-mono text-[11px] text-slate-500">{formatAddress(don.donor_wallet || don.wallet_address)}</div>
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

          {/* Penyaluran Dana (GET /campaigns/{id}/disbursements) */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-none">
            <CardHeader className="p-5 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> Penyaluran Dana Lapangan
                </CardTitle>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                  {disbursements.length} Penyaluran
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {disbursements.length === 0 ? (
                <div className="p-6 text-center space-y-1 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Belum ada pencairan dana</p>
                  <p className="text-[11px] text-slate-500">Dana tersimpan di smart contract escrow hingga diajukan inisiator.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {disbursements.map((dis, idx) => (
                    <div key={dis.id || idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{dis.purpose || "Penyaluran Bantuan"}</div>
                        <div className="text-[11px] text-slate-500">Penerima: {dis.recipient || "Posko Tanggap Darurat"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-emerald-700">
                          {dis.amount_eth ? `${dis.amount_eth} ETH` : dis.amount ? formatRupiah(dis.amount) : "0 ETH"}
                        </div>
                        {dis.tx_hash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${dis.tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-600 hover:underline inline-flex items-center gap-1 font-mono"
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

        {/* Right Column: Clean Sticky Funding Box */}
        <div className="space-y-6">
          <Card className="sticky top-20 rounded-2xl border border-slate-200/90 bg-white shadow-none overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                Progress Penyaluran Donasi
              </span>
              <div className="mt-1.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {formatRupiah(campaign.collectedAmount)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  terkumpul dari target <strong className="text-slate-900">{formatRupiah(campaign.targetAmount)}</strong>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-5">
              <div className="space-y-1.5">
                <Progress value={percent} className="h-2 bg-slate-100" />
                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span className="font-bold text-emerald-700">{percent}% Terkumpul</span>
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Batas: {formatDate(campaign.deadline)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-2 border border-slate-100">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Jaringan Blockchain</span>
                  <span className="font-semibold text-slate-900">Ethereum Sepolia</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Target Tanggap</span>
                  <span className="font-semibold text-slate-900">{formatDate(campaign.deadline)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Metode Pembayaran</span>
                  <span className="font-semibold text-emerald-700">Midtrans Snap (QRIS/VA)</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                size="lg"
                className="w-full text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-xs gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <HeartHandshake className="h-4.5 w-4.5" /> Donasi Sekarang
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Transaksi diverifikasi publik di Sepolia Etherscan</span>
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
