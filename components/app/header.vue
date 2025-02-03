<template>
  <t-head-menu theme="light" class="drop-shadow" :value="headMenuVal">
    <!-- Desktop Left Menu -->
    <template #logo>
      <img class="ml-8 size-12" src="@/assets/images/logo.png" alt="logo">
    </template>

    <div v-for="item in menu[0]" :key="item.value" class="hidden lg:block">
      <t-menu-item v-if="item.visible" :value="item.value" class="text-2xl" @click="goTo(item.to)">
        {{ item.content }}
      </t-menu-item>
    </div>

    <template #operations>
      <client-only>
        <div class="mr-8 flex items-center justify-center">
          <!-- Desktop Right Menu -->
          <div v-for="item in menu[1]" :key="item.value" class="hidden lg:block">
            <t-menu-item v-if="item.visible" :value="item.value" class="text-2xl" @click="goTo(item.to)">
              {{ item.content }}
            </t-menu-item>
          </div>

          <div v-if="isLoggedIn" class="hidden lg:flex lg:items-center lg:justify-center">
            <t-popup :destroy-on-close="true" trigger="click">
              <t-avatar :image="userStore.avatar" size="large" />
              <template #content>
                <t-menu :value="headMenuVal">
                  <div class="flex items-center">
                    <t-avatar :image="userStore.avatar" />
                    <div class="ml-4 truncate text-center text-lg">{{ userStore.username }}</div>
                  </div>
                  <t-divider class="!my-2" />
                  <template v-for="(subMenu, index) in avatarMenu" :key="index">
                    <template v-for="item in subMenu" :key="item.value">
                      <t-menu-item :value="item.value" class="text-lg !text-black" @click="goTo(item.to)">
                        <template #icon>
                          <t-icon :name="item.icon" class="mr-3" />
                        </template>
                        {{ item.content }}
                      </t-menu-item>
                    </template>
                    <t-divider v-if="index < avatarMenu.length - 1" class="!my-2" />
                  </template>
                </t-menu>
              </template>
            </t-popup>
          </div>

          <!-- Mobile -->
          <div class="block lg:hidden">
            <t-popup :destroy-on-close="true" trigger="click">
              <BulletpointIcon size="2em" />
              <template #content>
                <t-menu :value="headMenuVal">
                  <div v-if="isLoggedIn" class="flex items-center">
                    <t-avatar :image="userStore.avatar" />
                    <div class="ml-4 truncate text-center text-lg">{{ userStore.username }}</div>
                  </div>
                  <t-divider v-if="isLoggedIn" class="!my-2" />

                  <template v-for="(subMenu, index) in mobileMenu" :key="index">
                    <template v-for="item in subMenu" :key="item.value">
                      <t-menu-item :value="item.value" class="text-lg !text-black" @click="goTo(item.to)">
                        <template #icon>
                          <t-icon :name="item.icon" class="mr-3" />
                        </template>
                        {{ item.content }}
                      </t-menu-item>
                    </template>
                    <t-divider v-if="index < mobileMenu.length - 1" class="!my-2" />
                  </template>
                </t-menu>
              </template>
            </t-popup>
          </div>
        </div>
      </client-only>
    </template>
  </t-head-menu>
</template>

<script setup lang="ts">
import type { MenuProps } from 'tdesign-vue-next'
import { BulletpointIcon } from 'tdesign-icons-vue-next'

const userStore = useUser()
const isLoggedIn = useState<boolean>('isLoggedIn')

const headMenuVal = ref<MenuProps['value']>('')

onMounted(() => {
  const curRoute = useRoute().name?.toString() ?? ''
  headMenuVal.value = curRoute.split('-')[0]
})

const menu = [
  [ // Left
    { value: 'index', to: '/', content: '首頁', icon: 'home', visible: true },
    { value: 'about', to: '/about', content: '關於', icon: 'usergroup', visible: true },
    { value: 'tools', to: '/tools', content: '小工具', icon: 'tools', visible: true },
  ],
  [ // Right
    { value: 'login', to: '/login', content: '登入', icon: 'login', visible: !isLoggedIn.value },
  ],
  [ // Avatar Group 0
    { value: 'dashboard', to: '/dashboard', content: '儀表板', icon: 'dashboard-1', visible: isLoggedIn.value },
    { value: 'setting', to: '/setting', content: '設定', icon: 'setting-1', visible: isLoggedIn.value },
  ],
  [ // Avatar Group 1
    { value: 'logout', to: '/logout', content: '登出', icon: 'logout', visible: isLoggedIn.value },
  ],
]
const avatarMenu = menu.slice(2)
  .map(group => group.filter(item => item.visible))
const mobileMenu = menu.map(group => group.filter(item => item.visible))
  .filter(group => group.length > 0)

const goTo = (to: string) => {
  if (to === '/logout') window.location.href = to
  else navigateTo(to)
}
</script>
