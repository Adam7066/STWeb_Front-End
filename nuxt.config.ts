// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: 'https://smallten.me',
  },

  routeRules: {
    '/api/shortUrl/**': {
      proxy: { to: process.env.SHORT_URL_API },
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
    },
  },

  devtools: {
    enabled: true,
    componentInspector: false,
  },

  typescript: {
    typeCheck: true,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@tdesign-vue-next/nuxt',
    'nuxt-lodash',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    '@nuxt/eslint',
  ],

  build: {
    transpile: ['tdesign-vue-next'],
  },

  runtimeConfig: {
    public: {
      shortUrlApi: process.env.SHORT_URL_API,
      backendApi: process.env.BACKEND_API,
    },
  },
})
