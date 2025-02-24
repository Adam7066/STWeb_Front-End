<template>
  <t-row :gutter="20">
    <t-col v-for="(img, idx) in imgsInfo" :key="idx" :span="4">
      <t-image-viewer :default-index="idx" :images="images">
        <template #trigger="{ open }">
          <div class="relative size-fit">
            <img :alt="img.alt" :src="img.src" :width="img.width">
            <div
              class="absolute inset-0 flex size-full cursor-pointer items-center justify-center bg-gray-200 opacity-0 hover:opacity-65"
              @click="open"
            >
              <span><BrowseIcon />預覽</span>
            </div>
          </div>
        </template>
      </t-image-viewer>
    </t-col>
  </t-row>
</template>

<script setup lang="ts">
import { BrowseIcon } from 'tdesign-icons-vue-next'
import type { ImageViewerProps } from 'tdesign-vue-next'

defineSlots<{
  default: () => VNode[]
}>()

const imgsInfo = ref<{ alt: string; src: string; width: number }[]>([])
const images = ref<ImageViewerProps['images']>([])

onMounted(() => {
  const slots = useSlots()
  if (slots.default) {
    const children = slots.default()[0].children as { default: () => VNode[] }
    if (children) {
      imgsInfo.value = children.default().map((child) => {
        return {
          alt: child.props?.alt,
          src: child.props?.src,
          width: child.props?.width,
        }
      })
    }
  }
  images.value = imgsInfo.value.map((img) => {
    return {
      mainImage: img.src,
      download: false,
    }
  })
})
</script>
