export default defineEventHandler(async () => {
  const users = await useDB().query.users.findMany()

  return successResponse(users)
})
