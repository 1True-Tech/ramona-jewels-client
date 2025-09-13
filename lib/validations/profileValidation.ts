export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

export const profileValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: false,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
  },
  bio: {
    required: false,
    maxLength: 500,
  },
  address: {
    street: {
      required: false,
      maxLength: 100,
    },
    city: {
      required: false,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
    },
    state: {
      required: false,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
    },
    zipCode: {
      required: false,
      pattern: /^[\d]{5}(-[\d]{4})?$/,
    },
    country: {
      required: false,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
    },
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
}

export function validateField(field: string, value: any, rules: any): string[] {
  const errors: string[] = []
  
  if (!rules) return errors
  
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
    return errors
  }
  
  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return errors
  }
  
  const stringValue = value.toString().trim()
  
  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`)
  }
  
  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must not exceed ${rules.maxLength} characters`)
  }
  
  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    switch (field) {
      case 'email':
        errors.push('Please enter a valid email address')
        break
      case 'phone':
        errors.push('Please enter a valid phone number')
        break
      case 'name':
      case 'city':
      case 'state':
      case 'country':
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} can only contain letters and spaces`)
        break
      case 'zipCode':
        errors.push('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)')
        break
      case 'password':
        errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        break
      default:
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`)
    }
  }
  
  return errors
}

export function validateProfile(profile: any, options?: { mode?: 'full' | 'partial' }): ValidationResult {
  const mode = options?.mode || 'full'
  const errors: Record<string, string[]> = {}

  const shouldValidateField = (obj: any, key: string) => {
    if (mode === 'partial') {
      return Object.prototype.hasOwnProperty.call(obj, key)
    }
    return true
  }
  
  // Validate basic fields
  const basicFields = ['name', 'email', 'phone', 'bio']
  basicFields.forEach(field => {
    if (!shouldValidateField(profile, field)) return
    const fieldErrors = validateField(field, profile[field], profileValidationRules[field as keyof typeof profileValidationRules])
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  })
  
  // Validate address fields
  if (profile.address) {
    const addressFields = ['street', 'city', 'state', 'zipCode', 'country']
    addressFields.forEach(field => {
      if (mode === 'partial' && !Object.prototype.hasOwnProperty.call(profile.address, field)) return
      const fieldErrors = validateField(
        field, 
        profile.address[field], 
        profileValidationRules.address[field as keyof typeof profileValidationRules.address]
      )
      if (fieldErrors.length > 0) {
        errors[`address.${field}`] = fieldErrors
      }
    })
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validatePassword(currentPassword: string, newPassword: string, confirmPassword?: string): ValidationResult {
  const errors: Record<string, string[]> = {}
  
  // Validate current password
  if (!currentPassword || currentPassword.trim() === '') {
    errors.currentPassword = ['Current password is required']
  }
  
  // Validate new password
  const newPasswordErrors = validateField('newPassword', newPassword, profileValidationRules.password)
  if (newPasswordErrors.length > 0) {
    errors.newPassword = newPasswordErrors
  }
  
  // Validate password confirmation if provided
  if (confirmPassword !== undefined) {
    if (!confirmPassword || confirmPassword.trim() === '') {
      errors.confirmPassword = ['Please confirm your new password']
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = ['Passwords do not match']
    }
  }
  
  // Check if new password is different from current
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = ['New password must be different from current password']
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function getFieldError(errors: Record<string, string[]>, field: string): string | undefined {
  return errors[field]?.[0]
}

export function hasFieldError(errors: Record<string, string[]>, field: string): boolean {
  return errors[field] && errors[field].length > 0
}