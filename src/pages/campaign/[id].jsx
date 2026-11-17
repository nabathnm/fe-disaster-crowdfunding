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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import MidtransSnapModal from "@/components/MidtransSnapModal"
import { fetchCampaignById, INITIAL_CAMPAIGNS } from "@/services/api"
import { formatRupiah, formatAddress, formatDate, formatPercent } from "@/lib/formatters"
import { getAddressExplorerUrl } from "@/services/web3Provider"

export default function CampaignDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [campaign, setCampaign] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCampaignById(id).then((data) => {
        setCampaign(data || INITIAL_CAMPAIGNS[0])
      })
    }
  }, [id])

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-sm">Memuat informasi kampanye bencana...</p>
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
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground pl-0">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Kampanye
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cerita & Detail Kampanye */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-muted border shadow-sm">
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
              <Badge className="bg-black/75 backdrop-blur text-white text-xs px-3 py-1">
                {campaign.category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-background/90 text-xs backdrop-blur font-mono">
                {campaign.status}
              </Badge>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              {campaign.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {campaign.description}
            </p>
          </div>

          <Separator />

          {/* Detail Cerita Bencana */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" /> Cerita Penggalangan Dana
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3">
              <p>{campaign.story}</p>
              <p>
                Setiap donasi yang masuk melalui gateway Midtrans akan otomatis mencatat tanda terima (hash voucher) pada
                jaringan <strong>Ethereum Sepolia</strong>. Dana ditampung di dompet resmi kampanye bencana yang diawasi
                langsung oleh relawan lapangan.
              </p>
            </div>
          </div>

          <Separator />

          {/* Smart Contract & Wallet Transparency Card */}
          <Card className="border-muted bg-muted/30">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Alamat Dompet Ethereum Kampanye (0x...)
              </CardTitle>
              <CardDescription className="text-xs">
                Dompet transparan penerima dana yang terhubung langsung ke smart contract Sepolia.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg bg-background p-3 border font-mono text-xs">
                <span className="break-all font-semibold text-foreground select-all">
                  {campaign.walletAddress}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="ghost" size="sm" onClick={copyWallet} className="h-7 text-xs gap-1">
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                  <Button variant="outline" size="sm" asChild className="h-7 text-xs gap-1">
                    <a
                      href={getAddressExplorerUrl(campaign.walletAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Etherscan <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Funding Widget & Action */}
        <div className="space-y-6">
          <Card className="sticky top-20 border-primary/20 shadow-md">
            <CardHeader className="p-6 pb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Progress Penggalangan
              </span>
              <div className="mt-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {formatRupiah(campaign.collectedAmount)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  terkumpul dari target <strong>{formatRupiah(campaign.targetAmount)}</strong>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-5">
              <div className="space-y-1.5">
                <Progress value={percent} className="h-3" />
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                  <span className="font-bold text-foreground">{percent}% Tercapai</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Batas Waktu: {formatDate(campaign.deadline)}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/60 p-3.5 text-xs space-y-2 border">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Jaringan
                  </span>
                  <span className="font-semibold text-foreground">Ethereum Sepolia</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Batas Waktu
                  </span>
                  <span className="font-semibold text-foreground">{formatDate(campaign.deadline)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5" /> Metode Donasi
                  </span>
                  <span className="font-semibold text-foreground">Midtrans Snap (QRIS/VA)</span>
                </div>
              </div>

              {/* Tombol Donasi Sekarang */}
              <Button
                size="lg"
                className="w-full text-base font-bold shadow-md gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <HeartHandshake className="h-5 w-5" /> Donasi Sekarang
              </Button>

              <p className="text-[11px] text-center text-muted-foreground">
                Pembayaran diamankan oleh Midtrans Snap Sandbox. Data hash otomatis dikirimkan ke audit log publik.
              </p>
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
