<template>
  <t-layout class="min-h-screen">
    <t-header>
      <AppHeader :key="$route.name?.toString()" />
    </t-header>
    <t-layout class="pt-14">
      <t-aside class="!w-fit border-r-2 border-t-2">
        <t-menu :value="menuValue" :collapsed="collapsed" @change="menuOnChange">
          <template v-for="item in menu" :key="item.value">
            <t-menu-item v-if="item.visible" :value="item.value" class="text-lg !text-black" :to="item.to">
              <template #icon>
                <t-icon :name="item.icon" />
              </template>
              {{ item.name }}
            </t-menu-item>
          </template>

          <template #operations>
            <t-button variant="text" shape="square" @click="changeCollapsed">
              <template #icon>
                <t-icon :name="collapsedIconName" />
              </template>
            </t-button>
          </template>
        </t-menu>
      </t-aside>

      <t-layout>
        <t-content class="bg-white">
          <slot />
        </t-content>
        <t-footer class="!flex !h-12 !items-center !justify-center !border-t">
          <AppFooter />
        </t-footer>
      </t-layout>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import type { ButtonProps, MenuProps } from 'tdesign-vue-next'

const userRole = useState<string>('userRole')

const menuValue = ref<MenuProps['value']>('dashboard')

onMounted(() => {
  const curRoute = useRoute().name?.toString() ?? ''
  if (curRoute.startsWith('dashboard')) {
    const val = curRoute.split('-')
    menuValue.value = val.length > 1 ? val[1] : val[0]
  } else {
    menuValue.value = 'dashboard'
  }
})

const menu = [
  { value: 'dashboard', name: '儀表板', icon: 'dashboard', to: { path: '/dashboard' }, visible: true },
  {
    value: 'usermgmt',
    name: '使用者管理',
    icon: 'user-list',
    to: { path: '/dashboard/usermgmt' },
    visible: userRole.value !== 'User',
  },
  {
    value: 'membermgmt',
    name: '團隊成員管理',
    icon: 'user-business',
    to: { path: '/dashboard/membermgmt' },
    visible: userRole.value !== 'User',
  },
]
const menuOnChange: MenuProps['onChange'] = (active) => {
  menuValue.value = active
}

const collapsed = ref(false)
const collapsedIconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'))
const changeCollapsed: ButtonProps['onClick'] = () => {
  collapsed.value = !collapsed.value
}
</script>
