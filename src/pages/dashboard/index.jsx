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
  Lock,
  Loader2,
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
import { getMyTransactionsApi } from "@/services/transaction"
import TopupModal from "@/components/TopupModal"

export default function DonorDashboardPage() {
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth()
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
    if (!token) return
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

  const [userTransactions, setUserTransactions] = useState([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [transactionFilter, setTransactionFilter] = useState("ALL")

  // Load transactions via GET /api/v1/transactions/me
  const loadTransactions = async () => {
    if (!token) return
    setIsLoadingTransactions(true)
    try {
      const res = await getMyTransactionsApi(transactionFilter, token)
      if (res.success && Array.isArray(res.data)) {
        setUserTransactions(res.data)
      } else {
        setUserTransactions([])
      }
    } catch (e) {
      console.warn("Gagal mengambil data transaksi:", e)
      setUserTransactions([])
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && token) {
      loadWallet()
      loadTransactions()
    }
  }, [isAuthenticated, token, transactionFilter])

  const handleTopupSuccess = () => {
    loadWallet()
    loadTransactions()
  }

  const donationTransactions = userTransactions.filter((t) => t.type === "DONATION")
  const totalDonations = donationTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const handleCopyWallet = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 2000)
    }
  }

  // 1. Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-xs text-slate-500 font-medium">Memuat data dashboard akun Anda...</p>
      </div>
    )
  }

  // 2. Authentication Restriction Gate
  if (!isAuthenticated || !token) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="rounded-lg border border-slate-200 bg-white text-center overflow-hidden shadow-none">
          <CardHeader className="pt-8 pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mb-3">
              <Lock className="h-6 w-6 text-slate-600" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              Akses Dibatasi: Silakan Masuk
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Dashboard akun, saldo dompet, dan riwayat transaksi hanya dapat diakses setelah Anda masuk ke sistem.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-8 px-6 flex flex-col gap-2">
            <Button asChild className="w-full font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none">
              <Link href="/auth/login">Masuk ke Akun Anda</Link>
            </Button>
            <Button variant="outline" asChild className="w-full text-xs font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
              <Link href="/auth/register">Belum Memiliki Akun? Daftar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeWalletAddress = walletData.wallet_address || user?.wallet_address || ""

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

      {/* User On-Chain Identity Card */}
      <Card className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-none">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {user?.name}
                </h2>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-medium rounded-md">
                  {user?.role || "DONOR"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold text-slate-900">Dompet Ethereum:</span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-800">
              {activeWalletAddress ? formatAddress(activeWalletAddress) : "Sedang disinkronisasi..."}
            </span>
            {activeWalletAddress && (
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
            )}
          </div>
        </div>
      </Card>

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
              Tersalurkan ke <strong className="text-slate-800">{donationTransactions.length}</strong> donasi bencana
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                <History className="h-4.5 w-4.5 text-emerald-600" /> Riwayat Transaksi & Bukti Resi
              </CardTitle>
              <CardDescription className="text-xs mt-0.5 text-slate-500">
                Bukti transaksi resmi yang diproses sistem dan dicatat pada smart contract Ethereum Sepolia (GET /api/v1/transactions/me).
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              {["ALL", "DONATION", "TOPUP"].map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={transactionFilter === f ? "default" : "outline"}
                  onClick={() => setTransactionFilter(f)}
                  className={`h-7 px-2.5 text-[11px] font-semibold rounded-md ${
                    transactionFilter === f
                      ? "bg-emerald-600 text-white shadow-none"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {f === "ALL" ? "Semua" : f === "DONATION" ? "Donasi" : "Top Up"}
                </Button>
              ))}
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-medium rounded-md ml-1">
                {displayTransactions.length} Resi
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200">
                <TableHead className="text-xs font-semibold text-slate-700">No. Order / Resi</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Tipe</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Tujuan / Kampanye</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Waktu</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Nominal</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-700">Verifikasi On-Chain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingTransactions ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500 text-xs">
                    Memuat data transaksi dari blockchain...
                  </TableCell>
                </TableRow>
              ) : userTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-400 text-xs">
                    Belum ada riwayat transaksi pada akun ini. Lakukan donasi atau top up saldo untuk memulai.
                  </TableCell>
                </TableRow>
              ) : (
                userTransactions.map((item) => (
                  <TableRow key={item.id || item.order_id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                    {/* Resi ID */}
                    <TableCell className="font-mono text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                        {item.order_id || item.id}
                      </span>
                    </TableCell>

                    {/* Tipe */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold rounded-md ${
                          item.type === "DONATION"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-sky-50 text-sky-700 border-sky-200"
                        }`}
                      >
                        {item.type || "DONATION"}
                      </Badge>
                    </TableCell>

                    {/* Kampanye */}
                    <TableCell className="text-xs font-medium">
                      {item.campaign_id ? (
                        <Link href={`/campaign/${item.campaign_id}`} className="hover:underline text-slate-900">
                          {item.campaignTitle || `Kampanye #${item.campaign_id.slice(0, 8)}`}
                        </Link>
                      ) : (
                        <span className="text-slate-500">Saldo Dompet Akun</span>
                      )}
                    </TableCell>

                    {/* Tanggal */}
                    <TableCell className="text-xs text-slate-500">
                      {formatDate(item.created_at || item.date)}
                    </TableCell>

                    {/* Nominal */}
                    <TableCell className="text-xs font-bold text-slate-900">
                      <div>{formatRupiah(item.amount)}</div>
                      {item.amount_eth && (
                        <div className="font-mono text-[10px] text-emerald-700 font-normal">
                          {item.amount_eth} ETH
                        </div>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-medium rounded-md">
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* Action Link Etherscan */}
                    <TableCell className="text-right">
                      {item.tx_url || item.transfer_tx_url || item.tx_hash ? (
                        <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1 font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-md">
                          <a
                            href={item.tx_url || item.transfer_tx_url || getTxExplorerUrl(item.tx_hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1"
                          >
                            <span>Etherscan</span>
                            <ExternalLink className="h-3 w-3 text-slate-500" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Tercatat Off-Chain</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
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
