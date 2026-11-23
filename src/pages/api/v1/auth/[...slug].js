export default async function handler(req, res) {
  // CORS Headers untuk mencegah error "Provisional headers are shown"
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  const { slug } = req.query
  const endpoint = Array.isArray(slug) ? slug.join("/") : slug || ""

  // Jika user membuka endpoint registrasi/login lewat URL bar (method GET), alihkan langsung ke halaman tampilan frontend
  if (req.method === "GET") {
    if (endpoint === "register") {
      return res.redirect(307, "/auth/register")
    }
    if (endpoint === "login") {
      return res.redirect(307, "/auth/login")
    }
  }

  const targetUrl = `https://becak-be.jevvonn.foo/api/v1/auth/${endpoint}`

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization
    }

    const fetchOptions = {
      method: req.method,
      headers,
    }

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body)
    }

    const backendRes = await fetch(targetUrl, fetchOptions)
    
    let data
    const contentType = backendRes.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      data = await backendRes.json()
    } else {
      const text = await backendRes.text()
      try {
        data = JSON.parse(text)
      } catch {
        data = { success: backendRes.ok, message: text, errors: null, data: null }
      }
    }

    return res.status(backendRes.status).json(data)
  } catch (error) {
    console.error("Proxy error to backend:", error)
    return res.status(500).json({
      success: false,
      message: "Gagal terhubung ke server backend becak-be",
      errors: error.message,
      data: null,
    })
  }
}
