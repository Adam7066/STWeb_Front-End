<template>
  <AsideLayout>
    <template #aside>
      <t-menu :value="menuValue" :expand-mutex="true" @change="showMobileAsideDrawer=false">
        <t-menu-item class="text-xl font-medium !text-black" value="learn" :to="{path: '/learn'}">
          最新文章
        </t-menu-item>

        <t-divider class="!my-1" />

        <t-menu-group v-for="(category, categoryKey) in learnArticles" :key="categoryKey">
          <template #title>
            <div class="text-xl font-medium text-black">{{ category.name }}</div>
          </template>
          <t-submenu v-for="(topic, topicKey) in category.topics" :key="topicKey" :value="topicKey">
            <template #icon>
              <Icon :name="topic.topicIcon" class="size-5" />
            </template>
            <template #title>
              <div class="ml-2 text-lg text-black">{{ topic.topicName }}</div>
            </template>

            <t-menu-item
              v-for="article in topic.articles"
              :key="article.title"
              :value="article.filename"
              class="text-lg !text-black"
              :to="{path: `/learn/${categoryKey}/${topicKey}/${article.filename}`}"
            >
              {{ article.title }}
            </t-menu-item>
          </t-submenu>
        </t-menu-group>
      </t-menu>
    </template>
    <template #content>
      <slot />
    </template>
  </AsideLayout>
</template>

<script setup lang="ts">
import AsideLayout from './aside.vue'
import type { MenuProps } from 'tdesign-vue-next'
import type { LearnCategory } from '~/scripts/fetchInterface'
import { useWebSocket } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

const route = useRoute()
const config = useRuntimeConfig()
const learnStore = useLearn()
const showMobileAsideDrawer = useState('showMobileAsideDrawer')

const menuValue = computed<MenuProps['value']>(() => {
  const curRoute = route.name?.toString() ?? ''
  if (curRoute === 'learn-category-topic-id') {
    return route.params.id as string
  }
  return 'learn'
})

const learnArticles = useState<Record<string, LearnCategory>>('learnArticles')

if (!learnStore.userId) learnStore.setUserId(uuidv4())
const { data, close } = useWebSocket(
  `${config.public.backendApi.replace('http', 'ws')}/learn-ws?userId=${learnStore.userId}`,
  {
    immediate: true,
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.error('WebSocket connection failed')
      },
    },
  },
)

watch(data, (newData)=>{
  learnStore.setTotal(JSON.parse(newData).total)
})

onUnmounted(() => {
  close()
})
</script>
