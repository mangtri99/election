export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  let tps = await useDB().query.tps.findMany({
    where: (tps, { eq }) => query.villageId ? eq(tps.villageId, Number(query.villageId)) : undefined,
    with: {
      village: {
        with: {
          district: true
        }
      }
    }
  })

  if (query.districtId) {
    tps = tps.filter(tps => tps.village.districtId === Number(query.districtId))
  }

  return successResponse(tps)
})
