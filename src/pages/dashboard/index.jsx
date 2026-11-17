import React, { useState } from "react"
import Link from "next/link"
import {
  Wallet,
  Coins,
  History,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Heart,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRupiah, formatAddress, formatDate } from "@/lib/formatters"
import { getTxExplorerUrl } from "@/services/web3Provider"

export default function DonorDashboardPage() {
  const [fiatBalance] = useState(2500000)
  const [donorHistory] = useState([
    {
      id: "INV-20261117-001",
      campaignTitle: "Tanggap Darurat Gempa Bumi Cianjur",
      campaignId: "cmp-001",
      amount: 500000,
      date: "2026-11-17T09:45:00Z",
      paymentMethod: "GoPay / QRIS Snap",
      status: "Settlement",
      txHash: "0x789a456bc12de34fa567890123456789abcdef0123456789abcdef0123456789",
    },
    {
      id: "INV-20261115-004",
      campaignTitle: "Bantuan Logistik Korban Banjir Demak",
      campaignId: "cmp-002",
      amount: 250000,
      date: "2026-11-15T14:20:00Z",
      paymentMethod: "BCA Virtual Account",
      status: "Settlement",
      txHash: "0x987f654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
    },
    {
      id: "INV-20261110-009",
      campaignTitle: "Evakuasi & Masker Erupsi Gunung Marapi",
      campaignId: "cmp-003",
      amount: 150000,
      date: "2026-11-10T11:10:00Z",
      paymentMethod: "ShopeePay Snap",
      status: "Settlement",
      txHash: "0x456cde78901234567890abcdef1234567890abcdef1234567890abcdef123456",
    },
  ])

  const totalDonations = donorHistory.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold">
              Portal Donatur
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard Donatur
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pantau akumulasi kontribusi kebaikan Anda, saldo dompet fiat, dan resi transaksi yang terverifikasi on-chain.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 font-bold shadow-sm shadow-emerald-600/20">
          <Link href="/">
            <HeartHandshake className="h-4 w-4" /> Donasi Lagi
          </Link>
        </Button>
      </div>

      {/* Metric Cards Section (Clean White with Caring Green Accents) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Donasi */}
        <Card className="rounded-2xl border-emerald-100/90 bg-white dark:bg-card shadow-sm shadow-emerald-600/5 hover:border-emerald-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Donasi Saya
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Coins className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {formatRupiah(totalDonations)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
              Tersalurkan ke <strong>{donorHistory.length}</strong> kampanye bencana
            </p>
          </CardContent>
        </Card>

        {/* Sisa Saldo Dompet Fiat */}
        <Card className="rounded-2xl border-emerald-100/90 bg-white dark:bg-card shadow-sm shadow-emerald-600/5 hover:border-emerald-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Sisa Saldo Dompet Fiat
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
              <Wallet className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {formatRupiah(fiatBalance)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-600 font-semibold">Tersambung Midtrans Sandbox</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                Ready
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status Verifikasi Sepolia */}
        <Card className="rounded-2xl border-emerald-100/90 bg-white dark:bg-card shadow-sm shadow-emerald-600/5 hover:border-emerald-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Status Verifikasi On-Chain
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
              100% Sepolia Verified
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Seluruh resi tersimpan secara immutable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Donasi & Bukti Resi Transaksi */}
      <Card className="rounded-2xl border-emerald-100 bg-white dark:bg-card shadow-sm shadow-emerald-600/5 overflow-hidden">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-extrabold flex items-center gap-2 text-foreground">
                <History className="h-5 w-5 text-emerald-600" /> Riwayat Transaksi & Bukti Resi Donasi
              </CardTitle>
              <CardDescription className="text-xs mt-0.5 text-muted-foreground">
                Bukti pembayaran sah yang diterbitkan oleh payment gateway dan dicatat pada smart contract Sepolia.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold">
              {donorHistory.length} Resi
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-emerald-50/50">
              <TableRow className="border-emerald-100">
                <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">No. Resi</TableHead>
                <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Kampanye Bencana</TableHead>
                <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Waktu Donasi</TableHead>
                <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Metode Pembayaran</TableHead>
                <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Nominal (IDR)</TableHead>
                <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Status</TableHead>
                <TableHead className="text-right text-xs font-bold text-emerald-950 dark:text-emerald-200">Verifikasi On-Chain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donorHistory.map((item) => (
                <TableRow key={item.id} className="hover:bg-emerald-50/40 border-emerald-100/60 transition-colors">
                  {/* Resi ID */}
                  <TableCell className="font-mono text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
                      <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                      {item.id}
                    </span>
                  </TableCell>

                  {/* Kampanye */}
                  <TableCell className="text-xs font-semibold">
                    <Link href={`/campaign/${item.campaignId}`} className="hover:underline text-foreground">
                      {item.campaignTitle}
                    </Link>
                  </TableCell>

                  {/* Tanggal */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </TableCell>

                  {/* Metode Pembayaran */}
                  <TableCell className="text-xs text-muted-foreground">
                    {item.paymentMethod}
                  </TableCell>

                  {/* Nominal */}
                  <TableCell className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatRupiah(item.amount)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-bold">
                      {item.status}
                    </Badge>
                  </TableCell>

                  {/* Action Link Etherscan */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 font-semibold text-emerald-800 hover:bg-emerald-50">
                      <a
                        href={getTxExplorerUrl(item.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <span>Etherscan</span>
                        <ExternalLink className="h-3 w-3 text-emerald-600" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
