import axios from "axios"

/**
 * Get Wallet Information API
 * Endpoint: GET /api/v1/wallet
 * Headers: Authorization: Bearer <access_token>
 * Returns: { wallet_address, balance_eth, balance_wei, balance_idr, idr_per_eth }
 */
export async function getWalletApi(token) {
  try {
    const headers = {
      Accept: "application/json",
    }
    const activeToken = token || (typeof window !== "undefined" ? (localStorage.getItem("becak_token") || localStorage.getItem("pedulichain_token")) : null)
    if (activeToken) {
      headers.Authorization = `Bearer ${activeToken}`
    }

    const response = await axios.get("/api/v1/wallet", {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      return error.response.data
    }
    return {
      success: false,
      message: error.message || "Gagal mengambil data wallet",
      errors: null,
      data: null,
    }
  }
}

/**
 * Create Top-up Transaction API
 * Endpoint: POST /api/v1/wallet/topup
 * Payload: { amount: number } (min: 10000, max: 100000000)
 * Headers: Authorization: Bearer <access_token>
 * Returns: { id, order_id, type, amount, amount_eth, payment_url, status, created_at }
 */
export async function createTopupApi({ amount }, token) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    const activeToken = token || (typeof window !== "undefined" ? (localStorage.getItem("becak_token") || localStorage.getItem("pedulichain_token")) : null)
    if (activeToken) {
      headers.Authorization = `Bearer ${activeToken}`
    }

    const response = await axios.post(
      "/api/v1/wallet/topup",
      { amount: Number(amount) },
      { headers, timeout: 20000 }
    )
    return response.data
  } catch (error) {
    if (error.response?.data) {
      return error.response.data
    }
    return {
      success: false,
      message: error.message || "Gagal membuat transaksi top-up",
      errors: null,
      data: null,
    }
  }
}
