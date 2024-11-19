<script setup lang="ts">
import { z } from 'zod'
import type { User } from '~/utils/types'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'

const { data, status } = useFetch<APIResponseData<User[]>>('/api/user')
const isOpen = ref(false)
const toast = useToast()
const loading = ref(false)

const schema = z.object({
  location: z.string(),
  password: z.string().min(8, 'Minimal 8 karakter')
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({
  location: 'district',
  password: ''
})

const columns = [
  {
    key: 'id',
    label: 'Nomor',
    sortable: true
  },
  {
    key: 'username',
    label: 'username',
    sortable: true
  },
  {
    key: 'name',
    label: 'Nama',
    sortable: true
  }

]

const options = [{
  value: 'district',
  label: 'Per Kecamatan'
}, {
  value: 'village',
  label: 'Per Kelurahan'
}]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true
    const response = await $fetch('/api/user/bulk', {
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
      Daftar Petugas Pilkada Karangasem 2025
    </h1>
    <div>
      <div class="mb-4">
        <UButton
          label="Tambah Petugas"
          @click="isOpen = true"
        />
      </div>

      <UModal v-model="isOpen">
        <div class="p-4">
          <p class="mb-4">
            Tambah Petugas
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
              label="Pilih Lokasi"
              name="location"
              required
            >
              <URadioGroup
                v-model="state.location"
                :options="options"
              />
            </UFormGroup>
            <UFormGroup
              label="Password"
              name="password"
              required
            >
              <UInput
                v-model="state.password"
                type="passowrd"
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
