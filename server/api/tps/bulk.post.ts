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
  for (let i = tpsNumberFrom; i <= tpsNumberTo; i++) {
    const checkTpsExist = await useDB().select().from(tables.tps)
      .where(and(eq(tables.tps.name, i.toString()), eq(tables.tps.villageId, villageId)))
      .get()

    if (checkTpsExist) {
      throw createError({
        status: 400,
        message: `TPS ${i} yang dimasukkan sudah terdaftar!`
      })
    }

    await useDB().insert(tables.tps).values({
      name: i.toString(),
      villageId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).get()
  }

  return successResponse({
    message: `TPS ${tpsNumberFrom} - ${tpsNumberTo} berhasil dibuat`
  })
})
