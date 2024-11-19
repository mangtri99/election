<script lang="ts" setup>
import { z } from 'zod'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import type { Candidate, District, Tps, Village } from '~/utils/types'

definePageMeta({
  middleware: 'auth'
})

const runtimeConfig = useRuntimeConfig()

const toast = useToast()

const schema = z.object({
  provinceId: z.number().int().positive(),
  regencyId: z.number().int().positive(),
  districtId: z.union([z.object({
    id: z.number().int().positive(),
    name: z.string().optional()
  }), z.number().int().positive().optional().refine((value) => {
    if (value) {
      return value > 0
    }
  }, {
    message: 'Kecamatan wajib diisi'
  })]),
  villageId: z.union([z.object({
    id: z.number().int().positive(),
    name: z.string().optional()
  }), z.number().int().positive().optional().refine((value) => {
    if (value) {
      return value > 0
    }
  }, {
    message: 'Kelurahan/Desa wajib diisi'
  })]),
  tpsId: z.union([z.object({
    id: z.number().int().positive(),
    name: z.string().optional()
  }), z.number().int().positive().optional()]),
  tpsNumber: z.string().min(1, {
    message: 'Nomor TPS wajib diisi'
  }),
  totalValidVote: z.number({
    invalid_type_error: 'Wajib diisi',
    required_error: 'Wajib diisi'
  }).min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }),
  totalInvalidVote: z.number({
    invalid_type_error: 'Wajib diisi',
    required_error: 'Wajib diisi'
  }).min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }),
  totalDptActive: z.coerce.number().min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }).optional(),
  totalDptPassive: z.coerce.number().min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }).optional(),
  totalOtherDpt: z.coerce.number().min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }).optional(),
  totalDpt: z.coerce.number().min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }).optional(),
  candidateVotes: z.array(z.object({
    candidateId: z.number().int().positive(),
    totalVote: z.number({
      invalid_type_error: 'Wajib diisi',
      required_error: 'Wajib diisi'
    }).min(0).transform((value) => {
      if (Number.isNaN(value)) {
        return undefined
      }

      else return value
    })
  })),
  reportName: z.string().min(1, {
    message: 'Nama pelapor wajib diisi'
  }),
  reportPhoneNumber: z.string().optional()
})

type Schema = z.output<typeof schema>

const { data: candidateList } = useFetch<APIResponseData<Candidate[]>>('/api/candidate')

const defaultState = {
  provinceId: runtimeConfig.public.defaultProvinceId,
  regencyId: runtimeConfig.public.defaultRegencyId,
  districtId: undefined,
  villageId: undefined,
  tpsId: undefined,
  tpsNumber: '',
  totalValidVote: undefined,
  totalInvalidVote: undefined,
  totalDptActive: undefined,
  totalDptPassive: undefined,
  totalOtherDpt: undefined,
  totalDpt: undefined,
  candidateVotes: [
    {
      candidateId: 1,
      totalVote: undefined
    },
    {
      candidateId: 2,
      totalVote: undefined
    },
    {
      candidateId: 3,
      totalVote: undefined
    }
  ],
  reportName: '',
  reportPhoneNumber: ''
}

const loading = ref(false)
const state = reactive<Schema>(defaultState)

const search = ref({
  districtId: state.districtId,
  villageId: state.villageId
})

const { data: districtOptions } = useFetch<APIResponseData<District[]>>('/api/location/district', {
  query: {
    regencyId: runtimeConfig.public.defaultRegencyId
  }
})

const { data: villageOptions, status: statusVillageOptions } = await useAsyncData('village-options', () => $fetch<APIResponseData<Village[]>>(`/api/location/village`, {
  query: {
    districtId: search.value.districtId
  }
}), {
  watch: [search.value]
})

const { data: tpsOptions, status: statusTpsOptions } = await useAsyncData('tps-options', () => $fetch<APIResponseData<Tps[]>>(`/api/tps`, {
  query: {
    villageId: search.value.villageId
  }
}), {
  watch: [search.value]
})

const getTpsOptions = computed(() => {
  return tpsOptions?.value?.data?.map((tps) => {
    return {
      id: tps.id,
      name: `TPS No. ${tps.name} - ${tps.village.name}`
    }
  }) || []
})

watch(() => state.districtId, (value, oldValue) => {
  if (typeof value === 'object' && typeof oldValue === 'object' && value.id === oldValue?.id) return
  search.value.districtId = typeof value === 'object' ? value.id : value
  state.villageId = undefined
}, { deep: true })

watch(() => state.villageId, (value, oldValue) => {
  if (typeof value === 'object' && typeof oldValue === 'object' && value.id === oldValue?.id) return
  search.value.villageId = typeof value === 'object' ? value.id : value
  state.tpsId = undefined
  state.tpsNumber = ''
}, { deep: true })

watch(() => state.tpsId, (value, oldValue) => {
  if (typeof value === 'object' && typeof oldValue === 'object' && value.id === oldValue?.id) return
  const getId = typeof value === 'object' ? value.id : value
  state.tpsNumber = tpsOptions?.value?.data?.find(tps => tps.id === Number(getId))?.name || ''
}, { deep: true })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const formatFormRequest = {
      ...event.data,
      districtId: typeof event.data.districtId === 'object' ? event.data.districtId.id : event.data.districtId,
      villageId: typeof event.data.villageId === 'object' ? event.data.villageId.id : event.data.villageId,
      tpsId: typeof event.data.tpsId === 'object' ? event.data.tpsId.id : event.data.tpsId
    }

    loading.value = true
    const response = await $fetch('/api/votes/tps', {
      method: 'POST',
      body: formatFormRequest,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    loading.value = false

    if (response) {
      toast.add({
        title: 'Berhasil input data',
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

const getCandidateInfo = (candidateId: number) => {
  return candidateList.value?.data?.find(item => item.id === candidateId)
}
</script>

<template>
  <div class="flex w-full justify-center">
    <div class="w-full max-w-4xl">
      <UCard>
        <template #header>
          <div>
            <h2>Perolehan Suara</h2>
            <p class="text-sm text-gray-700">
              Silakan input hasil suara di TPS anda
            </p>
          </div>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          :validate-on="['submit']"

          @submit="onSubmit"
          @error="onError"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 md:space-x-4 space-y-4 md:space-y-0">
            <UCard
              v-for="(candidate, index) in state.candidateVotes"
              :key="candidate.candidateId"
              :ui="{
                body: {
                  padding: 'px-2 py-3 sm:p-4'
                }
              }"
            >
              <div class="text-center">
                <div class="mb-4">
                  <p class="text-lg">
                    {{ getCandidateInfo(candidate.candidateId)?.orderNumber || '' }}
                  </p>
                  <p class="text-sm">
                    {{ getCandidateInfo(candidate.candidateId)?.candidateName || '' }}
                  </p>
                  <p class="text-sm">
                    {{ getCandidateInfo(candidate.candidateId)?.viceCandidateName || '' }}
                  </p>
                </div>
                <UFormGroup
                  label="Perolehan Suara"
                  :name="`candidateVotes.${index}.totalVote`"
                >
                  <UInput
                    v-model="candidate.totalVote"
                    type="number"
                  />
                </UFormGroup>
              </div>
            </UCard>
          </div>
          <UFormGroup
            label="Kecamatan"
            name="districtId"
            required
          >
            <USelectMenu
              v-model="state.districtId"
              by="id"
              option-attribute="name"
              searchable
              searchable-placeholder="Cari kecamatan..."
              class="w-full"
              placeholder="Pilih Kecamatan"
              :options="districtOptions?.data || []"
            />
          </UFormGroup>

          <UFormGroup
            label="Kelurahan"
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

          <UFormGroup
            label="TPS"
            name="tpsId"
            help="Kosongkan jika TPS tidak ditemukan"
          >
            <USelectMenu
              v-model="state.tpsId"
              :loading="statusTpsOptions === 'pending' ? true : false"
              by="id"
              option-attribute="name"
              searchable
              searchable-placeholder="Cari TPS..."
              class="w-full"
              placeholder="Pilih TPS"
              clear-search-on-close
              :options="getTpsOptions || []"
            >
              <template #empty>
                TPS Tidak Ditemukan
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup
            label="Nomor TPS"
            name="tpsNumber"
            required
            help="Nomor TPS otomatis terisi jika TPS sudah dipilih"
          >
            <UInput
              v-model="state.tpsNumber"
              :readonly="state.tpsId !== undefined"
              placeholder="contoh: 12"
              type="tel"
            />
          </UFormGroup>

          <UFormGroup
            label="Total Suara Sah"
            name="totalValidVote"
            required
          >
            <UInput
              v-model="state.totalValidVote"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Total Suara Tidak Sah"
            name="totalInvalidVote"
            required
          >
            <UInput
              v-model="state.totalInvalidVote"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Nama Pelapor"
            name="reportName"
            required
          >
            <UInput
              v-model="state.reportName"
              type="text"
            />
          </UFormGroup>

          <UFormGroup
            label="Nomor HP Pelapor"
            name="reportPhoneNumber"
          >
            <UInput
              v-model="state.reportPhoneNumber"
              type="tel"
            />
          </UFormGroup>

          <UFormGroup
            label="Total DPT (Optional)"
            name="totalDpt"
          >
            <UInput
              v-model="state.totalDpt"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Total DPT Hadir (Optional)"
            name="totalDptActive"
          >
            <UInput
              v-model="state.totalDptActive"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Total DPT Tidak Hadir (Optional)"
            name="totalDptPassive"
          >
            <UInput
              v-model="state.totalDptPassive"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Total Pemilih Diluar DPT (Optional)"
            name="totalOtherDpt"
          >
            <UInput
              v-model="state.totalOtherDpt"
              type="number"
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
      </UCard>
    </div>
  </div>
</template>
