export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  const { slug } = req.query
  const endpoint = Array.isArray(slug) ? slug.join("/") : slug || ""
  const targetUrl = `https://becak-be.jevvonn.foo/api/v1/wallet/${endpoint}`

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: req.headers.accept || "*/*",
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
    console.error(`Proxy error to /wallet/${endpoint}:`, error)
    return res.status(500).json({
      success: false,
      message: `Gagal terhubung ke backend /api/v1/wallet/${endpoint}`,
      errors: error.message,
      data: null,
    })
  }
}
