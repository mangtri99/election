import { useValidatedBody, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  try {
    const {
      voteId,
      candidateId,
      totalVote

    } = await useValidatedBody(event, {
      voteId: z.number().int().positive(),
      candidateId: z.number().int().positive(),
      totalVote: z.number().int().positive().default(0)

    })

    const createCandidateVotes = await useDB().insert(tables.candidateVotes).values({
      voteId,
      candidateId,
      totalVote,
      userId: Number(event.context.user.id),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning().get()

    return successResponse(createCandidateVotes)
  }
  catch (error) {
    console.error('Error creating candidate votes:', error)
    return createError({
      statusCode: 400,
      statusMessage: 'Failed to process request'
    })
  }
})
