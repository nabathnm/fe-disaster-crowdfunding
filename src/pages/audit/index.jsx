import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, ExternalLink, RefreshCw, Sparkles, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold rounded-md">
              Buku Kas Terbuka
            </Badge>
            <Badge variant="outline" className="text-xs text-slate-500 border-slate-200 rounded-md">
              Akses Publik (Bebas Login)
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Transparency Audit View
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-3xl">
            Audit terbuka seluruh catatan donasi bencana yang tercatat secara permanen di blockchain Ethereum Sepolia.
            Masyarakat dapat memverifikasi setiap rupiah secara independen.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            disabled={isRefreshing}
            className="gap-1.5 text-xs font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button size="sm" asChild className="text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-none">
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
      <Card className="rounded-lg border border-slate-200 bg-slate-50/60 shadow-none">
        <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Protokol Audit On-Chain Ethereum Sepolia
                </h2>
                <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5 rounded-md">Live Testnet</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Setiap donasi yang masuk melalui gateway Midtrans menerbitkan voucher bukti hash transaksi yang
                di-commit ke <strong>Ethereum Sepolia (Chain ID 11155111)</strong>. Bukti ini bebas diinspeksi publik melalui
                format URL: <code className="rounded bg-white border border-slate-200 px-1.5 py-0.5 font-mono text-[11px] text-slate-800">https://sepolia.etherscan.io/tx/&#123;tx_hash&#125;</code>.
              </p>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0 text-xs">
            <span className="text-slate-500 text-[11px]">Akses Halaman:</span>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-200 font-semibold px-2.5 py-1 rounded-md">
              100% Terbuka untuk Umum
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Audit Trail Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" /> Log Transaksi Real-Time
            </h2>
            <p className="text-xs text-slate-500">
              Daftar transaksi donasi terbaru yang telah tercatat dan divalidasi ke blok Sepolia.
            </p>
          </div>
        </div>

        <AuditTrailTable transactions={logs} />
      </div>
    </div>
  )
}
