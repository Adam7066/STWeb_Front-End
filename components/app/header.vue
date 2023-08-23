<template>
  <div>
    <t-head-menu theme="light" class="drop-shadow">
      <template #logo>
        <img class="ml-8 h-12 w-12" src="@/assets/images/logo.png" alt="logo" />
      </template>
      <t-menu-item value="home" class="text-2xl" to="/">首頁</t-menu-item>
      <t-menu-item value="about" class="text-2xl" to="/about">關於我</t-menu-item>
      <t-menu-item value="tools" class="text-2xl" to="/tools">小工具</t-menu-item>

      <template #operations>
        <t-space class="mr-8" :size="25">
          <NuxtLink to="https://blog.smallten.me/" target="_blank">
            <t-icon name="books" size="2em" />
          </NuxtLink>
          <NuxtLink to="https://github.com/Adam7066" target="_blank">
            <t-icon name="logo-github-filled" size="2em" />
          </NuxtLink>
        </t-space>
      </template>
    </t-head-menu>
  </div>
</template>
