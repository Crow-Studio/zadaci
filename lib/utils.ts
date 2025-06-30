import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { User } from '~/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function get2FARedirect(user: User, defaultPath: string): string {
  if (user.registeredPasskey && !user.twoFactorVerified) {
    return '/auth/two-factor'
  }
  if (user.registeredTOTP && !user.twoFactorVerified) {
    return '/auth/two-factor'
  }
  return defaultPath
}

export const formatDateForPicker = (dateValue: string | Date | null | undefined): string | undefined => {
  if (!dateValue) return undefined // This handles null, undefined, and empty string

  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    if (isNaN(date.getTime())) return undefined

    // @internationalized/date parseDate expects YYYY-MM-DD format
    return date.toISOString().split('T')[0]
  }
  catch {
    return undefined
  }
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
