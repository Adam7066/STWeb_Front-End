<template>
  <AsideLayout>
    <template #aside>
      <t-menu :value="menuValue" :expand-mutex="true">
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
              <Icon :name="topic.topic_icon" class="size-5" />
            </template>
            <template #title>
              <div class="ml-2 text-lg text-black">{{ topic.topic_name }}</div>
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

const route = useRoute()

const menuValue = computed<MenuProps['value']>(() => {
  const curRoute = route.name?.toString() ?? ''
  if (curRoute === 'learn-category-topic-id') {
    return route.params.id as string
  }
  return 'learn'
})

const learnArticles = useState<Record<string, LearnCategory>>('learnArticles')
</script>
