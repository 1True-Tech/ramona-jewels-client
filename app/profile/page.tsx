"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ResponseModal } from "@/components/ui/response-modal"
import {  
  Mail, 
  Calendar, 
  Shield, 
  Edit, 
  Save,
  Camera,
  Bell,
  Eye,
  EyeOff,
  Loader2,
  Key,
  X,
  CornerUpLeft
} from "lucide-react"
import { useAuth } from "@/contexts/redux-auth-context"
import { userApiService, UpdateProfileData, ChangePasswordData } from "@/lib/api/userApi"
import { 
  validateProfile, 
  validatePassword, 
  getFieldError, 
  hasFieldError
} from "@/lib/validations/profileValidation"
import type { UserProfile } from "@/app/types"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/ui/loader"
import { getUserAvatarUrl, hasUserProfileImage } from "@/lib/utils/imageUtils"


export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    title: '',
    message: '',
    errors: {} as Record<string, string[]>
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [profile, setProfile] = useState<UserProfile>({
    _id: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "/placeholder.svg",
    role: user?.role || "user",
    bio: user?.bio || "Passionate about luxury jewelry and fine fragrances. Admin at Ramona Jewels with over 5 years of experience in the luxury retail industry.",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || ""
    },
    preferences: {
      notifications: user?.preferences?.notifications || true,
      newsletter: user?.preferences?.newsletter || false,
      twoFactorAuth: user?.preferences?.twoFactorAuth || false
    },
    stats: {
      totalOrders: user?.stats?.totalOrders || 0,
      wishlistItems: user?.stats?.wishlistItems || 0,
      reviewsCount: user?.stats?.reviewsCount || 0,
      totalSpent: user?.stats?.totalSpent || 0
    },
    createdAt: user?.createdAt || "",
    isActive: user?.isActive || true
  })

  // Track the original profile to build diffs for partial updates
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null)

  // Helper to compute minimal diff payload for partial updates
  const buildUpdateData = (original: UserProfile | null, current: UserProfile) => {
    const diff: any = {}
    if (!original) {
      // No baseline, send non-derived fields that exist
      if (current.name !== undefined) diff.name = current.name
      if (current.email !== undefined) diff.email = current.email
      if (current.phone !== undefined) diff.phone = current.phone
      if (current.bio !== undefined) diff.bio = current.bio
      if (current.address) {
        const addr: any = {}
        ;(['street','city','state','zipCode','country'] as const).forEach((k) => {
          if (current.address && current.address[k] !== undefined) addr[k] = current.address[k]
        })
        if (Object.keys(addr).length) diff.address = addr
      }
      if (current.preferences) {
        const prefs: any = {}
        ;(['notifications','newsletter','twoFactorAuth'] as const).forEach((k) => {
          if (current.preferences && current.preferences[k] !== undefined) prefs[k] = current.preferences[k]
        })
        if (Object.keys(prefs).length) diff.preferences = prefs
      }
      return diff
    }

    // Shallow fields
    if (current.name !== original.name) diff.name = current.name
    if (current.email !== original.email) diff.email = current.email
    if (current.phone !== original.phone) diff.phone = current.phone
    if (current.bio !== original.bio) diff.bio = current.bio

    // Nested address
    if (current.address) {
      const addrDiff: any = {}
      ;(['street','city','state','zipCode','country'] as const).forEach((k) => {
        const cur = current.address?.[k]
        const org = original.address?.[k]
        if (cur !== org) addrDiff[k] = cur
      })
      if (Object.keys(addrDiff).length) diff.address = addrDiff
    }

    // Nested preferences
    if (current.preferences) {
      const prefDiff: any = {}
      ;(['notifications','newsletter','twoFactorAuth'] as const).forEach((k) => {
        const cur = current.preferences?.[k]
        const org = original.preferences?.[k]
        if (cur !== org) prefDiff[k] = cur
      })
      if (Object.keys(prefDiff).length) diff.preferences = prefDiff
    }

    return diff
  }

  // Load profile data on component mount
  useEffect(() => {
    loadProfile()
  }, [])

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const response = await userApiService.getProfile()
      if (response.success && response.data) {
        setProfile(prev => ({ ...prev, ...response.data }))
        setOriginalProfile(response.data as UserProfile)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const showModal = (type: 'success' | 'error' | 'warning', title: string, message: string, errors?: Record<string, string[]>) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      errors: errors || {}
    })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setValidationErrors({})
      
      // Build minimal update data (diff) for partial validation and update
      const updateDataForValidation: any = {}
      const diff = buildUpdateData(originalProfile, profile)
      Object.assign(updateDataForValidation, diff)

      // Validate only changed fields in partial mode
      const validationResult = validateProfile(updateDataForValidation as any, { mode: 'partial' })
      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors)
        showModal('error', 'Validation Failed', 'Please fix validation errors before saving.', validationResult.errors)
        return
      }

      const updatedProfile = { ...profile }

      // Handle avatar upload first if there's a selected file
      if (selectedFile) {
        try {
          const avatarResponse = await userApiService.uploadAvatar(selectedFile)
          if (avatarResponse.success && avatarResponse.data?.avatar) {
            updatedProfile.avatar = avatarResponse.data.avatar
            // Clear preview and selected file
            setImagePreview(null)
            setSelectedFile(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          } else {
            showModal('error', 'Avatar Upload Failed', avatarResponse.message || 'Failed to upload avatar.')
            return
          }
        } catch (avatarError: any) {
          console.error('Avatar upload error:', avatarError)
          showModal('error', 'Avatar Upload Failed', avatarError.response?.data?.message || 'An unexpected error occurred while uploading your avatar.')
          return
        }
      }

      // Build minimal update data
      const minimalPayload: UpdateProfileData = buildUpdateData(originalProfile, updatedProfile) as UpdateProfileData
      
      if (!Object.keys(minimalPayload || {}).length) {
        // If only avatar changed, consider it a successful update without PUT
        if (updatedProfile.avatar && updatedProfile.avatar !== originalProfile?.avatar) {
          setProfile(updatedProfile)
          setOriginalProfile(updatedProfile)
          if (updateUser) {
            updateUser({ ...user, avatar: updatedProfile.avatar })
          }
          setIsEditing(false)
          showModal('success', 'Avatar Updated', 'Your avatar has been updated successfully!')
        } else {
          showModal('warning', 'No Changes', 'You have not modified any fields to update.')
        }
        return
      }

      // Call API to update profile with minimal payload
      const response = await userApiService.updateProfile(minimalPayload)
      
      if (response.success) {
        // Update local profile state with the new avatar if it was uploaded
        setProfile(updatedProfile)
        setOriginalProfile(updatedProfile)
        
        // Update auth context with new user data
        if (updateUser && response.data) {
          const updatedUserData = { ...response.data, avatar: updatedProfile.avatar }
          updateUser(updatedUserData)
        }
        
        setIsEditing(false)
        showModal('success', 'Profile Updated', response.message || 'Your profile has been updated successfully!')
      } else {
        setValidationErrors(response.errors || {})
        showModal('error', 'Update Failed', response.message || 'Failed to update profile.', response.errors)
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      const errorData = error.response?.data
      showModal(
        'error', 
        'Update Failed', 
        errorData?.message || 'An unexpected error occurred while updating your profile.',
        errorData?.errors
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      setIsSaving(true)
      
      // Validate password data
      const validation = validatePassword(passwordData.currentPassword, passwordData.newPassword, passwordData.confirmPassword)
      if (!validation.isValid) {
        showModal('error', 'Password Validation Error', 'Please fix the errors below.', validation.errors)
        return
      }

      const changePasswordData: ChangePasswordData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      }

      const response = await userApiService.changePassword(changePasswordData)
      
      if (response.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        showModal('success', 'Password Changed', response.message || 'Your password has been changed successfully!')
      } else {
        showModal('error', 'Password Change Failed', response.message || 'Failed to change password.', response.errors)
      }
    } catch (error: any) {
      console.error('Password change error:', error)
      const errorData = error.response?.data
      showModal(
        'error', 
        'Password Change Failed', 
        errorData?.message || 'An unexpected error occurred while changing your password.',
        errorData?.errors
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type (only images, no SVG or video)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showModal('error', 'Invalid File', 'Please upload a valid image file (JPEG, PNG, GIF, or WebP). SVG and video files are not allowed.')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showModal('error', 'File Too Large', 'Please select an image smaller than 5MB.')
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setSelectedFile(file)
  }



  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddressChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
    
    // Clear validation error for this field
    const errorKey = `address.${field}`
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  const handlePasswordInputChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Back to previous route
  const router = useRouter()

  if (isLoading) {
    return (
      <Loader message="Loading profile..." />
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4 w-full">
          <Button onClick={() => router.back()} variant="link" className="text-lg flex items-center gap-2">
            <CornerUpLeft className="text-2xl"/>
            Back
          </Button>
          <div className="flex items-center justify-end md:justify-between w-full">
            <div className="hidden md:inline-block">
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
              <div className="relative">
                {imagePreview ? (
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={imagePreview} alt="Preview" />
                    <AvatarFallback className="text-lg bg-gray-200 text-gray-600">
                      Preview
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className = "h-20 w-20">
                    {hasUserProfileImage(profile.avatar) ? (
                      <AvatarImage 
                        src={getUserAvatarUrl(profile.avatar) || profile.avatar} 
                        alt={profile.name} 
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="text-md bg-yellow-500 text-white md:text-xl font-bold letter-spacing-3">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                {isEditing && (
                  <>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col-reverse md:flex-row items-center gap-3">
                  <h2 className="md:text-xl font-semibold whitespace-nowrap">{profile.name}</h2>
                  <Badge variant={profile.role === "admin" ? "default" : "secondary"} className="hidden md:inline-flex">
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4 hidden md:block" />
                  {profile.email}
                </p>
                <p className="text-muted-foreground text-xs flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="h-4 w-4 hidden md:block" />
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-primary">{profile.stats.totalOrders}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    Orders
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">{profile.stats.wishlistItems}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    Wishlist
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">{profile.stats.reviewsCount}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">${profile.stats.totalSpent}</div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">Total Spent</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Preview Section */}
        {/* {imagePreview && (
          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={imagePreview} alt="Preview" />
                    <AvatarFallback className="text-lg bg-gray-200 text-gray-600">
                      Preview
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelPreview}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Profile Details */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList
            className="flex justify-start w-full gap-5 overflow-x-auto overflow-y-hidden whitespace-nowrap snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          >
            <TabsTrigger value="personal" className="p-3">Personal Info</TabsTrigger>
            <TabsTrigger value="address" className="p-3">Address</TabsTrigger>
            <TabsTrigger value="security" className="p-3">Security</TabsTrigger>
            <TabsTrigger value="preferences" className="p-3">Preferences</TabsTrigger>
          </TabsList>


          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className={hasFieldError(validationErrors, 'name') ? 'border-red-500' : ''}
                    />
                    {hasFieldError(validationErrors, 'name') && (
                      <p className="text-sm text-red-500">{getFieldError(validationErrors, 'name')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={hasFieldError(validationErrors, 'email') ? 'border-red-500' : ''}
                    />
                    {hasFieldError(validationErrors, 'email') && (
                      <p className="text-sm text-red-500">{getFieldError(validationErrors, 'email')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={hasFieldError(validationErrors, 'phone') ? 'border-red-500' : ''}
                    />
                    {hasFieldError(validationErrors, 'phone') && (
                      <p className="text-sm text-red-500">{getFieldError(validationErrors, 'phone')}</p>
                    )}
                  </div>
                  {profile?.role === "admin" ? 
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      disabled
                      className="capitalize"
                    />
                  </div>
                  : null
                  }
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className={hasFieldError(validationErrors, 'bio') ? 'border-red-500' : ''}
                  />
                  {hasFieldError(validationErrors, 'bio') && (
                    <p className="text-sm text-red-500">{getFieldError(validationErrors, 'bio')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Manage your shipping and billing address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={profile.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    disabled={!isEditing}
                    className={hasFieldError(validationErrors, 'address.street') ? 'border-red-500' : ''}
                  />
                  {hasFieldError(validationErrors, 'address.street') && (
                    <p className="text-sm text-red-500">{getFieldError(validationErrors, 'address.street')}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      disabled={!isEditing}
                      className={hasFieldError(validationErrors, 'address.city') ? 'border-red-500' : ''}
                    />
                    {hasFieldError(validationErrors, 'address.city') && (
                      <p className="text-sm text-red-500">{getFieldError(validationErrors, 'address.city')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profile.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      disabled={!isEditing}
                      className={hasFieldError(validationErrors, 'address.state') ? 'border-red-500' : ''}
                    />
                    {hasFieldError(validationErrors, 'address.state') && (
                      <p className="text-sm text-red-500">{getFieldError(validationErrors, 'address.state')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={profile.address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      disabled={!isEditing}
                      className={hasFieldError(validationErrors, 'address.zipCode') ? 'border-red-500' : ''}
                    />
                    {hasFieldError(validationErrors, 'address.zipCode') && (
                      <p className="text-sm text-red-500">{getFieldError(validationErrors, 'address.zipCode')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profile.address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      disabled={!isEditing}
                      className={hasFieldError(validationErrors, 'address.country') ? 'border-red-500' : ''}
                    />
                    {hasFieldError(validationErrors, 'address.country') && (
                      <p className="text-sm text-red-500">{getFieldError(validationErrors, 'address.country')}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Change Password</h4>
                    {isEditing && (
                      <Button
                        onClick={handlePasswordChange}
                        disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        size="sm"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Key className="w-4 h-4 mr-2" />
                        )}
                        {isSaving ? 'Changing...' : 'Change Password'}
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Enable two-factor authentication for enhanced security</p>
                      <p className="text-xs text-muted-foreground">Requires authentication app</p>
                    </div>
                    <Button
                      variant={profile.preferences.twoFactorAuth ? "destructive" : "default"}
                      onClick={() => handlePreferenceChange('twoFactorAuth', !profile.preferences.twoFactorAuth)}
                      disabled={!isEditing}
                    >
                      {profile.preferences.twoFactorAuth ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications about orders and updates</p>
                    </div>
                  </div>
                  <Button
                    variant={profile.preferences.notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePreferenceChange('notifications', !profile.preferences.notifications)}
                    disabled={!isEditing}
                  >
                    {profile.preferences.notifications ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted-foreground">Receive our weekly newsletter with new products</p>
                    </div>
                  </div>
                  <Button
                    variant={profile.preferences.newsletter ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePreferenceChange('newsletter', !profile.preferences.newsletter)}
                    disabled={!isEditing}
                  >
                    {profile.preferences.newsletter ? "Subscribed" : "Unsubscribed"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Response Modal */}
      <ResponseModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        errors={modal.errors}
        autoClose={modal.type === 'success'}
        autoCloseDelay={3000}
      />
    </div>
  )
}