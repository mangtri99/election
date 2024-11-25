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
    totalValidVote: z.number().min(0),
    totalInvalidVote: z.number().min(0),
    // totalDptActive: z.number().min(0).optional(),
    // totalDptPassive: z.number().min(0).optional(),
    // totalOtherDpt: z.number().min(0).optional(),
    totalDpt: z.number().min(0).optional(),
    candidateVotes: z.any().array().default([]),
    reportName: z.string().min(0).optional(),
    reportPhoneNumber: z.string().min(0).optional()
  })

  let getTpsId = null
  // remove 0 if on first digit
  let getTpsNumber = payload.tpsNumber ? payload.tpsNumber.replace(/^0+/, '') : ''

  const filters: SQL[] = []

  // if (payload.tpsId) {
  //   filters.push(eq(tables.tpsVotes.tpsId, Number(payload.tpsId)))
  //   const checkTpsVote = await useDB().select().from(tables.tpsVotes).where(and(...filters)).get()

  //   if (checkTpsVote) {
  //     return createError({
  //       statusCode: 400,
  //       statusMessage: 'Data di TPS ini sudah ada'
  //     })
  //   }
  // }
  // else {
  filters.push(eq(tables.tpsVotes.tpsNumber, getTpsNumber))
  filters.push(eq(tables.tpsVotes.villageId, payload.villageId))

  const checkTpsVote = await useDB().select().from(tables.tpsVotes).where(and(...filters)).get()

  if (checkTpsVote) {
    return createError({
      statusCode: 400,
      statusMessage: 'Data di TPS ini sudah ada'
    })
  }

  const checkTpsExist = await useDB().select().from(tables.tps).where(
    and(
      eq(tables.tps.villageId, Number(payload.villageId)),
      eq(tables.tps.name, getTpsNumber)
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
      name: getTpsNumber,
      villageId: Number(payload.villageId),
      totalDpt: payload.totalDpt ?? 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning().get()

    getTpsId = createTps.id
    getTpsNumber = createTps.name
  }
  // }

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
