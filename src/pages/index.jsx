import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, HeartHandshake, Eye, Sparkles, Heart, Users, CheckCircle2 } from "lucide-react"
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

  const totalCollected = (campaigns || []).reduce((acc, c) => acc + (c?.collectedAmount || 0), 0)
  const totalTarget = (campaigns || []).reduce((acc, c) => acc + (c?.targetAmount || 0), 0)

  return (
    <div className="space-y-16 pb-20">
      {/* Minimalist Hero Section */}
      <section className="border-b border-slate-100 bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6">
          {/* Trust Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-medium text-slate-700">
            <Heart className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            <span>Gerakan Peduli Bencana Transparan</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="font-mono text-[10px] text-emerald-700 font-bold">Ethereum Sepolia</span>
          </div>

          {/* Clean Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Bantuan Nyata untuk Korban Bencana,{" "}
            <span className="text-emerald-600">
              Tercatat Transparan On-Chain
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Platform penggalangan dana kemanusiaan dengan pembayaran instan melalui <strong>Midtrans Snap</strong> dan verifikasi bukti transaksi terbuka pada jaringan <strong>Ethereum Sepolia</strong>.
          </p>

          {/* Clean CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs px-6 py-5 gap-2" asChild>
              <a href="#katalog">
                <HeartHandshake className="h-4 w-4" /> Mulai Berdonasi
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-5 gap-2" asChild>
              <Link href="/audit">
                <Eye className="h-4 w-4 text-slate-500" /> Buku Kas Audit
              </Link>
            </Button>
          </div>

          {/* Minimalist Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-10 border-t border-slate-100 max-w-3xl mx-auto text-left">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <span className="text-xs text-slate-500 font-medium">Total Dana Tersalurkan</span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {formatRupiah(totalCollected)}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                Target: {formatRupiah(totalTarget)}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <span className="text-xs text-slate-500 font-medium">Program Tanggap Darurat</span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {campaigns.length} Program
              </p>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                Posko Terverifikasi
              </span>
            </div>

            <div className="col-span-2 md:col-span-1 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <span className="text-xs text-slate-500 font-medium">Smart Contract Testnet</span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                Chain ID 11155111
              </p>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                Ethereum Sepolia
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Kampanye Bencana (Clean Grid) */}
      <section id="katalog" className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Katalog Bantuan Bencana
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pilih program bantuan darurat untuk menyalurkan kepedulian Anda.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
            <Link href="/audit">
              Lihat Audit On-Chain →
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {campaigns.map((camp) => (
            <CampaignCard key={camp.id} campaign={camp} onDonateClick={handleDonate} />
          ))}
        </div>
      </section>

      {/* Midtrans Snap Modal */}
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
