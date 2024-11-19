import { ne } from 'drizzle-orm'
import { useValidatedBody, useValidatedParams, zh } from 'h3-zod'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

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
    .where(and(eq(tables.tps.name, name), eq(tables.tps.villageId, villageId), ne(tables.tps.id, id)))
    .get()

  if (checkTpsExist) {
    throw createError({
      status: 400,
      message: 'TPS yang dimasukkan sudah terdaftar!'
    })
  }

  const updateTps = await useDB().update(tables.tps).set({
    name,
    villageId,
    totalDpt,
    updatedAt: new Date()
  }).where(eq(tables.tps.id, id)).returning().get()

  return successResponse(updateTps)
})
