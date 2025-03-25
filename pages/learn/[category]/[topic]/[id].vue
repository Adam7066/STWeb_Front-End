<template>
  <div class="w-full p-4 lg:p-8">
    <div v-if="ast" class="flex justify-between space-x-8">
      <!-- Article -->
      <div class="flex flex-1 flex-col justify-center">
        <t-card class="w-full max-w-6xl" :header-bordered="true">
          <template v-if="article" #header>
            <t-space direction="vertical">
              <div class="text-3xl font-semibold">{{ article.title }}</div>
              <t-space class="ml-4 text-base">
                <t-tooltip content="最後編輯時間">
                  <CalendarEditIcon class="mr-2 !size-4" />
                  {{ new Date(article.updatedAt).toLocaleDateString() }}
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

        <!-- Comments -->
        <div class="mt-4">
          <t-card :header-bordered="true">
            <template #header>
              <div class="text-xl font-medium">留言板</div>
            </template>
            <div class="max-h-[450px] overflow-auto">
              <template v-for="(comment, index) in floorComments" :key="index">
                <Comment :comment="comment" @reply-comment="showReplyComment" />
                <t-collapse v-if="replyComments[index]" :borderless="true" class="!mx-14">
                  <t-collapse-panel header="查看回覆">
                    <template v-for="(replyComment) in replyComments[index]" :key="replyComment.replyNo">
                      <Comment :comment="replyComment" />
                    </template>
                  </t-collapse-panel>
                </t-collapse>
                <div
                  v-if="isLoggedIn"
                  v-show="replyData.floorNo === comment.floorNo"
                  class="mx-14 flex gap-4 p-2"
                >
                  <t-avatar v-if="userStore.avatar" :image="userStore.avatar" />
                  <t-avatar v-else>
                    <template #icon>
                      <UserIcon />
                    </template>
                  </t-avatar>
                  <div class="flex flex-1 flex-col gap-2">
                    <t-textarea v-model="replyData.content" placeholder="請輸入回覆" />
                    <div class="flex justify-end">
                      <t-button @click="createReplyComment">回覆</t-button>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <t-divider class="!my-2" />
            <div class="flex gap-4 p-2">
              <t-avatar v-if="userStore.avatar" :image="userStore.avatar" />
              <t-avatar v-else>
                <template #icon>
                  <UserIcon />
                </template>
              </t-avatar>
              <div class="flex flex-1 flex-col gap-2">
                <t-textarea
                  v-model="floorTextareaData"
                  placeholder="請輸入留言"
                  @focus="canComment"
                />
                <div class="flex justify-end">
                  <t-button @click="createFloorComment">留言</t-button>
                </div>
              </div>
            </div>
          </t-card>
        </div>
      </div>

      <!-- TOC -->
      <div class="hidden w-72 xl:block">
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
import { MessagePlugin, type TextareaProps } from 'tdesign-vue-next'
import { CalendarEditIcon, UserIcon } from 'tdesign-icons-vue-next'
import type {
  LearnArticle,
  LearnCategory,
  LearnComment,
  GetLearnComments,
  CreateLearnCommentFloor,
  CreateLearnCommentReply,
} from '~/scripts/fetchInterface'

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

const config = useRuntimeConfig()
const route = useRoute()
const routeCategory = route.params.category as string
const routeTopic = route.params.topic as string
const routeId = route.params.id as string

const isLoggedIn = useState<boolean>('isLoggedIn')
const userStore = useUser()

const { data: mdRaw } = await useFetch<string>(config.public.minioApi + '/stweb-learn-article/' + routeId + '.md', {
  method: 'GET',
})
const { data: ast } = await useAsyncData('markdown', () => parseMarkdown(mdRaw?.value ?? ''))

const learnArticles = useState<Record<string, LearnCategory>>('learnArticles')
const article = computed(() => {
  return learnArticles.value[routeCategory].topics[routeTopic].articles
    .find((article: LearnArticle) => article.filename === routeId)
})

const {
  data: getLearnCommentsRes,
  refresh,
} = await useFetch<GetLearnComments>(config.public.backendApi + '/learn/comments', {
  method: 'GET',
  query: {
    articleFn: routeId,
  },
})
const floorComments = computed(() => {
  if (getLearnCommentsRes.value) {
    const comments = getLearnCommentsRes.value.data
    return comments.filter((comment) => comment.replyNo === 0)
  }
  return []
})
const replyComments = computed(() => {
  if (getLearnCommentsRes.value) {
    const comments = getLearnCommentsRes.value.data
    return comments
      .filter((comment) => comment.replyNo !== 0)
      .reduce((acc: LearnComment[][], comment) => {
        const floorIdx = comment.floorNo - 1
        if (!acc[floorIdx]) acc[floorIdx] = []
        acc[floorIdx].push(comment)
        return acc
      }, [])
  }
  return []
})

const canComment: TextareaProps['onFocus'] = async (_, { e }) => {
  if (!isLoggedIn.value) {
    await MessagePlugin.error('請先登入');
    (e.target as HTMLTextAreaElement).blur()
  }
}

const floorTextareaData = ref('')
const createFloorComment = async () => {
  if (!floorTextareaData.value) {
    await MessagePlugin.error('留言不可為空')
    return
  }
  const resp = await $fetch<CreateLearnCommentFloor>(config.public.backendApi + '/learn/comment/floor', {
    method: 'POST',
    credentials: 'include',
    body: {
      articleFn: routeId,
      content: floorTextareaData.value,
    },
  })
  if (resp.error) await MessagePlugin.error(resp.error)
  else if (!resp.data) await MessagePlugin.error('留言失敗')
  else {
    await MessagePlugin.success('留言成功')
    floorTextareaData.value = ''
    await refresh()
  }
}

const replyData = reactive({
  floorNo: 0,
  content: '',
})
const showReplyComment = (floorNo: number) => {
  replyData.floorNo = floorNo === replyData.floorNo ? -1 : floorNo
  replyData.content = ''
}
const createReplyComment = async () => {
  if (!replyData.content) {
    await MessagePlugin.error('回覆不可為空')
    return
  }
  const resp = await $fetch<CreateLearnCommentReply>(config.public.backendApi + '/learn/comment/reply', {
    method: 'POST',
    credentials: 'include',
    body: {
      articleFn: routeId,
      ...replyData,
    },
  })
  if (resp.error) await MessagePlugin.error(resp.error)
  else if (!resp.data) await MessagePlugin.error('回覆失敗')
  else {
    await MessagePlugin.success('回覆成功')
    showReplyComment(-1)
    await refresh()
  }
}
</script>
