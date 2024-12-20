export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api')) return
  if (event.path.startsWith('/api/auth/login')) return
  if (event.path.startsWith('/api/auth/signup')) return

  const session = await getUserSession(event)

  event.context.user = session.user

  // if (!session.secure) {
  //   const authHeader = event.node.req.headers.authorization

  //   if (!authHeader) {
  //     return createError({
  //       statusCode: 401,
  //       statusMessage: 'Token is required'
  //     })
  //   }

  //   const getToken = authHeader.split(' ')[1]

  //   const verifyJwtToken = await verifyToken(getToken)

  //   // if token is invalid
  //   if (!verifyJwtToken) {
  //     // event.context.user = null
  //     return createError({
  //       statusCode: 401,
  //       statusMessage: 'Invalid token'
  //     })
  //   }

  //   event.context.user = decodeToken(getToken)
  // }
  // else {
  //   event.context.user = session.user
  // }
})
