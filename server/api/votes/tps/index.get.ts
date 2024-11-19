import type { SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: SQL[] = []
  // filter by, provinceId, regencyId, districtId, villageId, tpsId,
  if (query.provinceId) filters.push(eq(tables.tpsVotes, Number(query.provinceId)))
  if (query.regencyId) filters.push(eq(tables.tpsVotes, Number(query.regencyId)))
  if (query.districtId) filters.push(eq(tables.tpsVotes, Number(query.districtId)))
  if (query.villageId) filters.push(eq(tables.tpsVotes, Number(query.villageId)))
  if (query.tpsId) filters.push(eq(tables.tpsVotes, Number(query.tpsId)))

  const tpsVotes = await useDB().query.tpsVotes.findMany({
    where: and(...filters),
    with: {
      candidateVotes: true,
      district: true,
      regency: true,
      province: true,
      village: true,
      tps: true
    }
  })

  return successResponse(tpsVotes)
})
