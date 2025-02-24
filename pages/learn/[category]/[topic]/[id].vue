<template>
  <div class="w-full p-10">
    <div v-if="ast" class="flex justify-between space-x-10">
      <div class="flex flex-1 justify-center">
        <t-card class="w-full max-w-6xl">
          <template v-if="article" #header>
            <t-space direction="vertical">
              <div class="text-3xl font-semibold">{{ article.title }}</div>
              <t-space class="ml-4 text-base">
                <t-tooltip content="最後編輯時間">
                  <CalendarEditIcon class="mr-2 !size-4" />
                  {{ new Date(article.updated_at).toLocaleDateString() }}
                </t-tooltip>
                <t-tooltip content="作者">
                  <Icon name="my-icon:author" class="mr-2 size-4" />
                  {{ article.author }}
                </t-tooltip>
              </t-space>
            </t-space>
          </template>
          <MDCRenderer :body="ast.body" :data="ast.data" class="prose" />
        </t-card>
      </div>

      <div class="w-72">
        <t-card v-if="ast.toc" :header-bordered="true" class="!fixed max-h-[400px] w-72 overflow-auto">
          <template #header>
            <div class="text-xl font-semibold"># Table of contents</div>
          </template>
          <ul class="list-inside list-disc text-lg font-medium">
            <li v-for="link in ast.toc.links" :key="link.id">
              <a :href="`#${link.id}`" class="truncate">{{ link.text }}</a>
              <ul class="ml-4 list-inside list-[circle]">
                <li v-for="link1 of link.children" :key="link1.id">
                  <a :href="`#${link1.id}`" class="truncate">{{ link1.text }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LearnArticle, LearnCategory } from '~/scripts/fetchInterface'
import { CalendarEditIcon } from 'tdesign-icons-vue-next'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
      integrity: 'sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib',
      crossorigin: 'anonymous',
    },
  ],
})

definePageMeta({
  middleware: 'learn-article-validator',
  layout: 'learn',
})

const route = useRoute()
const routeCategory = route.params.category as string
const routeTopic = route.params.topic as string
const routeId = route.params.id as string

const { data: mdRaw } = await useFetch<string>('http://localhost:9000/stweb-learn-article/' + routeId + '.md', {
  method: 'GET',
})
const { data: ast } = await useAsyncData('markdown', () => parseMarkdown(mdRaw?.value ?? ''))

const learnArticles = useState<Record<string, LearnCategory>>('learnArticles')
const article = computed(() => {
  return learnArticles.value[routeCategory].topics[routeTopic].articles
    .find((article: LearnArticle) => article.filename === routeId)
})
</script>
