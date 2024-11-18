import { sum } from 'drizzle-orm'

export default defineEventHandler(async () => {
  try {
    const tpsVotes = await useDB().select({
      totalValidVote: sum(tables.tpsVotes.totalValidVote),
      totalInvalidVote: sum(tables.tpsVotes.totalInvalidVote)
    }).from(tables.tpsVotes)

    return successResponse(tpsVotes)
  }
  catch (error) {
    console.log(error)
  }
})
