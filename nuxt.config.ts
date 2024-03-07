// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: 'https://smallten.me',
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
    },
  },
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'tdesign-vue-next/es/nuxt',
    'nuxt-lodash',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
  ],
  build: {
    transpile: ['tdesign-vue-next'],
  },
  pinia: {
    autoImports: ['defineStore'],
  },
})
