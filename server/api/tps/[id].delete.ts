import { useValidatedParams, zh } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  try {
    // delete tps by id
    await useDB().delete(tables.tps).where(eq(tables.tps.id, id))

    return successResponse({
      message: `TPS berhasil dihapus`
    })
  }
  catch (error) {
    console.error(error)
    return createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan saat menghapus TPS'
    })
  }
})
