<template>
  <div class="my-8 flex flex-col items-center justify-center lg:my-14">
    <div class="mx-4 max-w-[1440px] lg:w-3/4">
      <div class="text-center text-2xl font-medium lg:text-3xl">團隊簡介</div>
      <hr class="my-2 border-2 lg:my-4">
      <div class="py-4 text-base">
        <p>
          憑藉著一股對於科技、教育的熱情，我們幾個志同道合的夥伴組成了這個團隊，
          並致力於打造一個集教育、學習資源、實用工具於一體的平台，讓學習變得更簡單、更有趣。
        </p>
        <br>
        並且我們始終堅持「開源」、「免費」的理念，為每一位使用者提供無門檻的學習環境。
        <br><br>
        【 對學生 】
        <br>
        我們撰寫了各式各樣的教學文章、提供考古題下載、開發了許多實用小工具...
        <br><br>
        【 對老師 】
        <br>
        我們也準備了許多的教學資源，例如：講義、投影片、Online Judge...
        <br><br>
        <div class="text-blue-600">
          展望未來，【 小十科技 】在教育平台中，不一定要成為第一，但一定能夠越做越好!!
        </div>
      </div>

      <div class="mb-4 mt-8 text-center text-2xl font-medium lg:text-3xl">團隊成員</div>
      <t-row :gutter="30" class="flex" justify="space-around">
        <t-col v-for="member in members" :key="member.name" :xs="12" :sm="6" :md="4">
          <div class="my-4">
            <t-card :header-bordered="true" :hover-shadow="true" class="w-full">
              <template #header>
                <t-avatar :image="member.avatar" />
                <div class="text-xl font-medium">{{ member.name }}</div>
              </template>

              <div class="w-full">
                <div class="text-base">{{ member.description }}</div>
                <t-divider v-if="member.urlGithub && member.urlBlog" />
                <div class="flex justify-around">
                  <t-tooltip v-if="member.urlGithub" content="Github">
                    <NuxtLink :to="member.urlGithub" target="_blank">
                      <LogoGithubFilledIcon size="2em" />
                    </NuxtLink>
                  </t-tooltip>
                  <t-tooltip v-if="member.urlBlog" content="Blog">
                    <NuxtLink :to="member.urlBlog" target="_blank">
                      <PenFilledIcon size="2em" />
                    </NuxtLink>
                  </t-tooltip>
                </div>
              </div>
            </t-card>
          </div>
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogoGithubFilledIcon, PenFilledIcon } from 'tdesign-icons-vue-next'
import type { GetMembersRes, MemberData } from '~/scripts/fetchInterface'

const config = useRuntimeConfig()

const { data } = await useFetch<GetMembersRes>(config.public.backendApi + '/members', {
  method: 'GET',
})

const members = computed(() => {
  if (data.value) return data.value.data
  return [] as MemberData[]
})
</script>
