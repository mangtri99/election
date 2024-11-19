import { useValidatedParams, zh } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  // delete tps by id
  await useDB().delete(tables.tps).where(eq(tables.tps.id, id)).get()

  return successResponse({
    message: `TPS berhasil dihapus`
  })
})
