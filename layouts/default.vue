<template>
  <t-layout class="min-h-screen">
    <t-header class="fixed left-0 top-0 z-50 w-full">
      <AppHeader :key="$route.name?.toString()" />
    </t-header>
    <t-content class="bg-white pt-14">
      <slot />
    </t-content>
    <t-footer class="!py-4">
      <AppFooter />
    </t-footer>
  </t-layout>
</template>
