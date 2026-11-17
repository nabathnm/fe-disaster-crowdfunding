import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ShieldCheck, HeartHandshake, FileText, LayoutDashboard, Menu, X, ExternalLink } from "lucide-react"
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none">PeduliChain</span>
            <span className="text-[10px] text-muted-foreground font-normal">Disaster Crowdfunding</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = router.pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Sepolia Badge & Action */}
        <div className="hidden sm:flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sepolia Testnet
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Explorer <ExternalLink className="h-3 w-3" />
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
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t mt-2 flex items-center justify-between">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                Ethereum Sepolia
              </Badge>
              <a
                href="https://sepolia.etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground flex items-center gap-1"
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
