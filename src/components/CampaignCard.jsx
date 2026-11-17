import React, { useState } from "react"
import Link from "next/link"
import { Copy, Check, Clock, Wallet, ArrowRight } from "lucide-react"
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
    <Card className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg border-muted">
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80"
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/70 backdrop-blur-md text-white border-none font-medium">
            {campaign.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-md text-xs font-mono">
            {campaign.status || "AKTIF"}
          </Badge>
        </div>
      </div>

      {/* Body Content */}
      <CardHeader className="p-5 pb-2">
        <Link href={`/campaign/${campaign.id}`} className="hover:underline">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground">
            {campaign.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground mt-1">
          {campaign.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-end space-y-4">
        {/* Progress Bar & Amount */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-semibold text-primary">{formatRupiah(campaign.collectedAmount)}</span>
            <span className="text-muted-foreground">Target: {formatRupiah(campaign.targetAmount)}</span>
          </div>
          <Progress value={percent} className="h-2" />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
            <span className="font-medium text-foreground">{percent}% Tercapai</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Aktif
            </span>
          </div>
        </div>

        {/* Ethereum Smart Contract Wallet */}
        <div className="rounded-lg bg-muted/60 p-2.5 text-xs flex items-center justify-between border border-border/50">
          <div className="flex items-center gap-1.5 min-w-0">
            <Wallet className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-muted-foreground text-[11px]">Wallet:</span>
            <span className="font-mono text-[11px] font-medium truncate">
              {formatAddress(campaign.walletAddress)}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={copyWallet}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-background cursor-pointer"
                aria-label="Copy Address"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
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
          className="flex-1"
          asChild
        >
          <Link href={`/campaign/${campaign.id}`} className="inline-flex items-center justify-center gap-1">
            Detail <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1 font-semibold"
          onClick={() => {
            if (onDonateClick) {
              onDonateClick(campaign)
            } else {
              window.location.href = `/campaign/${campaign.id}`
            }
          }}
        >
          Donasi Sekarang
        </Button>
      </CardFooter>
    </Card>
  )
}
