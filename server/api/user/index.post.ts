import { useValidatedBody } from 'h3-zod'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const {
    name,
    username,
    phoneNumber,
    password,
    roleId,
    image
  } = await useValidatedBody(event, {
    name: z.string().min(4).max(100),
    username: z.string().min(4).max(100),
    password: z.string().min(8).max(100),
    phoneNumber: z.string().nullish(),
    roleId: z.number().nullish(),
    image: z.any().nullish()
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
      image: image || null,
      updatedAt: new Date(),
      createdAt: new Date()
    }).returning().get()

    return successResponse(user)
  }
  catch (error) {
    console.error('Error creating user:', error)
    return createError({
      statusCode: 409,
      statusMessage: 'Username already exists'
    })
  }
})
