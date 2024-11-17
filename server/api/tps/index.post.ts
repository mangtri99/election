import { useValidatedBody, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    const {
      name,
      villageId,
      totalDpt
    } = await useValidatedBody(event, {
      name: z.string(),
      villageId: z.number().int().positive(),
      totalDpt: z.number().int().positive()
    })

    const createTps = await useDB().insert(tables.tps).values({
      name,
      villageId,
      totalDpt,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning().get()

    return successResponse(createTps)
  }
  catch (error) {
    console.error('Error creating tps:', error)
    return createError({
      statusCode: 400,
      statusMessage: 'Failed to process request'
    })
  }
})
