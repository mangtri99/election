<script lang="ts" setup>
import type { APIResponseData, Candidate } from '~/utils/types'

definePageMeta({
  middleware: 'admin'
})

const { data, status } = useFetch<APIResponseData<Candidate[]>>('/api/candidate')

const columns = [
  {
    key: 'orderNumber',
    label: 'Nomor Urut',
    sortable: true
  },
  {
    key: 'name',
    label: 'Nama Pasangan',
    sortable: false
  },
  {
    key: 'candidateName',
    label: 'Calon Bupati',
    sortable: false
  },
  {
    key: 'viceCandidateName',
    label: 'Calon Wakil Bupati',
    sortable: false
  }

]
</script>

<template>
  <div>
    <h1 class="text-xl mb-4 text-center">
      List Calon Bupati dan Calon Wakil Bupati Karangasem 2024
    </h1>
    <UCard>
      <UTable
        :loading="status === 'pending'"
        :rows="data?.data"
        :columns="columns"
      />
    </UCard>
  </div>
</template>
