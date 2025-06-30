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
