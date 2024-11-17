import { generatePayload } from '~~/server/utils/tpsVotes/generatePayload'

export default defineEventHandler(async (event) => {
  const payload = await generatePayload(event)

  const createTpsVote = await useDB().insert(tables.tpsVotes).values({
    userId: Number(event.context.user.id),
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning().get()

  return successResponse(createTpsVote)
})
