import React from "react"
import Link from "next/link"
import { Heart, ExternalLink, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white dark:bg-card text-slate-600 py-10 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Heart className="h-4 w-4 fill-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                PeduliChain
              </span>
              <span className="text-[11px] text-slate-500">
                Crowdfunding Kemanusiaan On-Chain
              </span>
            </div>
          </Link>

          {/* Minimalist Navigation */}
          <nav className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Katalog
            </Link>
            <Link href="/audit" className="hover:text-emerald-700 transition-colors">
              Audit Trail
            </Link>
            <Link href="/dashboard" className="hover:text-emerald-700 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="hover:text-emerald-700 transition-colors">
              Panel Admin
            </Link>
            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-700 transition-colors inline-flex items-center gap-1 text-slate-500"
            >
              Sepolia Etherscan <ExternalLink className="h-3 w-3" />
            </a>
          </nav>

          {/* Testnet Badge */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-50 py-1 px-3 rounded-full border border-slate-200/60">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Ethereum Sepolia Active</span>
          </div>
        </div>

        {/* Clean Line */}
        <div className="my-6 border-t border-slate-100" />

        {/* Minimal Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-400">
          <p>© 2026 PeduliChain. Platform donasi tanggap darurat terdesentralisasi.</p>
          <div className="flex items-center gap-4">
            <Link href="/audit" className="hover:text-slate-600 transition-colors">
              Transparansi Blockchain
            </Link>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Midtrans Snap Gateway
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
