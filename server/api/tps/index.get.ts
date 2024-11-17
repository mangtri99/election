export default defineEventHandler(async () => {
  const tps = await useDB().select().from(tables.tps).get()

  return successResponse(tps)
})
