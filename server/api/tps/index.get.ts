import type { SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: SQL[] = []
  // filter by, villageId
  if (query.villageId) filters.push(eq(tables.tps, Number(query.villageId)))

  // const tps = (await useDB().select().from(tables.tps).where(and(...filters)))

  const tps = await useDB().query.tps.findMany({
    where: (tps, { eq }) => query.villageId ? eq(tps.villageId, Number(query.villageId)) : undefined,
    with: {
      village: true
    }
  })

  return successResponse(tps)
})
