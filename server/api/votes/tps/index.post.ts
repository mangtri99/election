import type { SQL } from 'drizzle-orm'
import { useValidatedBody } from 'h3-zod'
import { z } from 'zod'
// import { generatePayload } from '~~/server/utils/tpsVotes/generatePayload'

export default defineEventHandler(async (event) => {
  // const payload = await generatePayload(event)
  const { user } = await requireUserSession(event)

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
    filters.push(eq(tables.tpsVotes.tpsId, Number(payload.tpsId)))
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
        totalDpt: payload.totalDpt ?? 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning().get()

      getTpsId = createTps.id
      getTpsNumber = createTps.name
    }
  }

  const createTpsVote = await useDB().insert(tables.tpsVotes).values({
    userId: Number(user.id),
    ...payload,
    tpsId: getTpsId,
    tpsNumber: getTpsNumber,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning().get()

  const createCandidateVotes = [] as typeof tables.candidateVotes.$inferInsert[]
  payload.candidateVotes?.forEach(async (candidateVote) => {
    createCandidateVotes.push({
      voteId: createTpsVote.id,
      candidateId: candidateVote.candidateId,
      totalVote: candidateVote.totalVote,
      userId: Number(user.id),
      createdAt: new Date(),
      updatedAt: new Date()
    })
  })

  await useDB().insert(tables.candidateVotes).values(createCandidateVotes)

  return successResponse({
    message: 'Laporan TPS berhasil disimpan'
  })
})
