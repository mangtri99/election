export default defineEventHandler(async () => {
  const candidates = await useDB().select().from(tables.candidates)

  return successResponse(candidates)
})
