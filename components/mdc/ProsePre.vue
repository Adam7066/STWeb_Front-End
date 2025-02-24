<template>
  <div class="my-5 flex flex-col rounded border bg-[#fafafa]">
    <div class="flex items-center space-x-4 px-4 py-2">
      <Icon :name="`vscode-icons:file-type-${props.language}`" class="size-6" />
      <div class="flex-1">{{ props.filename }}</div>
      <div
        v-if="!showCopiedMessage"
        class=" flex size-8 items-center justify-center rounded border hover:bg-gray-300"
        @click="copyCode()"
      >
        <CopyIcon class="size-6" />
      </div>
      <div v-else class="h-8">Copied!</div>
    </div>
    <t-divider class="!m-0" />
    <pre :class="$props.class" class="my-3 bg-[#fafafa] p-0"><slot /></pre>
  </div>
</template>

<script setup lang="ts">
import { CopyIcon } from 'tdesign-icons-vue-next'
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  code: string,
  language?: string
  filename?: string
  highlights?: Array<number>
  meta?: string
  class?: string
}>()

const showCopiedMessage = ref(false)
const { copy } = useClipboard()

const copyCode = async () => {
  await copy(props.code)
  showCopiedMessage.value = true
  setTimeout(() => {
    showCopiedMessage.value = false
  }, 1500)
}
</script>
