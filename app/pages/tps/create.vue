<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({
  name: z.string(),
  villageId: z.number().min(1).refine((value) => {
    return value > 0
  }, {
    message: 'Village is required'
  }),
  totalDpt: z.number()
})

type Schema = z.output<typeof schema>

const { data: villageOptions } = await useAsyncData('village-options', () => $fetch<APIResponseData<Village[]>>(`/api/location/village`))

const state = reactive<Schema>({
  name: '',
  villageId: 0,
  totalDpt: 0
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h2>Tambah TPS</h2>
        <p class="text-sm text-gray-700">
          Silakan informasi TPS yang akan ditambahkan
        </p>
      </div>
    </template>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        label="Name"
        name="name"
      >
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup
        label="Kelurahan"
        name="villageId"
      >
        <USelectMenu
          v-model="state.villageId"
          by="id"
          option-attribute="name"
          searchable
          searchable-placeholder="Search a person..."
          class="w-full lg:w-48"
          placeholder="Select a person"
          :options="villageOptions?.data || []"
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
          Submit
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
