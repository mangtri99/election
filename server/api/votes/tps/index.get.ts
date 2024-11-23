import type { SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: SQL[] = []
  // filter by, provinceId, regencyId, districtId, villageId, tpsId,
  if (query.provinceId) filters.push(eq(tables.tpsVotes.provinceId, Number(query.provinceId)))
  if (query.regencyId) filters.push(eq(tables.tpsVotes.regencyId, Number(query.regencyId)))
  if (query.districtId) filters.push(eq(tables.tpsVotes.districtId, Number(query.districtId)))
  if (query.villageId) filters.push(eq(tables.tpsVotes.villageId, Number(query.villageId)))
  if (query.tpsId) filters.push(eq(tables.tpsVotes.tpsId, Number(query.tpsId)))

  // user can only see their own votes
  if (event.context?.user?.role === 'user') filters.push(eq(tables.tpsVotes.userId, Number(event.context.user.id)))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformDataCandidateVotes(data: any = []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed = {} as any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.candidateVotes.forEach((candidateVote: any, index: number) => {
      const candidateIndex = index + 1 // To align with 1-based indexing
      transformed[`candidateName${candidateIndex}`] = candidateVote.candidate.name
      transformed[`candidateTotalVote${candidateIndex}`] = candidateVote.totalVote
    })

    return transformed
  }

  const tpsVotes = await useDB().query.tpsVotes.findMany({
    where: and(...filters),
    orderBy: (tv, { desc }) => [desc(tv.id)],
    with: {
      candidateVotes: {
        orderBy: (cv, { asc }) => [asc(cv.candidateId)],
        with: {
          candidate: true
        }
      },
      district: true,
      regency: true,
      province: true,
      village: true,
      tps: true
    }
  })

  const formattedTpsVotes = tpsVotes.map((tpsVote) => {
    const transformedCandidateVotes = transformDataCandidateVotes(tpsVote)
    return {
      ...tpsVote,
      ...transformedCandidateVotes
    }
  })

  return successResponse(formattedTpsVotes)
})
