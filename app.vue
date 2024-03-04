<template>
  <t-config-provider :global-config="globalConfig">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </t-config-provider>
</template>

<script setup lang="ts">
import merge from 'lodash/merge'
import enConfig from 'tdesign-vue-next/es/locale/zh_TW'

const globalConfig = merge(enConfig)

useHead({
  title: '小十的家',
  meta: [{ name: 'description', content: '小十的家' }],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>
