import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  Heart,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Wallet,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { formatAddress } from "@/lib/formatters"
import { getAddressExplorerUrl } from "@/services/web3Provider"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [registeredData, setRegisteredData] = useState(null)
  const [copiedWallet, setCopiedWallet] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setFieldErrors({})

    if (!name.trim()) {
      setErrorMessage("Nama lengkap wajib diisi")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setErrorMessage("Alamat email wajib diisi")
      return
    } else if (!emailRegex.test(email.trim())) {
      setErrorMessage("Format email tidak valid (contoh: nama@domain.com)")
      return
    }

    if (password.length < 8) {
      setErrorMessage("Kata sandi minimal 8 karakter (sesuai standar keamanan)")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok")
      return
    }

    setIsLoading(true)

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      if (res.success && res.data) {
        setRegisteredData(res.data)
      } else {
        if (Array.isArray(res.errors)) {
          const mapped = {}
          const errorTexts = []
          res.errors.forEach((err) => {
            if (err.field) mapped[err.field] = err.message
            if (err.message) errorTexts.push(err.message)
          })
          setFieldErrors(mapped)
          setErrorMessage(errorTexts.join(", ") || res.message || "Validasi pendaftaran gagal (422)")
        } else if (typeof res.errors === "string") {
          setErrorMessage(res.errors)
        } else {
          setErrorMessage(res.message || "Gagal melakukan pendaftaran")
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan pada sistem")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyWallet = () => {
    if (registeredData?.wallet_address) {
      navigator.clipboard.writeText(registeredData.wallet_address)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 2000)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {registeredData ? (
          /* Success Screen displaying generated Ethereum Wallet */
          <Card className="rounded-lg border border-slate-200 bg-white shadow-none overflow-hidden">
            <CardHeader className="text-center pt-8 pb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mb-2">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <Badge className="mx-auto bg-slate-50 text-slate-700 border-slate-200 font-semibold text-xs rounded-md">
                Registrasi Berhasil
              </Badge>
              <CardTitle className="text-xl font-bold text-slate-900 mt-2">
                Selamat Datang, {registeredData.name}!
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Akun donatur Anda telah terdaftar aktif di PeduliChain.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-6">
              {/* Generated Wallet Address Box */}
              <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Dompet Ethereum Terbuat
                  </span>
                  <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 text-[10px] font-semibold rounded-md">
                    {registeredData.role || "DONOR"}
                  </Badge>
                </div>

                <div className="rounded-lg bg-white p-3 border border-slate-200 font-mono text-xs flex items-center justify-between gap-2">
                  <span className="break-all font-semibold text-slate-900 select-all">
                    {registeredData.wallet_address}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyWallet}
                    className="h-8 text-xs shrink-0 gap-1 font-semibold text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    {copiedWallet ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedWallet ? "Disalin" : "Salin"}
                  </Button>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dompet Ethereum ini dibuat otomatis oleh sistem dan terhubung ke smart contract bencana untuk
                  transparansi audit on-chain Anda.
                </p>
              </div>

              {/* Account summary list */}
              <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between text-slate-500">
                  <span>Email Terdaftar:</span>
                  <span className="font-semibold text-slate-900">{registeredData.email}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Peran Pengguna:</span>
                  <span className="font-semibold text-emerald-700">{registeredData.role}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-2 pb-8 px-6">
              <Button
                className="w-full font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none"
                onClick={() => router.push("/dashboard")}
              >
                Masuk ke Dashboard Donatur <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => router.push("/")}
              >
                Lihat Katalog Kampanye
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* Registration Form */
          <Card className="rounded-lg border border-slate-200 bg-white shadow-none overflow-hidden">
            <CardHeader className="space-y-1.5 text-center pt-8 pb-4">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white mb-2">
                <Heart className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
                Daftar Akun PeduliChain
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 max-w-xs mx-auto">
                Bergabunglah sebagai donatur tanggap bencana dengan transparansi penuh berbasis blockchain.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Global Error Banner */}
                {errorMessage && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-900 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Nama Lengkap */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                    Nama Lengkap
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      placeholder="Contoh: John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 text-xs rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500"
                      required
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-[11px] text-destructive">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Alamat Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 text-xs rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500"
                      required
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-destructive">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 text-xs rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-destructive">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
                    Konfirmasi Kata Sandi
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ulangi kata sandi"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 text-xs rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Auto wallet info banner */}
                <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700 flex items-start gap-2 border border-slate-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Dompet Ethereum Sepolia akan otomatis digenerate untuk akun Anda sebagai identitas donatur on-chain.
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none py-2.5 text-sm gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mendaftarkan Akun...
                    </>
                  ) : (
                    <>
                      Daftar Sekarang <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="pt-3 pb-6 px-6 text-center justify-center border-t border-slate-100 mt-4">
              <p className="text-xs text-slate-500">
                Sudah memiliki akun?{" "}
                <Link href="/auth/login" className="font-semibold text-emerald-700 hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
