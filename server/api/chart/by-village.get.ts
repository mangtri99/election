export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    const villages = await useDB().query.villages.findMany({
      where: (village, { eq }) => eq(village.districtId, Number(query.districtId))
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
        // data is an array of sum of totalVote candidate per village
        data: villages.map((village) => {
          const candidateVote = candidateVotes.filter((candidateVote) => {
            return candidateVote.candidateId === candidate.id && candidateVote.vote.villageId === village.id
          })

          return candidateVote.reduce((acc, curr) => {
            return acc + curr.totalVote
          }, 0)
        })
      }
    }
    )

    const createCategories = villages.map(village => village.name)

    return successResponse({
      categories: createCategories,
      series: createSeries
    })
  }
  catch (error) {
    console.log(error)
  }
})
