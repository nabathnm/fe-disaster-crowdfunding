import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  Heart,
  ShieldCheck,
  HeartHandshake,
  FileText,
  LayoutDashboard,
  Menu,
  X,
  ExternalLink,
  User,
  LogOut,
  Wallet,
  Copy,
  Check,
  UserCheck,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { formatAddress } from "@/lib/formatters"

export default function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copiedWallet, setCopiedWallet] = useState(false)

  const navLinks = [
    { href: "/", label: "Katalog", icon: HeartHandshake },
    { href: "/audit", label: "Audit Trail", icon: FileText },
  ]

  if (isAuthenticated && user) {
    if (user.role === "ADMIN") {
      navLinks.push({ href: "/admin", label: "Panel Admin", icon: ShieldCheck })
      navLinks.push({ href: "/initiator", label: "Inisiator", icon: Layers })
      navLinks.push({ href: "/dashboard", label: "Donatur", icon: LayoutDashboard })
    } else if (user.role === "INITIATOR") {
      navLinks.push({ href: "/initiator", label: "Dashboard Inisiator", icon: Layers })
      navLinks.push({ href: "/dashboard", label: "Portal Donasi", icon: LayoutDashboard })
    } else {
      navLinks.push({ href: "/dashboard", label: "Dashboard Donatur", icon: LayoutDashboard })
    }
  } else {
    navLinks.push({ href: "/dashboard", label: "Dashboard Donatur", icon: LayoutDashboard })
  }

  const handleCopy = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 2000)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 dark:bg-card/95 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs transition-transform group-hover:scale-105">
            <Heart className="h-4.5 w-4.5 fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                PeduliChain
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Tanggap Bencana & Web3
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (Minimalist) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = router.pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-100/80"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Right Section: Testnet indicator & Auth */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-slate-50 border border-slate-200/60 text-[11px] font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Sepolia</span>
          </div>

          {/* User Auth */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200/80">
              <div className="flex items-center gap-2 py-1 px-2.5 rounded-xl border border-slate-200/80 bg-white text-xs">
                <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-[11px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-900 text-[11px] leading-tight">
                    {user.name}
                  </span>
                  {user.wallet_address && (
                    <button
                      type="button"
                      onClick={() => handleCopy(user.wallet_address)}
                      className="font-mono text-[10px] text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Salin Wallet Address"
                    >
                      <span>{formatAddress(user.wallet_address)}</span>
                      {copiedWallet ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                    </button>
                  )}
                </div>
                <Badge
                  className={
                    user.role === "ADMIN"
                      ? "bg-amber-100 text-amber-900 border-amber-200 text-[9px] py-0 px-1 font-bold"
                      : user.role === "INITIATOR"
                      ? "bg-sky-100 text-sky-900 border-sky-200 text-[9px] py-0 px-1 font-bold"
                      : "bg-emerald-100 text-emerald-900 border-emerald-200 text-[9px] py-0 px-1 font-bold"
                  }
                >
                  {user.role || "DONOR"}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
                title="Keluar"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200/80">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
              >
                <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="h-8 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs rounded-lg px-3.5"
              >
                <Link href="/auth/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && user && (
            <span className="sm:hidden font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
              {formatAddress(user.wallet_address)}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="h-9 w-9 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-100 bg-white px-4 py-4 lg:hidden animate-in fade-in-0 duration-150 space-y-3">
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{user.name}</span>
                <Badge
                  className={
                    user.role === "ADMIN"
                      ? "bg-amber-100 text-amber-900 border-amber-200 text-[10px] font-bold"
                      : user.role === "INITIATOR"
                      ? "bg-sky-100 text-sky-900 border-sky-200 text-[10px] font-bold"
                      : "bg-emerald-100 text-emerald-900 border-emerald-200 text-[10px] font-bold"
                  }
                >
                  {user.role || "DONOR"}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500">{user.email}</p>
              {user.wallet_address && (
                <div className="font-mono text-[11px] text-slate-600 break-all pt-1">
                  {user.wallet_address}
                </div>
              )}
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-100/60"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full text-xs font-semibold text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" /> Keluar dari Akun
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" size="sm" asChild className="text-xs font-semibold border-slate-200">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
                </Button>
                <Button size="sm" asChild className="text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700">
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>Daftar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
