import { inArray, type SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: SQL[] = []
  if (query.districtId) {
    if (Array.isArray(query.districtId)) {
      filters.push(inArray(tables.villages.districtId, query.districtId.map(Number)))
    }
    else {
      filters.push(eq(tables.villages.districtId, Number(query.districtId)))
    }
  }

  const villages = await useDB().select().from(tables.villages).where(and(...filters))

  return successResponse(villages)
})
