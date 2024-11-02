export default defineTask({
  meta: {
    name: 'place:get',
    description: 'Run get place in Bali, Indonesia'
  },
  async run() {
    // interface ResponseAPI<T> {
    //   code: number
    //   message: string
    //   value: T
    // }

    // // interface Regency {
    // //   id: string
    // //   id_provinsi: string
    // //   name: string
    // // }

    // interface District {
    //   id: string
    //   id_kabupaten: string
    //   name: string
    // }

    // interface Village {
    //   id: string
    //   id_kecamatan: string
    //   name: string
    // }

    // const API_KEY = 'c8d5944f437492b21eab07d9985f61a3ce03f07d9b3a925ae4ab26cb392ff552'
    // const API_URL = 'https://api.binderbyte.com'
    // // const PROVINCE_BALI_ID = 51

    // // const DATA_REGENCIES = [] as InferSelectModel<typeof tables.regencies>[]
    // // const DATA_DISTRICTS = [] as InferSelectModel<typeof tables.district>[]
    // // const DATA_VILLAGES = [] as InferSelectModel<typeof tables.villages>[]

    // const getRegencies = await useDB().query.regencies.findMany()

    // getRegencies.forEach(async (regency) => {
    //   // DATA_REGENCIES.push({
    //   //   id: parseInt(regency.id.replace(/\./g, '')),
    //   //   name: regency.name.replace('KAB. ', ''),
    //   //   createdAt: new Date(),
    //   //   updatedAt: new Date(),
    //   //   provinceId: PROVINCE_BALI_ID
    //   // })

    //   // get districts (kecamatan) by regency id
    //   const getDistricts = await $fetch<ResponseAPI<District[]>>(`/wilayah/kecamatan`, {
    //     params: {
    //       api_key: API_KEY,
    //       // change int 5101 to string 51.01
    //       id_kabupaten: String(regency.id).replace(/(\d{2})$/, '.$1')
    //     },
    //     method: 'GET',
    //     baseURL: API_URL
    //   })

    //   // store to district table
    //   getDistricts.value.forEach(async (district) => {
    //     // DATA_DISTRICTS.push()

    //     await useDB().insert(tables.district).values({
    //       id: parseInt(district.id.replace(/\./g, '')),
    //       name: district.name,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //       regencyId: regency.id
    //     }).onConflictDoNothing()

    //     // get villages (desa) by district id
    //     const getVillages = await $fetch<ResponseAPI<Village[]>>(`/wilayah/kelurahan`, {
    //       params: {
    //         api_key: API_KEY,
    //         id_kecamatan: district.id
    //       },
    //       method: 'GET',
    //       baseURL: API_URL
    //     })

    //     console.log('getVillages', getVillages)

    //     // store to village table
    //     getVillages.value.forEach(async (village) => {
    //       // DATA_VILLAGES.push()

    //       await useDB().insert(tables.villages).values({
    //         id: parseInt(village.id.replace(/\./g, '')),
    //         name: village.name,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         districtId: parseInt(district.id.replace(/\./g, ''))
    //       }).onConflictDoNothing()
    //     })
    //   })
    // })

    // await useDB().batch([
    //   // useDB().insert(tables.provinces).values({
    //   //   id: PROVINCE_BALI_ID,
    //   //   name: 'BALI',
    //   //   createdAt: new Date(),
    //   //   updatedAt: new Date()
    //   // }),
    //   // useDB().insert(tables.regencies).values(DATA_REGENCIES)
    //   useDB().insert(tables.district).values(DATA_DISTRICTS),
    //   useDB().insert(tables.villages).values(DATA_VILLAGES)
    // ])

    return { result: 'Success' }
  }
})
