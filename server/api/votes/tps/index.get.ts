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

  const tpsVotes = (await useDB().select().from(tables.tpsVotes)
    .leftJoin(tables.tps, eq(tables.tpsVotes.tpsId, tables.tps.id))
    .leftJoin(tables.villages, eq(tables.tps.villageId, tables.villages.id))
    .leftJoin(tables.district, eq(tables.villages.districtId, tables.district.id))
    .leftJoin(tables.regencies, eq(tables.district.regencyId, tables.regencies.id))
    .where(and(...filters)).get())

  return successResponse(tpsVotes)
})
