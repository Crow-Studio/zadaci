declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    username: string
    emailVerified: boolean
    registeredTOTP: boolean
    registeredPasskey: boolean
    registered2FA: boolean
    avatar: string
    twoFactorVerified: boolean
  }
  interface UserSession {
    user?: {
      id: string
      email: string
      username: string
      emailVerified: boolean
      registeredTOTP: boolean
      registeredPasskey: boolean
      registered2FA: boolean
      avatar: string
      twoFactorVerified: boolean
    }
    sessionToken?: string
  }
}
export {}
