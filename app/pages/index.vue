<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
  <div class="space-y-4">
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
      <UButton
        to="/login"
        icon="i-heroicons-user"
        label="Login Disini"
        color="black"
        external
      />
    </div>
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold leading-6">
          Aplikasi Hitung Pilkada 2025
        </h3>

        <!-- <UButton
          v-if="loggedIn"
          to="/todos"
          icon="i-heroicons-list-bullet"
          label="Go to Todos"
          color="black"
        /> -->
      </template>
      <p class="font-medium">
        Welcome to Atidone.
      </p>
      <hr class="dark:border-gray-700">
      <p class="text-sm text-gray-700 dark:text-gray-300 italic">
        No personal informations regarding your GitHub account are stored in database.<br>
        We store only the todos created linked with your GitHub ID.
      </p>
    </UCard>
  </div>
</template>
