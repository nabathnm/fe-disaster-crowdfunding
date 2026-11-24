import React, { useState, useEffect } from "react"
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
  User,
  Copy,
  Check,
  LogIn,
  UserPlus,
  PlusCircle,
  RefreshCw,
  ArrowUpRight,
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
import { useAuth } from "@/context/AuthContext"
import { formatRupiah, formatAddress, formatDate } from "@/lib/formatters"
import { getTxExplorerUrl, getAddressExplorerUrl } from "@/services/web3Provider"
import { getWalletApi } from "@/services/wallet"
import TopupModal from "@/components/TopupModal"

export default function DonorDashboardPage() {
  const { user, token, isAuthenticated } = useAuth()
  const [copiedWallet, setCopiedWallet] = useState(false)
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)

  const [walletData, setWalletData] = useState({
    wallet_address: user?.wallet_address || "",
    balance_eth: "0.0",
    balance_wei: "0",
    balance_idr: 0,
    idr_per_eth: 10000000,
  })

  // Load live wallet information from GET /api/v1/wallet
  const loadWallet = async () => {
    setIsLoadingWallet(true)
    try {
      const res = await getWalletApi(token)
      if (res.success && res.data) {
        setWalletData(res.data)
      }
    } catch (e) {
      console.warn("Gagal mengambil data wallet live:", e)
    } finally {
      setIsLoadingWallet(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated || token) {
      loadWallet()
    }
  }, [isAuthenticated, token])

  const handleTopupSuccess = (topupData) => {
    // Refresh balance after top-up transaction initiated
    loadWallet()
  }

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

  const handleCopyWallet = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 2000)
    }
  }

  const activeWalletAddress =
    walletData.wallet_address || user?.wallet_address || "0x20100998db146E02FC6A24778B82132C7044bdB4"

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold rounded-md">
              Portal Donatur
            </Badge>
            {isAuthenticated && (
              <Badge className="bg-emerald-600 text-white text-[10px] font-bold rounded-md">
                {user?.role || "DONOR"}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {isAuthenticated && user?.name ? `Dashboard Donatur: ${user.name}` : "Dashboard Donatur"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau akumulasi kontribusi kebaikan Anda, saldo dompet fiat, dan dompet Ethereum resmi Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsTopupModalOpen(true)}
            className="gap-1.5 font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none"
          >
            <PlusCircle className="h-4 w-4" /> Top Up Saldo
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2 font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
            <Link href="/">
              <HeartHandshake className="h-4 w-4 text-emerald-600" /> Donasi Lagi
            </Link>
          </Button>
        </div>
      </div>

      {/* User On-Chain Identity Card / Auth Callout */}
      {isAuthenticated && user ? (
        <Card className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-none">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {user.name}
                  </h2>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-medium rounded-md">
                    {user.role || "DONOR"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Wallet className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-slate-900">Ethereum Wallet:</span>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-800">
                {formatAddress(activeWalletAddress)}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyWallet(activeWalletAddress)}
                  className="h-7 text-xs px-2 gap-1 font-medium text-slate-700 hover:bg-slate-200/60 rounded-md"
                  title="Salin Wallet Lengkap"
                >
                  {copiedWallet ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copiedWallet ? "Tersalin" : "Salin"}
                </Button>
                <Button variant="outline" size="sm" asChild className="h-7 text-xs px-2 border-slate-200 text-slate-700 rounded-md hover:bg-slate-100">
                  <a
                    href={getAddressExplorerUrl(activeWalletAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka di Sepolia Etherscan"
                  >
                    <ExternalLink className="h-3 w-3 text-slate-600" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="rounded-lg border border-slate-200 bg-slate-50/60 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-none">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Akun untuk Mendapatkan Dompet Ethereum Pribadi
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Setiap akun yang didaftarkan ke API backend otomatis memiliki dompet on-chain terverifikasi untuk mencatat riwayat donasi Anda secara transparan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild className="rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              <Link href="/auth/login" className="gap-1">
                <LogIn className="h-3.5 w-3.5" /> Masuk
              </Link>
            </Button>
            <Button size="sm" asChild className="rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-none">
              <Link href="/auth/register" className="gap-1">
                <UserPlus className="h-3.5 w-3.5" /> Daftar Akun
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Metric Cards Section (Clean White Minimalist) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Donasi */}
        <Card className="rounded-lg border border-slate-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Donasi Saya
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Coins className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {formatRupiah(totalDonations)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
              Tersalurkan ke <strong className="text-slate-800">{donorHistory.length}</strong> kampanye bencana
            </p>
          </CardContent>
        </Card>

        {/* Sisa Saldo Dompet Fiat & Topup System */}
        <Card className="rounded-lg border border-slate-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saldo Dompet Fiat (Midtrans)
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={loadWallet}
                disabled={isLoadingWallet}
                className="h-7 w-7 text-slate-400 hover:text-slate-700 cursor-pointer rounded-md"
                title="Refresh Saldo Wallet"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingWallet ? "animate-spin text-emerald-600" : ""}`} />
              </Button>
              <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                {formatRupiah(walletData.balance_idr || 0)}
              </div>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="font-mono text-emerald-700 font-semibold">
                  ≈ {walletData.balance_eth || "0.0"} ETH
                </span>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-slate-50 text-slate-600 border-slate-200 rounded-md">
                  Rate: 1 ETH = {formatRupiah(walletData.idr_per_eth || 10000000)}
                </Badge>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setIsTopupModalOpen(true)}
              className="w-full text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none gap-1.5 py-2 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Top Up Saldo Sekarang
            </Button>
          </CardContent>
        </Card>

        {/* Status Verifikasi Sepolia */}
        <Card className="rounded-lg border border-slate-200 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status Verifikasi On-Chain
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              100% Sepolia Verified
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Seluruh resi tersimpan secara immutable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Donasi & Bukti Resi Transaksi */}
      <Card className="rounded-lg border border-slate-200 bg-white shadow-none overflow-hidden">
        <CardHeader className="p-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                <History className="h-4.5 w-4.5 text-emerald-600" /> Riwayat Transaksi & Bukti Resi Donasi
              </CardTitle>
              <CardDescription className="text-xs mt-0.5 text-slate-500">
                Bukti pembayaran sah yang diterbitkan oleh payment gateway dan dicatat pada smart contract Sepolia.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-medium rounded-md">
              {donorHistory.length} Resi
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200">
                <TableHead className="text-xs font-semibold text-slate-700">No. Resi</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Kampanye Bencana</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Waktu Donasi</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Metode Pembayaran</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Nominal (IDR)</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-700">Verifikasi On-Chain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donorHistory.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                  {/* Resi ID */}
                  <TableCell className="font-mono text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                      {item.id}
                    </span>
                  </TableCell>

                  {/* Kampanye */}
                  <TableCell className="text-xs font-medium">
                    <Link href={`/campaign/${item.campaignId}`} className="hover:underline text-slate-900">
                      {item.campaignTitle}
                    </Link>
                  </TableCell>

                  {/* Tanggal */}
                  <TableCell className="text-xs text-slate-500">
                    {formatDate(item.date)}
                  </TableCell>

                  {/* Metode Pembayaran */}
                  <TableCell className="text-xs text-slate-500">
                    {item.paymentMethod}
                  </TableCell>

                  {/* Nominal */}
                  <TableCell className="text-xs font-bold text-slate-900">
                    {formatRupiah(item.amount)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-medium rounded-md">
                      {item.status}
                    </Badge>
                  </TableCell>

                  {/* Action Link Etherscan */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-md">
                      <a
                        href={getTxExplorerUrl(item.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                      >
                        <span>Etherscan</span>
                        <ExternalLink className="h-3 w-3 text-slate-500" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Topup Modal System */}
      <TopupModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        idrPerEth={walletData?.idr_per_eth || 10000000}
        onTopupSuccess={handleTopupSuccess}
      />
    </div>
  )
}
