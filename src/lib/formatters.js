/**
 * Helper formatter untuk angka, mata uang, alamat blockchain, dan tanggal
 */

export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "Rp 0"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatAddress(address) {
  if (!address || typeof address !== "string") return ""
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatDate(dateInput) {
  if (!dateInput) return "-"
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return String(dateInput)
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatPercent(collected, target) {
  if (!target || target <= 0) return 0
  const pct = Math.round((collected / target) * 100)
  return Math.min(pct, 100)
}
