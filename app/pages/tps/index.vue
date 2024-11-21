<script setup lang="ts">
import { z } from 'zod'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'admin'
})

const { data, status } = await useFetch<APIResponseData<Tps[]>>('/api/tps')
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
  villageId: z.number({
    invalid_type_error: 'Wajib diisi',
    required_error: 'Wajib diisi'
  }).min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  })
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
    const response = await $fetch('/api/tps/bulk', {
      method: 'POST',
      body: event.data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    loading.value = false

    if (response) {
      toast.add({
        title: 'Berhasil menambahkan data',
        icon: 'i-heroicons-check-circle'
      })

      navigateTo('/')
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
        class="mb-4"
      >
        <UButton
          label="Tambah TPS"
          @click="isOpen = true"
        />
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
