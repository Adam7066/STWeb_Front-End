<template>
    <div class="flex w-full flex-col items-center justify-center">
        <div class="my-14 flex w-1/2 max-w-[450px] flex-col items-center justify-center gap-4">
          <div class="mb-6 text-2xl font-semibold">重設您的密碼</div>
            <t-form
                ref="resetPasswordForm" label-align="top" :required-mark="false" :data="formData" :rules="userFormRules"
                class="!w-full !max-w-[450px] rounded-md border border-gray-200 bg-white !p-6"
                @submit="resetPassWord"
            >   
                <t-form-item name="password">
                    <template #label>
                        <div class="text-lg">請輸入新的密碼</div>
                    </template>
                    <t-input v-model="formData.password" type="password" :clearable="true" placeholder="請輸入 新的密碼" class="!mt-4">
                        <template #prefix-icon>
                            <LockOnIcon />
                        </template>
                    </t-input>
                </t-form-item>

                <t-form-item>
                    <t-button theme="primary" type="submit" :block="true">送出</t-button>
                </t-form-item>
            </t-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MessagePlugin, type FormProps } from 'tdesign-vue-next'
import { userFormRules } from '~/scripts/formRules'
import { LockOnIcon } from 'tdesign-icons-vue-next'

const config = useRuntimeConfig()
const route = useRoute()
const token = route.query.token as string

const formData = ref({
  password: '',
})

interface resetPasswordResData {
  error: string
  data: string
}

const resetPassWord: FormProps['onSubmit'] = async({ validateResult, firstError, e}) => {
  if (e) e.preventDefault()

  if(validateResult == true){
    const res = await $fetch<resetPasswordResData>(config.public.backendApi + '/reset-pwd', {
      method: 'POST',
      body: JSON.stringify({
        token: token,
        newPwd: formData.value.password
      })
    })
    if(res.error){
      MessagePlugin.error(res.error)
    }else{
      MessagePlugin.success('密碼重設成功，請重新登入')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    }
  }else if(firstError){
    MessagePlugin.error(firstError)
  }
}

</script>
