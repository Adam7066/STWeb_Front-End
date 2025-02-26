<template>
  <div class="mx-auto my-14 w-5/6">
    <div class="flex w-full justify-between space-x-10">
      <t-space direction="vertical" class="flex-1">
        <div class="text-3xl font-semibold">最新文章</div>
        <template v-for="i in 5" :key="i">
          <t-card :hover-shadow="true" class="shadow-md">OAO</t-card>
        </template>
      </t-space>

      <div class="min-w-60">
        <t-card>
          <div class="space-y-4 text-lg font-medium">
            <div>當前閱讀人數：1,000</div>
            <div>當前文章總數：{{ totalArticles }}</div>
          </div>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LearnCategory } from '~/scripts/fetchInterface'

definePageMeta({
  middleware: 'learn-article-validator',
  layout: 'learn',
})

const learnArticles = useState<Record<string, LearnCategory>>('learnArticles')

const totalArticles = computed(() => {
  return Object.values(learnArticles.value).reduce((categoryCnt, category) => {
    return categoryCnt + Object.values(category.topics).reduce((topicCnt, topic) => {
      return topicCnt + topic.articles.length
    }, 0)
  }, 0)
})
</script>
