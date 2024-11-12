import * as jose from 'jose'
import type { User } from '#auth-utils'

export const runtimeConfig = useRuntimeConfig()

const JWT_SECRET = new TextEncoder().encode(
  runtimeConfig.jwtSecret
)

export const generateToken = async (user: User) => {
  const jwt = await new jose.SignJWT(user as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('my-first-app')
    .setAudience('app1')
    .setExpirationTime(runtimeConfig.jwtExpiresIn)
    .sign(JWT_SECRET)

  return jwt
}

export const verifyToken = async (token: string) => {
  const jwt = await jose.jwtVerify(token, JWT_SECRET, {
    audience: 'app1',
    issuer: 'my-first-app'

  })

  return jwt
}

export const decodeToken = (token: string) => {
  return jose.decodeJwt(token)
}
