<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({
  name: z.string().min(4, 'Must be at least 4 characters'),
  username: z.string().min(4, 'Must be at least 4 characters'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  image: z.any().optional()
})

const router = useRouter()

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  name: '',
  username: '',
  password: '',
  image: null
})

const upload = useUpload('/api/images/upload', {
  multiple: false
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const form = event.target as HTMLFormElement
  let imageResponse = null
  if (form.image.files.length) {
    imageResponse = await upload(form.image)
  }

  console.log('imageResponse', imageResponse)

  const response = await $fetch('/api/auth/signup', {
    method: 'POST',
    body: {
      ...event.data,
      image: imageResponse ? imageResponse.pathname : null
    }
  }).catch((error) => {
    console.error(error)
  })

  if (response) {
    router.push('/')
  }
}
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <h2>
          Register
        </h2>
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

        <UFormGroup
          label="Image"
          name="image"
        >
          <UInput
            v-model="state.image"
            type="file"
            name="image"
            accept="image/jpg,image/png"
          />
        </UFormGroup>

        <div class="flex items-center space-x-4">
          <UButton type="submit">
            Register
          </UButton>
          <p>
            Already have an account? <NuxtLink
              class="text-primary-500"
              to="/login"
            >
              Login
            </NuxtLink>
          </p>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<style>

</style>
