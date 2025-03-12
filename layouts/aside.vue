<template>
  <t-layout class="min-h-screen">
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
