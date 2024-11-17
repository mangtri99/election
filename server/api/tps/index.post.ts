import { useValidatedBody, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const {
    name,
    villageId,
    totalDpt
  } = await useValidatedBody(event, {
    name: z.string(),
    villageId: z.number().int().positive(),
    totalDpt: z.number().int().positive()
  })

  const checkTpsExist = await useDB().select().from(tables.tps)
    .where(and(eq(tables.tps.name, name), eq(tables.tps.villageId, villageId)))
    .get()

  if (checkTpsExist) {
    throw createError({
      status: 400,
      message: 'TPS yang dimasukkan sudah terdaftar!'
    })
  }

  const createTps = await useDB().insert(tables.tps).values({
    name,
    villageId,
    totalDpt,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning().get()

  return successResponse(createTps)
})
