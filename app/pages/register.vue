<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({
  name: z.string().min(4, 'Must be at least 4 characters'),
  username: z.string().min(4, 'Must be at least 4 characters'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  name: '',
  username: '',
  password: ''

})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
  const response = await $fetch('/api/auth/signup', {
    method: 'POST',
    body: event.data
  }).catch((error) => {
    console.error(error)
  })

  if (response) {
    console.log(response)
  }
}
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <h2>Register</h2>
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
          label="Username"
          name="username"
        >
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
          />
        </UFormGroup>

        <UButton type="submit">
          Register
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<style>

</style>
