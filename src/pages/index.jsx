import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, HeartHandshake, Eye, Sparkles, ArrowRight, Heart, Users, CheckCircle2 } from "lucide-react"
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
    <div className="space-y-12 pb-20">
      {/* Hero Section: Nuansa Putih Bersih & Hijau Peduli */}
      <section className="relative overflow-hidden border-b border-emerald-100/70 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-background dark:to-background py-16 sm:py-24">
        {/* Soft background ambient radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-emerald-200/30 via-teal-100/20 to-emerald-200/30 blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl text-center space-y-6">
          {/* Top Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 dark:bg-card/90 px-4 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 backdrop-blur shadow-xs">
            <Heart className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            <span>Gerakan Peduli Bencana Transparan</span>
            <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
            <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px] px-1.5 py-0 font-bold">
              100% On-Chain
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50 leading-[1.15]">
            Ulurkan Tangan untuk Korban Bencana,{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Tercatat Pasti di Blockchain Sepolia
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-emerald-900/70 dark:text-emerald-200/70 leading-relaxed font-normal">
            Platform crowdfunding kemanusiaan dengan pembayaran mudah via <strong>Midtrans Snap</strong> dan verifikasi
            transaksi terbuka di <strong>Ethereum Sepolia Testnet</strong>. Setiap bantuan Anda disalurkan tanpa potongan
            tersembunyi.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" className="gap-2 shadow-md shadow-emerald-600/20 text-sm font-bold" asChild>
              <a href="#katalog">
                <HeartHandshake className="h-4 w-4" /> Mulai Berdonasi
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-sm font-semibold border-emerald-200" asChild>
              <Link href="/audit">
                <Eye className="h-4 w-4 text-emerald-600" /> Lihat Audit Trail Publik
              </Link>
            </Button>
          </div>

          {/* Key Metric Highlights Cards (Clean White with Green Accents) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-emerald-100 max-w-3xl mx-auto text-left">
            <div className="rounded-2xl border border-emerald-100/90 bg-white dark:bg-card p-4 shadow-sm shadow-emerald-500/5 hover:border-emerald-200 transition-colors">
              <span className="text-xs text-muted-foreground font-medium">Total Dana Bantuan</span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">
                {formatRupiah(totalCollected)}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" /> Target: {formatRupiah(totalTarget)}
              </span>
            </div>

            <div className="rounded-2xl border border-emerald-100/90 bg-white dark:bg-card p-4 shadow-sm shadow-emerald-500/5 hover:border-emerald-200 transition-colors">
              <span className="text-xs text-muted-foreground font-medium">Kampanye Tanggap Darurat</span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">
                {campaigns.length} Bencana
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="h-3 w-3" /> Posko Lapangan Aktif
              </span>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl border border-emerald-100/90 bg-white dark:bg-card p-4 shadow-sm shadow-emerald-500/5 hover:border-emerald-200 transition-colors">
              <span className="text-xs text-muted-foreground font-medium">Jaringan Terbuka</span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">
                Ethereum Sepolia
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-3 w-3" /> Transparansi Tanpa Batas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Katalog Kampanye Bencana */}
      <section id="katalog" className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 pb-2 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
                Katalog Utama Bencana
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">Daftar Terverifikasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              Bantu Saudara Kita yang Terdampak
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pilih kampanye bencana untuk menyalurkan kepedulian Anda. Seluruh donasi langsung tercatat ke dompet resmi.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-xs gap-1 font-semibold text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50">
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
