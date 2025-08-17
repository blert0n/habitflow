const BASE_URL = import.meta.env.VITE_API_URL

export async function client(path: string, init: RequestInit = {}) {
  const url = `${BASE_URL}${path}`
  const method = init.method?.toUpperCase() || 'GET'

  try {
    const res = await fetch(url, {
      ...init,
      credentials: 'include',
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok || data.success === false) {
      // Use 'error' if present, fallback to statusText
      const errorMessage = data.error || data.message || res.statusText
      throw new Error(errorMessage)
    }

    return data
  } catch (err) {
    console.error('Fetch failed', err)
    throw err
  }
}
