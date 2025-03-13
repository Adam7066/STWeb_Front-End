<template>
  <div class="flex size-full items-center justify-around">
    <template v-for="i in menu" :key="i.value">
      <NuxtLink
        :to="i.to" class="flex flex-col items-center justify-center font-medium"
        :class="menuVal === i.value ? 'text-blue-800' : 'text-black'"
      >
        <t-icon :name="i.icon" />
        <div>{{ i.content }}</div>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const menu = [
  { value: 'index', to: '/', content: '首頁', icon: 'home' },
  { value: 'about', to: '/about', content: '關於', icon: 'usergroup' },
  { value: 'learn', to: '/learn', content: '學習文章', icon: 'book' },
  { value: 'tools', to: '/tools', content: '小工具', icon: 'tools' },
  { value: 'login', to: '/login', content: '登入', icon: 'login' },
]
const route = useRoute()
const menuVal = computed(() => (route.name?.toString() ?? '').split('-')[0])
</script>
