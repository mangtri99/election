declare module '#auth-utils' {
  interface User {
    id: number
    login: string
    name?: string
    role?: string
  }

  interface UserSession {
    user: User
    loggedInAt: Date
    accessToken?: string
    secure: SecureSessionData
  }

  interface SecureSessionData {
    token?: string
    refreshToken?: string
  }
}
export {}
