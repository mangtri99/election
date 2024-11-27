<script lang="ts" setup>
// import { z } from 'zod'
// import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import type { District, Tps, Village } from '~/utils/types'
// import { ZodNumberDefaultUndefined } from '~/utils/validation'

definePageMeta({
  middleware: 'auth'
})

const runtimeConfig = useRuntimeConfig()


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { data: districtOptions } = useFetch<APIResponseData<District[]>>('/api/location/district', {
  key: 'district-options',
  query: {
    regencyId: runtimeConfig.public.defaultRegencyId
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { data: villageOptions, status: statusVillageOptions } = await useAsyncData('village-options', () => $fetch<APIResponseData<Village[]>>(`/api/location/village`))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { data: tpsOptions, status: statusTpsOptions } = await useAsyncData('tps-options', () => $fetch<APIResponseData<Tps[]>>(`/api/tps`))
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

        <FormVoting :is-edit="false" />
      </UCard>
    </div>
  </div>
</template>
