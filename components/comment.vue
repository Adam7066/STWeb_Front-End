<template>
  <div class="flex p-2 text-black">
    <t-avatar v-if="comment.userAvatar" :image="comment.userAvatar" />
    <t-avatar v-else>
      <template #icon>
        <UserIcon />
      </template>
    </t-avatar>
    <div class="ml-4 flex flex-1 flex-col">
      <div class="text-base font-medium">{{ comment.username ? comment.username : '這則留言已被刪除' }}</div>
      <div class="py-2 text-base">{{ comment.content ? comment.content : '消失的留言' }}</div>

      <div class="flex gap-2">
        <div>B{{ comment.floorNo }}<span v-if="comment.replyNo!==0">-{{ comment.replyNo }}</span></div>
        <div v-if="comment.content">{{ getCommentTime(comment.updatedAt) }}</div>
        <div v-if="comment.createdAt !== comment.updatedAt">(已編輯)</div>
        <t-button
          v-if="comment.replyNo===0" size="small" variant="text"
          @click="showReplyBlock"
        >
          <div class="flex items-center justify-center gap-1">
            <ChatIcon />
            <div>回覆</div>
          </div>
        </t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'
import { UserIcon, ChatIcon } from 'tdesign-icons-vue-next'
import type { LearnComment } from '~/scripts/fetchInterface'

const props = defineProps<{
  comment: LearnComment
}>()

const emits = defineEmits<{
  (e: 'replyComment', floorNo: number): void
}>()

const isLoggedIn = useState<boolean>('isLoggedIn')

const getCommentTime = (commentDateStr: string) => {
  const commentDate = new Date(commentDateStr)
  const today = new Date()
  return (
    commentDate.getFullYear() === today.getFullYear() &&
    commentDate.getMonth() === today.getMonth() &&
    commentDate.getDate() === today.getDate()
      ? commentDate.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
      : commentDate.toLocaleDateString('zh-TW')
  )
}

const showReplyBlock = () => {
  if (isLoggedIn.value) emits('replyComment', props.comment.floorNo)
  else MessagePlugin.error('請先登入')
}
</script>
