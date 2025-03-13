<template>
    <div class="flex w-full flex-col items-center justify-center">
        <div class="my-14 flex w-1/2 max-w-[450px] flex-col items-center justify-center gap-4">
          <div class="mb-6 text-2xl font-semibold">忘記您的密碼？</div>
            <t-form
                ref="signUpForm" label-align="top" :required-mark="false" :data="formData" :rules="formRules"
                class="!w-full !max-w-[450px] rounded-md border border-gray-200 bg-white !p-6"
                @submit="forgotPassWord"
            >   
                <t-form-item name="email">
                    <template #label>
                        <div class="text-lg">尋找您的電子郵件</div>
                    </template>
                    <t-input v-model="formData.email" type="text" :clearable="true" placeholder="請輸入 電子信箱" class="!mt-4">
                        <template #prefix-icon>
                            <MailIcon />
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
import { MailIcon } from 'tdesign-icons-vue-next'

const config = useRuntimeConfig()

const formRules: FormProps['rules'] = {
  email: [
    { required: true, message: '請輸入 電子信箱', trigger: 'blur' },
    { email: true, message: '電子信箱格式錯誤', trigger: 'blur' }
  ]
}

const formData = ref({
  email: ''   
})

interface forgotPassWordResData {
  error: string
  data: string
}

const forgotPassWord: FormProps['onSubmit'] = async({ validateResult, firstError, e}) => {
  if (e) e.preventDefault()

  if(validateResult == true){
    const res = await $fetch<forgotPassWordResData>(config.public.backendApi + '/forgot-pwd', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })
    if(res.error){
      MessagePlugin.error(res.error)
    }
    else{
      MessagePlugin.success(res.data + '，請查看您的電子郵件')
    }
  }
  else if(firstError){
    MessagePlugin.error(firstError)
  }
}
</script>
