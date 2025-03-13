<template>
  <AsideLayout>
    <template #aside>
      <t-menu :value="menuValue" :collapsed="collapsed" @change="showMobileAsideDrawer=false">
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
    </template>
    <template #content>
      <slot />
    </template>
  </AsideLayout>
</template>

<script setup lang="ts">
import AsideLayout from './aside.vue'
import type { ButtonProps, MenuProps } from 'tdesign-vue-next'

const userRole = useState<string>('userRole')
const showMobileAsideDrawer = useState('showMobileAsideDrawer')

const menuValue = computed<MenuProps['value']>(() => {
  const curRoute = useRoute().name?.toString() ?? ''
  if (curRoute.startsWith('dashboard')) {
    const val = curRoute.split('-')
    return val.length > 1 ? val[1] : val[0]
  }
  return 'dashboard'
})

const menu = computed(() => [
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
  {
    value: 'learnmgmt',
    name: '學習文章管理',
    icon: 'article',
    to: { path: '/dashboard/learnmgmt' },
    visible: userRole.value !== 'User',
  }
])

const collapsed = ref(false)
const collapsedIconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'))
const changeCollapsed: ButtonProps['onClick'] = () => {
  collapsed.value = !collapsed.value
}
</script>
