import React, { createContext, useContext, useState, useEffect } from "react"
import { registerApi, loginApi, getSessionApi } from "@/services/auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate & Validate Session menggunakan HTTP Bearer Token on load
  useEffect(() => {
    const initSession = async () => {
      try {
        const savedToken = localStorage.getItem("pedulichain_token")
        if (savedToken) {
          setToken(savedToken)
          // Verifikasi token ke endpoint GET /api/v1/auth/session dengan Bearer
          const sessionRes = await getSessionApi(savedToken)
          if (sessionRes.success && sessionRes.data) {
            setUser(sessionRes.data)
            localStorage.setItem("pedulichain_user", JSON.stringify(sessionRes.data))
          } else {
            // Token expired atau tidak valid
            console.warn("Session token expired / invalid:", sessionRes.message)
            localStorage.removeItem("pedulichain_token")
            localStorage.removeItem("pedulichain_user")
            setUser(null)
            setToken(null)
          }
        }
      } catch (e) {
        console.error("Gagal memeriksa sesi auth:", e)
      } finally {
        setIsLoading(false)
      }
    }

    initSession()
  }, [])

  /**
   * Register User ke API POST https://becak-be.jevvonn.foo/api/v1/auth/register
   * Lalu otomatis login dan mengambil session data via Bearer token
   */
  const register = async ({ name, email, password }) => {
    const res = await registerApi({ name, email, password })
    if (res.success && res.data) {
      const registeredUser = res.data
      setUser(registeredUser)
      try {
        localStorage.setItem("pedulichain_user", JSON.stringify(registeredUser))
      } catch (err) {
        console.error("Gagal menyimpan user:", err)
      }

      // Auto login setelah register untuk mendapatkan JWT access_token
      try {
        const loginRes = await loginApi({ email, password })
        if (loginRes.success && loginRes.data?.access_token) {
          const accessToken = loginRes.data.access_token
          setToken(accessToken)
          localStorage.setItem("pedulichain_token", accessToken)

          // Ambil full session dengan Bearer token
          const sessionRes = await getSessionApi(accessToken)
          if (sessionRes.success && sessionRes.data) {
            setUser(sessionRes.data)
            localStorage.setItem("pedulichain_user", JSON.stringify(sessionRes.data))
          }
        }
      } catch (loginErr) {
        console.warn("Auto-login error:", loginErr)
      }

      return { success: true, data: registeredUser, message: res.message }
    }

    return {
      success: false,
      message: res.message || "Pendaftaran gagal",
      errors: res.errors,
    }
  }

  /**
   * Login User ke API POST https://becak-be.jevvonn.foo/api/v1/auth/login
   * Mengambil access_token (JWT) dan memanggil GET /api/v1/auth/session dengan Bearer
   */
  const login = async ({ email, password }) => {
    const res = await loginApi({ email, password })
    if (res.success && res.data?.access_token) {
      const accessToken = res.data.access_token
      setToken(accessToken)
      localStorage.setItem("pedulichain_token", accessToken)

      // Ambil data user lengkap dari endpoint GET /api/v1/auth/session
      const sessionRes = await getSessionApi(accessToken)
      if (sessionRes.success && sessionRes.data) {
        setUser(sessionRes.data)
        localStorage.setItem("pedulichain_user", JSON.stringify(sessionRes.data))
      } else {
        // Fallback jika session endpoint temporary offline
        const fallbackUser = {
          name: email.split("@")[0],
          email: email,
          role: "DONOR",
          wallet_address: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        }
        setUser(fallbackUser)
        localStorage.setItem("pedulichain_user", JSON.stringify(fallbackUser))
      }

      return { success: true, data: res.data, message: res.message }
    }

    return {
      success: false,
      message: res.message || "Login gagal, periksa email dan kata sandi Anda",
      errors: res.errors,
    }
  }

  /**
   * Refresh session manual dari server menggunakan Bearer token
   */
  const refreshSession = async () => {
    if (!token) return null
    const res = await getSessionApi(token)
    if (res.success && res.data) {
      setUser(res.data)
      localStorage.setItem("pedulichain_user", JSON.stringify(res.data))
      return res.data
    }
    return null
  }

  /**
   * Logout User: bersihkan token dan sesi lokal
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem("pedulichain_user")
      localStorage.removeItem("pedulichain_token")
    } catch (e) {
      console.error("Gagal membersihkan storage:", e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        register,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider")
  }
  return context
}
