export const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || (() => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || ""
    return api ? new URL(api).origin : ""
  } catch {
    return ""
  }
})()

export function getUserAvatarUrl(avatar?: string | null): string {
  if (!avatar) return "/placeholder.svg"
  const src = String(avatar)
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith("/uploads") || src.startsWith("/api/v1/uploads")) {
    const base = SERVER_BASE_URL.replace(/\/$/, "")
    return base ? `${base}${src}` : src
  }
  if (src.startsWith("/images/")) return src
  const path = src.startsWith("/") ? src : `/uploads/${src}`
  const base = SERVER_BASE_URL.replace(/\/$/, "")
  return base ? `${base}${path}` : path
}

export function hasUserProfileImage(avatar?: string | null): boolean {
  if (!avatar) return false
  const src = String(avatar)
  if (/^https?:\/\//i.test(src)) return true
  if (src.startsWith("/uploads") || src.startsWith("/api/v1/uploads")) return true
  return Boolean(src.trim())
}

export function getUserInitials(name?: string | null): string {
  if (!name) return ""
  const parts = String(name).trim().split(/\s+/)
  if (!parts.length) return ""
  const first = parts[0]?.[0] || ""
  const second = parts[1]?.[0] || ""
  return (first + second).toUpperCase()
}

// Generic helper for any product/order image coming from backend
export function toServerImageUrl(src?: string | null): string {
  if (!src) return "/placeholder.svg"
  const val = String(src)
  if (/^https?:\/\//i.test(val)) return val
  // Keep static app images untouched
  if (val.startsWith("/images/")) return val

  // Normalize to an uploads path
  let path = val.startsWith("/") ? val : `/${val}`
  if (!path.startsWith("/uploads") && !path.startsWith("/api/v1/uploads")) {
    path = `/uploads/${path.replace(/^\/+/, "")}`
  }

  const base = SERVER_BASE_URL.replace(/\/$/, "")
  return base ? `${base}${path}` : path
}