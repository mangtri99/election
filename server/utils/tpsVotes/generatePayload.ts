import type { SQL } from 'drizzle-orm'
import { useValidatedBody, z } from 'h3-zod'
import type { H3Event, EventHandlerRequest } from 'h3'

export async function generatePayload(event: H3Event<EventHandlerRequest>) {
  const {
    provinceId,
    regencyId,
    districtId,
    villageId,
    tpsId,
    tpsNumber,
    totalValidVote,
    totalInvalidVote,
    totalDptActive,
    totalDptPassive,
    totalOtherDpt,
    totalDpt

  } = await useValidatedBody(event, {
    provinceId: z.number().int().positive(),
    regencyId: z.number().int().positive(),
    districtId: z.number().int().positive(),
    villageId: z.number().int().positive(),
    tpsId: z.number().int().positive().nullish(),
    tpsNumber: z.string(),
    totalValidVote: z.number().int().positive(),
    totalInvalidVote: z.number().int().positive(),
    totalDptActive: z.number().int().positive(),
    totalDptPassive: z.number().int().positive(),
    totalOtherDpt: z.number().int().positive().default(0),
    totalDpt: z.number().int().positive().default(0)

  })

  let getTpsId = tpsId
  let getTpsNumber = tpsNumber

  const filters: SQL[] = []
  // filter by, provinceId, regencyId, districtId, villageId, tpsId,
  if (tpsId) {
    filters.push(eq(tables.tpsVotes, Number(tpsId)))
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
        eq(tables.tps.villageId, Number(villageId)),
        eq(tables.tps.name, tpsNumber)
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
        name: tpsNumber,
        villageId: Number(villageId),
        totalDpt: totalDpt,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning().get()

      getTpsId = createTps.id
      getTpsNumber = createTps.name
    }
  }

  return {
    provinceId,
    regencyId,
    districtId,
    villageId,
    tpsId: getTpsId,
    tpsNumber: getTpsNumber,
    totalValidVote,
    totalInvalidVote,
    totalDptActive,
    totalDptPassive,
    totalOtherDpt,
    totalDpt
  }
}
