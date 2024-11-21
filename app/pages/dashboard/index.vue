<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'

interface ChartData {
  series: number[]
  categories: string[]
}

interface Summary {
  totalValidVote: number
  totalInvalidVote: number
  countTps: number
}

definePageMeta({
  middleware: 'admin'
})

const runtimeConfig = useRuntimeConfig()
const { data: districtOptions } = await useFetch<APIResponseData<District[]>>('/api/location/district', {
  query: {
    regencyId: runtimeConfig.public.defaultRegencyId
  }
})

const { data: villageOptions } = await useAsyncData('village-options', () => $fetch<APIResponseData<Village[]>>(`/api/location/village`))
const { data: summaryVote } = await useAsyncData('chart-summary', () => $fetch<APIResponseData<Summary>>(`/api/chart/summary`))

// const { data: tpsOptions } = await useAsyncData('tps-options', () => $fetch<APIResponseData<Tps[]>>(`/api/tps`))

const filterByVillage = ref({
  district: districtOptions.value?.data?.[0] || undefined
})

const filterByTps = ref({
  district: districtOptions.value?.data?.[0] || undefined,
  village: villageOptions?.value?.data?.[0] || undefined
})

const { data, status: statusVoteAll } = useFetch<APIResponseData<ChartData>>('/api/chart/all')
const { data: listVoteByDistrict, status: statusVoteByDistrict } = useFetch<APIResponseData<ChartData>>('/api/chart/by-district')

const { data: listVoteByVillage, status: statusVoteByVillage } = useAsyncData('chart-by-village', () => $fetch<APIResponseData<ChartData>>(`/api/chart/by-village`, {
  query: {
    districtId: filterByVillage.value.district?.id
  }
}), {
  watch: [filterByVillage.value],
  deep: true
})

const { data: listVoteByTps, status: statusVoteByTps } = useAsyncData('chart-by-tps', () => $fetch<APIResponseData<ChartData>>(`/api/chart/by-tps`, {
  query: {
    districtId: filterByTps.value.district?.id,
    villageId: filterByTps.value.village?.id
  }
}), {
  watch: [filterByTps.value],
  deep: true
})

const generateSeries = (data: ChartData) => {
  return [
    {
      name: 'Jumlah Suara',
      data: data.series || []
    }
  ]
}

const getVillageByDistrict = (districtId?: number) => {
  if (!districtId) return villageOptions?.value?.data || []
  return villageOptions?.value?.data?.filter(village => village.districtId === districtId) || []
}

watch(() => filterByTps.value.district, () => {
  filterByTps.value.village = getVillageByDistrict(filterByTps.value.district?.id)?.[0]
}, {
  deep: true
})
</script>

<template>
  <div>
    <ClientOnly>
      <div class="grid grid-cols-1 gap-y-4">
        <div>
          <UCard class="text-center">
            <template #header>
              <div class="w-full">
                <h1 class="text-3xl text-center">
                  Rekapitulasi Penghitungan Suara
                </h1>
              </div>
            </template>
            <h2 class="text-2xl">
              Laporan Total Suara Masuk
            </h2>
            <div class="flex items-start justify-center space-x-8">
              <div>
                <p class="text-xl">
                  {{ summaryVote?.data?.totalValidVote }} Suara dari {{ summaryVote?.data?.countTps }} TPS
                </p>
                <!-- <p>1000 Suara</p> -->
              </div>
              <!-- <div>
                <p class="text-xl">
                  Total Suara Sah
                </p>
                <p>1000 Suara</p>
              </div> -->
            </div>
          </UCard>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 gap-y-4 md:gap-y-0">
          <div class="w-full">
            <UCard>
              <p class="text-center">
                Perolehan Suara Total (Persentase)
              </p>
              <div>
                <div
                  v-if="statusVoteAll === 'pending'"
                  class="text-center text-2xl"
                >
                  Loading...
                </div>

                <div v-else>
                  <VueApexCharts
                    v-if="data?.data?.categories && data?.data?.categories.length > 0"
                    type="pie"
                    :options="{
                      labels: data?.data?.categories || [],
                      chart: {
                        id: 'total-persentase'
                      }
                    }"
                    :series="[
                      ...data?.data?.series || []
                    ]"
                    height="350"
                  />
                  <div
                    v-else
                    class="text-center text-xl"
                  >
                    Data Tidak Ada
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <div class="w-full">
            <UCard>
              <p class="text-center">
                Perolehan Suara Total (Jumlah)
              </p>

              <div>
                <div
                  v-if="statusVoteAll === 'pending'"
                  class="text-center text-2xl"
                >
                  Loading...
                </div>

                <div v-else>
                  <VueApexCharts
                    v-if="data?.data?.categories && data?.data?.categories.length > 0"
                    type="bar"
                    :options="{
                      xaxis: {
                        categories: data?.data?.categories || []
                      },
                      chart: {
                        id: 'total-jumlah'
                      }
                    }"
                    :series="generateSeries(data?.data || { series: [], categories: [] })"
                    height="350"
                  />
                  <div
                    v-else
                    class="text-center text-xl"
                  >
                    Data Tidak Ada
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <div class="">
          <UCard>
            <p class="text-center">
              Perolehan Suara per Kecamatan
            </p>

            <div>
              <div
                v-if="statusVoteByDistrict === 'pending'"
                class="text-center text-2xl"
              >
                Loading...
              </div>

              <div v-else>
                <VueApexCharts
                  v-if="listVoteByDistrict?.data?.categories && listVoteByDistrict?.data?.categories.length > 0"
                  type="bar"
                  :options="{
                    xaxis: {
                      categories: listVoteByDistrict?.data?.categories || []
                    },
                    chart: {
                      id: 'total-jumlah-per-kecamatan'
                    }
                  }"
                  :series="listVoteByDistrict?.data?.series || []"
                  height="500"
                />
                <div
                  v-else
                  class="text-center text-xl"
                >
                  Data Tidak Ada
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <div class="">
          <UCard>
            <p class="text-center">
              Perolehan Suara per Kelurahan
            </p>
            <div class="flex flex-row space-x-4">
              <UFormGroup
                label="Filter Kecamatan"
                name="districtId"
              >
                <USelectMenu
                  v-model="filterByVillage.district"
                  by="id"
                  option-attribute="name"
                  searchable
                  searchable-placeholder="Cari kecamatan..."
                  class="w-48"
                  placeholder="Pilih Kecamatan"
                  :options="districtOptions?.data || []"
                />
              </UFormGroup>
            </div>
            <div>
              <div
                v-if="statusVoteByVillage === 'pending'"
                class="text-center text-2xl"
              >
                Loading...
              </div>

              <div v-else>
                <VueApexCharts
                  v-if="listVoteByVillage?.data?.categories && listVoteByVillage?.data?.categories.length > 0"
                  type="bar"
                  :options="{
                    xaxis: {
                      categories: listVoteByVillage?.data?.categories || []
                    },
                    chart: {
                      id: 'total-jumlah-per-kelurahan'
                    }
                  }"
                  :series="listVoteByVillage?.data?.series || []"
                  height="500"
                />
                <div
                  v-else
                  class="text-center text-xl"
                >
                  Data Tidak Ada
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <div class="">
          <UCard>
            <p class="text-center">
              Perolehan Suara per TPS
            </p>
            <div class="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0">
              <UFormGroup
                label="Filter Kecamatan"
                name="districtId"
              >
                <USelectMenu
                  v-model="filterByTps.district"
                  by="id"
                  option-attribute="name"
                  searchable
                  searchable-placeholder="Cari kecamatan..."
                  class="w-48"
                  placeholder="Pilih Kecamatan"
                  :options="districtOptions?.data || []"
                />
              </UFormGroup>

              <UFormGroup
                label="Filter Kelurahan/Desa"
                name="villageId"
              >
                <USelectMenu
                  v-model="filterByTps.village"
                  by="id"
                  option-attribute="name"
                  searchable
                  searchable-placeholder="Cari Keluraha..."
                  class="w-48"
                  placeholder="Pilih Kelurahan"
                  :options="getVillageByDistrict(filterByTps.district?.id) || []"
                />
              </UFormGroup>
            </div>
            <div>
              <div
                v-if="statusVoteByTps === 'pending'"
                class="text-center text-2xl"
              >
                Loading...
              </div>
              <div v-else>
                <VueApexCharts
                  v-if="listVoteByTps?.data?.categories && listVoteByTps?.data?.categories.length > 0"
                  type="bar"
                  :options="{
                    xaxis: {
                      categories: listVoteByTps?.data?.categories || []
                    },
                    chart: {
                      id: 'total-jumlah-per-tps'
                    }
                  }"
                  :series="listVoteByTps?.data?.series || []"
                  height="500"
                />
                <div
                  v-else
                  class="text-center text-xl"
                >
                  Data Tidak Ada
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
