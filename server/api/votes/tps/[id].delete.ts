import { useValidatedParams, zh } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  try {
    await useDB().delete(tables.candidateVotes).where(eq(tables.candidateVotes.voteId, id))
    await useDB().delete(tables.tpsVotes).where(eq(tables.tpsVotes.id, id))

    return successResponse({
      message: `Laporan Suara TPS berhasil dihapus`
    })
  }
  catch (error) {
    console.error(error)
    return createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan saat menghapus Laporan Suara TPS'
    })
  }
})
