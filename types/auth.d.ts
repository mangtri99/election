declare module '#auth-utils' {
  interface User {
    id: number
    login: string
    name?: string
    role?: string
  }
}
export {}
