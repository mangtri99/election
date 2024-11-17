import { useValidatedParams, zh } from 'h3-zod'
import { generatePayload } from '~~/server/utils/tpsVotes/generatePayload'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  const payload = await generatePayload(event)

  const { user } = await requireUserSession(event)

  const todo = await useDB().update(tables.tpsVotes).set({
    userId: user.id,
    ...payload,
    updatedAt: new Date()

  }).where(and(
    eq(tables.tpsVotes.id, id)
  )).returning().get()

  return successResponse(todo)
})
