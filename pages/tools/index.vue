<template>
  <div class="my-14 flex items-center justify-center">
    <t-row :gutter="[30, 30]" class="mx-auto w-4/5">
      <t-col v-for="(tool, index) in tools" :key="index" class="w-full" :xs="12" :sm="6" :md="4">
        <t-card :header-bordered="true" class="w-full">
          <template #header>
            <div class="text-xl font-medium">{{ tool.name }}</div>
            <t-button variant="dashed" theme="primary" :ghost="true">
              <NuxtLink v-if="tool.path === '/tools'">Coming soon</NuxtLink>
              <NuxtLink v-else :to="tool.path">前往</NuxtLink>
            </t-button>
          </template>

          <div class="text-center text-lg">
            {{ tool.description }}
          </div>
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>

<script setup lang="ts">
const tools = [
  {
    name: 'QRCode 產生器',
    path: '/tools/qrcode',
    description: '產生 QRCode 並且下載成圖檔',
  },
  {
    name: '短網址',
    path: '/tools',
    description: '短網址服務',
  },
  {
    name: '股票計算機',
    path: '/tools/stockCal',
    description: '快速計算股票交易的成本與報酬',
  },
]
</script>
