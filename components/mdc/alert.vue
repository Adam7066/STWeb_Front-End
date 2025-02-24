<template>
  <t-alert class="!my-2" :theme="props.theme">
    <template #message>
      <MDCSlot mdc-unwrap="p" />
    </template>
  </t-alert>
</template>

<script setup lang="ts">
const props = defineProps<{
  theme: 'error' | 'info' | 'success' | 'warning',
}>()
</script>
