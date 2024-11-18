import { sum } from 'drizzle-orm'

export default defineEventHandler(async () => {
  try {
    const candidates = await useDB().query.candidates.findMany()
    const candidateVotes = await useDB().select({
      candidateId: tables.candidateVotes.candidateId,
      candidateName: tables.candidates.name,
      totalVote: sum(tables.candidateVotes.totalVote)
    }).from(tables.candidateVotes)
      .leftJoin(tables.candidates, eq(tables.candidateVotes.candidateId, tables.candidates.id))
      .groupBy(tables.candidateVotes.candidateId)

    const createCategories = candidates.map(candidate => candidate.name)

    return successResponse({
      categories: createCategories,
      series: candidateVotes.map(candidateVote => Number(candidateVote.totalVote))
    })
  }
  catch (error) {
    console.log(error)
  }
})
