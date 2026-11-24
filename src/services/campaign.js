import axios from "axios"

/**
 * 1. GET /campaigns
 * Mengambil daftar kampanye aktif/publik (bisa filter ?status=ACTIVE dll)
 */
export async function getCampaignsApi(status) {
  try {
    const params = status ? { status } : {}
    const response = await axios.get("/api/v1/campaigns", {
      params,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: [] }
  }
}

/**
 * 2. POST /campaigns
 * Membuat kampanye bencana baru (Role: INITIATOR / ADMIN)
 * Payload: { title, description, image_url, target_amount }
 */
export async function createCampaignApi({ title, description, image_url, target_amount }, token) {
  try {
    const headers = { "Content-Type": "application/json", Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.post(
      "/api/v1/campaigns",
      {
        title: title.trim(),
        description: description.trim(),
        image_url: image_url.trim(),
        target_amount: String(target_amount),
      },
      { headers, timeout: 20000 }
    )
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: null }
  }
}

/**
 * 3. GET /campaigns/me
 * Mengambil daftar kampanye yang dibuat oleh pengguna yang sedang login (Role: INITIATOR)
 */
export async function getMyCampaignsApi(token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.get("/api/v1/campaigns/me", {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: [] }
  }
}

/**
 * 4. GET /campaigns/all
 * Mengambil SELURUH kampanye dari semua status (Role: ADMIN)
 */
export async function getAllCampaignsApi(status, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const params = status && status !== "ALL" ? { status } : {}
    const response = await axios.get("/api/v1/campaigns/all", {
      headers,
      params,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: [] }
  }
}

/**
 * 5. GET /campaigns/{id}
 * Mengambil detail satu kampanye spesifik
 */
export async function getCampaignByIdApi(id) {
  try {
    const response = await axios.get(`/api/v1/campaigns/${id}`, {
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: null }
  }
}

/**
 * 6. PATCH /campaigns/{id}
 * Memperbarui info kampanye (title, description, image_url, target_amount)
 */
export async function updateCampaignApi(id, data, token) {
  try {
    const headers = { "Content-Type": "application/json", Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.patch(`/api/v1/campaigns/${id}`, data, {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: null }
  }
}

/**
 * 7. DELETE /campaigns/{id}
 * Menghapus kampanye
 */
export async function deleteCampaignApi(id, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.delete(`/api/v1/campaigns/${id}`, {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: null }
  }
}

/**
 * 8. GET /campaigns/{id}/donaturs
 * Mengambil daftar donatur dari kampanye tertentu
 */
export async function getCampaignDonatursApi(id) {
  try {
    const response = await axios.get(`/api/v1/campaigns/${id}/donaturs`, {
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: [] }
  }
}

/**
 * 9. GET /campaigns/{id}/disbursements
 * Mengambil daftar pencairan dana (disbursements) dari kampanye tertentu
 */
export async function getCampaignDisbursementsApi(id) {
  try {
    const response = await axios.get(`/api/v1/campaigns/${id}/disbursements`, {
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: [] }
  }
}

/**
 * 10. PATCH /campaigns/{id}/close
 * Menutup kampanye (Role: INITIATOR / ADMIN)
 */
export async function closeCampaignApi(id, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.patch(`/api/v1/campaigns/${id}/close`, {}, {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: null }
  }
}

/**
 * 11. PATCH /campaigns/{id}/approve
 * Menyetujui kampanye bencana (Role: ADMIN)
 */
export async function approveCampaignApi(id, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.patch(`/api/v1/campaigns/${id}/approve`, {}, {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: null }
  }
}

/**
 * 12. PATCH /campaigns/{id}/reject
 * Menolak kampanye bencana dengan alasan (Role: ADMIN)
 * Payload: { reason: string }
 */
export async function rejectCampaignApi(id, reason, token) {
  try {
    const headers = { "Content-Type": "application/json", Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.patch(
      `/api/v1/campaigns/${id}/reject`,
      { reason: reason || "Alasan penolakan administratif" },
      { headers, timeout: 15000 }
    )
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return { success: false, message: error.message, errors: null, data: null }
  }
}

/**
 * 13. GET /campaigns/{id}/donation-limit
 * Cek batas donasi user pada kampanye berdasarkan saldo wallet & sisa target (JWT Required)
 * Returns: ApiResponse_DonationLimitResponse_
 */
export async function getDonationLimitApi(id, token) {
  try {
    const headers = { Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.get(`/api/v1/campaigns/${id}/donation-limit`, {
      headers,
      timeout: 15000,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal mengambil batas donasi",
      errors: null,
      data: null,
    }
  }
}

/**
 * 14. POST /campaigns/{id}/donations
 * Melakukan donasi langsung on-chain menggunakan saldo wallet user (JWT Required)
 * Payload: { amount: string (ETH format, e.g. "0.01") }
 * Returns: ApiResponse_TransactionResponse_
 */
export async function createDonationApi(id, { amount }, token) {
  try {
    const headers = { "Content-Type": "application/json", Accept: "application/json" }
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("pedulichain_token") : null)
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`

    const response = await axios.post(
      `/api/v1/campaigns/${id}/donations`,
      { amount: String(amount) },
      { headers, timeout: 30000 }
    )
    return response.data
  } catch (error) {
    if (error.response?.data) return error.response.data
    return {
      success: false,
      message: error.message || "Gagal memproses donasi",
      errors: null,
      data: null,
    }
  }
}
