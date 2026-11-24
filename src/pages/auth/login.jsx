import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!email.trim() || !password) {
      setErrorMessage("Email dan password wajib diisi")
      return
    }

    setIsLoading(true)

    try {
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      })

      if (res.success) {
        // Auto-redirect berdasarkan 3 jenis peran: ADMIN -> /admin, INITIATOR -> /initiator, DONOR -> /dashboard
        const role = res.user?.role
        if (role === "ADMIN") {
          router.push("/admin")
        } else if (role === "INITIATOR") {
          router.push("/initiator")
        } else {
          router.push("/dashboard")
        }
      } else {
        const errorText = typeof res.errors === "string" ? res.errors : res.message
        setErrorMessage(errorText || "Email atau kata sandi tidak valid")
      }
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat masuk")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="rounded-lg border border-slate-200 bg-white shadow-none overflow-hidden">
          <CardHeader className="space-y-1.5 text-center pt-8 pb-4">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white mb-2">
              <Heart className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
              Masuk ke Becak
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 max-w-xs mx-auto">
              Akses dashboard donatur Anda dan pantau seluruh transaksi on-chain.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-900 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

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
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
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
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-none py-2.5 text-sm gap-2 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    Masuk Sekarang <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-3 pb-6 px-6 text-center justify-center border-t border-slate-100 mt-4">
            <p className="text-xs text-slate-500">
              Belum memiliki akun?{" "}
              <Link href="/auth/register" className="font-semibold text-emerald-700 hover:underline">
                Daftar Akun Baru
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
