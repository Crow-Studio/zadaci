import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding'
import { generateRandomString } from '@oslojs/crypto/random'
import type { RandomReader } from '@oslojs/crypto/random'

export type TimeSpanUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w'

export class TimeSpan {
  value: number
  unit: TimeSpanUnit

  constructor(value: number, unit: TimeSpanUnit) {
    this.value = value
    this.unit = unit
  }

  milliseconds(): number {
    const unitMultipliers: Record<TimeSpanUnit, number> = {
      ms: 1,
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
      w: 604800000,
    }
    return this.value * unitMultipliers[this.unit]
  }

  seconds(): number {
    return this.milliseconds() / 1000
  }

  transform(x: number): TimeSpan {
    return new TimeSpan(this.value * x, this.unit)
  }
}

export function isWithinExpirationDate(date: Date): boolean {
  return date.getTime() > Date.now()
}

export function createDate(timeSpan: TimeSpan): Date {
  return new Date(Date.now() + timeSpan.milliseconds())
}

export function generateRandomOTP(): string {
  const bytes = new Uint8Array(5)
  crypto.getRandomValues(bytes)
  const code = encodeBase32UpperCaseNoPadding(bytes)
  return code
}

export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10)
  crypto.getRandomValues(recoveryCodeBytes)
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes)
  return recoveryCode
}

export function generateUniqueCode(length: number): string {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes)
    },
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'

  return generateRandomString(random, alphabet, length)
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
