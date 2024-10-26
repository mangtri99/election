import { useValidatedBody, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    const {
      name,
      username,
      phoneNumber,
      password,
      roleId
    } = await useValidatedBody(event, {
      name: z.string().min(4).max(100),
      username: z.string().min(4).max(100),
      password: z.string().min(8).max(100),
      phoneNumber: z.string().nullish(),
      roleId: z.number().nullish()
    })

    const hashedPassword = await hashPassword(password)

    try {
      // create user
      const user = await useDB().insert(tables.users).values({
        name: name,
        username: username,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        roleId: roleId || null,
        updatedAt: new Date(),
        createdAt: new Date()
      }).returning().get()

      let getRole = undefined
      if (roleId) {
        getRole = await useDB().select().from(tables.roles).where(eq(tables.roles.id, roleId)).get()
      }

      await setUserSession(event, {
        user: {
          id: user.id,
          login: user.username,
          name: user.name,
          role: getRole?.name || 'user'
        }
      })
      return { success: true, user }
    }
    catch (error) {
      console.error('Error creating user:', error)
      return createError({
        statusCode: 409,
        statusMessage: 'Username already exists'
      })
    }
  }
  catch (error) {
    console.error('Error handling signup request:', error)
    return createError({
      statusCode: 400,
      statusMessage: 'Failed to process request'
    })
  }
})
