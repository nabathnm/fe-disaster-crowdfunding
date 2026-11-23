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
        // Redirect to dashboard or back
        router.push("/dashboard")
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/40 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <Card className="rounded-3xl border-emerald-100/90 bg-white dark:bg-card shadow-xl shadow-emerald-600/5 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          <CardHeader className="space-y-2 text-center pt-8 pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 mb-1">
              <Heart className="h-6 w-6 fill-white/20" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-100">
              Masuk ke PeduliChain
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground max-w-xs mx-auto">
              Akses dashboard donatur Anda dan pantau seluruh transaksi on-chain.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2 animate-in fade-in-50">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Alamat Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-xs rounded-xl border-emerald-200 focus-visible:ring-emerald-500 bg-emerald-50/20"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    Kata Sandi
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 text-xs rounded-xl border-emerald-200 focus-visible:ring-emerald-500 bg-emerald-50/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold shadow-md shadow-emerald-600/20 rounded-xl py-5 text-sm gap-2 mt-2"
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

          <CardFooter className="pt-2 pb-6 px-6 text-center justify-center border-t border-emerald-100/60 mt-4">
            <p className="text-xs text-muted-foreground">
              Belum memiliki akun?{" "}
              <Link href="/auth/register" className="font-bold text-emerald-700 hover:underline">
                Daftar Akun Baru
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
