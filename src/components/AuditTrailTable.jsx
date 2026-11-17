import React, { useState } from "react"
import { ExternalLink, Search, Copy, Check, ShieldCheck, ArrowUpDown } from "lucide-react"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari Tx Hash / ID Kampanye / Wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span>Menampilkan <strong>{filteredTransactions.length}</strong> transaksi on-chain</span>
          <Badge variant="outline" className="text-[11px] bg-muted">
            Sepolia Testnet
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[170px] text-xs font-semibold">Timestamp</TableHead>
              <TableHead className="text-xs font-semibold">ID Kampanye</TableHead>
              <TableHead className="text-xs font-semibold">Alamat Wallet Donatur</TableHead>
              <TableHead className="text-xs font-semibold">Nominal (IDR)</TableHead>
              <TableHead className="text-xs font-semibold">Status On-Chain</TableHead>
              <TableHead className="text-right text-xs font-semibold">Action Link</TableHead>
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
                  <TableRow key={tx.txHash} className="hover:bg-muted/40 transition-colors">
                    {/* Timestamp */}
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {tx.timestamp}
                    </TableCell>

                    {/* ID Kampanye */}
                    <TableCell className="text-xs font-medium">
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {tx.campaignId}
                      </span>
                    </TableCell>

                    {/* Alamat Wallet Donatur */}
                    <TableCell className="text-xs font-mono">
                      <span title={tx.donorFullWallet || tx.donorWallet}>
                        {formatAddress(tx.donorFullWallet || tx.donorWallet)}
                      </span>
                    </TableCell>

                    {/* Nominal IDR */}
                    <TableCell className="text-xs font-bold text-foreground">
                      {formatRupiah(tx.amount)}
                    </TableCell>

                    {/* Status On-Chain */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] font-medium gap-1"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {tx.status || "Confirmed"}
                      </Badge>
                    </TableCell>

                    {/* Action Link to Sepolia Etherscan */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopy(tx.txHash)}
                          title="Salin Tx Hash"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" asChild>
                          <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka di Sepolia Etherscan"
                          >
                            <span>Etherscan</span>
                            <ExternalLink className="h-3 w-3" />
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
