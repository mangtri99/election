<script setup lang="ts">
const { loggedIn } = useUserSession()

const route = useRoute()

// check if contain query ?login=true
if (route.query.login === 'true') {
  // redirect to login page
  window.location.href = '/'
}

const router = useRouter()

onMounted(() => {
  const getDate = new Date()

  const getFullYear = getDate.getFullYear()
  const getMonth = getDate.getMonth() + 1
  const getDay = getDate.getDate()

  const getHours = getDate.getHours()
  const getMinutes = getDate.getMinutes()
  const getSeconds = getDate.getSeconds()

  console.log(new Date(getFullYear, getMonth, getDay, getHours, getMinutes, getSeconds))

  if (new Date(getFullYear, getMonth, getDay, getHours, getMinutes, getSeconds) < new Date(2024, 11, 27, 11, 0, 0)) {
    router.push('/lock')
  }
})
</script>

<template>
  <div class="space-y-4 flex justify-center">
    <div
      v-if="!loggedIn"
      class="flex justify-end space-x-4"
    >
      <!-- <UButton
        to="/api/auth/github"
        icon="i-simple-icons-github"
        label="Login with GitHub"
        color="black"
        external
      /> -->
    </div>
    <UCard class="max-w-2xl">
      <template #header>
        <h3 class="text-lg font-semibold leading-6">
          Aplikasi Hitung Pilkada 2024
        </h3>
      </template>
      <div>
        <p
          v-if="!loggedIn"
          class="mb-4 text-gray"
        >
          Silakan Login terlebih dahulu
        </p>
        <UButton
          v-if="!loggedIn"
          to="/login"
          icon="i-heroicons-user"
          label="Login Disini"
          color="black"
          external
        />
        <UButton
          v-if="loggedIn"
          to="/vote"
          icon="i-heroicons-archive-box"
          label="Buat Laporan Suara"
          color="black"
        />
      </div>
      <hr class="dark:border-gray-700">
      <p class="text-sm text-gray-700 dark:text-gray-300 italic">
        Aplikasi ini dibuat untuk memudahkan proses penghitungan suara Pilkada Karangasem 2024
      </p>
    </UCard>
  </div>
</template>
