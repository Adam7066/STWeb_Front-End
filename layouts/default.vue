<template>
  <t-layout v-if="$device.isMobile" class="min-h-screen">
    <t-header
      class="fixed left-0 top-0 z-50 w-full transition-all duration-500"
      :class="{'pointer-events-none -translate-y-full opacity-0': !showMobileHeader, 'pointer-events-auto translate-y-0 opacity-100': showMobileHeader}"
    >
      <MobileHeader :aside-btn="false" />
    </t-header>
    <t-content class="bg-[#f5f5fa] py-14">
      <slot />
    </t-content>
    <t-footer class="fixed bottom-0 left-0 z-50 h-14 w-full bg-white !p-2">
      <MobileFooter />
    </t-footer>
  </t-layout>

  <t-layout v-else class="min-h-screen">
    <t-header class="fixed left-0 top-0 z-50 w-full">
      <AppHeader />
    </t-header>
    <t-content class="bg-[#f5f5fa] pt-14">
      <slot />
    </t-content>
    <t-footer class="!flex !h-12 !items-center !justify-center !border-t">
      <AppFooter />
    </t-footer>
  </t-layout>
</template>

<script setup lang="ts">
const { showMobileHeader } = useMobileHeaderScroll()
</script>
