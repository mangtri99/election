import type { SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: SQL[] = []
  // filter by, vote_id, candidate_id
  if (query.voteId) filters.push(eq(tables.candidateVotes, Number(query.voteId)))
  if (query.candidateId) filters.push(eq(tables.candidateVotes, Number(query.candidateId)))

  const candidateVotes = await useDB().select().from(tables.candidateVotes)
    .leftJoin(tables.tpsVotes, eq(tables.candidateVotes.voteId, tables.tpsVotes.id))
    .where(and(...filters))

  return successResponse(candidateVotes)
})
