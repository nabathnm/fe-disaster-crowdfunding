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
    { href: "/", label: "Katalog Kampanye", icon: HeartHandshake },
    { href: "/audit", label: "Transparency Audit", icon: FileText },
    { href: "/dashboard", label: "Dashboard Donatur", icon: LayoutDashboard },
  ]

  const handleCopy = (address) => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 2000)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100/80 bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-sm shadow-emerald-500/5 transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 transition-transform duration-200 group-hover:scale-105">
            <Heart className="h-5 w-5 fill-white/20" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-emerald-950 dark:text-emerald-100">
                PeduliChain
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 font-medium tracking-wide">
              Disaster Relief & Web3
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/30 p-1 rounded-xl border border-emerald-100/60 dark:border-emerald-900/30">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = router.pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white dark:bg-card text-emerald-900 dark:text-emerald-200 font-bold shadow-sm shadow-emerald-900/5 border border-emerald-100/80"
                      : "text-muted-foreground hover:bg-white/60 dark:hover:bg-card/60 hover:text-emerald-800"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-600" : ""}`} />
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
            className="flex items-center gap-1.5 py-1 px-2.5 bg-emerald-50 text-emerald-700 border-emerald-200/80 text-[11px] font-semibold"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sepolia Testnet
          </Badge>

          {/* User Auth Info */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-emerald-100 ml-1">
              <div className="flex items-center gap-2 bg-emerald-50/60 dark:bg-emerald-950/30 py-1 px-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs">
                <div className="h-6 w-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-emerald-950 dark:text-emerald-100 text-[11px] leading-tight">
                    {user.name}
                  </span>
                  {user.wallet_address && (
                    <button
                      type="button"
                      onClick={() => handleCopy(user.wallet_address)}
                      className="font-mono text-[10px] text-muted-foreground hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      title="Salin Wallet Address"
                    >
                      <span>{formatAddress(user.wallet_address)}</span>
                      {copiedWallet ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                    </button>
                  )}
                </div>
                <Badge variant="outline" className="bg-white dark:bg-card text-emerald-700 border-emerald-200 text-[9px] py-0 px-1 font-bold">
                  {user.role || "DONOR"}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1 border-l border-emerald-100 ml-1">
              <Button variant="ghost" size="sm" asChild className="h-8 text-xs font-semibold text-emerald-900">
                <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button size="sm" asChild className="h-8 text-xs font-bold shadow-xs shadow-emerald-600/20">
                <Link href="/auth/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && user && (
            <span className="sm:hidden font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              {formatAddress(user.wallet_address)}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="h-9 w-9 text-emerald-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-emerald-100 bg-white/95 dark:bg-card/95 px-4 py-4 lg:hidden animate-in fade-in-0 duration-150 space-y-3">
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-950">{user.name}</span>
                <Badge className="bg-emerald-600 text-white text-[10px]">{user.role || "DONOR"}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{user.email}</p>
              {user.wallet_address && (
                <div className="font-mono text-[11px] text-emerald-800 break-all pt-1">
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
                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                      : "text-muted-foreground hover:bg-emerald-50/50"
                  }`}
                >
                  <Icon className="h-4 w-4 text-emerald-600" />
                  {link.label}
                </Link>
              )
            })}

            <div className="pt-3 border-t border-emerald-100 flex flex-col gap-2">
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
                  <Button variant="outline" size="sm" asChild className="text-xs font-semibold">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      Masuk
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="text-xs font-bold">
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      Daftar
                    </Link>
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                  Sepolia Testnet
                </Badge>
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 font-medium flex items-center gap-1"
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
