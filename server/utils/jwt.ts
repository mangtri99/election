import jwt from 'jsonwebtoken'
import type { User } from '#auth-utils'

export const generateToken = (user: User) => {
  const runtimeConfig = useRuntimeConfig()
  return jwt.sign(user, runtimeConfig.jwtSecret, {
    expiresIn: runtimeConfig.jwtExpiresIn
  })
}

export const verifyToken = (token: string) => {
  const runtimeConfig = useRuntimeConfig()
  return jwt.verify(token, runtimeConfig.jwtSecret)
}

export const generateRefreshToken = (user: User) => {
  const runtimeConfig = useRuntimeConfig()
  return jwt.sign(user, runtimeConfig.jwtRefreshSecret, {
    expiresIn: runtimeConfig.jwtExpiresIn
  })
}

export const verifyRefreshToken = (token: string) => {
  const runtimeConfig = useRuntimeConfig()
  return jwt.verify(token, runtimeConfig.jwtRefreshSecret)
}

export const decodeToken = (token: string) => {
  return jwt.decode(token)
}
