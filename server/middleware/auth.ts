export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/login")) return;
  if (event.path.startsWith("/api/auth/login")) return;
  // verify token
  const session = await requireUserSession(event)
  const verifyJwtToken = verifyToken(session.secure?.token)

  // if token is invalid
  if (!verifyJwtToken) {
    return createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})
