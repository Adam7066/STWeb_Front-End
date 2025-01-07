<template>
  <t-layout class="min-h-screen">
    <t-header>
      <AppHeader :key="$route.name?.toString()" />
    </t-header>
    <t-content class="bg-white">
      <slot />
    </t-content>
    <t-footer class="!py-4">
      <AppFooter />
    </t-footer>
  </t-layout>
</template>
