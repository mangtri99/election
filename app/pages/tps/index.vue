<script setup lang="ts">
const { data, status } = useFetch<APIResponseData<Tps[]>>('/api/tps')

const columns = [
  {
    key: 'village.district.name',
    label: 'Kecamatan',
    sortable: true
  },
  {
    key: 'village.name',
    label: 'Kelurahan/Desa',
    sortable: true
  },
  {
    key: 'name',
    label: 'Nomor TPS',
    sortable: true
  },
  {
    key: 'totalDpt',
    label: 'Total DPT',
    sortable: true
  }

]
</script>

<template>
  <div>
    <h1 class="text-xl mb-4 text-center">
      Daftar TPS Pilkada Karangasem
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
