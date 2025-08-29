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
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit, 
  Save,
  Camera,
  Package,
  Heart,
  CreditCard,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Key
} from "lucide-react"
import { useAuth } from "@/contexts/redux-auth-context"
import { userApiService, UpdateProfileData, ChangePasswordData } from "@/lib/api/userApi"
import { 
  validateProfile, 
  validatePassword, 
  getFieldError, 
  hasFieldError,
  ValidationResult 
} from "@/lib/validations/profileValidation"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: "admin" | "user"
  joinDate: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  bio: string
  preferences: {
    notifications: boolean
    newsletter: boolean
    twoFactor: boolean
  }
  stats: {
    orders: number
    wishlist: number
    reviews: number
  }
}

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
  
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "/placeholder.svg",
    role: user?.role || "user",
    joinDate: user?.joinDate || "2023-01-15",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States"
    },
    bio: "Passionate about luxury jewelry and fine fragrances. Admin at Ramona Jewels with over 5 years of experience in the luxury retail industry.",
    preferences: {
      notifications: true,
      newsletter: true,
      twoFactor: false
    },
    stats: {
      orders: 24,
      wishlist: 12,
      reviews: 8
    }
  })

  // Load profile data on component mount
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const response = await userApiService.getProfile()
      if (response.success && response.data) {
        setProfile(prev => ({ ...prev, ...response.data }))
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
      
      // Validate profile data
      const validation = validateProfile(profile)
      if (!validation.isValid) {
        setValidationErrors(validation.errors)
        showModal('error', 'Validation Error', 'Please fix the errors below before saving.', validation.errors)
        return
      }

      // Prepare update data
      const updateData: UpdateProfileData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        address: profile.address,
        preferences: profile.preferences
      }

      // Call API to update profile
      const response = await userApiService.updateProfile(updateData)
      
      if (response.success) {
        // Update auth context with new user data
        if (updateUser && response.data) {
          updateUser(response.data)
        }
        
        setIsEditing(false)
        showModal('success', 'Profile Updated', response.message || 'Your profile has been updated successfully!')
      } else {
        showModal('error', 'Update Failed', response.message || 'Failed to update profile.', response.errors)
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      showModal('error', 'Update Failed', error.response?.data?.message || 'An unexpected error occurred while updating your profile.')
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
        newPassword: passwordData.newPassword
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
      showModal('error', 'Password Change Failed', error.response?.data?.message || 'An unexpected error occurred while changing your password.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      showModal('error', 'Invalid File', 'Please select a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showModal('error', 'File Too Large', 'Please select an image smaller than 5MB.')
      return
    }

    try {
      setIsSaving(true)
      const response = await userApiService.uploadAvatar(file)
      
      if (response.success && response.data?.avatar) {
        setProfile(prev => ({ ...prev, avatar: response.data.avatar }))
        if (updateUser) {
          updateUser({ ...user, avatar: response.data.avatar })
        }
        showModal('success', 'Avatar Updated', 'Your profile picture has been updated successfully!')
      } else {
        showModal('error', 'Upload Failed', response.message || 'Failed to upload avatar.')
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error)
      showModal('error', 'Upload Failed', error.response?.data?.message || 'An unexpected error occurred while uploading your avatar.')
    } finally {
      setIsSaving(false)
    }
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2 text-lg">Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
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
                  {isSaving ? 'Saving...' : 'Save Changes'}
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

        {/* Profile Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-lg bg-yellow-500 text-white md:text-4xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
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
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                  <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date(profile.joinDate).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{profile.stats.orders}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Package className="h-3 w-3" />
                    Orders
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{profile.stats.wishlist}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Heart className="h-3 w-3" />
                    Wishlist
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{profile.stats.reviews}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
                      variant={profile.preferences.twoFactor ? "destructive" : "default"}
                      onClick={() => handlePreferenceChange('twoFactor', !profile.preferences.twoFactor)}
                      disabled={!isEditing}
                    >
                      {profile.preferences.twoFactor ? "Disable" : "Enable"}
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
      />
    </div>
  )
}