<template>
  <div class="flex w-full flex-col items-center justify-center">
    <div class="my-14 flex w-1/2 max-w-[450px] flex-col items-center justify-center gap-4">
      <div class="mb-6 text-2xl font-semibold">歡迎登入 小十的家</div>

      <div class="w-full rounded-md border border-gray-200 bg-white p-6">
        <t-form
          ref="form" label-align="top" :data="formData" :rules="formRules" :required-mark="false"
          @submit="login"
        >
          <t-form-item name="email">
            <template #label>
              <div class="text-lg">電子信箱</div>
            </template>
            <t-auto-complete v-model="formData.email" :options="emailOptions" :filterable="true">
              <t-input v-model="formData.email" :clearable="true" placeholder="請輸入 電子信箱">
                <template #prefix-icon>
                  <MailIcon />
                </template>
              </t-input>
            </t-auto-complete>
          </t-form-item>

          <t-form-item name="password">
            <template #label>
              <div class="text-lg">密碼</div>
            </template>
            <t-input v-model="formData.password" type="password" :clearable="true" placeholder="請輸入 密碼">
              <template #prefix-icon>
                <LockOnIcon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item>
            <t-button theme="primary" type="submit" :block="true">登入</t-button>
          </t-form-item>
        </t-form>

        <div class="mt-6 flex w-full items-center">
          <div>還沒有帳號？</div>
          <t-button theme="primary" type="button" variant="text">
            <NuxtLink to="/signup" class="text-blue-500">註冊帳號</NuxtLink>
          </t-button>

          <div class="flex flex-1 justify-end">
            <t-button theme="primary" type="button" variant="text">
              <NuxtLink to="/reset-pwd" class="text-blue-500">忘記密碼？</NuxtLink>
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin, type FormProps } from 'tdesign-vue-next'
import { MailIcon, LockOnIcon } from 'tdesign-icons-vue-next'
import type { LoginRes } from '~/scripts/fetchInterface'

const config = useRuntimeConfig()
const userStore = useUser()

const formData: FormProps['data'] = reactive({
  email: '',
  password: '',
})

const emailSuffix = ['@gmail.com', '@yahoo.com']
const emailOptions = computed(() => {
  const emailPrefix = formData.email.split('@')[0]
  if (!emailPrefix) return []
  return emailSuffix.map((suffix) => emailPrefix + suffix)
})

const formRules: FormProps['rules'] = {
  email: [
    { required: true, message: '此項必填', type: 'error', trigger: 'blur' },
    { email: true, message: '格式錯誤', type: 'error', trigger: 'blur' },
  ],
  password: [{ required: true, message: '此項必填', type: 'error', trigger: 'blur' }],
}

const login: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()

  if (validateResult === true) {
    const resp = await $fetch<LoginRes>(config.public.backendApi + '/login', {
      method: 'POST',
      body: JSON.stringify(formData),
      credentials: 'include',
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('請確認電子郵件地址或密碼')
    else {
      userStore.setUsername(resp.data.username)
      userStore.setEmail(resp.data.email)
      userStore.setAvatar(resp.data.avatar)
      const isLoggedIn = useState<boolean>('isLoggedIn')
      isLoggedIn.value = true
      await MessagePlugin.success('登入成功')
      await navigateTo('/', { replace: true })
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}
</script>
