import axios from "axios"

// Menggunakan proxy API Next.js untuk mencegah masalah CORS dan "Provisional headers are shown"
export const AUTH_API_URL = "/api/v1/auth"

export const authClient = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request Interceptor: Otomatis lampirkan JWT Bearer Token jika tersedia di localStorage
authClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("pedulichain_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Register User API
 * Endpoint: POST /api/v1/auth/register
 * Payload: { name, email, password }
 */
export async function registerApi({ name, email, password }) {
  try {
    const response = await authClient.post("/register", {
      name,
      email,
      password,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      return error.response.data
    }
    return {
      success: false,
      message: error.message || "Gagal menghubungi server pendaftaran",
      errors: null,
      data: null,
    }
  }
}

/**
 * Login User API
 * Endpoint: POST /api/v1/auth/login
 * Payload: { email, password }
 * Response Data: { access_token, token_type, expires_at }
 */
export async function loginApi({ email, password }) {
  try {
    const response = await authClient.post("/login", {
      email,
      password,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      return error.response.data
    }
    return {
      success: false,
      message: error.message || "Gagal menghubungi server autentikasi",
      errors: null,
      data: null,
    }
  }
}

/**
 * Get User Session API (Menggunakan HTTP Bearer Token)
 * Endpoint: GET /api/v1/auth/session
 * Headers: { Authorization: 'Bearer <access_token>' }
 * Response Data: { id, name, email, role, wallet_address, created_at, updated_at }
 */
export async function getSessionApi(token) {
  try {
    const headers = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const response = await authClient.get("/session", { headers })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      return error.response.data
    }
    return {
      success: false,
      message: error.message || "Gagal memverifikasi sesi token Bearer",
      errors: null,
      data: null,
    }
  }
}
