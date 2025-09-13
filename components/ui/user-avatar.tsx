"use client"

import * as React from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserAvatarUrl, hasUserProfileImage, getUserInitials } from "@/lib/utils/imageUtils"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface UserAvatarProps {
  user?: {
    name?: string
    avatar?: string
    email?: string
  } | null
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showOnlineStatus?: boolean
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
}

export function UserAvatar({ 
  user, 
  size = "md", 
  className,
  showOnlineStatus = false 
}: UserAvatarProps) {
  const avatarUrl = getUserAvatarUrl(user?.avatar)
  const hasProfileImage = hasUserProfileImage(user?.avatar)
  const initials = getUserInitials(user?.name)
  
  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(sizeClasses[size], "border-2 border-background")}>
        {hasProfileImage && avatarUrl ? (
          <AvatarImage 
            src={avatarUrl} 
            alt={`${user?.name || 'User'}'s profile picture`}
            className="object-cover"
          />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {initials || <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      {showOnlineStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
      )}
    </div>
  )
}

// Alternative component for cases where you need more control over the image
export function UserProfileImage({ 
  user, 
  width = 40, 
  height = 40, 
  className 
}: {
  user?: {
    name?: string
    avatar?: string
  } | null
  width?: number
  height?: number
  className?: string
}) {
  const avatarUrl = getUserAvatarUrl(user?.avatar)
  const hasProfileImage = hasUserProfileImage(user?.avatar)
  const initials = getUserInitials(user?.name)
  
  if (hasProfileImage && avatarUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-full", className)} style={{ width, height }}>
        <Image
          src={avatarUrl}
          alt={`${user?.name || 'User'}'s profile picture`}
          fill
          className="object-cover"
          sizes={`${width}px`}
        />
      </div>
    )
  }
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold",
        className
      )}
      style={{ width, height }}
    >
      <span className="text-sm">{initials}</span>
    </div>
  )
}