import React, { useState } from "react"
import Link from "next/link"
import {
  Wallet,
  Coins,
  History,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
  HeartHandshake,
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
  // Mock data donatur
  const [fiatBalance, setFiatBalance] = useState(2500000) // Sisa saldo dompet fiat
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

  // Akumulasi total donasi
  const totalDonations = donorHistory.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard Donatur
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau akumulasi total donasi Anda, sisa saldo dompet fiat, dan riwayat resi transaksi terverifikasi on-chain.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/">
            <HeartHandshake className="h-4 w-4" /> Donasi Lagi
          </Link>
        </Button>
      </div>

      {/* Metric Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Donasi */}
        <Card className="border-muted shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Donasi Saya
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Coins className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {formatRupiah(totalDonations)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Akumulasi dari <strong>{donorHistory.length}</strong> transaksi donasi bencana
            </p>
          </CardContent>
        </Card>

        {/* Sisa Saldo Dompet Fiat */}
        <Card className="border-muted shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sisa Saldo Dompet Fiat
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {formatRupiah(fiatBalance)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-600 font-medium">Terintegrasi Midtrans / E-Wallet</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status Verifikasi Sepolia */}
        <Card className="border-muted shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Audit Status On-Chain
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              100% On-Chain
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Seluruh resi donasi terhubung ke Sepolia Etherscan Explorer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Donasi & Bukti Resi Transaksi */}
      <Card className="border-muted shadow-sm">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Riwayat Transaksi & Resi Donasi
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Bukti transaksi sah yang telah diterbitkan oleh payment gateway dan dicatat pada smart contract.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-muted text-xs">
              {donorHistory.length} Resi
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">No. Resi</TableHead>
                <TableHead className="text-xs font-semibold">Kampanye Bencana</TableHead>
                <TableHead className="text-xs font-semibold">Waktu Donasi</TableHead>
                <TableHead className="text-xs font-semibold">Metode Pembayaran</TableHead>
                <TableHead className="text-xs font-semibold">Nominal (IDR)</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold">Verifikasi On-Chain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donorHistory.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  {/* Resi ID */}
                  <TableCell className="font-mono text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {item.id}
                    </span>
                  </TableCell>

                  {/* Kampanye */}
                  <TableCell className="text-xs font-medium">
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
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatRupiah(item.amount)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px]">
                      {item.status}
                    </Badge>
                  </TableCell>

                  {/* Action Link Etherscan */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1">
                      <a
                        href={getTxExplorerUrl(item.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <span>Etherscan</span>
                        <ExternalLink className="h-3 w-3" />
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
