import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, ExternalLink, RefreshCw, Info, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AuditTrailTable from "@/components/AuditTrailTable"
import { fetchAuditLogs } from "@/services/api"
import { SEPOLIA_CONFIG } from "@/services/web3Provider"

export default function TransparencyAuditPage() {
  const [logs, setLogs] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadLogs = async () => {
    setIsRefreshing(true)
    const data = await fetchAuditLogs()
    setLogs(data)
    setIsRefreshing(false)
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
              Public Ledger
            </Badge>
            <Badge variant="outline" className="text-xs">
              No Authentication Required
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Transparency Audit View
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Audit terbuka seluruh transaksi donasi yang tercatat secara permanen di blockchain Ethereum Sepolia.
            Masyarakat dapat memverifikasi setiap rupiah secara independen tanpa perlu login.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            disabled={isRefreshing}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Log
          </Button>
          <Button size="sm" asChild className="text-xs gap-1.5">
            <a
              href={SEPOLIA_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sepolia Etherscan <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Blockchain Integration Spec Banner */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">
                Spesifikasi Audit On-Chain Sepolia Testnet
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setiap donasi melalui Midtrans diterbitkan voucher bukti hash transaksi. Hash tersebut di-commit ke
                jaringan <strong>Ethereum Sepolia Testnet (Chain ID 11155111)</strong> dan dapat diakses publik melalui
                format URL resmi: <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">https://sepolia.etherscan.io/tx/&#123;tx_hash&#125;</code>.
              </p>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end gap-1 shrink-0 text-xs">
            <span className="text-muted-foreground">Akses Halaman:</span>
            <Badge variant="outline" className="bg-background text-emerald-600 border-emerald-500/40 font-semibold">
              Publik (Bebas Login)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Audit Trail Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Tabel Log Transaksi Real-Time</h2>
            <p className="text-xs text-muted-foreground">
              Daftar transaksi donasi terbaru yang telah tercatat dan divalidasi ke blok Sepolia.
            </p>
          </div>
        </div>

        <AuditTrailTable transactions={logs} />
      </div>
    </div>
  )
}
