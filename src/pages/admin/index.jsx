import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserCheck,
  HeartHandshake,
  Search,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Lock,
  Filter,
  User,
  ArrowUpRight,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
  Layers,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Eye,
  Clock,
  Ban,
  AlertTriangle,
  FileText,
  DollarSign,
  Wallet,
  Sparkles,
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
import { formatAddress, formatDate, formatRupiah } from "@/lib/formatters"
import { getAddressExplorerUrl } from "@/services/web3Provider"
import { getUsersApi, updateUserRoleApi } from "@/services/auth"
import { getWalletApi } from "@/services/wallet"
import {
  getAllCampaignsApi,
  approveCampaignApi,
  rejectCampaignApi,
  closeCampaignApi,
  deleteCampaignApi,
  updateCampaignApi,
  getCampaignDonatursApi,
  getCampaignDisbursementsApi,
} from "@/services/campaign"

export default function AdminPage() {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuth()

  // Tab State: "users" vs "campaigns"
  const [activeTab, setActiveTab] = useState("campaigns")

  // ================= USERS STATE =================
  const [usersList, setUsersList] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("ALL")

  // Admin Wallet State (via GET /api/v1/wallet)
  const [walletData, setWalletData] = useState({
    wallet_address: user?.wallet_address || "",
    balance_eth: "0.0",
    balance_wei: "0",
    balance_idr: 0,
    idr_per_eth: 10000000,
  })

  // Role change confirmation dialog state
  const [selectedUser, setSelectedUser] = useState(null)
  const [targetRole, setTargetRole] = useState("INITIATOR")
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)

  // Copy wallet feedback state
  const [copiedAddress, setCopiedAddress] = useState(null)

  // ================= CAMPAIGNS STATE =================
  const [campaignsList, setCampaignsList] = useState([])
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false)
  const [campaignSearchTerm, setCampaignSearchTerm] = useState("")
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("ALL")

  // Action states for campaigns
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  // 1. Reject Modal State
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // 2. Edit Campaign Modal State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editImageUrl, setEditImageUrl] = useState("")
  const [editTargetAmount, setEditTargetAmount] = useState("")

  // 3. Delete Confirm Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // 4. Close Confirm Dialog State
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)

  // 5. Donaturs Modal State
  const [isDonatursDialogOpen, setIsDonatursDialogOpen] = useState(false)
  const [donatursList, setDonatursList] = useState([])
  const [isLoadingDonaturs, setIsLoadingDonaturs] = useState(false)

  // 6. Disbursements Modal State
  const [isDisbursementsDialogOpen, setIsDisbursementsDialogOpen] = useState(false)
  const [disbursementsList, setDisbursementsList] = useState([])
  const [isLoadingDisbursements, setIsLoadingDisbursements] = useState(false)

  // Global Notification states
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Load Admin Wallet
  const loadWallet = async () => {
    if (!token) return
    try {
      const res = await getWalletApi(token)
      if (res.success && res.data) {
        setWalletData(res.data)
      }
    } catch (e) {
      console.warn("Gagal mengambil data wallet admin:", e)
    }
  }

  // Load Users via GET /api/v1/users
  const loadUsers = async () => {
    if (!token) return
    setIsLoadingUsers(true)
    try {
      const res = await getUsersApi(token)
      if (res.success && Array.isArray(res.data)) {
        setUsersList(res.data)
      } else {
        setErrorMessage(res.message || "Gagal memuat daftar pengguna")
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat menghubungi API pengguna")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Load Campaigns via GET /api/v1/campaigns/all
  const loadCampaigns = async () => {
    if (!token) return
    setIsLoadingCampaigns(true)
    try {
      const res = await getAllCampaignsApi(campaignStatusFilter, token)
      if (res.success && Array.isArray(res.data)) {
        setCampaignsList(res.data)
      } else {
        setErrorMessage(res.message || "Gagal memuat daftar kampanye")
      }
    } catch (err) {
      console.warn("Gagal memuat kampanye:", err)
      setErrorMessage(err.message || "Terjadi kesalahan saat mengambil kampanye")
    } finally {
      setIsLoadingCampaigns(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      loadWallet()
      loadUsers()
      loadCampaigns()
    }
  }, [isAuthenticated, user?.role, token, campaignStatusFilter])

  const handleCopyWallet = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    }
  }

  // Role Dialog Open
  const openRoleDialog = (targetUser, newRole) => {
    setSelectedUser(targetUser)
    setTargetRole(newRole)
    setIsRoleDialogOpen(true)
    setErrorMessage("")
    setSuccessMessage("")
  }

  // Role Confirm Change
  const handleConfirmRoleChange = async () => {
    if (!selectedUser || !targetRole) return
    setIsUpdatingRole(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const res = await updateUserRoleApi(selectedUser.id, targetRole, token)
      if (res.success && res.data) {
        setSuccessMessage(
          `Peran pengguna ${selectedUser.name || selectedUser.email} berhasil diubah menjadi ${targetRole}!`
        )
        setUsersList((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? { ...u, role: targetRole, updated_at: res.data.updated_at } : u))
        )
        setIsRoleDialogOpen(false)
      } else {
        const errorText = typeof res.errors === "string" ? res.errors : res.message
        setErrorMessage(errorText || "Gagal memperbarui peran pengguna")
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memperbarui peran")
    } finally {
      setIsUpdatingRole(false)
    }
  }

  // ================= CAMPAIGN ACTION HANDLERS =================

  // 1. Approve Campaign (PATCH /campaigns/{id}/approve)
  const handleApproveCampaign = async (camp) => {
    if (!camp?.id) return
    setIsActionLoading(true)
    setErrorMessage("")
    setSuccessMessage("")
    try {
      const res = await approveCampaignApi(camp.id, token)
      if (res.success) {
        setSuccessMessage(`Kampanye "${camp.title}" berhasil disetujui (APPROVED)!`)
        loadCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal menyetujui kampanye")
      }
    } catch (e) {
      setErrorMessage(e.message || "Terjadi kesalahan saat menyetujui kampanye")
    } finally {
      setIsActionLoading(false)
    }
  }

  // 2. Open Reject Dialog
  const openRejectDialog = (camp) => {
    setSelectedCampaign(camp)
    setRejectionReason("")
    setIsRejectDialogOpen(true)
  }

  // Confirm Reject (PATCH /campaigns/{id}/reject)
  const handleConfirmReject = async () => {
    if (!selectedCampaign?.id) return
    if (!rejectionReason.trim()) {
      setErrorMessage("Mohon sertakan alasan penolakan kampanye.")
      return
    }
    setIsActionLoading(true)
    setErrorMessage("")
    try {
      const res = await rejectCampaignApi(selectedCampaign.id, rejectionReason.trim(), token)
      if (res.success) {
        setSuccessMessage(`Kampanye "${selectedCampaign.title}" telah ditolak.`)
        setIsRejectDialogOpen(false)
        loadCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal menolak kampanye")
      }
    } catch (e) {
      setErrorMessage(e.message || "Terjadi kesalahan saat menolak kampanye")
    } finally {
      setIsActionLoading(false)
    }
  }

  // 3. Open Edit Dialog
  const openEditDialog = (camp) => {
    setSelectedCampaign(camp)
    setEditTitle(camp.title || "")
    setEditDescription(camp.description || "")
    setEditImageUrl(camp.image_url || "")
    setEditTargetAmount(String(camp.target_amount || ""))
    setIsEditDialogOpen(true)
  }

  // Confirm Update (PATCH /campaigns/{id})
  const handleConfirmUpdate = async (e) => {
    e.preventDefault()
    if (!selectedCampaign?.id) return
    setIsActionLoading(true)
    setErrorMessage("")
    try {
      const payload = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        image_url: editImageUrl.trim(),
        target_amount: editTargetAmount.trim(),
      }
      const res = await updateCampaignApi(selectedCampaign.id, payload, token)
      if (res.success) {
        setSuccessMessage(`Data kampanye "${editTitle}" berhasil diperbarui!`)
        setIsEditDialogOpen(false)
        loadCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal memperbarui kampanye")
      }
    } catch (e) {
      setErrorMessage(e.message || "Terjadi kesalahan saat memperbarui kampanye")
    } finally {
      setIsActionLoading(false)
    }
  }

  // 4. Open Close Dialog (PATCH /campaigns/{id}/close)
  const openCloseDialog = (camp) => {
    setSelectedCampaign(camp)
    setIsCloseDialogOpen(true)
  }

  const handleConfirmClose = async () => {
    if (!selectedCampaign?.id) return
    setIsActionLoading(true)
    setErrorMessage("")
    try {
      const res = await closeCampaignApi(selectedCampaign.id, token)
      if (res.success) {
        setSuccessMessage(`Kampanye "${selectedCampaign.title}" resmi ditutup!`)
        setIsCloseDialogOpen(false)
        loadCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal menutup kampanye")
      }
    } catch (e) {
      setErrorMessage(e.message || "Terjadi kesalahan saat menutup kampanye")
    } finally {
      setIsActionLoading(false)
    }
  }

  // 5. Open Delete Dialog (DELETE /campaigns/{id})
  const openDeleteDialog = (camp) => {
    setSelectedCampaign(camp)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedCampaign?.id) return
    setIsActionLoading(true)
    setErrorMessage("")
    try {
      const res = await deleteCampaignApi(selectedCampaign.id, token)
      if (res.success) {
        setSuccessMessage(`Kampanye "${selectedCampaign.title}" telah dihapus!`)
        setIsDeleteDialogOpen(false)
        loadCampaigns()
      } else {
        setErrorMessage(res.message || res.errors || "Gagal menghapus kampanye")
      }
    } catch (e) {
      setErrorMessage(e.message || "Terjadi kesalahan saat menghapus kampanye")
    } finally {
      setIsActionLoading(false)
    }
  }

  // 6. View Donaturs Modal (GET /campaigns/{id}/donaturs)
  const openDonatursDialog = async (camp) => {
    setSelectedCampaign(camp)
    setIsDonatursDialogOpen(true)
    setIsLoadingDonaturs(true)
    try {
      const res = await getCampaignDonatursApi(camp.id)
      if (res.success && Array.isArray(res.data)) {
        setDonatursList(res.data)
      } else {
        setDonatursList([])
      }
    } catch (e) {
      console.warn("Gagal memuat donatur kampanye:", e)
      setDonatursList([])
    } finally {
      setIsLoadingDonaturs(false)
    }
  }

  // 7. View Disbursements Modal (GET /campaigns/{id}/disbursements)
  const openDisbursementsDialog = async (camp) => {
    setSelectedCampaign(camp)
    setIsDisbursementsDialogOpen(true)
    setIsLoadingDisbursements(true)
    try {
      const res = await getCampaignDisbursementsApi(camp.id)
      if (res.success && Array.isArray(res.data)) {
        setDisbursementsList(res.data)
      } else {
        setDisbursementsList([])
      }
    } catch (e) {
      console.warn("Gagal memuat pencairan kampanye:", e)
      setDisbursementsList([])
    } finally {
      setIsLoadingDisbursements(false)
    }
  }

  // ================= FILTERED DATA =================

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((item) => {
      const matchSearch =
        (item.name || "").toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (item.email || "").toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (item.wallet_address || "").toLowerCase().includes(userSearchTerm.toLowerCase())
      const matchRole = userRoleFilter === "ALL" || item.role === userRoleFilter
      return matchSearch && matchRole
    })
  }, [usersList, userSearchTerm, userRoleFilter])

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter((item) => {
      const matchSearch =
        (item.title || "").toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
        (item.id || "").toLowerCase().includes(campaignSearchTerm.toLowerCase())
      const matchStatus = campaignStatusFilter === "ALL" || item.status === campaignStatusFilter
      return matchSearch && matchStatus
    })
  }, [campaignsList, campaignSearchTerm, campaignStatusFilter])

  // Counters
  const countPending = campaignsList.filter((c) => c.status === "PENDING").length
  const countActive = campaignsList.filter((c) => c.status === "ACTIVE" || c.status === "APPROVED").length
  const countClosed = campaignsList.filter((c) => c.status === "CLOSED").length
  const countRejected = campaignsList.filter((c) => c.status === "REJECTED").length

  const getCampaignStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-extrabold flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-600" /> MENUNGGU PERSETUJUAN
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge className="bg-blue-100 text-blue-900 border-blue-300 text-[10px] font-extrabold flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-blue-600" /> DISETUJUI
          </Badge>
        )
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-600" /> AKTIF
          </Badge>
        )
      case "CLOSED":
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-extrabold flex items-center gap-1">
            <Lock className="h-3 w-3 text-slate-600" /> DITUTUP
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-900 border-rose-300 text-[10px] font-extrabold flex items-center gap-1">
            <XCircle className="h-3 w-3 text-rose-600" /> DITOLAK
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-bold">
            {status || "UNKNOWN"}
          </Badge>
        )
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-extrabold flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-amber-600" /> ADMIN
          </Badge>
        )
      case "INITIATOR":
        return (
          <Badge className="bg-sky-100 text-sky-900 border-sky-300 text-[10px] font-extrabold flex items-center gap-1">
            <UserCheck className="h-3 w-3 text-sky-600" /> INITIATOR
          </Badge>
        )
      case "DONOR":
      default:
        return (
          <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
            <HeartHandshake className="h-3 w-3 text-emerald-600" /> DONOR
          </Badge>
        )
    }
  }

  // 1. Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-xs text-muted-foreground font-medium">Memverifikasi hak akses administrator...</p>
      </div>
    )
  }

  // 2. Unauthorized State (Not an ADMIN)
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="rounded-3xl border-destructive/30 bg-white dark:bg-card shadow-xl text-center overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-600" />
          <CardHeader className="pt-8 pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3 shadow-inner">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-extrabold text-foreground">
              Akses Dibatasi: Khusus Administrator
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Halaman ini diperuntukkan secara eksklusif bagi administrator untuk mengelola hak akses akun donatur, peran inisiator, dan moderasi kampanye bencana.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 text-xs text-muted-foreground">
            <div className="rounded-xl bg-muted/60 p-3 text-left space-y-1">
              <div className="flex justify-between">
                <span>Status Akun:</span>
                <span className="font-semibold text-foreground">
                  {isAuthenticated ? "Terautentikasi" : "Belum Masuk"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Peran Akun Anda:</span>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {user?.role || "GUEST"}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-0 pb-8 px-6 flex flex-col gap-2">
            <Button asChild className="w-full font-bold shadow-md shadow-emerald-600/20 rounded-xl">
              <Link href="/auth/login">Masuk dengan Akun Admin</Link>
            </Button>
            <Button variant="outline" asChild className="w-full text-xs font-semibold rounded-xl border-emerald-200">
              <Link href="/dashboard">Kembali ke Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeWalletAddress =
    walletData.wallet_address || user?.wallet_address || "0x275E9554066767Cc65AaDAa5F4898D5E67bD0908"

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl space-y-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Panel Kontrol Administrator
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[10px] font-bold">
              Role: ADMIN
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Pusat Kendali Sistem & Moderasi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Kelola persetujuan kampanye bencana darurat, pantau alur pencairan dana, dan ubah hak akses pengguna dari <strong>DONOR</strong> menjadi <strong>INITIATOR</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === "campaigns") loadCampaigns()
              else loadUsers()
            }}
            disabled={isLoadingCampaigns || isLoadingUsers}
            className="rounded-xl border-emerald-200 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isLoadingCampaigns || isLoadingUsers ? "animate-spin" : ""}`} />
            Segarkan Data
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

      {/* Admin Wallet Card (via GET /api/v1/wallet) */}
      <Card className="rounded-3xl border-emerald-100 bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/40 dark:from-emerald-950/20 dark:via-card dark:to-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Alamat Wallet Administrator (Sepolia)
                </span>
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 text-[9px] font-bold">
                  Ethereum Sepolia
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  {formatAddress(activeWalletAddress)}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyWallet(activeWalletAddress)}
                  className="text-muted-foreground hover:text-emerald-700 cursor-pointer p-1"
                  title="Salin Alamat Wallet"
                >
                  {copiedAddress === activeWalletAddress ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <a
                  href={getAddressExplorerUrl(activeWalletAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-emerald-700 p-1"
                  title="Buka di Etherscan"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-card p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase">Saldo Kas Administrator</div>
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
          </div>
        </div>
      </Card>

      {/* Main Tab Navigation Buttons */}
      <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("campaigns")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
            activeTab === "campaigns"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-muted/60 text-muted-foreground hover:bg-emerald-50 hover:text-emerald-800"
          }`}
        >
          <Layers className="h-4 w-4" /> Moderasi & Manajemen Kampanye
          {countPending > 0 && (
            <span className="bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
              {countPending}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
            activeTab === "users"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-muted/60 text-muted-foreground hover:bg-emerald-50 hover:text-emerald-800"
          }`}
        >
          <Users className="h-4 w-4" /> Manajemen Pengguna & Peran Inisiator
          <span className="bg-muted text-foreground px-1.5 py-0.2 rounded-full text-[10px] font-bold">
            {usersList.length}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: MODERASI KAMPANYE ================= */}
      {activeTab === "campaigns" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-emerald-100 bg-white dark:bg-card p-4 shadow-xs">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Kampanye</span>
              <div className="text-2xl font-extrabold text-foreground mt-1">{campaignsList.length}</div>
              <span className="text-[10px] text-muted-foreground">Semua status program</span>
            </Card>

            <Card className="rounded-2xl border-amber-200 bg-amber-50/40 dark:bg-card p-4 shadow-xs">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase">Perlu Disetujui</span>
              <div className="text-2xl font-extrabold text-amber-900 dark:text-amber-300 mt-1">{countPending}</div>
              <span className="text-[10px] text-amber-800/80">Status PENDING</span>
            </Card>

            <Card className="rounded-2xl border-emerald-200 bg-emerald-50/40 dark:bg-card p-4 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase">Aktif / Disetujui</span>
              <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">{countActive}</div>
              <span className="text-[10px] text-emerald-800/80">Menerima donasi</span>
            </Card>

            <Card className="rounded-2xl border-rose-100 bg-rose-50/30 dark:bg-card p-4 shadow-xs">
              <span className="text-[11px] font-bold text-rose-900 dark:text-rose-300 uppercase">Ditolak / Ditutup</span>
              <div className="text-2xl font-extrabold text-rose-900 dark:text-rose-300 mt-1">{countRejected + countClosed}</div>
              <span className="text-[10px] text-rose-800/80">{countRejected} ditolak, {countClosed} selesai</span>
            </Card>
          </div>

          {/* Filter Bar */}
          <Card className="rounded-2xl border-emerald-100 bg-white dark:bg-card p-4 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Cari judul, ID, atau deskripsi..."
                  value={campaignSearchTerm}
                  onChange={(e) => setCampaignSearchTerm(e.target.value)}
                  className="pl-9 text-xs rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                />
              </div>

              {/* Status Filter Badges */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Status:
                </span>
                {["ALL", "PENDING", "APPROVED", "ACTIVE", "CLOSED", "REJECTED"].map((st) => (
                  <Button
                    key={st}
                    variant={campaignStatusFilter === st ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCampaignStatusFilter(st)}
                    className={`rounded-xl text-[11px] h-8 px-3 font-semibold ${
                      campaignStatusFilter === st
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border-emerald-200 text-foreground hover:bg-emerald-50"
                    }`}
                  >
                    {st === "ALL" ? "Semua" : st}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Campaigns Table Card */}
          <Card className="rounded-3xl border-emerald-100 bg-white dark:bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-600" /> Daftar Kampanye Bencana (GET /api/v1/campaigns/all)
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Menampilkan {filteredCampaigns.length} kampanye tanggap darurat
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingCampaigns ? (
                <div className="p-12 text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
                  <p className="text-xs text-muted-foreground font-medium">Memuat data kampanye dari server...</p>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <HeartHandshake className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-bold text-foreground">Tidak Ada Kampanye yang Ditemukan</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Belum ada kampanye bencana dengan kriteria pencarian atau status yang dipilih.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50">
                        <TableHead className="w-14 text-xs font-bold text-emerald-950">Foto</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950">Kampanye Bencana</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950">Target (ETH)</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950">Status</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950">Dibuat Pada</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950 text-right">Aksi Moderasi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((camp) => (
                        <TableRow key={camp.id} className="hover:bg-emerald-50/30 transition-colors">
                          <TableCell className="p-3">
                            <img
                              src={camp.image_url || "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=200&q=80"}
                              alt={camp.title}
                              className="h-12 w-12 rounded-xl object-cover border border-emerald-100"
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <div className="font-bold text-xs text-foreground line-clamp-1">
                              {camp.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-md mt-0.5">
                              {camp.description}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <span className="font-mono bg-muted px-1 rounded">ID: {camp.id?.slice(0, 8)}...</span>
                              {camp.rejection_reason && (
                                <span className="text-rose-700 bg-rose-50 px-1 rounded font-semibold">
                                  Alasan: {camp.rejection_reason}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-3 font-mono text-xs font-extrabold text-emerald-700">
                            {camp.target_amount} ETH
                          </TableCell>
                          <TableCell className="p-3">
                            {getCampaignStatusBadge(camp.status)}
                          </TableCell>
                          <TableCell className="p-3 text-[11px] text-muted-foreground">
                            {camp.created_at ? formatDate(camp.created_at) : "-"}
                          </TableCell>
                          <TableCell className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* 1. APPROVE BUTTON (For PENDING) */}
                              {camp.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveCampaign(camp)}
                                  disabled={isActionLoading}
                                  className="h-8 px-2.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs gap-1"
                                  title="Setujui Kampanye (PATCH /campaigns/{id}/approve)"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" /> Setujui
                                </Button>
                              )}

                              {/* 2. REJECT BUTTON (For PENDING) */}
                              {camp.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openRejectDialog(camp)}
                                  disabled={isActionLoading}
                                  className="h-8 px-2.5 text-[11px] font-bold border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg gap-1"
                                  title="Tolak Kampanye (PATCH /campaigns/{id}/reject)"
                                >
                                  <Ban className="h-3.5 w-3.5" /> Tolak
                                </Button>
                              )}

                              {/* 3. CLOSE BUTTON (For ACTIVE / APPROVED) */}
                              {(camp.status === "ACTIVE" || camp.status === "APPROVED") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openCloseDialog(camp)}
                                  disabled={isActionLoading}
                                  className="h-8 px-2.5 text-[11px] font-semibold border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg gap-1"
                                  title="Tutup Kampanye (PATCH /campaigns/{id}/close)"
                                >
                                  <Lock className="h-3.5 w-3.5" /> Tutup
                                </Button>
                              )}

                              {/* 4. LIHAT DONATUR */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDonatursDialog(camp)}
                                className="h-8 px-2 text-[11px] font-semibold border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-lg gap-1"
                                title="Lihat Daftar Donatur (GET /campaigns/{id}/donaturs)"
                              >
                                <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" /> Donatur
                              </Button>

                              {/* 5. LIHAT PENCAIRAN */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDisbursementsDialog(camp)}
                                className="h-8 px-2 text-[11px] font-semibold border-teal-200 text-teal-800 hover:bg-teal-50 rounded-lg gap-1"
                                title="Lihat Pencairan Dana (GET /campaigns/{id}/disbursements)"
                              >
                                <DollarSign className="h-3.5 w-3.5 text-teal-600" /> Pencairan
                              </Button>

                              {/* 6. EDIT KAMPANYE */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditDialog(camp)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-700 rounded-lg"
                                title="Edit Info Kampanye (PATCH /campaigns/{id})"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>

                              {/* 7. HAPUS KAMPANYE */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openDeleteDialog(camp)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                                title="Hapus Kampanye (DELETE /campaigns/{id})"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>

                              {/* 8. DETAIL PUBLIK */}
                              <Button
                                size="sm"
                                variant="ghost"
                                asChild
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-700 rounded-lg"
                                title="Lihat Halaman Publik"
                              >
                                <Link href={`/campaign/${camp.id}`} target="_blank">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 2: MANAJEMEN PENGGUNA ================= */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="rounded-2xl border-emerald-100 bg-white dark:bg-card p-4 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Cari nama, email, atau wallet..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-9 text-xs rounded-xl border-emerald-200 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Filter Peran:
                </span>
                {["ALL", "DONOR", "INITIATOR", "ADMIN"].map((r) => (
                  <Button
                    key={r}
                    variant={userRoleFilter === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserRoleFilter(r)}
                    className={`rounded-xl text-[11px] h-8 px-3 font-semibold ${
                      userRoleFilter === r
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border-emerald-200 text-foreground hover:bg-emerald-50"
                    }`}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-emerald-100 bg-white dark:bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-emerald-50">
              <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" /> Daftar Pengguna Terdaftar (GET /api/v1/users)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Menampilkan {filteredUsers.length} pengguna terdaftar
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingUsers ? (
                <div className="p-12 text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
                  <p className="text-xs text-muted-foreground font-medium">Memuat data pengguna...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <User className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-bold text-foreground">Tidak Ada Pengguna Ditemukan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50">
                        <TableHead className="text-xs font-bold text-emerald-950">Nama & Email</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950">Peran Akun</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950">Alamat Dompet Sepolia</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950">Terdaftar Pada</TableHead>
                        <TableHead className="text-xs font-bold text-emerald-950 text-right">Ubah Hak Akses</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((item) => (
                        <TableRow key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                          <TableCell className="p-3">
                            <div className="font-bold text-xs text-foreground">{item.name || "Pengguna"}</div>
                            <div className="text-[11px] text-muted-foreground">{item.email}</div>
                          </TableCell>
                          <TableCell className="p-3">{getRoleBadge(item.role)}</TableCell>
                          <TableCell className="p-3 font-mono text-xs">
                            <div className="flex items-center gap-1.5">
                              <span>{formatAddress(item.wallet_address)}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyWallet(item.wallet_address)}
                                className="text-muted-foreground hover:text-emerald-700 p-1"
                              >
                                {copiedAddress === item.wallet_address ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="p-3 text-[11px] text-muted-foreground">
                            {item.created_at ? formatDate(item.created_at) : "-"}
                          </TableCell>
                          <TableCell className="p-3 text-right">
                            {item.role === "ADMIN" ? (
                              <span className="text-[11px] font-semibold text-muted-foreground italic">Admin Sistem</span>
                            ) : item.role === "DONOR" ? (
                              <Button
                                size="sm"
                                onClick={() => openRoleDialog(item, "INITIATOR")}
                                className="h-8 px-3 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs gap-1"
                              >
                                <UserCheck className="h-3.5 w-3.5" /> Jadikan INITIATOR
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openRoleDialog(item, "DONOR")}
                                className="h-8 px-3 text-xs font-bold border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl gap-1"
                              >
                                <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" /> Kembalikan ke DONOR
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= MODAL 1: TOLAK KAMPANYE ================= */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-rose-200 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Ban className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Tolak Pengajuan Kampanye
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">PATCH /campaigns/{selectedCampaign?.id}/reject</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              Kampanye: <strong>{selectedCampaign?.title}</strong>
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="rejectionReason" className="text-xs font-bold text-foreground">
                Alasan Penolakan Administratif
              </Label>
              <textarea
                id="rejectionReason"
                rows={3}
                placeholder="Contoh: Dokumen verifikasi lokasi bencana belum lengkap atau target dana melebihi ketentuan..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-xl border border-rose-200 bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isActionLoading}
              onClick={() => setIsRejectDialogOpen(false)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isActionLoading}
              onClick={handleConfirmReject}
              className="w-full sm:flex-1 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-5 text-xs gap-2"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
              Konfirmasi Tolak Kampanye
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 2: EDIT KAMPANYE ================= */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg p-6 rounded-3xl border-emerald-200 shadow-2xl bg-white dark:bg-card">
          <form onSubmit={handleConfirmUpdate} className="space-y-4">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-foreground">
                    Perbarui Data Kampanye Bencana
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    API: <code className="font-mono text-[11px] bg-muted px-1 rounded">PATCH /campaigns/{selectedCampaign?.id}</code>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="editCampTitle" className="text-xs font-bold text-foreground">
                  Judul Kampanye
                </Label>
                <Input
                  id="editCampTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xs rounded-xl border-emerald-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editCampTarget" className="text-xs font-bold text-foreground">
                  Target Donasi (ETH)
                </Label>
                <Input
                  id="editCampTarget"
                  type="text"
                  value={editTargetAmount}
                  onChange={(e) => setEditTargetAmount(e.target.value)}
                  className="font-mono text-xs font-bold rounded-xl border-emerald-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editCampImage" className="text-xs font-bold text-foreground">
                  URL Gambar Dokumentasi
                </Label>
                <Input
                  id="editCampImage"
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="text-xs rounded-xl border-emerald-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editCampDesc" className="text-xs font-bold text-foreground">
                  Deskripsi Bencana
                </Label>
                <textarea
                  id="editCampDesc"
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
                disabled={isActionLoading}
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isActionLoading}
                className="w-full sm:flex-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 text-xs gap-2"
              >
                {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 3: TUTUP KAMPANYE ================= */}
      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-amber-200 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Tutup Penggalangan Kampanye
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">PATCH /campaigns/{selectedCampaign?.id}/close</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <p className="text-xs text-muted-foreground py-2 leading-relaxed">
            Apakah Anda yakin ingin menutup kampanye <strong>"{selectedCampaign?.title}"</strong>? Setelah ditutup, program tidak akan lagi menerima donasi baru dari publik.
          </p>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isActionLoading}
              onClick={() => setIsCloseDialogOpen(false)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isActionLoading}
              onClick={handleConfirmClose}
              className="w-full sm:flex-1 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-5 text-xs gap-2"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Ya, Tutup Kampanye
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 4: HAPUS KAMPANYE ================= */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">DELETE /campaigns/{selectedCampaign?.id}</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Tindakan ini permanen. Kampanye "{selectedCampaign?.title}" akan dihapus dari basis data sistem.</span>
          </div>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isActionLoading}
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isActionLoading}
              onClick={handleConfirmDelete}
              className="w-full sm:flex-1 font-bold bg-destructive hover:bg-destructive/90 text-white rounded-xl py-5 text-xs gap-2"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 5: DAFTAR DONATUR ================= */}
      <Dialog open={isDonatursDialogOpen} onOpenChange={setIsDonatursDialogOpen}>
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
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">GET /campaigns/{selectedCampaign?.id}/donaturs</code>
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
                <p className="text-xs text-muted-foreground">Memuat data donatur dari blockchain...</p>
              </div>
            ) : donatursList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-muted/40 space-y-1">
                <p className="text-xs font-bold text-foreground">Belum Ada Donatur</p>
                <p className="text-[11px] text-muted-foreground">Kampanye ini belum menerima donasi dari donatur.</p>
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
              onClick={() => setIsDonatursDialogOpen(false)}
              className="w-full text-xs font-semibold rounded-xl border-emerald-200"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 6: DAFTAR PENCAIRAN (DISBURSEMENTS) ================= */}
      <Dialog open={isDisbursementsDialogOpen} onOpenChange={setIsDisbursementsDialogOpen}>
        <DialogContent className="max-w-2xl p-6 rounded-3xl border-teal-200 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Riwayat Pencairan Dana (Disbursements)
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">GET /campaigns/{selectedCampaign?.id}/disbursements</code>
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
                <p className="text-[11px] text-muted-foreground">Belum ada dana yang dicairkan untuk kebutuhan posko bencana ini.</p>
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
              onClick={() => setIsDisbursementsDialogOpen(false)}
              className="w-full text-xs font-semibold rounded-xl border-teal-200"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 7: UBAH ROLE USER ================= */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl border-emerald-200/90 shadow-2xl bg-white dark:bg-card">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Konfirmasi Perubahan Peran
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  API: <code className="font-mono text-[11px] bg-muted px-1 rounded">PATCH /api/v1/users/{selectedUser?.id}/role</code>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="rounded-2xl bg-muted/40 p-3.5 space-y-2 text-xs border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nama Pengguna:</span>
                  <span className="font-bold text-foreground">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-foreground">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Peran Saat Ini:</span>
                  <span>{getRoleBadge(selectedUser.role)}</span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">Peran Baru yang Diberikan:</span>
                  <span>{getRoleBadge(targetRole)}</span>
                </div>
              </div>

              {targetRole === "INITIATOR" ? (
                <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 p-3 border border-sky-200/80 text-[11px] text-sky-900 dark:text-sky-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-sky-600" /> Hak Akses INITIATOR:
                  </p>
                  <p className="leading-relaxed">
                    Pengguna ini akan memiliki kewenangan membuat kampanye tanggap darurat bencana baru dan mengajukan pencairan dana pada smart contract.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
                  Pengguna ini akan kembali menjadi <strong>DONOR</strong> standar yang berpartisipasi dalam penyaluran donasi bencana.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isUpdatingRole}
              onClick={() => setIsRoleDialogOpen(false)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl border-emerald-200"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isUpdatingRole}
              onClick={handleConfirmRoleChange}
              className={`w-full sm:flex-1 font-bold shadow-md rounded-xl py-5 text-xs gap-2 ${
                targetRole === "INITIATOR"
                  ? "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
              }`}
            >
              {isUpdatingRole ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memperbarui Peran...
                </>
              ) : (
                <>
                  Simpan Peran {targetRole} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
