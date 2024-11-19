<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const filter = ref({
  district: undefined as District | undefined,
  village: undefined as Village | undefined
})

const { data: districtOptions } = await useFetch<APIResponseData<District[]>>('/api/location/district', {
  query: {
    regencyId: runtimeConfig.public.defaultRegencyId
  }
})

const { data: villageOptions } = await useAsyncData('village-options', () => $fetch<APIResponseData<Village[]>>(`/api/location/village`))
const { data, status, refresh } = await useAsyncData('vote-tps-result',
  () => $fetch<APIResponseData<Village[]>>(`/api/votes/tps`, {
    query: {
      provinceId: runtimeConfig.public.defaultProvinceId,
      regencyId: runtimeConfig.public.defaultRegencyId,
      districtId: filter.value.district?.id,
      villageId: filter.value.village?.id
    }
  }))

function onFilterChange() {
  refresh()
}

const getVillageByDistrict = (districtId?: number) => {
  if (!districtId) return villageOptions?.value?.data || []
  return villageOptions?.value?.data?.filter(village => village.districtId === districtId) || []
}

const columns = [

  {
    key: 'district.name',
    label: 'Kecamatan',
    sortable: true
  },
  {
    key: 'village.name',
    label: 'Kelurahan/Desa',
    sortable: true
  },
  {
    key: 'tpsNumber',
    label: 'Nomor TPS',
    sortable: true
  },
  {
    key: 'candidateVotes',
    label: 'Suara Paslon',
    sortable: false
  },
  {
    key: 'totalValidVote',
    label: 'Total Suara Sah',
    sortable: true
  },
  {
    key: 'totalInvalidVote',
    label: 'Total Suara Tidak Sah',
    sortable: true
  },
  {
    key: 'reportName',
    label: 'Nama Pelapor',
    sortable: false
  }

]

async function downloadCSV(isAll = true) {
  let searchQuery = {}

  if (isAll) {
    searchQuery = {
      all: true,
      provinceId: runtimeConfig.public.defaultProvinceId,
      regencyId: runtimeConfig.public.defaultRegencyId
    }
  }
  else {
    searchQuery = {
      all: false,
      provinceId: runtimeConfig.public.defaultProvinceId,
      regencyId: runtimeConfig.public.defaultRegencyId,
      districtId: filter.value.district?.id,
      villageId: filter.value.village?.id
    }
  }

  const response = await $fetch('/api/votes/tps/export', {
    query: {
      ...searchQuery
    }
  })

  // creata csv from string response
  const blob = new Blob([response], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'laporan-tps.csv'
  a.click()

  window.URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <h1 class="text-xl mb-4 text-center">
      Laporan TPS Pilkada Karangasem 2025
    </h1>
    <UCard>
      <div class="flex justify-between items-end">
        <div class="flex md:flex-row flex-col items-end md:space-x-4 space-y-4 md:space-y-0">
          <UFormGroup
            label="Filter Kecamatan"
            name="districtId"
          >
            <USelectMenu
              v-model="filter.district"
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
              v-model="filter.village"
              by="id"
              option-attribute="name"
              searchable
              searchable-placeholder="Cari Keluraha..."
              class="w-48"
              placeholder="Pilih Kelurahan"
              :options="getVillageByDistrict(filter.district?.id) || []"
            />
          </UFormGroup>

          <UButton
            variant="solid"
            @click="onFilterChange"
          >
            Cari
          </UButton>
        </div>

        <div class="flex space-x-4">
          <UButton
            variant="solid"
            @click="downloadCSV(false)"
          >
            Export Data Sesuai Filter
          </UButton>

          <UButton
            variant="solid"
            @click="downloadCSV"
          >
            Export Semua Data
          </UButton>
        </div>
      </div>
      <UTable
        :loading="status === 'pending'"
        :rows="data?.data"
        :columns="columns"
      >
        <template #candidateVotes-data="{ row }">
          <div>
            <div
              v-for="candidate in row.candidateVotes"
              :key="candidate.id"
            >
              <p>{{ candidate.candidate?.orderNumber }}. {{ candidate.candidate?.name }} : {{ candidate.totalVote }} </p>
            </div>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
