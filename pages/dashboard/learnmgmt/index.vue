<template>
  <client-only>
    <div class="w-full px-8 py-14">
      <Article />
      <t-divider />
      <Category />
      <t-divider />
      <Topic />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import Article from '~/components/learnmgmt/article.vue'
import Category from '~/components/learnmgmt/category.vue'
import Topic from '~/components/learnmgmt/topic.vue'

definePageMeta({
  layout: 'dashboard',
})
</script>
