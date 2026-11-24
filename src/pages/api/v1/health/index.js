export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  const targetUrl = "https://becak-be.jevvonn.foo/api/v1/health"

  try {
    const backendRes = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    const data = await backendRes.json()
    return res.status(backendRes.status).json(data)
  } catch (error) {
    console.error("Proxy error to /health:", error)
    return res.status(500).json({
      success: false,
      message: "Gagal terhubung ke backend /api/v1/health",
      errors: error.message,
      data: null,
    })
  }
}
