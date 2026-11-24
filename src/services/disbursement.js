import axios from "axios"

/**
 * 1. GET /disbursements/me
 * Mengambil daftar pencairan dana milik inisiator login (Role: INITIATOR / ADMIN)
 * Returns: ApiResponse_DisbursementResponse-Array_
 */
export async function getMyDisbursementsApi(token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.get("/api/v1/disbursements/me", {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal memuat daftar pencairan",
      errors: null,
      data: [],
    }
  }
}

/**
 * 2. GET /disbursements/limit?campaign_id={id}
 * Cek batas pencairan dana yang tersedia untuk kampanye
 * Returns: ApiResponse_DisbursementLimitResponse_
 */
export async function getDisbursementLimitApi(campaignId, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.get("/api/v1/disbursements/limit", {
      headers,
      params: { campaign_id: campaignId },
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal mengambil batas pencairan",
      errors: null,
      data: null,
    }
  }
}

/**
 * 3. GET /disbursements
 * Mengambil seluruh pencairan dana sistem untuk verifikasi admin (Role: ADMIN)
 * Query: status ("PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | etc)
 * Returns: ApiResponse_DisbursementResponse-Array_
 */
export async function getAllDisbursementsApi(status, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const params = status && status !== "ALL" ? { status } : {}
    const response = await axios.get("/api/v1/disbursements", {
      headers,
      params,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal memuat seluruh pencairan",
      errors: null,
      data: [],
    }
  }
}

/**
 * 4. POST /disbursements
 * Mengajukan pencairan dana baru untuk kampanye (Role: INITIATOR / ADMIN)
 * Body: { campaign_id, amount, proof_url, description }
 * Returns: ApiResponse_DisbursementResponse_
 */
export async function createDisbursementApi({ campaign_id, amount, proof_url, description }, token) {
  try {
    const headers = { "Content-Type": "application/json", Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.post(
      "/api/v1/disbursements",
      {
        campaign_id,
        amount: String(amount),
        proof_url,
        description: description || "",
      },
      { headers, timeout: 20000 }
    )
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal mengajukan pencairan dana",
      errors: null,
      data: null,
    }
  }
}

/**
 * 5. PATCH /disbursements/{id}/approve
 * Menyetujui pencairan dana dan eksekusi transfer on-chain (Role: ADMIN)
 * Returns: ApiResponse_DisbursementResponse_
 */
export async function approveDisbursementApi(id, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.patch(`/api/v1/disbursements/${id}/approve`, {}, { headers, timeout: 30000 })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal menyetujui pencairan dana",
      errors: null,
      data: null,
    }
  }
}

/**
 * 6. PATCH /disbursements/{id}/reject
 * Menolak pencairan dana dengan alasan (Role: ADMIN)
 * Body: { reason: string }
 * Returns: ApiResponse_DisbursementResponse_
 */
export async function rejectDisbursementApi(id, reason, token) {
  try {
    const headers = { "Content-Type": "application/json", Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.patch(
      `/api/v1/disbursements/${id}/reject`,
      { reason },
      { headers, timeout: 20000 }
    )
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal menolak pencairan dana",
      errors: null,
      data: null,
    }
  }
}
