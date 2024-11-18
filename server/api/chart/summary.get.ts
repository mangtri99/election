import { count, sum } from 'drizzle-orm'

export default defineEventHandler(async () => {
  try {
    const tpsVotes = await useDB().select({
      totalValidVote: sum(tables.tpsVotes.totalValidVote),
      totalInvalidVote: sum(tables.tpsVotes.totalInvalidVote),
      countTps: count(tables.tpsVotes.tpsId)
    }).from(tables.tpsVotes).get()

    return successResponse(tpsVotes)
  }
  catch (error) {
    console.log(error)
  }
})
