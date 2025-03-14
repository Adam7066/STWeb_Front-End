<template>
  <div class="mx-4 my-8 lg:mx-auto lg:my-14 lg:w-5/6">
    <div class="flex w-full flex-col justify-between lg:flex-row lg:space-x-10">
      <t-space direction="vertical" class="order-2 flex-1 lg:order-none">
        <div class="text-center text-2xl font-semibold lg:text-start lg:text-3xl">最新文章</div>

        <template v-for="i in learnLatest" :key="i.url">
          <t-card :hover-shadow="true" class="shadow-md hover:cursor-pointer" @click="goToArticle(i.url)">
            <t-space direction="vertical" size="small">
              <t-tag theme="primary" variant="light" class="!text-sm !font-medium">{{ i.topic_name }}</t-tag>
              <div class="text-xl font-medium">{{ i.title }}</div>
              <t-space class="text-sm">
                <t-tooltip content="最後編輯時間">
                  <CalendarEditIcon class="mr-2 !size-4" />
                  {{ new Date(i.updated_at).toLocaleDateString() }}
                </t-tooltip>
                <t-tooltip content="作者">
                  <Icon name="my-icon:author" class="mr-2 size-4" />
                  {{ i.author }}
                </t-tooltip>
              </t-space>
            </t-space>
          </t-card>
        </template>
      </t-space>

      <div class="order-1 mb-8 min-w-60 lg:order-none lg:mb-0">
        <t-card>
          <div class="space-y-4 text-lg font-medium">
            <client-only>
              <div>在線閱讀人數：{{ learnStore.total }}</div>
            </client-only>
            <div>當前文章總數：{{ totalArticles }}</div>
          </div>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetLearnLatestRes, LearnCategory, LearnLatest } from '~/scripts/fetchInterface'
import { CalendarEditIcon } from 'tdesign-icons-vue-next'

definePageMeta({
  middleware: 'learn-article-validator',
  layout: 'learn',
})

const config = useRuntimeConfig()
const learnStore = useLearn()
const learnArticles = useState<Record<string, LearnCategory>>('learnArticles')

const totalArticles = computed(() => {
  return Object.values(learnArticles.value).reduce((categoryCnt, category) => {
    return categoryCnt + Object.values(category.topics).reduce((topicCnt, topic) => {
      return topicCnt + topic.articles.length
    }, 0)
  }, 0)
})

const { data } = await useFetch<GetLearnLatestRes>(config.public.backendApi + '/learn/latest', {
  method: 'GET',
})

const learnLatest = computed(() => {
  if (data.value) return data.value.data
  return [] as LearnLatest[]
})

const goToArticle = async (url: string) => {
  await navigateTo({ path: url })
}
</script>
