import * as jose from 'jose'
import type { User } from '#auth-utils'

export const runtimeConfig = useRuntimeConfig()

const JWT_SECRET = new TextEncoder().encode(
  runtimeConfig.jwtSecret
)

export const generateToken = async (user: User) => {
  // const runtimeConfig = useRuntimeConfig()
  // return jwt.SignJWT(user, runtimeConfig.jwtSecret, {
  //   expiresIn: runtimeConfig.jwtExpiresIn
  // })
  // const secret = new TextEncoder().encode(
  //   runtimeConfig.jwtSecret
  // )
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

// export const generateRefreshToken = (user: User) => {
//   // const runtimeConfig = useRuntimeConfig()
//   return jwt.sign(user, runtimeConfig.jwtRefreshSecret, {
//     expiresIn: runtimeConfig.jwtExpiresIn
//   })
// }

// export const verifyRefreshToken = (token: string) => {
//   // const runtimeConfig = useRuntimeConfig()
//   return jwt.verify(token, runtimeConfig.jwtRefreshSecret)
// }
