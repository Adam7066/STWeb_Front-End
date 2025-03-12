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
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/mdc',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@tdesign-vue-next/nuxt',
    'nuxt-lodash',
    'nuxt-monaco-editor',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
  ],

  mdc: {
    remarkPlugins: {
      'remark-math': {},
    },
    rehypePlugins: {
      'rehype-katex': {},
    },
    headings: {
      anchorLinks: { h4: false },
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      langs: [
        'c', 'cpp', 'go', 'js', 'typescript', 'vue', 'html', 'css', 'bash', 'md',
        'yaml', 'json',
      ],
    },
  },

  icon: {
    provider: 'server',
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './assets/icons',
      },
    ],
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  build: {
    transpile: ['tdesign-vue-next'],
  },

  runtimeConfig: {
    public: {
      shortUrlApi: process.env.SHORT_URL_API,
      backendApi: process.env.BACKEND_API,
      minioApi: process.env.MINIO_API,
    },
  },

  compatibilityDate: '2025-03-03',
})