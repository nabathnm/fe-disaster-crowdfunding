import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, HeartHandshake, Eye, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CampaignCard from "@/components/CampaignCard"
import MidtransSnapModal from "@/components/MidtransSnapModal"
import { fetchCampaigns } from "@/services/api"
import { formatRupiah } from "@/lib/formatters"

export default function HomePage() {
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchCampaigns().then(setCampaigns)
  }, [])

  const handleDonate = (campaign) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  const totalCollected = campaigns.reduce((acc, c) => acc + (c.collectedAmount || 0), 0)
  const totalTarget = campaigns.reduce((acc, c) => acc + (c.targetAmount || 0), 0)

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section: Transparansi Donasi Berbasis Blockchain */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 via-background to-background py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1 text-xs font-medium backdrop-blur shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Transparansi Donasi Tanpa Potongan Tersembunyi</span>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 text-[10px] px-1.5 py-0">
              On-Chain Verified
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Bantu Korban Bencana dengan Kepastian{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Blockchain Sepolia
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Platform penggalangan dana tanggap bencana terintegrasi pembayaran <strong>Midtrans Snap</strong> dan audit
            trail on-chain pada <strong>Ethereum Sepolia Testnet</strong>. Setiap rupiah yang Anda sumbangkan tercatat
            secara publik, kekal, dan dapat diverifikasi langsung di Etherscan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" className="gap-2 shadow-md" asChild>
              <a href="#katalog">
                <HeartHandshake className="h-4 w-4" /> Mulai Donasi
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/audit">
                <Eye className="h-4 w-4" /> Lihat Audit Trail Publik
              </Link>
            </Button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t max-w-3xl mx-auto text-left">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <span className="text-xs text-muted-foreground">Total Dana Terkumpul</span>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5">{formatRupiah(totalCollected)}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Dari target {formatRupiah(totalTarget)}</span>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <span className="text-xs text-muted-foreground">Kampanye Tanggap Darurat</span>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5">{campaigns.length} Bencana</p>
              <span className="text-[11px] text-muted-foreground">Status Aktif & Terverifikasi</span>
            </div>
            <div className="col-span-2 md:col-span-1 rounded-xl border bg-card p-4 shadow-sm">
              <span className="text-xs text-muted-foreground">Jaringan Blockchain</span>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5">Ethereum Sepolia</p>
              <span className="text-[11px] text-emerald-600 font-medium">100% Transparansi On-Chain</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Katalog Kampanye Bencana */}
      <section id="katalog" className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Katalog Utama
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">Live Campaigns</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              Daftar Kampanye Bencana Aktif
            </h2>
            <p className="text-sm text-muted-foreground">
              Pilih kampanye bencana untuk menyalurkan bantuan dengan laporan persentase target terkumpul secara real-time.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-xs gap-1">
            <Link href="/audit">
              Audit Data Transaksi <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {campaigns.map((camp) => (
            <CampaignCard key={camp.id} campaign={camp} onDonateClick={handleDonate} />
          ))}
        </div>
      </section>

      {/* Midtrans Snap Modal Wrapper */}
      {selectedCampaign && (
        <MidtransSnapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          campaign={selectedCampaign}
          onDonationSuccess={() => {
            fetchCampaigns().then(setCampaigns)
          }}
        />
      )}
    </div>
  )
}
