<template>
  <UContainer class="min-h-screen flex flex-col justify-center relative">
    <div class="absolute top-3 right-3 space-x-5">
      <div class="flex justify-end">
        <UDropdown
          v-if="user"
          class="hidden md:flex"
          :items="items"
        >
          <UButton
            color="white"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          >
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

    <div class="flex flex-row md:flex-row items-center py-4">
      <UButton
        class="md:hidden"
        icon="i-heroicons-bars-3"
        variant="ghost"
        color="gray"
        @click="isOpen = true"
      />
      <NuxtLink to="/">
        Aplikasi Pilkada 2025
      </NuxtLink>
    </div>

    <div class="md:flex hidden md:flex-row flex-col md:space-x-4 md:justify-center space-y-4 md:space-y-0">
      <UHorizontalNavigation
        :links="links"
        class="border-b border-gray-200 dark:border-gray-800"
      />
    </div>

    <UDivider class="my-4" />

    <USlideover v-model="isOpen">
      <div class="p-4 flex-1">
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10"
          square
          padded
          @click="isOpen = false"
        />

        <div class="mt-12">
          <UVerticalNavigation :links="links" />
          <div class="mt-4">
            <UButton
              v-if="!loggedIn"
              to="/login"
              icon="i-heroicons-user"
              label="Login Disini"
              color="black"
              external
            />
            <UDropdown
              v-if="user"
              :items="items"
            >
              <UButton
                color="white"
                trailing-icon="i-heroicons-chevron-down-20-solid"
              >
                {{ user.login }}
              </UButton>
            </UDropdown>
          </div>
        </div>
      </div>
    </USlideover>

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
const { user, clear, loggedIn } = useUserSession()

const items = [[{
  label: 'Logout',
  icon: 'i-heroicons-arrow-left-on-rectangle',
  click: clear
}]]

const links = ref([{
  label: 'Dashboard',
  icon: 'i-heroicons-home',
  to: '/dashboard',
  click: () => isOpen.value = false
},
{
  label: 'Laporan TPS',
  icon: 'i-heroicons-document',
  to: '/report',
  click: () => isOpen.value = false
}, {
  label: 'Kandidat Calon',
  icon: 'i-heroicons-user-circle',
  to: '/candidate',
  click: () => isOpen.value = false
}, {
  label: 'Daftar Petugas',
  icon: 'i-heroicons-user-group',
  to: '/user',
  click: () => isOpen.value = false
}, {
  label: 'Daftar TPS',
  icon: 'i-heroicons-command-line',
  to: '/tps',
  click: () => isOpen.value = false
}, {
  label: 'Voting',
  icon: 'i-heroicons-document',
  to: '/vote',
  click: () => isOpen.value = false
}])

onMounted(() => {
  if (user?.value?.role?.toLocaleLowerCase() === 'user') {
    links.value = [
      {
        label: 'Voting',
        icon: 'i-heroicons-document',
        to: '/vote',
        click: () => isOpen.value = false
      }
    ]
  }
})

const isOpen = ref(false)

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<style>

</style>
