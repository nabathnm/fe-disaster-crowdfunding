import React, { useState } from "react"
import Link from "next/link"
import { Copy, Check, Clock, Wallet, ArrowRight, HeartHandshake } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { formatRupiah, formatAddress, formatPercent } from "@/lib/formatters"

export default function CampaignCard({ campaign, onDonateClick }) {
  const [copied, setCopied] = useState(false)
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
    <Card className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-card border-emerald-100/90 dark:border-emerald-950/60 shadow-sm shadow-emerald-600/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 group">
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full overflow-hidden bg-emerald-50">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/95 backdrop-blur-md text-emerald-900 border-emerald-200 font-semibold shadow-xs">
            {campaign.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-emerald-950/70 backdrop-blur-md text-emerald-300 border-emerald-700/50 text-[11px] font-mono">
            {campaign.status || "AKTIF"}
          </Badge>
        </div>
      </div>

      {/* Body Content */}
      <CardHeader className="p-5 pb-2">
        <Link href={`/campaign/${campaign.id}`} className="group-hover:text-emerald-700 transition-colors">
          <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground">
            {campaign.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {campaign.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-end space-y-4">
        {/* Progress Bar & Amount */}
        <div className="space-y-1.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 p-3 border border-emerald-100/60 dark:border-emerald-900/30">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
              {formatRupiah(campaign.collectedAmount)}
            </span>
            <span className="text-muted-foreground text-[11px]">
              Target: <strong className="text-foreground">{formatRupiah(campaign.targetAmount)}</strong>
            </span>
          </div>
          <Progress value={percent} className="h-2" />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
            <span className="font-bold text-emerald-800 dark:text-emerald-300">{percent}% Terkumpul</span>
            <span className="flex items-center gap-1 font-medium text-emerald-700/80">
              <Clock className="h-3 w-3" /> Tanggap Cepat
            </span>
          </div>
        </div>

        {/* Ethereum Smart Contract Wallet */}
        <div className="rounded-xl bg-muted/40 p-2.5 text-xs flex items-center justify-between border border-emerald-100/50 dark:border-emerald-950">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="h-5 w-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Wallet className="h-3 w-3" />
            </div>
            <span className="text-muted-foreground text-[11px]">Wallet:</span>
            <span className="font-mono text-[11px] font-semibold text-foreground truncate">
              {formatAddress(campaign.walletAddress)}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={copyWallet}
                className="text-muted-foreground hover:text-emerald-700 transition-colors p-1 rounded hover:bg-emerald-50 cursor-pointer"
                aria-label="Copy Address"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Tersalin!" : "Salin Alamat Ethereum"}</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="p-5 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 font-semibold"
          asChild
        >
          <Link href={`/campaign/${campaign.id}`} className="inline-flex items-center justify-center gap-1">
            Detail <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1 font-semibold gap-1.5"
          onClick={() => {
            if (onDonateClick) {
              onDonateClick(campaign)
            } else {
              window.location.href = `/campaign/${campaign.id}`
            }
          }}
        >
          <HeartHandshake className="h-3.5 w-3.5" /> Donasi
        </Button>
      </CardFooter>
    </Card>
  )
}
