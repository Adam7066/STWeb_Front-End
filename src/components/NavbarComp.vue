<template>
	<nav class="ring ring-gray-100">
		<div class="max-w-7xl m-auto h-full">
			<div class="inline-flex w-full">
				<el-space spacer="|" class="m-auto text-2xl">
					<router-link to="/" class="m-4 font-black inline-flex items-center">
						<img src="@/assets/home.png" alt="home" class="h-12 w-12" />
						小十の家
					</router-link>
					<router-link to="/" class="m-4"> About </router-link>
					<router-link to="/" class="m-4"> 小工具 </router-link>
				</el-space>
				<div class="flex-1"></div>
				<el-space spacer="|" class="m-auto h-full">
					<el-switch class="m-4" v-model="switchVal" inline-prompt />
				</el-space>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
const switchVal = ref(false)
</script>
