import { generatePayload } from '~~/server/utils/tpsVotes/generatePayload'

export default defineEventHandler(async (event) => {
  try {
    const payload = await generatePayload(event)

    const createTpsVote = await useDB().insert(tables.tpsVotes).values({
      userId: Number(event.context.user.id),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning().get()

    return successResponse(createTpsVote)
  }
  catch (error) {
    console.error('Error creating tps:', error)
    return createError({
      statusCode: 400,
      statusMessage: 'Failed to process request'
    })
  }
})
