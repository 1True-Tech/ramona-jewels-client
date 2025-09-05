/**
 * Utility functions for handling user images and avatars
 */

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'

/**
 * Get the full URL for a user avatar
 * @param avatarPath - The avatar path from the user object (e.g., '/uploads/avatars/avatar_123.jpg')
 * @returns Full URL to the avatar image or null if no avatar
 */
export function getUserAvatarUrl(avatarPath: string | null | undefined): string | null {
  if (!avatarPath) return null
  
  // If it's already a full URL, return as is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }
  
  // If it's a relative path, construct the full URL
  if (avatarPath.startsWith('/')) {
    return `${SERVER_BASE_URL}${avatarPath}`
  }
  
  // If it's just a filename, assume it's in the uploads/avatars directory
  return `${SERVER_BASE_URL}/uploads/avatars/${avatarPath}`
}

/**
 * Check if user has a valid profile image
 * @param user - User object
 * @returns boolean indicating if user has a profile image
 */
export function hasUserProfileImage(user: any): boolean {
  return !!(user?.avatar && user.avatar !== '/placeholder.svg' && user.avatar.trim() !== '')
}

/**
 * Get user initials for fallback avatar
 * @param name - User's name
 * @returns User initials (max 2 characters)
 */
export function getUserInitials(name: string | null | undefined): string {
  if (!name) return 'U'
  
  const words = name.trim().split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}