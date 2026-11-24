import axios from "axios"

/**
 * 1. GET /exchange-rate
 * Mengambil kurs live ETH ke IDR (CoinGecko dengan fallback)
 * Returns: ApiResponse_ExchangeRateResponse_
 */
export async function getExchangeRateApi() {
  try {
    const response = await axios.get("/api/v1/exchange-rate", {
      timeout: 10000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal mengambil kurs pertukaran",
      errors: null,
      data: {
        pair: "ETH/IDR",
        idr_per_eth: 55000000,
        source: "fallback",
        cached: true,
        fetched_at: new Date().toISOString(),
        expires_in_seconds: 60,
      },
    }
  }
}

/**
 * 2. GET /health
 * Cek status kesehatan backend & blockchain
 * Returns: ApiResponse_HealthResponse_
 */
export async function getHealthApi() {
  try {
    const response = await axios.get("/api/v1/health", {
      timeout: 10000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Server tidak merespons",
      errors: null,
      data: null,
    }
  }
}
