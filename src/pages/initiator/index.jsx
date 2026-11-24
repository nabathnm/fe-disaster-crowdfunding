import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  HeartHandshake,
  UserCheck,
  PlusCircle,
  Wallet,
  Coins,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  FileText,
  Loader2,
  Calendar,
  Layers,
  Edit,
  Trash2,
  Lock,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { formatRupiah, formatAddress, formatDate } from "@/lib/formatters"
import { getAddressExplorerUrl } from "@/services/web3Provider"
import { getWalletApi } from "@/services/wallet"
import {
  getMyCampaignsApi,
  createCampaignApi,
  updateCampaignApi,
  closeCampaignApi,
  deleteCampaignApi,
  getCampaignDonatursApi,
  getCampaignDisbursementsApi,
} from "@/services/campaign"
import TopupModal from "@/components/TopupModal"

export default function InitiatorDashboardPage() {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth()

  // Wallet State
  const [walletData, setWalletData] = useState({
    wallet_address: user?.wallet_address || "",
    balance_eth: "0.0",
    balance_wei: "0",
    balance_idr: 0,
    idr_per_eth: 10000000,
  })
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false)
  const [copiedWallet, setCopiedWallet] = useState(false)

  // Campaigns State (via GET /api/v1/campaigns/me)
  const [myCampaigns, setMyCampaigns] = useState([])
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false)

  // Global Notification
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // 1. Create Campaign Modal State (POST /api/v1/campaigns)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false)
  const [createTitle, setCreateTitle] = useState("")
  const [createDescription, setCreateDescription] = useState("")
  const [createImageUrl, setCreateImageUrl] = useState("https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80")
  const [createTargetAmountEth, setCreateTargetAmountEth] = useState("1.5")
  const [createError, setCreateError] = useState("")

  // 2. Edit Campaign Modal State (PATCH /api/v1/campaigns/{id})
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editImageUrl, setEditImageUrl] = useState("")
  const [editTargetAmountEth, setEditTargetAmountEth] = useState("")

  // 3. Close Campaign Modal State (PATCH /api/v1/campaigns/{id}/close)
  const [isCloseOpen, setIsCloseOpen] = useState(false)
  const [isSubmittingClose, setIsSubmittingClose] = useState(false)

  // 4. Delete Campaign Modal State (DELETE /api/v1/campaigns/{id})
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false)

  // 5. Donaturs Modal State (GET /api/v1/campaigns/{id}/donaturs)
  const [isDonatursOpen, setIsDonatursOpen] = useState(false)
  const [donatursList, setDonatursList] = useState([])
  const [isLoadingDonaturs, setIsLoadingDonaturs] = useState(false)

  // 6. Disbursements Modal State (GET /api/v1/campaigns/{id}/disbursements)
  const [isDisbursementsOpen, setIsDisbursementsOpen] = useState(false)
  const [disbursementsList, setDisbursementsList] = useState([])
  const [isLoadingDisbursements, setIsLoadingDisbursements] = useState(false)

  // Load wallet via GET /api/v1/wallet
  const loadWallet = async () => {
    if (!token) return
    setIsLoadingWallet(true)
    try {
      const res = await getWalletApi(token)
      if (res.success && res.data) {
        setWalletData(res.data)
      }
    } catch (e) {
      console.warn("Gagal mengambil data wallet inisiator:", e)
    } finally {
      setIsLoadingWallet(false)
    }
  }

  // Load campaigns via GET /api/v1/campaigns/me
  const loadMyCampaigns = async () => {
    if (!token) return
    setIsLoadingCampaigns(true)
    try {
      const res = await getMyCampaignsApi(token)
      if (res.success && Array.isArray(res.data)) {
        setMyCampaigns(res.data)
      } else {
        setMyCampaigns([])
      }
    } catch (e) {
      console.warn("Gagal memuat kampanye saya:", e)
      setMyCampaigns([])
    } finally {
      setIsLoadingCampaigns(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadWallet()
      if (user?.role === "INITIATOR" || user?.role === "ADMIN") {
        loadMyCampaigns()
      }
    }
  }, [isAuthenticated, user?.role, token])

  const handleCopyWallet = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 2000)
    }
  }

  // Submit Create Campaign (POST /api/v1/campaigns)
  const handleCreateCampaignSubmit = async (e) => {
    e.preventDefault()
    setCreateError("")

    if (!createTitle.trim()) {
      setCreateError("Judul kampanye wajib diisi")
      return
    }

    if (!createDescription.trim()) {
      setCreateError("Deskripsi detail kebutuhan bencana wajib diisi")
      return
    }

    if (!createImageUrl.trim()) {
      setCreateError("Tautan foto dokumentasi lokasi bencana wajib diisi")
      return
    }

    if (!createTargetAmountEth || Number(createTargetAmountEth) <= 0) {
      setCreateError("Target donasi dalam ETH harus lebih dari 0")
      return
    }

    setIsSubmittingCreate(true)

    try {
      const res = await createCampaignApi(
        {
          title: createTitle.trim(),
          description: createDescription.trim(),
          image_url: createImageUrl.trim(),
          target_amount: createTargetAmountEth,
        },
        token
      )

      if (res.success && res.data) {
        setSuccessMessage(`Kampanye bencana "${res.data.title || createTitle}" berhasil dibuat dan menunggu persetujuan admin!`)
        setIsCreateOpen(false)
        setCreateTitle("")
        setCreateDescription("")
        setCreateTargetAmountEth("1.5")
        loadMyCampaigns()
      } else {
        const errText = typeof res.errors === "string" ? res.errors : res.message
        setCreateError(errText || "Gagal menerbitkan kampanye bencana")
      }
    } catch (err) {
      setCreateError(err.message || "Terjadi kesalahan saat memproses kampanye")
    } finally {
      setIsSubmittingCreate(false)
    }
  }

  // Open Edit Campaign Modal
  const openEditModal = (camp) => {
    setSelectedCampaign(camp)
    setEditTitle(camp.title || "")
    setEditDescription(camp.description || "")
    setEditImageUrl(camp.image_url || "")
    setEditTargetAmountEth(String(camp.target_amount || ""))
    setIsEditOpen(true)
  }

  // Submit Edit Campaign (PATCH /api/v1/campaigns/{id})
  const handleEditCampaignSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCampaign?.id) return
    setIsSubmittingEdit(true)
    setErrorMessage("")
    try {
      const res = await updateCampaignApi(
        selectedCampaign.id,
        {
          title: editTitle.trim(),
          description: editDescription.trim(),
          image_url: editImageUrl.trim(),
          target_amount: editTargetAmountEth,
        },
        token
      )
      if (res.success) {
        setSuccessMessage(`Data kampanye "${editTitle}" berhasil diperbarui!`)
        setIsEditOpen(false)
        loadMyCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal memperbarui kampanye")
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memperbarui kampanye")
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  // Open Close Confirmation Dialog
  const openCloseModal = (camp) => {
    setSelectedCampaign(camp)
    setIsCloseOpen(true)
  }

  // Submit Close Campaign (PATCH /api/v1/campaigns/{id}/close)
  const handleCloseCampaignSubmit = async () => {
    if (!selectedCampaign?.id) return
    setIsSubmittingClose(true)
    setErrorMessage("")
    try {
      const res = await closeCampaignApi(selectedCampaign.id, token)
      if (res.success) {
        setSuccessMessage(`Kampanye "${selectedCampaign.title}" resmi ditutup!`)
        setIsCloseOpen(false)
        loadMyCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal menutup kampanye")
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat menutup kampanye")
    } finally {
      setIsSubmittingClose(false)
    }
  }

  // Open Delete Confirmation Dialog
  const openDeleteModal = (camp) => {
    setSelectedCampaign(camp)
    setIsDeleteOpen(true)
  }

  // Submit Delete Campaign (DELETE /api/v1/campaigns/{id})
  const handleDeleteCampaignSubmit = async () => {
    if (!selectedCampaign?.id) return
    setIsSubmittingDelete(true)
    setErrorMessage("")
    try {
      const res = await deleteCampaignApi(selectedCampaign.id, token)
      if (res.success) {
        setSuccessMessage(`Kampanye "${selectedCampaign.title}" berhasil dihapus!`)
        setIsDeleteOpen(false)
        loadMyCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal menghapus kampanye")
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat menghapus kampanye")
    } finally {
      setIsSubmittingDelete(false)
    }
  }

  // Open Donaturs Modal (GET /api/v1/campaigns/{id}/donaturs)
  const openDonatursModal = async (camp) => {
    setSelectedCampaign(camp)
    setIsDonatursOpen(true)
    setIsLoadingDonaturs(true)
    try {
      const res = await getCampaignDonatursApi(camp.id)
      if (res.success && Array.isArray(res.data)) {
        setDonatursList(res.data)
      } else {
        setDonatursList([])
      }
    } catch (e) {
      console.warn("Gagal mengambil daftar donatur:", e)
      setDonatursList([])
    } finally {
      setIsLoadingDonaturs(false)
    }
  }

  // Open Disbursements Modal (GET /api/v1/campaigns/{id}/disbursements)
  const openDisbursementsModal = async (camp) => {
    setSelectedCampaign(camp)
    setIsDisbursementsOpen(true)
    setIsLoadingDisbursements(true)
    try {
      const res = await getCampaignDisbursementsApi(camp.id)
      if (res.success && Array.isArray(res.data)) {
        setDisbursementsList(res.data)
      } else {
        setDisbursementsList([])
      }
    } catch (e) {
      console.warn("Gagal mengambil data pencairan:", e)
      setDisbursementsList([])
    } finally {
      setIsLoadingDisbursements(false)
    }
  }

  const getCampaignStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
            <Clock className="h-3 w-3 text-amber-600" /> MENUNGGU PERSETUJUAN
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge className="bg-blue-100 text-blue-900 border-blue-300 text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
            <CheckCircle className="h-3 w-3 text-blue-600" /> DISETUJUI ADMIN
          </Badge>
        )
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-600 text-white border-emerald-500 text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
            <Sparkles className="h-3 w-3" /> AKTIF MENERIMA DONASI
          </Badge>
        )
      case "CLOSED":
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
            <Lock className="h-3 w-3 text-slate-600" /> SELESAI / DITUTUP
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-900 border-rose-300 text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
            <XCircle className="h-3 w-3 text-rose-600" /> DITOLAK
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-bold">
            {status || "ACTIVE"}
          </Badge>
        )
    }
  }

  // 1. Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-xs text-muted-foreground font-medium">Memuat portal inisiator kampanye...</p>
      </div>
    )
  }

  // 2. Role Restriction (If not INITIATOR and not ADMIN)
  if (!isAuthenticated || (user?.role !== "INITIATOR" && user?.role !== "ADMIN")) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="rounded-3xl border-sky-200/90 bg-white dark:bg-card shadow-xl text-center overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-600" />
          <CardHeader className="pt-8 pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 mb-3 shadow-inner">
              <UserCheck className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-extrabold text-foreground">
              Portal Khusus Inisiator Bencana
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Halaman ini diperuntukkan bagi pengguna dengan peran <strong>INITIATOR</strong> untuk membuat dan mengelola program bantuan bencana.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 text-xs text-muted-foreground">
            <div className="rounded-xl bg-muted/60 p-3 text-left space-y-1">
              <div className="flex justify-between">
                <span>Peran Akun Anda Saat Ini:</span>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {user?.role || "DONOR"}
                </Badge>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed">
              Untuk mengajukan diri sebagai Inisiator Kampanye, hubungi Administrator sistem PeduliChain untuk verifikasi identitas dan peningkatan peran akun Anda.
            </p>
          </CardContent>
          <CardContent className="pt-0 pb-8 px-6 flex flex-col gap-2">
            <Button asChild className="w-full font-bold shadow-md shadow-emerald-600/20 rounded-xl">
              <Link href="/dashboard">Buka Dashboard Donatur Saya</Link>
            </Button>
            <Button variant="outline" asChild className="w-full text-xs font-semibold rounded-xl border-emerald-200">
              <Link href="/">Kembali ke Katalog Kampanye</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeWalletAddress =
    walletData.wallet_address || user?.wallet_address || "0x20100998db146E02FC6A24778B82132C7044bdB4"

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="bg-sky-600 text-white font-bold text-xs flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5" /> Portal Inisiator Kampanye
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
              Role: {user?.role || "INITIATOR"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard Inisiator - {user?.name || "Inisiator"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Buat kampanye bantuan bencana baru (<code className="font-mono text-[11px] bg-muted px-1 rounded">POST /campaigns</code>), kelola status program, dan pantau penyaluran dana langsung ke korban bencana.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl font-bold shadow-md shadow-sky-600/20 bg-sky-600 hover:bg-sky-700 text-white gap-1.5"
          >
            <PlusCircle className="h-4 w-4" /> Buat Kampanye Baru
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMyCampaigns}
            disabled={isLoadingCampaigns}
            className="rounded-xl border-emerald-200 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isLoadingCampaigns ? "animate-spin" : ""}`} />
            Segarkan
          </Button>
        </div>
      </div>

      {/* Global Notifications */}
      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-start justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive flex items-start justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-destructive font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Initiator Wallet Card (via GET /api/v1/wallet) */}
      <Card className="rounded-3xl border-sky-100 bg-gradient-to-r from-sky-50/50 via-white to-emerald-50/30 dark:from-sky-950/20 dark:via-card dark:to-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Dompet On-Chain Inisiator (Sepolia)
                </span>
                <Badge variant="outline" className="bg-white text-sky-700 border-sky-300 text-[9px] font-bold">
                  Ethereum Sepolia
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm font-bold text-sky-950 dark:text-sky-200">
                  {formatAddress(activeWalletAddress)}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyWallet(activeWalletAddress)}
                  className="text-muted-foreground hover:text-sky-700 cursor-pointer p-1"
                  title="Salin Alamat Wallet"
                >
                  {copiedWallet ? <Check className="h-3.5 w-3.5 text-sky-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <a
                  href={getAddressExplorerUrl(activeWalletAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-sky-700 p-1"
                  title="Lihat di Sepolia Etherscan"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Wallet Balance Display */}
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-card p-4 rounded-2xl border border-sky-100 shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase">Saldo Fiat (Midtrans)</div>
              <div className="text-xl font-extrabold text-foreground">
                {formatRupiah(walletData.balance_idr || 0)}
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase">Saldo On-Chain ETH</div>
              <div className="text-xl font-extrabold font-mono text-emerald-700">
                {walletData.balance_eth || "0.0"} ETH
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setIsTopupModalOpen(true)}
              className="rounded-xl text-xs font-bold shadow-xs ml-auto"
            >
              <Coins className="h-3.5 w-3.5" /> Top Up Saldo
            </Button>
          </div>
        </div>
      </Card>

      {/* Metric Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-sky-100 bg-white dark:bg-card shadow-xs p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Kampanye</span>
            <Layers className="h-4.5 w-4.5 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-foreground mt-2">{myCampaigns.length}</div>
          <p className="text-xs text-muted-foreground mt-0.5">Program bencana yang Anda kelola</p>
        </Card>

        <Card className="rounded-2xl border-emerald-100 bg-white dark:bg-card shadow-xs p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Target Terkumpul</span>
            <Coins className="h-4.5 w-4.5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-2">
            {myCampaigns.reduce((acc, c) => acc + Number(c.target_amount || 0), 0).toFixed(2)} ETH
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Akumulasi target donasi</p>
        </Card>

        <Card className="rounded-2xl border-amber-100 bg-white dark:bg-card shadow-xs p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Menunggu Review</span>
            <Clock className="h-4.5 w-4.5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-800 mt-2">
            {myCampaigns.filter((c) => c.status === "PENDING").length}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Verifikasi tim kurator admin</p>
        </Card>

        <Card className="rounded-2xl border-teal-100 bg-white dark:bg-card shadow-xs p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Transparansi Penyaluran</span>
            <ShieldCheck className="h-4.5 w-4.5 text-teal-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-teal-800 mt-2">
            100% On-Chain
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Tercatat permanen di Sepolia</p>
        </Card>
      </div>

      {/* Campaigns List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Daftar Kampanye Bencana yang Anda Buat</h3>
            <p className="text-xs text-muted-foreground">
              Dikelola melalui API <code className="font-mono text-[11px] bg-muted px-1 rounded">GET /api/v1/campaigns/me</code>.
            </p>
          </div>
          <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200 text-xs font-semibold">
            {myCampaigns.length} Kampanye
          </Badge>
        </div>

        {isLoadingCampaigns ? (
          <div className="p-12 text-center space-y-3 bg-white dark:bg-card rounded-2xl border border-sky-100">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600 mx-auto" />
            <p className="text-xs text-muted-foreground">Memuat daftar kampanye dari server...</p>
          </div>
        ) : myCampaigns.length === 0 ? (
          <Card className="p-10 text-center space-y-3 rounded-2xl border-dashed border-sky-200 bg-sky-50/20">
            <HeartHandshake className="h-10 w-10 text-sky-600/60 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-foreground">Belum Ada Kampanye yang Dibuat</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Sebagai inisiator, Anda dapat mempublikasikan program bantuan bencana dan menggalang donasi dari publik.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Buat Kampanye Pertama Anda
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCampaigns.map((camp) => (
              <Card
                key={camp.id}
                className="rounded-2xl border-emerald-100 bg-white dark:bg-card shadow-sm hover:border-emerald-300 transition-all overflow-hidden flex flex-col"
              >
                <div className="relative h-44 w-full bg-muted overflow-hidden">
                  <img
                    src={camp.image_url || "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80"}
                    alt={camp.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    {getCampaignStatusBadge(camp.status)}
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold text-foreground line-clamp-1">
                      {camp.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {camp.description}
                    </p>
                  </div>

                  {/* Rejection Notice if any */}
                  {camp.status === "REJECTED" && camp.rejection_reason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 space-y-0.5">
                      <span className="font-bold flex items-center gap-1 text-rose-700">
                        <AlertTriangle className="h-3 w-3" /> Catatan Penolakan Admin:
                      </span>
                      <p>{camp.rejection_reason}</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-emerald-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Target Donasi:</span>
                      <span className="font-mono font-extrabold text-emerald-700">
                        {camp.target_amount} ETH
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Dibuat Pada:</span>
                      <span>{camp.created_at ? formatDate(camp.created_at) : "-"}</span>
                    </div>
                  </div>

                  {/* Action Buttons for Initiator */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-50">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDonatursModal(camp)}
                      className="text-[11px] font-semibold rounded-xl border-emerald-200 text-emerald-800 hover:bg-emerald-50 gap-1 h-8"
                    >
                      <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" /> Donatur
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDisbursementsModal(camp)}
                      className="text-[11px] font-semibold rounded-xl border-teal-200 text-teal-800 hover:bg-teal-50 gap-1 h-8"
                    >
                      <DollarSign className="h-3.5 w-3.5 text-teal-600" /> Pencairan
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(camp)}
                      className="flex-1 text-xs font-semibold rounded-xl border-emerald-200 gap-1"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>

                    {camp.status !== "CLOSED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCloseModal(camp)}
                        className="text-xs font-semibold rounded-xl border-amber-300 text-amber-800 hover:bg-amber-50 px-3"
                        title="Tutup Kampanye"
                      >
                        <Lock className="h-3.5 w-3.5" /> Tutup
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(camp)}
                      className="text-muted-foreground hover:text-destructive p-2"
                      title="Hapus Kampanye"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      asChild
                      variant="ghost"
                      className="p-2 text-muted-foreground hover:text-emerald-700"
                      title="Lihat Halaman Publik"
                    >
                      <Link href={`/campaign/${camp.id}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL 1: BUAT KAMPANYE BARU (POST /campaigns) ================= */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg p-6 rounded-3xl border-emerald-200/90 shadow-2xl bg-white dark:bg-card">
          <form onSubmit={handleCreateCampaignSubmit} className="space-y-4">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-foreground">
                    Buat Kampanye Bencana Baru
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    API: <code className="font-mono text-[11px] bg-muted px-1 rounded">POST /api/v1/campaigns</code>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {createError && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{createError}</span>
              </div>
            )}

            {/* Judul Kampanye */}
            <div className="space-y-1.5">
              <Label htmlFor="campTitle" className="text-xs font-bold text-foreground">
                Judul Kampanye Tanggap Bencana
              </Label>
              <Input
                id="campTitle"
                placeholder="Contoh: Bantuan Tenda Darurat & Dapur Umum Gempa Cianjur"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                maxLength={150}
                className="text-xs rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                required
              />
            </div>

            {/* Target Donasi ETH */}
            <div className="space-y-1.5">
              <Label htmlFor="campTarget" className="text-xs font-bold text-foreground">
                Target Dana (ETH)
              </Label>
              <div className="relative">
                <Input
                  id="campTarget"
                  type="text"
                  placeholder="Contoh: 2.5"
                  value={createTargetAmountEth}
                  onChange={(e) => setCreateTargetAmountEth(e.target.value)}
                  className="pr-12 font-mono text-xs font-bold rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-emerald-700">
                  ETH
                </span>
              </div>
            </div>

            {/* URL Foto Lokasi Bencana */}
            <div className="space-y-1.5">
              <Label htmlFor="campImage" className="text-xs font-bold text-foreground">
                Tautan Gambar / Foto Lokasi (URL)
              </Label>
              <Input
                id="campImage"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={createImageUrl}
                onChange={(e) => setCreateImageUrl(e.target.value)}
                className="text-xs rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                required
              />
            </div>

            {/* Deskripsi & Kebutuhan Korban */}
            <div className="space-y-1.5">
              <Label htmlFor="campDesc" className="text-xs font-bold text-foreground">
                Deskripsi & Cerita Bencana
              </Label>
              <textarea
                id="campDesc"
                rows={3}
                placeholder="Jelaskan kondisi korban di lokasi bencana, kebutuhan logistik mendesak, serta rincian penyaluran bantuan..."
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmittingCreate}
                onClick={() => setIsCreateOpen(false)}
                className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingCreate}
                className="w-full sm:flex-1 font-bold shadow-md shadow-sky-600/20 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-5 text-xs gap-2"
              >
                {isSubmittingCreate ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Menerbitkan Kampanye...
                  </>
                ) : (
                  <>
                    Terbitkan Kampanye Sekarang <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 2: EDIT KAMPANYE (PATCH /campaigns/{id}) ================= */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg p-6 rounded-3xl border-emerald-200 shadow-2xl bg-white dark:bg-card">
          <form onSubmit={handleEditCampaignSubmit} className="space-y-4">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-foreground">
                    Perbarui Informasi Kampanye
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    API: <code className="font-mono text-[11px] bg-muted px-1 rounded">PATCH /api/v1/campaigns/{selectedCampaign?.id}</code>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Judul Kampanye</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xs rounded-xl border-emerald-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Target Dana (ETH)</Label>
                <Input
                  value={editTargetAmountEth}
                  onChange={(e) => setEditTargetAmountEth(e.target.value)}
                  className="font-mono text-xs font-bold rounded-xl border-emerald-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">URL Gambar Dokumentasi</Label>
                <Input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="text-xs rounded-xl border-emerald-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Deskripsi Kebutuhan Bencana</Label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmittingEdit}
                onClick={() => setIsEditOpen(false)}
                className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingEdit}
                className="w-full sm:flex-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 text-xs gap-2"
              >
                {isSubmittingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 3: TUTUP KAMPANYE (PATCH /campaigns/{id}/close) ================= */}
      <Dialog open={isCloseOpen} onOpenChange={setIsCloseOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-amber-200 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Tutup Kampanye Ini?
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">PATCH /api/v1/campaigns/{selectedCampaign?.id}/close</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="text-xs text-muted-foreground py-2 leading-relaxed">
            Apakah Anda yakin ingin menutup kampanye <strong>"{selectedCampaign?.title}"</strong>? Program tidak akan lagi menerima donasi baru dari publik setelah ditutup.
          </p>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmittingClose}
              onClick={() => setIsCloseOpen(false)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isSubmittingClose}
              onClick={handleCloseCampaignSubmit}
              className="w-full sm:flex-1 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-5 text-xs gap-2"
            >
              {isSubmittingClose ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Konfirmasi Tutup Kampanye
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 4: HAPUS KAMPANYE (DELETE /campaigns/{id}) ================= */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-destructive/20 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Hapus Kampanye Bencana
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">DELETE /api/v1/campaigns/{selectedCampaign?.id}</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="text-xs text-destructive py-2 leading-relaxed">
            Apakah Anda yakin ingin menghapus program <strong>"{selectedCampaign?.title}"</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </p>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmittingDelete}
              onClick={() => setIsDeleteOpen(false)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isSubmittingDelete}
              onClick={handleDeleteCampaignSubmit}
              className="w-full sm:flex-1 font-bold bg-destructive hover:bg-destructive/90 text-white rounded-xl py-5 text-xs gap-2"
            >
              {isSubmittingDelete ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 5: DAFTAR DONATUR (GET /campaigns/{id}/donaturs) ================= */}
      <Dialog open={isDonatursOpen} onOpenChange={setIsDonatursOpen}>
        <DialogContent className="max-w-2xl p-6 rounded-3xl border-emerald-200 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Daftar Donatur Terverifikasi
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">GET /api/v1/campaigns/{selectedCampaign?.id}/donaturs</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
              Kampanye: {selectedCampaign?.title}
            </div>

            {isLoadingDonaturs ? (
              <div className="p-8 text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mx-auto" />
                <p className="text-xs text-muted-foreground">Memuat catatan donatur dari blockchain...</p>
              </div>
            ) : donatursList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-muted/40 space-y-1">
                <p className="text-xs font-bold text-foreground">Belum Ada Donatur</p>
                <p className="text-[11px] text-muted-foreground">Kampanye ini belum menerima donasi dari donatur publik.</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2">
                {donatursList.map((don, idx) => (
                  <div key={don.id || idx} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-foreground">{don.donor_name || don.name || "Donatur Dermawan"}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{formatAddress(don.donor_wallet || don.wallet_address)}</div>
                      <div className="text-[10px] text-muted-foreground">{don.created_at ? formatDate(don.created_at) : ""}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-emerald-700 text-sm">
                        {don.amount_eth ? `${don.amount_eth} ETH` : don.amount ? formatRupiah(don.amount) : "0 ETH"}
                      </div>
                      {don.tx_hash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${don.tx_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-emerald-600 hover:underline inline-flex items-center gap-1 font-mono"
                        >
                          Tx On-Chain <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDonatursOpen(false)}
              className="w-full text-xs font-semibold rounded-xl border-emerald-200"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 6: DAFTAR PENCAIRAN (GET /campaigns/{id}/disbursements) ================= */}
      <Dialog open={isDisbursementsOpen} onOpenChange={setIsDisbursementsOpen}>
        <DialogContent className="max-w-2xl p-6 rounded-3xl border-teal-200 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Riwayat Pencairan Dana Bencana
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">GET /api/v1/campaigns/{selectedCampaign?.id}/disbursements</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="font-bold text-xs text-teal-950 dark:text-teal-200">
              Kampanye: {selectedCampaign?.title}
            </div>

            {isLoadingDisbursements ? (
              <div className="p-8 text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
                <p className="text-xs text-muted-foreground">Memuat catatan pencairan dana...</p>
              </div>
            ) : disbursementsList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-muted/40 space-y-1">
                <p className="text-xs font-bold text-foreground">Belum Ada Pencairan Dana</p>
                <p className="text-[11px] text-muted-foreground">Belum ada dana yang dicairkan untuk program ini.</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2">
                {disbursementsList.map((dis, idx) => (
                  <div key={dis.id || idx} className="p-3 rounded-xl border border-teal-100 bg-teal-50/30 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-foreground">{dis.purpose || "Penyaluran Bantuan Korban"}</div>
                      <div className="text-[11px] text-muted-foreground">Penerima: {dis.recipient || "Posko Lapangan"}</div>
                      <div className="text-[10px] text-muted-foreground">{dis.created_at ? formatDate(dis.created_at) : ""}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-teal-700 text-sm">
                        {dis.amount_eth ? `${dis.amount_eth} ETH` : dis.amount ? formatRupiah(dis.amount) : "0 ETH"}
                      </div>
                      {dis.tx_hash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${dis.tx_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-teal-600 hover:underline inline-flex items-center gap-1 font-mono"
                        >
                          Tx Sepolia <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDisbursementsOpen(false)}
              className="w-full text-xs font-semibold rounded-xl border-teal-200"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Topup Modal */}
      <TopupModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        idrPerEth={walletData?.idr_per_eth || 10000000}
        onTopupSuccess={loadWallet}
      />
    </div>
  )
}
