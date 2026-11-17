import React, { useState } from "react"
import { ExternalLink, Search, Copy, Check, ShieldCheck } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatRupiah, formatAddress } from "@/lib/formatters"
import { getTxExplorerUrl } from "@/services/web3Provider"

export default function AuditTrailTable({ transactions = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedHash, setCopiedHash] = useState(null)

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const filteredTransactions = transactions.filter((tx) => {
    const term = searchTerm.toLowerCase()
    return (
      tx.txHash?.toLowerCase().includes(term) ||
      tx.campaignId?.toLowerCase().includes(term) ||
      tx.donorWallet?.toLowerCase().includes(term) ||
      tx.donorFullWallet?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-4">
      {/* Search and summary bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
          <Input
            placeholder="Cari Tx Hash / ID Kampanye / Wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs rounded-xl border-emerald-200 focus-visible:ring-emerald-500 bg-white dark:bg-card"
          />
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span>Menampilkan <strong className="text-emerald-800 dark:text-emerald-300">{filteredTransactions.length}</strong> transaksi on-chain</span>
          <Badge variant="outline" className="text-[11px] bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold">
            Sepolia Testnet
          </Badge>
        </div>
      </div>

      {/* Table with Clean White & Caring Green Styling */}
      <div className="rounded-2xl border border-emerald-100 bg-white dark:bg-card shadow-sm shadow-emerald-600/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-emerald-50/60">
            <TableRow className="border-emerald-100">
              <TableHead className="w-[170px] text-xs font-bold text-emerald-950 dark:text-emerald-200">Timestamp</TableHead>
              <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">ID Kampanye</TableHead>
              <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Alamat Wallet Donatur</TableHead>
              <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Nominal (IDR)</TableHead>
              <TableHead className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Status On-Chain</TableHead>
              <TableHead className="text-right text-xs font-bold text-emerald-950 dark:text-emerald-200">Action Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Tidak ada transaksi yang cocok dengan kata kunci pencarian.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => {
                const isCopied = copiedHash === tx.txHash
                const explorerUrl = getTxExplorerUrl(tx.txHash)

                return (
                  <TableRow key={tx.txHash} className="hover:bg-emerald-50/40 border-emerald-100/60 transition-colors">
                    {/* Timestamp */}
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {tx.timestamp}
                    </TableCell>

                    {/* ID Kampanye */}
                    <TableCell className="text-xs font-semibold">
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900 border border-emerald-200/60">
                        {tx.campaignId}
                      </span>
                    </TableCell>

                    {/* Alamat Wallet Donatur */}
                    <TableCell className="text-xs font-mono font-medium">
                      <span title={tx.donorFullWallet || tx.donorWallet} className="text-foreground">
                        {formatAddress(tx.donorFullWallet || tx.donorWallet)}
                      </span>
                    </TableCell>

                    {/* Nominal IDR */}
                    <TableCell className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                      {formatRupiah(tx.amount)}
                    </TableCell>

                    {/* Status On-Chain */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-bold gap-1"
                      >
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        {tx.status || "Confirmed"}
                      </Badge>
                    </TableCell>

                    {/* Action Link to Sepolia Etherscan */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-emerald-800 hover:bg-emerald-50"
                          onClick={() => handleCopy(tx.txHash)}
                          title="Salin Tx Hash"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 rounded-lg border-emerald-200 font-semibold text-emerald-800" asChild>
                          <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka di Sepolia Etherscan"
                          >
                            <span>Etherscan</span>
                            <ExternalLink className="h-3 w-3 text-emerald-600" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
