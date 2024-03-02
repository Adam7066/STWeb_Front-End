<template>
  <div class="my-14 flex justify-center lg:my-24">
    <t-card :header-bordered="true" class="!mx-4 w-full lg:w-2/3 xl:w-1/2">
      <template #title>
        <div class="text-xl font-semibold">QRCode 產生器</div>
      </template>

      <div class="flex min-h-[248px] flex-col items-center sm:flex-row">
        <div class="flex w-full flex-col space-y-6 sm:w-2/3">
          <div class="flex">
            <div class="mr-4 font-medium sm:text-lg">文字內容</div>
            <t-input v-model="textInput" class="!w-80" placeholder="請輸入文字內容" />
          </div>
          <div class="flex">
            <div class="mr-4 font-medium sm:text-lg">容錯率</div>
            <t-radio-group default-value="medium" @change="radioOnChange">
              <t-radio-button value="low">low</t-radio-button>
              <t-radio-button value="medium">medium</t-radio-button>
              <t-radio-button value="quartile">quartile</t-radio-button>
              <t-radio-button value="high">high</t-radio-button>
            </t-radio-group>
          </div>
          <div class="flex">
            <div class="mr-4 font-medium sm:text-lg">Mask Pattern</div>
            <t-input-number v-model="mask" :max="7" :min="0" />
          </div>
          <div class="flex">
            <div class="mr-4 font-medium sm:text-lg">背景色</div>
            <t-color-picker
              v-model="color"
              :show-primary-color-preview="false"
              :color-modes="['monochrome']"
              format="HEX"
            />
          </div>
        </div>

        <div v-if="textInput" class="m-auto flex flex-col items-center">
          <div class="min-h-[200px]">
            <VueQrcode :options="qrcodeOptions" :value="textInput" />
          </div>
          <t-button class="!mt-4 w-28" @click="download">下載成 .png</t-button>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { type RadioGroupProps } from 'tdesign-vue-next'
import VueQrcode from '@chenfengyuan/vue-qrcode'

const textInput = ref('')
const errorCorrectionLevel = ref('medium')
const mask = ref(4)
const color = ref('#ffffffff')

const qrcodeOptions = computed(() => ({
  width: 200,
  errorCorrectionLevel: errorCorrectionLevel.value,
  maskPattern: mask.value,
  color: {
    light: color.value,
  },
}))

const download = () => {
  const canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement
  if (!canvas) return
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = 'qrcode.png'
  a.click()
}

const radioOnChange: RadioGroupProps['onChange'] = (checkedValues) => {
  errorCorrectionLevel.value = checkedValues.toString()
}
</script>
