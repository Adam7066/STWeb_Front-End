<template>
  <t-head-menu theme="light" class="drop-shadow">
    <template #logo>
      <img class="ml-8 h-12 w-12" src="@/assets/images/logo.png" alt="logo" />
    </template>

    <div v-for="item in menu" :key="item.value" class="hidden sm:block">
      <t-menu-item :value="item.value" class="text-2xl" :to="item.to">
        {{ item.content }}
      </t-menu-item>
    </div>

    <template #operations>
      <t-space class="mr-8" :size="25">
        <NuxtLink to="https://blog.smallten.me/" target="_blank">
          <BookmarkIcon size="2em" />
        </NuxtLink>
        <NuxtLink to="https://github.com/Adam7066" target="_blank">
          <LogoGithubFilledIcon size="2em" />
        </NuxtLink>
        <div class="block sm:hidden">
          <t-dropdown :options="menu" @click="clickHandler">
            <MenuApplicationIcon size="2em" />
          </t-dropdown>
        </div>
      </t-space>
    </template>
  </t-head-menu>
</template>

<script setup lang="ts">
import { type DropdownProps } from 'tdesign-vue-next'
import { BookmarkIcon, LogoGithubFilledIcon, MenuApplicationIcon } from 'tdesign-icons-vue-next'

const router = useRouter()

const menu = [
  { value: 'home', to: '/', content: '首頁' },
  { value: 'about', to: '/about', content: '關於我' },
  { value: 'tools', to: '/tools', content: '小工具' },
]

const clickHandler: DropdownProps['onClick'] = (data) => {
  router.push(data.to)
}
</script>
