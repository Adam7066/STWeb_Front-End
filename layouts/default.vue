<template>
  <t-layout class="min-h-screen">
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
