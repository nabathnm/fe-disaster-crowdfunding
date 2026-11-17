import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Heart, ShieldCheck, HeartHandshake, FileText, LayoutDashboard, Menu, X, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Katalog Kampanye", icon: HeartHandshake },
    { href: "/audit", label: "Transparency Audit", icon: FileText },
    { href: "/dashboard", label: "Dashboard Donatur", icon: LayoutDashboard },
  ]

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
        <nav className="hidden md:flex items-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/30 p-1 rounded-xl border border-emerald-100/60 dark:border-emerald-900/30">
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

        {/* Sepolia Badge & Action */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 py-1 px-3 bg-emerald-50 text-emerald-700 border-emerald-200/80 text-xs font-semibold shadow-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sepolia Testnet
          </Badge>
          <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold">
            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              Explorer <ExternalLink className="h-3 w-3 text-emerald-600" />
            </a>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
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
        <div className="border-b border-emerald-100 bg-white/95 dark:bg-card/95 px-4 py-4 md:hidden animate-in fade-in-0 duration-150">
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
            <div className="pt-3 border-t border-emerald-100 mt-2 flex items-center justify-between">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Ethereum Sepolia
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
          </nav>
        </div>
      )}
    </header>
  )
}
