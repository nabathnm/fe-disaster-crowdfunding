import axios from "axios"

/**
 * 1. GET /transactions/me
 * Mengambil daftar riwayat transaksi milik user yang sedang login
 * Query: type ("TOPUP" | "DONATION" | undefined)
 * Returns: ApiResponse_TransactionResponse-Array_
 */
export async function getMyTransactionsApi(type, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? (localStorage.getItem("becak_token") || localStorage.getItem("pedulichain_token")) : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const params = type && type !== "ALL" ? { type } : {}
    const response = await axios.get("/api/v1/transactions/me", {
      headers,
      params,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal memuat transaksi saya",
      errors: null,
      data: [],
    }
  }
}

/**
 * 2. GET /transactions/{id}
 * Mengambil detail satu transaksi spesifik
 * Returns: ApiResponse_TransactionResponse_
 */
export async function getTransactionByIdApi(id, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? (localStorage.getItem("becak_token") || localStorage.getItem("pedulichain_token")) : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.get(`/api/v1/transactions/${id}`, {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal memuat detail transaksi",
      errors: null,
      data: null,
    }
  }
}
