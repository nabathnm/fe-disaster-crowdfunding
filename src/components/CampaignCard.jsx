import React, { useState } from "react"
import Link from "next/link"
import { Copy, Check, Clock, Wallet, HeartHandshake } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatRupiah, formatAddress, formatPercent } from "@/lib/formatters"

export default function CampaignCard({ campaign, onDonateClick }) {
  const [copied, setCopied] = useState(false)
  if (!campaign) return null
  const percent = formatPercent(campaign.collectedAmount, campaign.targetAmount)

  const copyWallet = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (campaign.walletAddress) {
      navigator.clipboard.writeText(campaign.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-card border border-slate-200/80 hover:border-emerald-500 transition-colors shadow-none group">
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-50">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80"
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/95 text-slate-800 border-slate-200/80 text-[11px] font-semibold shadow-xs">
            {campaign.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-slate-900/80 text-white border-transparent text-[10px] font-mono">
            {campaign.status || "AKTIF"}
          </Badge>
        </div>
      </div>

      {/* Body Content */}
      <CardHeader className="p-5 pb-2">
        <Link href={`/campaign/${campaign.id}`} className="group-hover:text-emerald-700 transition-colors">
          <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-100">
            {campaign.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-xs text-slate-500 mt-1.5 leading-relaxed">
          {campaign.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-end space-y-4">
        {/* Progress Bar & Amount */}
        <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
              {formatRupiah(campaign.collectedAmount)}
            </span>
            <span className="text-slate-500 text-[11px]">
              Target: <strong className="text-slate-900 dark:text-slate-100">{formatRupiah(campaign.targetAmount)}</strong>
            </span>
          </div>
          <Progress value={percent} className="h-1.5 bg-slate-200" />
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
            <span className="font-bold text-slate-700">{percent}% Terkumpul</span>
            <span className="flex items-center gap-1 font-medium text-slate-500">
              <Clock className="h-3 w-3" /> Tanggap Cepat
            </span>
          </div>
        </div>

        {/* Ethereum Smart Contract Wallet */}
        <div className="rounded-xl bg-slate-50/60 p-2.5 text-xs flex items-center justify-between border border-slate-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="h-5 w-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Wallet className="h-3 w-3" />
            </div>
            <span className="text-slate-500 text-[11px]">Wallet:</span>
            <span className="font-mono text-[11px] font-medium text-slate-700 truncate">
              {formatAddress(campaign.walletAddress)}
            </span>
          </div>
          <button
            type="button"
            onClick={copyWallet}
            className="text-slate-400 hover:text-emerald-700 transition-colors p-1 rounded cursor-pointer"
            title="Salin Alamat"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Button
            size="sm"
            onClick={() => onDonateClick(campaign)}
            className="w-full text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          >
            <HeartHandshake className="h-3.5 w-3.5 mr-1.5" /> Donasi Sekarang
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
