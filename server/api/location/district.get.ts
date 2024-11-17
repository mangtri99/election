import type { SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: SQL[] = []
  if (query.regencyId) filters.push(eq(tables.district.regencyId, Number(query.regencyId)))

  const districts = await useDB().select().from(tables.district).where(and(...filters))

  return successResponse(districts)
})
