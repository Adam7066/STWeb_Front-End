<template>
  <div class="mx-2 my-14 flex flex-col items-center justify-center">
    <div class="mb-8 text-2xl font-semibold">歡迎登入 小十的家</div>

    <t-form
      ref="form" label-align="top" :data="formData" :rules="formRules" :required-mark="false"
      class="!w-full !max-w-[450px] rounded-md border border-gray-200 !p-6"
      @submit="login"
    >
      <t-form-item name="email">
        <template #label>
          <div class="text-lg">電子郵件地址</div>
        </template>
        <t-auto-complete v-model="formData.email" :options="emailOptions" :filterable="true">
          <t-input v-model="formData.email" :clearable="true" placeholder="請輸入 電子郵件地址">
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
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin, type FormProps } from 'tdesign-vue-next'
import { MailIcon, LockOnIcon } from 'tdesign-icons-vue-next'

const config = useRuntimeConfig()

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

interface LoginResData {
  error: string
  data: {
    username: string
    email: string
    aToken: string
    rToken: string
  }
}

const login: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()

  if (validateResult === true) {
    const resp = await $fetch<LoginResData>(config.public.backendApi + '/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('請確認電子郵件地址或密碼')
    else await MessagePlugin.success('登入成功')
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}
</script>
