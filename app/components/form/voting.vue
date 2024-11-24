<template>
  <div class="h-full overflow-y-auto px-2 py-2">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      :validate-on="['submit']"
      @submit="onSubmit"
      @error="onError"
    >
      <div
        class="grid grid-cols-1 space-y-4"
        :class="isEdit ? 'md:grid-cols-1' : 'md:grid-cols-3 md:space-x-4 md:space-y-0'"
      >
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
        label="Kelurahan/Desa"
        name="villageId"
        required
        hint="Pilih kecamatan terlebih dahulu"
      >
        <USelectMenu
          v-model="state.villageId"

          by="id"
          option-attribute="name"
          searchable
          searchable-placeholder="Cari kelurahan..."
          class="w-full"
          placeholder="Pilih Kelurahan/Desa"
          :options="filteredVillageOptions || []"
        />
      </UFormGroup>

      <!-- <UFormGroup
        label="TPS"
        name="tpsId"
        help="Kosongkan jika TPS tidak ditemukan"
        hint="Pilih kelurahan terlebih dahulu"
      >
        <USelectMenu
          v-model="state.tpsId"
          by="id"
          option-attribute="name"
          clearable
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
          <UInput
            class="flex-1 cursor-pointer"
            placeholder="Pilih TPS"
            :model-value="typeof state.tpsId === 'object' ? state.tpsId.name : state.tpsId"
            :ui="{ icon: { trailing: { pointer: '' } } }"
            readonly
          >
            <template #trailing>
              <UButton
                v-show="state.tpsId"
                icon="i-heroicons-x-mark"
                :padded="false"
                color="gray"
                variant="ghost"
                @click.stop="state.tpsId = undefined"
              />
            </template>
          </UInput>
        </USelectMenu>
      </UFormGroup> -->

      <UFormGroup
        label="Nomor TPS"
        name="tpsNumber"
        required
      >
        <UInput
          v-model="state.tpsNumber"
          placeholder="contoh: 12"
          type="tel"
        />
      </UFormGroup>

      <UFormGroup
        label="Total Suara Sah"
        name="totalValidVote"
        help="Total suara sah akan dihitung otomatis dari perolehan suara paslon"
        required
      >
        <UInput
          v-model="state.totalValidVote"
          type="number"
          readonly
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
        label="Total Suara Sah + Tidak Sah"
        name="totalDpt"
      >
        <UInput
          :model-value="Number(state.totalValidVote) + Number(state.totalInvalidVote)"
          type="number"
          readonly
        />
      </UFormGroup>

      <!-- <UFormGroup
            label="Total Pemilih Diluar DPT (Opsional)"
            name="totalOtherDpt"
          >
            <UInput
              v-model="state.totalOtherDpt"
              type="number"
            />
          </UFormGroup> -->

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
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import type { Candidate, District, Tps, Village } from '~/utils/types'
import { ZodNumberDefaultUndefined } from '~/utils/validation'

interface Props {
  id?: number
  isEdit: boolean
  selectedData?: TPSVote
}

const { isEdit, id, selectedData } = defineProps<Props>()
const emit = defineEmits(['successUpdate'])

const runtimeConfig = useRuntimeConfig()

const { data: districtOptions } = useNuxtData<APIResponseData<District[]>>('district-options')

const { data: villageOptions } = useNuxtData<APIResponseData<Village[]>>('village-options')

const { data: tpsOptions } = useNuxtData<APIResponseData<Tps[]>>('tps-options')

const toast = useToast()

const schema = z.object({
  id: z.number().int().positive().optional(),
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
  totalValidVote: ZodNumberDefaultUndefined(),
  totalInvalidVote: ZodNumberDefaultUndefined(),
  // totalDptActive: ZodNumberDefaultUndefined(),
  // totalDptPassive: ZodNumberDefaultUndefined(),
  totalDpt: z.number().min(0).optional(),
  // totalOtherDpt: z.number().min(0).optional(),
  candidateVotes: z.array(z.object({
    candidateId: z.number().int().positive(),
    totalVote: ZodNumberDefaultUndefined()
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
  // totalOtherDpt: undefined,
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
const state = ref<Schema>(defaultState)

watch(() => selectedData, (value) => {
  if (value) {
    state.value = {
      ...state.value,
      ...value,
      districtId: {
        id: value.districtId,
        name: districtOptions?.value?.data?.find(district => district.id === value.districtId)?.name
      },
      villageId: {
        id: value.villageId,
        name: villageOptions?.value?.data?.find(village => village.id === value.villageId)?.name
      },
      tpsId: {
        id: value.tpsId,
        name: tpsOptions?.value?.data?.find(tps => tps.id === value.tpsId)?.name
      }
    }
  }
}, { immediate: true })

const filteredVillageOptions = computed(() => {
  // filter by districtId
  const getDistrictId = typeof state.value.districtId === 'object' ? state.value.districtId.id : state.value.districtId
  return villageOptions?.value?.data?.filter(village => village.districtId === getDistrictId) || []
})

// const filteredTpsOptions = computed(() => {
//   // filter by villageId
//   const getVillageId = typeof state.villageId === 'object' ? state.villageId.id : state.villageId
//   return tpsOptions?.value?.data?.filter(tps => tps.villageId === getVillageId) || []
// })

// const getTpsOptions = computed(() => {
//   return filteredTpsOptions.value.map((tps) => {
//     return {
//       id: tps.id,
//       name: `TPS No. ${tps.name} - ${tps.village.name}`
//     }
//   }) || []
// })

watch(() => state.value.districtId, (value, oldValue) => {
  if (typeof value === 'object' && typeof oldValue === 'object' && value.id === oldValue?.id) return
  // search.value.districtId = typeof value === 'object' ? value.id : value
  state.value.villageId = undefined
}, { deep: true })

watch(() => state.value.villageId, (value, oldValue) => {
  if (typeof value === 'object' && typeof oldValue === 'object' && value.id === oldValue?.id) return
  // search.value.villageId = typeof value === 'object' ? value.id : value
  state.value.tpsId = undefined
  state.value.tpsNumber = ''
}, { deep: true })

watch(() => state.value.tpsId, (value, oldValue) => {
  if (typeof value === 'object' && typeof oldValue === 'object' && value.id === oldValue?.id) return
  const getId = typeof value === 'object' ? value.id : value
  state.value.tpsNumber = tpsOptions?.value?.data?.find(tps => tps.id === Number(getId))?.name || ''
}, { deep: true })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('id:', id)
  console.log('isEdit:', isEdit)

  const uri = isEdit ? `/api/votes/tps/${id}` : '/api/votes/tps'

  try {
    const formatFormRequest = {
      ...event.data,
      districtId: typeof event.data.districtId === 'object' ? event.data.districtId.id : event.data.districtId,
      villageId: typeof event.data.villageId === 'object' ? event.data.villageId.id : event.data.villageId,
      tpsId: typeof event.data.tpsId === 'object' ? event.data.tpsId.id : event.data.tpsId
    }

    loading.value = true
    const response = await $fetch(uri, {
      method: isEdit ? 'patch' : 'post',
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

      if (isEdit) {
        state.value = defaultState
      }
      else {
        navigateTo('/')
      }

      emit('successUpdate')
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (err: any) {
    console.error('error:', err?.data?.statusMessage)
    loading.value = false
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

watch(() => state.value.candidateVotes, () => {
  const sumTotalVote = state.value.candidateVotes.reduce((acc, item) => {
    return acc + (item.totalVote || 0)
  }, 0)

  state.value.totalValidVote = sumTotalVote
}, {
  deep: true
})
</script>

<style>

</style>
