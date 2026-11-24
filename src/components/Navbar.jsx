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
    <header className="sticky top-0 z-40 w-full border-b border-emerald-700/60 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md shadow-emerald-950/20 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-md shadow-emerald-950/30 transition-transform duration-200 group-hover:scale-105">
            <Heart className="h-5 w-5 fill-emerald-800" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">
                PeduliChain
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span className="text-[10px] text-emerald-200/90 font-medium tracking-wide">
              Tanggap Bencana & Web3
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-emerald-950/40 p-1 rounded-xl border border-emerald-700/60 backdrop-blur-xs">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = router.pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white text-emerald-950 font-bold shadow-sm"
                      : "text-emerald-100/90 hover:bg-emerald-800/60 hover:text-white"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-700" : "text-emerald-300"}`} />
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Right Section: Network Badge & Auth */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 py-1 px-2.5 bg-emerald-950/60 text-emerald-200 border-emerald-600/70 text-[11px] font-semibold"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            Sepolia Testnet
          </Badge>

          {/* User Auth Info */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-700/60 ml-1">
              <div className="flex items-center gap-2 bg-emerald-950/50 py-1 px-2.5 rounded-xl border border-emerald-600/50 text-xs">
                <div className="h-6 w-6 rounded-lg bg-white text-emerald-900 flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white text-[11px] leading-tight">
                    {user.name}
                  </span>
                  {user.wallet_address && (
                    <button
                      type="button"
                      onClick={() => handleCopy(user.wallet_address)}
                      className="font-mono text-[10px] text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      title="Salin Wallet Address"
                    >
                      <span>{formatAddress(user.wallet_address)}</span>
                      {copiedWallet ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                    </button>
                  )}
                </div>
                <Badge
                  className={
                    user.role === "ADMIN"
                      ? "bg-amber-500/30 text-amber-200 border-amber-400/40 text-[9px] py-0 px-1 font-bold"
                      : user.role === "INITIATOR"
                      ? "bg-sky-500/30 text-sky-200 border-sky-400/40 text-[9px] py-0 px-1 font-bold"
                      : "bg-emerald-500/30 text-emerald-200 border-emerald-400/40 text-[9px] py-0 px-1 font-bold"
                  }
                >
                  {user.role || "DONOR"}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 px-2 text-xs text-emerald-200 hover:text-white hover:bg-emerald-800/80"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-700/60 ml-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 text-xs font-semibold text-emerald-100 hover:text-white hover:bg-emerald-800/80"
              >
                <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="h-8 text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 shadow-md shadow-emerald-950/30"
              >
                <Link href="/auth/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && user && (
            <span className="sm:hidden font-mono text-[10px] font-bold text-emerald-200 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-600/60">
              {formatAddress(user.wallet_address)}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="h-9 w-9 text-emerald-100 hover:bg-emerald-800/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-emerald-700 bg-emerald-950/98 px-4 py-4 lg:hidden animate-in fade-in-0 duration-150 space-y-3 shadow-xl">
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/60 space-y-1 text-white">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{user.name}</span>
                <Badge
                  className={
                    user.role === "ADMIN"
                      ? "bg-amber-500/30 text-amber-200 border-amber-400/40 text-[10px] font-bold"
                      : user.role === "INITIATOR"
                      ? "bg-sky-500/30 text-sky-200 border-sky-400/40 text-[10px] font-bold"
                      : "bg-emerald-500/30 text-emerald-200 border-emerald-400/30 text-[10px] font-bold"
                  }
                >
                  {user.role || "DONOR"}
                </Badge>
              </div>
              <p className="text-[11px] text-emerald-300/80">{user.email}</p>
              {user.wallet_address && (
                <div className="font-mono text-[11px] text-emerald-300 break-all pt-1">
                  {user.wallet_address}
                </div>
              )}
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-emerald-950 font-bold"
                      : "text-emerald-100 hover:bg-emerald-900/60 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-700" : "text-emerald-400"}`} />
                  {link.label}
                </Link>
              )
            })}

            <div className="pt-3 border-t border-emerald-800 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-xs gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" /> Keluar dari Akun
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-xs font-semibold bg-emerald-900/40 text-white border-emerald-600/70 hover:bg-emerald-800"
                  >
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      Masuk
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="text-xs font-bold bg-white text-emerald-950 hover:bg-emerald-50"
                  >
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      Daftar
                    </Link>
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className="bg-emerald-900/60 text-emerald-200 border-emerald-700 text-xs">
                  Sepolia Testnet
                </Badge>
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-300 font-medium flex items-center gap-1 hover:text-white"
                >
                  Etherscan <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
