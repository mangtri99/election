export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    const tps = await useDB().query.tps.findMany({
      where: (tp, { eq }) => eq(tp.villageId, Number(query.villageId)),
      // cast name as number
      orderBy: tps => sql`CAST(${tps.name} AS SIGNED) ASC`
    })

    const candidates = await useDB().query.candidates.findMany()

    const candidateVotes = await useDB().query.candidateVotes.findMany({
      with: {
        vote: true // tps vote
      }
    })

    const createSeries = candidates.map((candidate) => {
      return {
        name: candidate.name,
        // data is an array of sum of totalVote candidate per tps
        data: tps.map((tp) => {
          const candidateVote = candidateVotes.filter((candidateVote) => {
            return candidateVote.candidateId === candidate.id && candidateVote.vote.tpsId === tp.id
          })

          return candidateVote.reduce((acc, curr) => {
            return acc + curr.totalVote
          }, 0)
        })
      }
    }
    )

    const createCategories = tps.map(tp => `No.${tp.name}`)

    return successResponse({
      categories: createCategories,
      series: createSeries
    })
  }
  catch (error) {
    console.log(error)
  }
})
