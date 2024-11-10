export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  return {
    success: true,
    user: session.user
  }
})
