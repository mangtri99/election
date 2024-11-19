import type { SQL } from 'drizzle-orm'
import { useValidatedBody, useValidatedParams, zh } from 'h3-zod'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  const payload = await useValidatedBody(event, {
    provinceId: z.number().int().positive(),
    regencyId: z.number().int().positive(),
    districtId: z.number().int().positive(),
    villageId: z.number().int().positive(),
    tpsId: z.number().int().positive().optional(),
    tpsNumber: z.string(),
    totalValidVote: z.number().int().positive(),
    totalInvalidVote: z.number().int().positive(),
    totalDptActive: z.number().positive().optional(),
    totalDptPassive: z.number().positive().optional(),
    totalOtherDpt: z.number().positive().optional(),
    totalDpt: z.number().positive().optional(),
    candidateVotes: z.any().array().default([]),
    reportName: z.string().optional(),
    reportPhoneNumber: z.string().optional()
  })

  let getTpsId = payload.tpsId
  let getTpsNumber = payload.tpsNumber

  const filters: SQL[] = []
  // filter by, provinceId, regencyId, districtId, villageId, tpsId,
  if (payload.tpsId) {
    filters.push(eq(tables.tpsVotes, Number(payload.tpsId)))
    const checkTpsVote = await useDB().select().from(tables.tpsVotes).where(and(...filters)).get()

    if (checkTpsVote) {
      return createError({
        statusCode: 400,
        statusMessage: 'Data di TPS ini sudah ada'
      })
    }
  }
  else {
    const checkTpsExist = await useDB().select().from(tables.tps).where(
      and(
        eq(tables.tps.villageId, Number(payload.villageId)),
        eq(tables.tps.name, payload.tpsNumber)
      )
    ).get()

    if (checkTpsExist) {
      // use existing tps
      getTpsId = checkTpsExist.id
      getTpsNumber = checkTpsExist.name
    }
    else {
      // else, create new tps
      const createTps = await useDB().insert(tables.tps).values({
        name: payload.tpsNumber,
        villageId: Number(payload.villageId),
        totalDpt: payload.totalDpt,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning().get()

      getTpsId = createTps.id
      getTpsNumber = createTps.name
    }
  }

  const updateTpsVote = await useDB().update(tables.tpsVotes).set({
    userId: event.context.user.id,
    ...payload,
    tpsId: getTpsId,
    tpsNumber: getTpsNumber,
    updatedAt: new Date()
  }).where(and(
    eq(tables.tpsVotes.id, id)
  )).returning().get()

  payload.candidateVotes?.forEach(async (candidateVote) => {
    await useDB().update(tables.candidateVotes).set({
      totalVote: candidateVote.totalVote,
      userId: event.context.user.id,
      updatedAt: new Date()
    }).where(and(
      eq(tables.candidateVotes.voteId, updateTpsVote.id),
      eq(tables.candidateVotes.candidateId, candidateVote.candidateId)
    )).returning().get()
  })

  return successResponse(updateTpsVote)
})
