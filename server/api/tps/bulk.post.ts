import { useValidatedBody, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const {
    tpsNumberFrom,
    tpsNumberTo,
    villageId
  } = await useValidatedBody(event, {
    tpsNumberFrom: z.number().int().positive(),
    tpsNumberTo: z.number().int().positive(),
    villageId: z.number().int().positive()
  })

  // create tps as much as tpsNumberTo - tpsNumberFrom
  // use the number as the name of the tps
  const createTps = [] as typeof tables.tps.$inferInsert[]
  for (let i = tpsNumberFrom; i <= tpsNumberTo; i++) {
    const checkTpsExist = await useDB().select().from(tables.tps)
      .where(and(eq(tables.tps.name, i.toString()), eq(tables.tps.villageId, villageId)))
      .get()

    if (checkTpsExist) {
      throw createError({
        statusCode: 400,
        statusMessage: `TPS Nomor ${i} yang dimasukkan sudah terdaftar!`
      })
    }

    createTps.push({
      name: i.toString(),
      villageId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  const splitData = createTps.reduce((acc, curr, index) => {
    const groupIndex = Math.floor(index / 10)
    if (!acc[groupIndex]) {
      acc[groupIndex] = []
    }
    acc[groupIndex].push(curr)
    return acc
  }
  , [])

  splitData.forEach(async (data) => {
    await useDB().insert(tables.tps).values(data)
  })

  // await useDB().insert(tables.tps).values(createTps)

  return successResponse({
    message: `TPS ${tpsNumberFrom} - ${tpsNumberTo} berhasil dibuat`
  })
})
