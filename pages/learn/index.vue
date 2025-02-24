<template>
  <div class="mx-auto my-14 w-5/6">
    <div class="flex w-full justify-between space-x-10">
      <t-space direction="vertical" class="flex-1">
        <div class="text-3xl font-semibold">最新文章</div>
        <template v-for="i in 5" :key="i">
          <t-card :hover-shadow="true" class="shadow-md">OAO</t-card>
        </template>

        <div class="mt-8 text-3xl font-semibold">近期更新</div>
        <template v-for="i in 5" :key="i">
          <t-card :hover-shadow="true" class="shadow-md">OAO</t-card>
        </template>
      </t-space>

      <div class="min-w-60">
        <t-card>
          <div class="space-y-4 text-lg font-medium">
            <div>當前在線人數：1,000</div>
            <div>本站文章總數：100</div>
          </div>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'learn-article-validator',
  layout: 'learn',
})
</script>
