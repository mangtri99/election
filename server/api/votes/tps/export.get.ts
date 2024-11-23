import type { SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filters: SQL[] = []
  // filter by, provinceId, regencyId, districtId, villageId, tpsId,
  if (query.all === false) {
    if (query.provinceId) filters.push(eq(tables.tpsVotes.provinceId, Number(query.provinceId)))
    if (query.regencyId) filters.push(eq(tables.tpsVotes.regencyId, Number(query.regencyId)))
    if (query.districtId) filters.push(eq(tables.tpsVotes.districtId, Number(query.districtId)))
    if (query.villageId) filters.push(eq(tables.tpsVotes.villageId, Number(query.villageId)))
    if (query.tpsId) filters.push(eq(tables.tpsVotes.tpsId, Number(query.tpsId)))
  }

  const tpsVotes = await useDB().query.tpsVotes.findMany({
    where: and(...filters),
    with: {
      candidateVotes: {
        with: {
          candidate: true
        }
      },
      district: true,
      regency: true,
      province: true,
      village: true,
      tps: true
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformDataCandidateVotes(data: any = []) {
    const transformed = {}

    data.candidateVotes.forEach((candidateVote, index) => {
      const candidateIndex = index + 1 // To align with 1-based indexing
      // transformed[`candidateName${candidateIndex}`] = candidateVote.candidate.name
      transformed[`candidateTotalVote${candidateIndex}`] = candidateVote.totalVote
    })

    return transformed
  }

  const csvHeader = [
    'Provinsi',
    'Kabupaten',
    'Kecamatan',
    'Kelurahan/Desa',
    'Nomor TPS',
    'Total Suara Paslon 1',
    'Total Suara Paslon 2',
    'Total Suara Paslon 3',
    'Total Suara Sah',
    'Total Suara Tidak Sah',
    // 'Total DPT yang Hadir',
    // 'Total DPT yang Tidak Hadir',
    'Total Suara Sah + Tidak Sah',
    'Nama Pelapor',
    'Nomor HP Pelapor'
  ]

  // create csv
  const dataCsv = tpsVotes.map((tpsVote) => {
    return {
      province: tpsVote.province?.name,
      regency: tpsVote.regency?.name,
      district: tpsVote.district?.name,
      village: tpsVote.village?.name,
      tps: tpsVote.tps?.name,
      ...transformDataCandidateVotes(tpsVote),
      totalValidVote: tpsVote.totalValidVote ?? 0,
      totalInvalidVote: tpsVote.totalInvalidVote ?? 0,
      // totalDptActive: tpsVote.totalDptActive ?? 0,
      // totalDptPassive: tpsVote.totalDptPassive ?? 0,
      totalAllVote: tpsVote.totalValidVote + tpsVote.totalInvalidVote,
      reportName: tpsVote.reportName,
      reportPhoneNumber: tpsVote.reportPhoneNumber
    }
  })

  // Convert data to CSV format
  const csvString = dataCsv.map((row) => {
    return Object.values(row).join(',')
  })

  // Add header
  csvString.unshift(csvHeader.join(','))

  const csv = csvString.join('\n')

  setHeader(event, 'Content-Type', 'text/csv')
  setHeader(event, 'Content-Disposition', 'attachment; filename=data.csv')

  return csv
})
