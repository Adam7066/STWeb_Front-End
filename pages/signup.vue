<template>
  <div class="flex w-full flex-col items-center justify-center">
    <div class="mx-4 my-8 flex max-w-[450px] flex-col items-center justify-center gap-4 lg:my-14 lg:w-1/2">
      <div class="text-2xl font-semibold lg:mb-6">歡迎註冊 小十的家</div>
      <t-form
        ref="signUpForm" label-align="top" :required-mark="false" :data="formData" :rules="userFormRules"
        class="!w-full rounded-md border border-gray-200 bg-white !p-6"
        @submit="signUp"
      >
        <t-form-item name="username">
          <template #label>
            <div class="text-lg">使用者名稱</div>
          </template>
          <t-input v-model="formData.username" type="text" :clearable="true" placeholder="請輸入 使用者名稱">
            <template #prefix-icon>
              <User1Icon />
            </template>
          </t-input>
        </t-form-item>

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

        <t-form-item name="verifyCode">
          <template #label>
            <div class="text-lg">驗證碼</div>
          </template>
          <div class="flex w-full flex-row justify-center gap-2">
            <t-input v-model="formData.verifyEmailCode" type="text" :clearable="true" placeholder="請輸入 驗證碼">
              <template #prefix-icon>
                <VerifiedFilledIcon />
              </template>
            </t-input>
            <t-button
              theme="primary" type="button" size="small" variant="base" class="!h-[32px] !w-1/5 !min-w-[72px]"
              @click="sendVerifyCode(formData.email)">
              發送驗證碼
            </t-button>
          </div>
        </t-form-item>

        <t-form-item name="password" help="長度：12-18，須包含大小寫字母、數字、特殊符號">
          <template #label>
            <div class="text-lg">密碼</div>
          </template>
          <t-input v-model="formData.password" type="password" :clearable="true" placeholder="請輸入 密碼">
            <template #prefix-icon>
              <LockOnIcon />
            </template>
          </t-input>
        </t-form-item>

        <t-form-item name="phone">
          <template #label>
            <div class="text-lg">手機號碼</div>
          </template>
          <t-input-group class="flex w-full flex-1 gap-2">
            <t-select v-model="formData.phoneCountry" :clearable="true" placeholder="國家" class="!w-2/5">
              <template #prefixIcon>
                <LocationIcon />
              </template>
              <t-option
                v-for="option in phoneCountryOptions" :key="option.value" :value="option.value"
                :label="option.label"
              />
            </t-select>
            <div class="flex w-[5%] items-center justify-center">-</div>
            <t-input
              v-model="formData.phoneNumber" type="tel" :clearable="true" placeholder="請輸入 手機號碼"
              class="!w-[55%]"
            >
              <template #prefix-icon>
                <Call1Icon />
              </template>
            </t-input>
          </t-input-group>
        </t-form-item>

        <t-form-item>
          <t-button theme="primary" type="submit" :block="true">註冊帳號</t-button>
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin, type FormProps } from 'tdesign-vue-next'
import { MailIcon, LockOnIcon, User1Icon, Call1Icon, LocationIcon, VerifiedFilledIcon } from 'tdesign-icons-vue-next'
import { userFormRules } from '~/scripts/formRules'
import { phoneCountryOptions } from '~/scripts/formOptions'
import type { RegisRes, SendVerifyCodeRes } from '~/scripts/fetchInterface'

const config = useRuntimeConfig()

const formData: FormProps['data'] = reactive({
  username: '',
  email: '',
  verifyEmailCode: '',
  password: '',
  phoneCountry: '',
  phoneNumber: '',
})

const emailSuffix = ['@gmail.com', '@yahoo.com']
const emailOptions = computed(() => {
  const emailPrefix = formData.email.split('@')[0]
  if (!emailPrefix) return []
  return emailSuffix.map((suffix) => emailPrefix + suffix)
})

const sendVerifyCode = async (email: string) => {
  if (!email) {
    await MessagePlugin.error('請輸入電子信箱')
    return
  }
  const res = await $fetch<SendVerifyCodeRes>(config.public.backendApi + '/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  if (res.error) {
    await MessagePlugin.error(res.error)
  } else {
    await MessagePlugin.success('驗證碼已發送至您的電子信箱')
  }
}

const signUp: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()

  if (validateResult === true) {
    const res = await $fetch<RegisRes>(config.public.backendApi + '/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    if (res.error) await MessagePlugin.error(res.error)
    else {
      await MessagePlugin.success('註冊成功, 回到登入頁面')
      await navigateTo('/login', { replace: true })
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}
</script>
