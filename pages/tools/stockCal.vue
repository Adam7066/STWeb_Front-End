<template>
  <client-only>
    <div class="my-14 flex justify-center lg:my-24">
      <t-card :header-bordered="true" class="!mx-4 w-full lg:w-2/3 xl:w-1/2">
        <template #title>
          <div class="text-xl font-semibold">台股交易計算機</div>
        </template>

        <t-form label-width="125px">
          <t-form-item label="股票數量" class="text-lg">
            <div class="flex flex-col sm:flex-row">
              <t-input-number
                v-model="formData.shares[0]"
                theme="normal"
                :min="0"
                :max="999"
                suffix="股"
              />
              <t-input-number
                v-model="formData.shares[1]"
                theme="normal"
                :min="0"
                suffix="張"
                class="!mt-2 sm:!ml-4 sm:!mt-0"
              />
            </div>
          </t-form-item>

          <t-form-item class="text-lg">
            <template #label>
              <div class="text-red-600">買入價格</div>
            </template>
            <t-input-number
              v-model="formData.buyPrice"
              theme="normal"
              :min="0"
              :decimal-places="2"
            />
          </t-form-item>
          <t-form-item class="text-lg">
            <template #label>
              <div class="text-green-600">賣出價格</div>
            </template>
            <t-input-number
              v-model="formData.sellPrice"
              theme="normal"
              :min="0"
              :decimal-places="2"
            />
          </t-form-item>

          <t-form-item label="手續費折扣" help="無條件捨去" class="text-lg">
            <t-input-number
              v-model="formData.discount"
              theme="normal"
              :min="0"
              :max="100"
              suffix="折"
            />
          </t-form-item>

          <t-form-item label="手續費最低價" class="text-lg">
            <t-input-number v-model="formData.discountMin" theme="normal" :min="0" suffix="元" />
          </t-form-item>

          <t-form-item label="稅金" help="無條件捨去，最低一元" class="text-lg">
            <t-radio-group v-model:value="formData.tax">
              <t-radio-button :value="1">證交稅 0.3%</t-radio-button>
              <t-radio-button :value="2">ETF 0.1%</t-radio-button>
            </t-radio-group>
          </t-form-item>
        </t-form>

        <t-divider />

        <t-space :break-line="true" class="text-lg">
          <div>買入成本：{{ buyCost }}</div>
          <div>賣出所得：{{ income }}</div>
          <div>
            利潤/虧損：
            <span :class="[profit < 0 ? 'text-green-600' : 'text-red-600', 'font-medium']">
              {{ profit }}
            </span>
          </div>
        </t-space>
      </t-card>
    </div>
  </client-only>
</template>

<script setup lang="ts">
const formData = reactive({
  shares: [0, 0], // 股, 張
  buyPrice: 0,
  sellPrice: 0,
  discount: 2.8,
  discountMin: 1,
  tax: 1,
})

const shares = computed(() => {
  return (formData.shares[0] ?? 0) + (formData.shares[1] ?? 0) * 1000
})

const discount = computed(() => {
  return formData.discount ?? 10 / 10
})

const buyCost = computed(() => {
  const cost = shares.value * formData.buyPrice ?? 0
  const handlingFee = Math.max(Math.floor(cost * 0.001425 * discount.value), formData.discountMin)
  return Math.round((cost + handlingFee) * 100) / 100
})

const income = computed(() => {
  const income = shares.value * formData.sellPrice ?? 0
  const handlingFee = Math.max(Math.floor(income * 0.001425 * discount.value), formData.discountMin)
  const tax = Math.max(Math.floor(formData.tax === 1 ? income * 0.003 : income * 0.001), 1)
  return Math.round((income - handlingFee - tax) * 100) / 100
})

const profit = computed(() => {
  return Math.round((income.value - buyCost.value) * 100) / 100
})
</script>
