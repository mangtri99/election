<template>
  <UContainer class="min-h-screen flex flex-col justify-center relative">
    <div class="absolute top-3 right-3 space-x-5">
      <div class="flex justify-end">
        <UDropdown
          v-if="user"
          :items="items"
        >
          <UButton
            color="white"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          >
            <UAvatar
              :src="`https://github.com/${user.login}.png`"
              :alt="user.login"
              size="3xs"
            />
            {{ user.login }}
          </UButton>
        </UDropdown>
        <UButton
          square
          variant="ghost"
          color="black"
          :icon="$colorMode.preference === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          @click="toggleColorMode"
        />
      </div>
    </div>

    <div class="flex flex-col md:flex-row md:justify-center py-4">
      <NuxtLink to="/">
        Aplikasi Pilkada 2025
      </NuxtLink>
    </div>

    <div class="md:flex hidden md:flex-row flex-col md:space-x-4 md:justify-center space-y-4 md:space-y-0">
      <ULink
        to="/dashboard"
        active-class="text-primary bg-primary-100 dark:bg-primary-800 px-2 py-1 rounded"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1"
      >
        Dashboard
      </ULink>
      <ULink
        to="/candidate"
        active-class="text-primary bg-primary-100 dark:bg-primary-800 px-2 py-1 rounded"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1"
      >
        Kandidat Calon
      </ULink>
      <ULink
        to="/tps"
        active-class="text-primary bg-primary-100 dark:bg-primary-800 px-2 py-1 rounded"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1"
      >
        Daftar TPS
      </ULink>
      <ULink
        to="/vote"
        active-class="text-primary bg-primary-100 dark:bg-primary-800 px-2 py-1 rounded"
        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1"
      >
        Voting
      </ULink>
    </div>

    <UDivider class="my-4" />

    <div class="nab" />

    <div class="flex flex-col flex-1">
      <slot />
    </div>

    <footer class="text-center mt-2">
      KARISMA KARANGASEM 2025
    </footer>
  </UContainer>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const { user, clear } = useUserSession()

const items = [[{
  label: 'Logout',
  icon: 'i-heroicons-arrow-left-on-rectangle',
  click: clear
}]]
function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<style>

</style>
