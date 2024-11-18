<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'

interface ChartData {
  series: number[]
  categories: string[]
}

const { data, status } = useFetch<APIResponseData<ChartData>>('/api/chart/all')

const generateSeries = (data: ChartData) => {
  return [
    {
      name: 'Jumlah Suara',
      data: data.series || []
    }
  ]
}
</script>

<template>
  <div>
    <ClientOnly>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UCard>
            <p class="text-center">
              Perolehan Suara Total (Persentase)
            </p>
            <VueApexCharts
              type="pie"
              :options="{
                labels: data?.data?.categories || [],
                chart: {
                  id: 'total-persentase'
                }
              }"
              :series="[
                ...data?.data?.series || []
              ]"
              height="350"
            />
          </UCard>
        </div>

        <div>
          <UCard>
            <p class="text-center">
              Perolehan Suara Total (Jumlah)
            </p>
            <VueApexCharts
              type="bar"
              :options="{
                xaxis: {
                  categories: data?.data?.categories || []
                },
                chart: {
                  id: 'total-jumlah'
                }
              }"
              :series="generateSeries(data?.data || { series: [], categories: [] })"
              height="350"
            />
          </UCard>
        </div>

        <div class="col-span-2">
          <UCard>
            <p class="text-center">
              Perolehan Suara per Kecamatan
            </p>
          </UCard>
        </div>

        <div class="col-span-2">
          <UCard>
            <p class="text-center">
              Perolehan Suara per Kelurahan
            </p>
          </UCard>
        </div>

        <div class="col-span-2">
          <UCard>
            <p class="text-center">
              Perolehan Suara per TPS
            </p>
          </UCard>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
