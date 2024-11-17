<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
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
    message: 'TPS number is required'
  }),
  totalValidVote: z.number().min(0).transform((value) => {
    if (Number.isNaN(value)) {
      return undefined
    }

    else return value
  }),
  totalInvalidVote: z.number().int().min(0).default(0),
  totalDptActive: z.number().int().min(0).default(0),
  totalDptPassive: z.number().int().min(0).default(0),
  totalOtherDpt: z.number().int().min(0).default(0),
  totalDpt: z.number().int().min(0).default(0),
  candidateVotes: z.array(z.object({
    candidateId: z.number().int().positive(),
    totalVote: z.number().min(0).positive().optional().refine((value) => {
      if (value === undefined || value === null) {
        return false
      }
      else {
        return true
      }
    }, {
      message: 'Perolehan Suara wajib diisi'
    })
  }))
})

type Schema = z.output<typeof schema>

const { data: candidateList } = useFetch<APIResponseData<Candidate[]>>('/api/candidate')

const state = reactive<Schema>({
  provinceId: runtimeConfig.public.defaultProvinceId,
  regencyId: runtimeConfig.public.defaultRegencyId,
  districtId: undefined,
  villageId: undefined,
  tpsId: undefined,
  tpsNumber: '',
  totalValidVote: undefined,
  totalInvalidVote: 0,
  totalDptActive: 0,
  totalDptPassive: 0,
  totalOtherDpt: 0,
  totalDpt: 0,
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
  ]
})

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

watch(() => state.districtId, (value) => {
  // check value is object or number
  search.value.districtId = typeof value === 'object' ? value.id : value
  state.villageId = undefined
})

watch(() => state.villageId, (value) => {
  // check value is object or number
  search.value.villageId = typeof value === 'object' ? value.id : value
  state.tpsId = undefined
  state.tpsNumber = ''
})

watch(() => state.tpsId, (value) => {
  const getId = typeof value === 'object' ? value.id : value
  console.log(tpsOptions?.value?.data?.find(tps => tps.id === Number(getId)))
  state.tpsNumber = tpsOptions?.value?.data?.find(tps => tps.id === Number(getId))?.name || ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)

  // const response = await $fetch('/api/votes/tps', {
  //   method: 'POST',
  //   body: event.data
  // })

  // if (response) {
  //   toast.add({
  //     title: 'Berhasil input data',
  //     icon: 'i-heroicons-check-circle'
  //   })

  //   navigateTo('/votes')
  // }
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
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 md:space-x-4 space-y-4 md:space-y-0">
            <UCard
              v-for="candidate in state.candidateVotes"
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
                  name="totalVote"
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
            label="Total DPT yang menggunakan hak pilih"
            name="totalDptActive"
          >
            <UInput
              v-model="state.totalDptActive"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Total DPT yang tidak menggunakan hak pilih"
            name="totalDptPassive"
          >
            <UInput
              v-model="state.totalDptPassive"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Total Pemilih diluar DPT"
            name="totalOtherDpt"
          >
            <UInput
              v-model="state.totalOtherDpt"
              type="number"
            />
          </UFormGroup>

          <UFormGroup
            label="Total DPT"
            name="totalDpt"
          >
            <UInput
              v-model="state.totalDpt"
              type="number"
            />
          </UFormGroup>

          <div class="flex items-center space-x-4">
            <UButton type="submit">
              Simpan
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
