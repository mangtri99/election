import { useValidatedBody, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const {
      username,
      password
    } = await useValidatedBody(event, {
      username: z.string().min(4).max(100),
      password: z.string().min(8).max(100)
    })

    const user = await useDB().query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
      with: {
        role: true
      }
    })

    if (!user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid username or password'
      })
    }

    if (await verifyPassword(user?.password, password)) {
      // Set user session
      await setUserSession(event, {
        user: {
          id: user.id,
          login: user.username,
          name: user.name,
          role: 'user'
        },
        loggedInAt: new Date()
      })

      return { success: true, user }
    }
    else {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid username or password'
      })
    }
  }
  catch (error) {
    console.error('Error handling login request:', error)
    return createError({
      statusCode: 400,
      statusMessage: 'Failed to process request'
    })
  }
})
