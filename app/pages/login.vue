<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'guest'
})

// const router = useRouter()
const toast = useToast()
const loading = ref(false)

const schema = z.object({
  username: z.string().min(4, 'Must be at least 4 characters'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  username: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true
    const login = await $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })
    loading.value = false

    if (login) {
      navigateTo('/?login=true')
    }
  }
  catch (error) {
    loading.value = false
    console.error(error)
    toast.add({
      title: 'Gagal login',
      description: 'Username atau password salah',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  }
}
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <div>
          <h2>Login</h2>
          <p class="text-sm text-gray-700">
            Silakan masukkan username dan password anda
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

        <div class="flex items-center space-x-4">
          <UButton type="submit">
            Submit
          </UButton>
          <!-- <p>
            Don't have an account? <NuxtLink
              to="/register"
              class="text-primary-500"
            >
              Register
            </NuxtLink>
          </p> -->
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<style>

</style>
