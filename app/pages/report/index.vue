<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

definePageMeta({
  middleware: 'auth'
})

const filter = ref({
  district: undefined as District | undefined,
  village: undefined as Village | undefined
})

const loading = ref(false)
const toast = useToast()
const isOpenDelete = ref(false)
const isOpenEdit = ref(false)
const selectedData = ref({} as TPSVote)

const { data: districtOptions } = await useFetch<APIResponseData<District[]>>('/api/location/district', {
  key: 'district-options',
  query: {
    regencyId: runtimeConfig.public.defaultRegencyId
  }
})

const { data: villageOptions } = await useAsyncData('village-options', () => $fetch<APIResponseData<Village[]>>(`/api/location/village`, {
  query: {
    districtId: [
      510701,
      510702,
      510703,
      510704,
      510705,
      510706,
      510707,
      510708
    ]
  }
}))
const { data, status, refresh } = await useAsyncData('vote-tps-result',
  () => $fetch<APIResponseData<TPSVote[]>>(`/api/votes/tps`, {
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

function resetFilter() {
  filter.value = {
    district: undefined,
    village: undefined
  }
  refresh()
}

function successUpdate() {
  isOpenEdit.value = false
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
    key: 'candidateTotalVote1',
    label: 'Suara Paslon 1',
    sortable: true
  },
  {
    key: 'candidateTotalVote2',
    label: 'Suara Paslon 2',
    sortable: true
  },
  {
    key: 'candidateTotalVote3',
    label: 'Suara Paslon 3',
    sortable: true
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
    key: 'totalAllVote',
    label: 'Total Suara Sah + Tidak Sah',
    sortable: true
  },
  {
    key: 'user.name',
    label: 'Akun Petugas',
    sortable: false
  },
  {
    key: 'reportName',
    label: 'Nama Pelapor',
    sortable: false
  },
  {
    key: 'reportPhoneNumber',
    label: 'Nomor HP Pelapor',
    sortable: false
  },
  {
    key: 'action',
    label: 'Action',
    sortable: false
  }

]

async function downloadCSV(isAll = true) {
  try {
    loading.value = true
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

    loading.value = false

    toast.add({
      title: 'Berhasil melakukan export data',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  }
  catch (error) {
    console.log(error)
    loading.value = false
    toast.add({
      title: 'Gagal melakukan export data',
      description: 'Silakan coba lagi',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  }
}

function onEditData(data: TPSVote) {
  selectedData.value = data
  isOpenEdit.value = true
}

function onDeleteData(data: TPSVote) {
  selectedData.value = data
  isOpenDelete.value = true
}

async function onConfirmDelete() {
  // delete data
  isOpenDelete.value = false
  try {
    loading.value = true
    await $fetch(`/api/votes/tps/${selectedData.value.id}`, {
      method: 'delete'
    })
    loading.value = false
    toast.add({
      title: 'Berhasil menghapus data',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
    refresh()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.log(error)
    loading.value = false
    toast.add({
      title: 'Gagal menghapus data',
      description: error?.data?.statusMessage || 'Silakan coba lagi',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  }
}
</script>

<template>
  <div>
    <h1 class="text-xl mb-4 text-center">
      Laporan TPS Pilkada Karangasem 2024
    </h1>
    <UCard>
      <div class="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div class="flex md:flex-row flex-col md:items-end md:space-x-4 space-y-4 md:space-y-0">
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
            class="w-auto inline-block"
            variant="solid"
            color="yellow"
            @click="onFilterChange"
          >
            Cari
          </UButton>
          <UButton
            class="w-auto inline-block"
            variant="solid"
            color="red"
            @click="resetFilter"
          >
            Hapus Filter
          </UButton>
        </div>

        <div class="flex md:space-x-4 space-x-2">
          <UButton
            size="xs"
            variant="solid"
            :loading="loading"
            :disabled="loading"
            @click="downloadCSV(false)"
          >
            Export Data Sesuai Filter
          </UButton>

          <UButton
            size="xs"
            variant="solid"
            :loading="loading"
            :disabled="loading"
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
        <template #totalAllVote-data="{ row }">
          <div>
            {{ Number(row.totalValidVote) + Number(row.totalInvalidVote) }}
          </div>
        </template>

        <template #action-data="{ row }">
          <div class="flex items-center space-x-4">
            <UButton
              size="xs"
              variant="solid"
              color="blue"
              label="Edit"
              icon="i-heroicons-pencil"
              @click="() => onEditData(row)"
            />

            <UButton
              size="xs"
              variant="solid"
              color="red"
              label="Hapus"
              icon="i-heroicons-trash"
              @click="() => onDeleteData(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isOpenDelete">
      <div class="p-4">
        <p>Apakah anda yakin ingin menghapus data dari TPS {{ selectedData.tpsNumber }}</p>
        <div class="mt-4 flex items-center space-x-4">
          <UButton
            color="red"
            variant="solid"
            label="Hapus"
            @click="onConfirmDelete()"
          />

          <UButton
            color="white"
            variant="solid"
            label="Batal"
            @click="() => isOpenDelete = false"
          />
        </div>
      </div>
    </UModal>

    <USlideover v-model="isOpenEdit">
      <div class="p-4 flex-1 overflow-auto">
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10"
          square
          padded
          @click="isOpenEdit = false"
        />
        <div class="h-full overflow-y-auto">
          <FormVoting
            :id="selectedData.id"
            :is-edit="true"
            :selected-data="selectedData"
            @success-update="successUpdate"
          />
        </div>
      </div>
    </USlideover>
  </div>
</template>
