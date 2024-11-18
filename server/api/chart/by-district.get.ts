export default defineEventHandler(async () => {
  try {
    const districts = await useDB().query.district.findMany({
      where: (district, { eq }) => eq(district.regencyId, 5107)
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
        // data is an array of sum of totalVote candidate per district
        data: districts.map((district) => {
          const candidateVote = candidateVotes.filter((candidateVote) => {
            return candidateVote.candidateId === candidate.id && candidateVote.vote.districtId === district.id
          })

          return candidateVote.reduce((acc, curr) => {
            return acc + curr.totalVote
          }, 0)
        })
      }
    }
    )

    const createCategories = districts.map(district => district.name)

    return successResponse({
      categories: createCategories,
      series: createSeries
    })
  }
  catch (error) {
    console.log(error)
  }
})
