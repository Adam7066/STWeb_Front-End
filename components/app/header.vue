<template>
  <t-head-menu theme="light" class="drop-shadow" :value="headMenuVal">
    <template #logo>
      <img class="ml-8 size-12" src="@/assets/images/logo.png" alt="logo">
    </template>

    <div v-for="(item, number) in menu" :key="item.value" class="hidden lg:block">
      <t-menu-item v-if="number<leftMenuItemCnt" :value="item.value" class="text-2xl" :to="item.to">
        {{ item.content }}
      </t-menu-item>
    </div>

    <template #operations>
      <t-space class="mr-8" :size="25">
        <div v-for="(item, number) in menu" :key="item.value" class="hidden lg:block">
          <t-menu-item v-if="number >= leftMenuItemCnt" :value="item.value" class="text-2xl" :to="item.to">
            {{ item.content }}
          </t-menu-item>
        </div>
        <div class="block lg:hidden">
          <t-popup :destroy-on-close="true" trigger="click">
            <BulletpointIcon size="2em" />
            <template #content>
              <t-menu :value="headMenuVal">
                <div v-for="item in menu" :key="item.value">
                  <t-menu-item :value="item.value" class="text-lg !text-black" :to="item.to">
                    <template #icon>
                      <t-icon :name="item.icon" class="mr-3" />
                    </template>
                    {{ item.content }}
                  </t-menu-item>
                </div>
              </t-menu>
            </template>
          </t-popup>
        </div>
      </t-space>
    </template>
  </t-head-menu>
</template>

<script setup lang="ts">
import { BulletpointIcon } from 'tdesign-icons-vue-next'

const headMenuVal = ref('')

onMounted(() => {
  const curRoute = useRoute().name?.toString() ?? ''
  headMenuVal.value = curRoute.split('-')[0]
})

const leftMenuItemCnt = 3
const menu = [
  { value: 'index', to: { path: '/' }, content: '首頁', icon: 'home' },
  { value: 'about', to: { path: '/about' }, content: '關於', icon: 'usergroup' },
  { value: 'tools', to: { path: '/tools' }, content: '小工具', icon: 'tools' },
  { value: 'login', to: { path: '/login' }, content: '登入', icon: 'login' },
]
</script>
