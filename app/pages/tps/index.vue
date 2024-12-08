<script setup lang="ts">
import { z } from 'zod'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'admin'
})

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

const { data, status, refresh } = await useAsyncData('list-tps',
  () => $fetch<APIResponseData<Tps[]>>(`/api/tps`, {
    query: {
      districtId: filter.value.district?.id,
      villageId: filter.value.village?.id
    }
  }))

const { data: villageOptions, status: statusVillageOptions } = await useAsyncData('village-options', () => $fetch<APIResponseData<Village[]>>(`/api/location/village`, {
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

const getVillageByDistrict = (districtId?: number) => {
  if (!districtId) return villageOptions?.value?.data || []
  return villageOptions?.value?.data?.filter(village => village.districtId === districtId) || []
}

const isOpen = ref(false)
const toast = useToast()
const loading = ref(false)

const { user } = useUserSession()

const schema = z.object({
  tpsNumberFrom: z.number({
    invalid_type_error: 'Wajib diisi',
    required_error: 'Wajib diisi'
  }).min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }),
  tpsNumberTo: z.number({
    invalid_type_error: 'Wajib diisi',
    required_error: 'Wajib diisi'
  }).min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }),
  villageId: z.union([z.object({
    id: z.number().int().positive(),
    name: z.string().optional()
  }), z.number().int().positive().optional().refine((value) => {
    if (value) {
      return value > 0
    }
  }, {
    message: 'Kelurahan/Desa wajib diisi'
  })])
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({
  tpsNumberFrom: 1,
  tpsNumberTo: 10,
  villageId: undefined
})

const columns = [
  {
    key: 'village.district.name',
    label: 'Kecamatan',
    sortable: true
  },
  {
    key: 'village.name',
    label: 'Kelurahan/Desa',
    sortable: true
  },
  {
    key: 'name',
    label: 'Nomor TPS',
    sortable: true
  },
  {
    key: 'totalDpt',
    label: 'Total DPT',
    sortable: true
  }

]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true

    const formatFormRequest = {
      ...event.data,
      villageId: typeof event.data.villageId === 'object' ? event.data.villageId?.id : event.data.villageId
    }

    const response = await $fetch('/api/tps/bulk', {
      method: 'POST',
      body: formatFormRequest,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    loading.value = false

    if (response) {
      refresh()
      toast.add({
        title: 'Berhasil menambahkan data',
        icon: 'i-heroicons-check-circle'
      })
      isOpen.value = false

      state.value = {
        tpsNumberFrom: 1,
        tpsNumberTo: 10,
        villageId: undefined
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (err: any) {
    console.error('error:', err?.data?.statusMessage)
    toast.add({
      title: 'Gagal input data',
      description: err?.data?.statusMessage || 'Terjadi kesalahan',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
    loading.value = false
  }
}

async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event?.errors[0]?.id || '')
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div>
    <h1 class="text-xl mb-4 text-center">
      Daftar TPS Pilkada Karangasem
    </h1>
    <div>
      <div
        v-if="user?.role && user?.role.toLowerCase() === 'admin'"
        class="mb-4 flex justify-between"
      >
        <UButton
          label="Tambah TPS"
          @click="isOpen = true"
        />
        <p class="font-bold text-xl">
          Total TPS: {{ data?.data?.length }}
        </p>
      </div>

      <div class="flex md:flex-row flex-col md:items-end md:space-x-4 space-y-4 md:space-y-0 mb-4">
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

      <UModal v-model="isOpen">
        <div class="p-4">
          <p class="mb-4">
            Tambah TPS
          </p>
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            :validate-on="['submit']"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormGroup
              label="Nomor TPS Dari"
              name="tpsNumberFrom"
              required
            >
              <UInput
                v-model="state.tpsNumberFrom"
                type="number"
              />
            </UFormGroup>

            <UFormGroup
              label="Nomor TPS Sampai"
              name="tpsNumberTo"
              required
            >
              <UInput
                v-model="state.tpsNumberTo"
                type="number"
              />
            </UFormGroup>

            <UFormGroup
              label="Kelurahan/Desa"
              name="villageId"
              required
            >
              <USelectMenu
                v-model="state.villageId"
                :loading="statusVillageOptions === 'pending' ? true : false"
                by="id"
                option-attribute="name"
                searchable
                searchable-placeholder="Cari kelurahan..."
                class="w-full"
                placeholder="Pilih Kelurahan/Desa"
                :options="villageOptions?.data || []"
              />
            </UFormGroup>

            <div class="flex items-center space-x-4">
              <UButton
                type="submit"
                :loading="loading"
                :disabled="loading"
              >
                Simpan
              </UButton>
            </div>
          </UForm>
        </div>
      </UModal>
    </div>
    <UCard>
      <UTable
        :loading="status === 'pending'"
        :rows="data?.data"
        :columns="columns"
      />
    </UCard>
  </div>
</template>
