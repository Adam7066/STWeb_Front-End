<template>
  <client-only>
    <div class="my-14 flex justify-center lg:my-24">
      <t-card :header-bordered="true" class="!mx-4 w-full lg:w-2/3 xl:w-1/2">
        <template #title>
          <div class="text-xl font-semibold">短網址</div>
        </template>

        <t-form :data="formData">
          <t-form-item label="網址" class="text-lg">
            <t-input v-model="formData.url" />
          </t-form-item>

          <div class="flex flex-col sm:flex-row">
            <t-form-item label="帳號" class="text-lg">
              <t-input v-model="formData.account" />
            </t-form-item>
            <t-form-item label="OTP" class="text-lg">
              <t-input v-model="formData.passcode" />
            </t-form-item>
          </div>
        </t-form>
        <div class="mt-6 flex w-full justify-center sm:mt-0">
          <t-button class="w-1/2 sm:w-1/3" variant="outline" theme="primary" @click="doShorten">
            縮短網址
          </t-button>
        </div>

        <div v-if="shortUrl">
          <t-divider />
          <div class="flex flex-col items-center justify-around sm:flex-row">
            <div class="align-middle text-lg">
              縮短後網址：
              <t-link theme="success" class="!text-lg" :href="shortUrl" target="_blank">
                {{ shortUrl }}
              </t-link>
            </div>
            <t-button theme="success" variant="outline" @click="copy(shortUrl)"> Copy </t-button>
          </div>
        </div>
      </t-card>
    </div>
  </client-only>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const { copy } = useClipboard()

const formData = reactive({
  url: 'https://blog.smallten.me',
  account: 'smallten',
  passcode: '',
})

const shortUrl = ref('')

interface ShortenData {
  error: object
  result: {
    code: string
    isSuccess: boolean
  }
}

const doShorten = async () => {
  const data = await $fetch<ShortenData>('/api/shortUrl', {
    method: 'POST',
    body: JSON.stringify(formData),

    onResponseError({ response }) {
      if (response.status === 401) {
        alert('請輸入正確的帳號與OTP')
      }
    },
  })
  if (data.result.code) {
    shortUrl.value = runtimeConfig.public.shortUrlApi + '/' + data.result.code
  }
}
</script>
