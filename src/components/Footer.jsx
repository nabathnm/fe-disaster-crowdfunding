import React from "react"
import Link from "next/link"
import { Heart, ExternalLink, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Footer() {
  return (
    <footer className="border-t border-emerald-800/60 bg-emerald-950 text-emerald-100 py-8 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Mini Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-900 shadow-sm transition-transform group-hover:scale-105">
              <Heart className="h-4 w-4 fill-emerald-900" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  PeduliChain
                </span>
                <Badge className="bg-emerald-800/80 text-emerald-200 border-emerald-700/60 text-[10px] py-0 px-1.5 font-semibold">
                  Sepolia
                </Badge>
              </div>
              <span className="text-[11px] text-emerald-300/70">
                Disaster Relief Crowdfunding & Blockchain
              </span>
            </div>
          </Link>

          {/* Minimalist Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-emerald-200/90">
            <Link href="/" className="hover:text-white transition-colors">
              Katalog
            </Link>
            <Link href="/audit" className="hover:text-white transition-colors">
              Audit Trail
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Panel Admin
            </Link>
            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1 text-emerald-300"
            >
              Etherscan <ExternalLink className="h-3 w-3" />
            </a>
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs text-emerald-300/80 bg-emerald-900/40 py-1.5 px-3 rounded-full border border-emerald-800/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-medium text-[11px]">Ethereum Sepolia Active</span>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="my-6 border-t border-emerald-900/60" />

        {/* Minimal Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-emerald-400/70">
          <p>© 2026 PeduliChain. Platform donasi tanggap bencana terdesentralisasi.</p>
          <div className="flex items-center gap-4">
            <Link href="/audit" className="hover:text-emerald-200 transition-colors">
              Transparansi On-Chain
            </Link>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Midtrans Snap Encrypted
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
