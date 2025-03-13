<template>
  <t-layout v-if="$device.isMobile" class="min-h-screen">
    <t-header
      class="fixed left-0 top-0 z-50 w-full transition-all duration-500"
      :class="{
        'pointer-events-none -translate-y-full opacity-0': !showMobileHeader,
        'pointer-events-auto translate-y-0 opacity-100': showMobileHeader
      }"
    >
      <MobileHeader :aside-btn="true" />
    </t-header>
    <t-content class="bg-[#f5f5fa] py-14">
      <client-only>
        <t-drawer v-model:visible="showMobileAsideDrawer" :footer="false" size="232px">
          <template #confirmBtn />
          <template #cancelBtn />
          <slot name="aside" />
        </t-drawer>
      </client-only>
      <slot name="content" />
    </t-content>
    <t-footer class="fixed bottom-0 left-0 z-50 h-14 w-full bg-white !p-2">
      <MobileFooter />
    </t-footer>
  </t-layout>

  <t-layout v-else class="min-h-screen">
    <t-header>
      <AppHeader />
    </t-header>
    <t-layout class="h-[calc(100vh-56px)] pt-14">
      <t-aside class="!w-fit border-r-2 border-t-2">
        <slot name="aside" />
      </t-aside>
      <t-layout class="w-[calc(100vw-234px)] overflow-auto">
        <t-content class="bg-[#f5f5fa]">
          <slot name="content" />
        </t-content>
        <t-footer class="!flex !h-12 !items-center !justify-center !border-t">
          <AppFooter />
        </t-footer>
      </t-layout>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
const showMobileAsideDrawer = useState('showMobileAsideDrawer', () => false)
const { showMobileHeader } = useMobileHeaderScroll()
</script>

<style>
.t-drawer__body {
  padding: 0 !important;
}
</style>
