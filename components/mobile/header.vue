<template>
  <div class="flex size-full items-center px-4">
    <img class="size-10" src="@/assets/images/logo.png" alt="logo">
    <div class="w-full text-center text-xl font-medium" :class="{'-ml-10': !asideBtn}">{{ title }}</div>
    <div v-if="asideBtn">
      <div class="flex size-10 items-center justify-center">
        <BulletpointIcon size="2em" @click="showMobileAsideDrawer = true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BulletpointIcon } from 'tdesign-icons-vue-next'

defineProps<{
  asideBtn: boolean
}>()

const titleMap: Record<string, string> = {
  'index': '小十的家',
  'about': '關於我們',
  'learn': '學習文章',
  'tools': '小工具',
  'login': '登入',
}
const route = useRoute()
const title = computed(() => titleMap[(route.name?.toString() ?? 'index').split('-')[0]])
const showMobileAsideDrawer = useState('showMobileAsideDrawer', () => false)
</script>
