export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/eslint',
    '@pinia/nuxt'
  ],
  devtools: {
    enabled: true
  },
  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET,
    jwtRefreshSecret: process.env.NUXT_JWT_REFRESH_SECRET,
    jwtExpiresIn: process.env.NUXT_JWT_EXPIRES_IN || '30d'
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',
  nitro: {
    experimental: {
      tasks: true
    }
  },
  hub: {
    database: true,
    blob: true,
    kv: true
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  }
})
