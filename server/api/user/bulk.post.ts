import { useValidatedBody } from 'h3-zod'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  // body:
  // location: 'district' | 'village'
  // if location === 'district'
  // create user for all district
  // if location === 'village'
  // create user for all village

  const DEFAULT_REGENCY_ID = 5107
  const DEFAULT_ROLE_ID = 2

  const payload = await useValidatedBody(event, {
    location: z.enum(['district', 'village']),
    password: z.string().min(8)
  })
  const getDistricts = await useDB().query.district.findMany({
    where: (districts, { eq }) => eq(districts.regencyId, DEFAULT_REGENCY_ID)
  })

  const hashedPassword = await hashPassword(payload.password)

  const createUsername = (name: string) => {
    return name.toLowerCase().replace(/ /g, '')
  }

  if (payload.location === 'district') {
    const createDataUser = [] as typeof tables.users.$inferInsert[]
    getDistricts.forEach(async (district) => {
      createDataUser.push({
        name: district.name,
        username: createUsername(`${district.name}2025`),
        password: hashedPassword,
        roleId: DEFAULT_ROLE_ID || null,
        updatedAt: new Date(),
        createdAt: new Date()
      })
    })
    await useDB().insert(tables.users).values(createDataUser)

    return successResponse({
      message: 'Success create user for all district'
    })
  }
  else if (payload.location === 'village') {
    // get all village
    const getVillages = await useDB().query.villages.findMany({
      with: {
        district: true
      }
    })

    // filter village by district where has regencyId = 5107
    const getVillagesByRegency = getVillages.filter(village => village.district.regencyId === DEFAULT_REGENCY_ID)
    const createDataUser = [] as typeof tables.users.$inferInsert[]
    // create user for all village
    getVillagesByRegency.forEach(async (village) => {
      createDataUser.push({
        name: village.name,
        username: createUsername(`${village.name}2025`),
        password: hashedPassword,
        roleId: DEFAULT_ROLE_ID || null,
        updatedAt: new Date(),
        createdAt: new Date()
      })
    })
    await useDB().insert(tables.users).values(createDataUser)

    return successResponse({
      message: 'Success create user for all village'
    })
  }
  else {
    return createError({
      statusCode: 400,
      statusMessage: 'Invalid location'
    })
  }
})
