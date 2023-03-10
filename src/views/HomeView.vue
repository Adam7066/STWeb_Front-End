<template>
	<el-card :body-style="{ height: '100%' }" class="mt-24 mx-auto max-w-3xl h-xs">
		<div class="h-full text-center flex items-center">
			<p class="m-auto text-5xl font-bold">歡迎來到小十的家</p>
		</div>
	</el-card>
</template>

<style scoped>
p {
	overflow: hidden;
	white-space: nowrap;
	animation: typing 3s steps(30) infinite;
}
@keyframes typing {
	from {
		width: 0;
	}
	to {
		width: 100%;
	}
}
</style>
