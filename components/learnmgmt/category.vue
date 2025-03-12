<template>
  <div class="flex justify-between">
    <div class="mb-4 text-xl font-medium">類別 Category</div>
    <t-button variant="outline" theme="success" @click="createVisible=true">新增類別</t-button>
    <t-dialog v-model:visible="createVisible" header="新增類別" width="550px">
      <template #cancelBtn />
      <template #confirmBtn />
      <t-form :data="createFormData" :rules="learnCategoryFormRules" @submit="createCategory">
        <t-form-item name="name" label="名稱">
          <t-input v-model="createFormData.name" :clearable="true" placeholder="請輸入 名稱" />
        </t-form-item>
        <t-form-item name="value" label="Value">
          <t-input v-model="createFormData.value" :clearable="true" placeholder="請輸入 Value" />
        </t-form-item>
        <t-form-item class="flex justify-end">
          <t-button theme="primary" type="submit">新增</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>

  <t-table
    row-key="id"
    :data="categoryTableData"
    :columns="categoryTableColumns"
    :stripe="true"
    :bordered="true"
    :hover="true"
    :pagination="pagination"
    table-layout="auto"
  >
    <template #operation="{ row }">
      <t-space>
        <!-- Update -->
        <t-button variant="text" theme="primary" shape="circle" @click="showUpdateDialog(row)">
          <template #icon>
            <Edit1Icon />
          </template>
        </t-button>
        <t-dialog v-model:visible="updateVisible" header="編輯類別">
          <template #cancelBtn />
          <template #confirmBtn />
          <t-form :data="updateFormData" :rules="learnCategoryFormRules" @submit="updateCategory">
            <t-form-item name="name" label="名稱">
              <t-input v-model="updateFormData.name" :clearable="true" placeholder="請輸入 名稱" />
            </t-form-item>
            <t-form-item name="value" label="Value">
              <t-input v-model="updateFormData.value" :clearable="true" placeholder="請輸入 Value" />
            </t-form-item>
            <t-form-item class="flex justify-end">
              <t-button theme="primary" type="submit">更新</t-button>
            </t-form-item>
          </t-form>
        </t-dialog>

        <!-- Delete -->
        <t-popconfirm theme="danger" :content="`確定要刪除 ${row.name} ?`" @confirm="deleteCategory(row.id)">
          <t-button variant="text" theme="danger">
            <template #icon>
              <DeleteIcon />
            </template>
          </t-button>
        </t-popconfirm>
      </t-space>
    </template>
  </t-table>
</template>

<script setup lang="ts">
import type {
  LCategory,
  GetLCategoriesRes,
  CreateLCategoryRes,
  UpdateLCategoryRes,
  DeleteLCategoryRes,
} from '~/scripts/fetchInterface'
import { type TableProps, type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { DeleteIcon, Edit1Icon } from 'tdesign-icons-vue-next'
import { learnCategoryFormRules } from '~/scripts/formRules'

const config = useRuntimeConfig()

const {
  data: getLCategoriesRes,
  refresh,
} = await useFetch<GetLCategoriesRes>(config.public.backendApi + '/learn/categories', {
  method: 'GET',
  credentials: 'include',
})
const categoryTableData = computed(() => getLCategoriesRes.value ? getLCategoriesRes.value.data : [] as LCategory[])
const categoryTableColumns = ref<TableProps['columns']>([
  { colKey: 'id', title: 'ID' },
  { colKey: 'name', title: 'Name' },
  { colKey: 'value', title: 'Value' },
  { colKey: 'operation', title: '操作' },
])
const pagination = computed(() => {
  return {
    defaultCurrent: 1,
    defaultPageSize: 5,
    total: categoryTableData.value.length,
  }
})

const deleteCategory = async (id: number) => {
  const resp = await $fetch<DeleteLCategoryRes>(config.public.backendApi + '/learn/category/' + id, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (resp.data === 'Success') await MessagePlugin.success('刪除成功')
  else await MessagePlugin.error('刪除失敗')
  await refresh()
}

const updateVisible = ref<boolean>(false)
const updateFormData: FormProps['data'] = reactive({
  id: 0,
  name: '',
  value: '',
})
const showUpdateDialog = (row: LCategory) => {
  Object.keys(updateFormData).forEach((key) => {
    updateFormData[key] = row[key as keyof LCategory]
  })
  updateVisible.value = true
}
const updateCategory: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()
  if (validateResult === true) {
    const resp = await $fetch<UpdateLCategoryRes>(config.public.backendApi + '/learn/category/' + updateFormData.id, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(updateFormData),
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('更新失敗')
    else {
      await MessagePlugin.success('更新成功')
      updateVisible.value = false
      await refresh()
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}

const createVisible = ref<boolean>(false)
const createFormData: FormProps['data'] = reactive({
  name: '',
  value: '',
})
const initCreateFormData = () => {
  Object.keys(createFormData).forEach((key) => {
    createFormData[key] = ''
  })
}
const createCategory: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()
  if (validateResult === true) {
    const resp = await $fetch<CreateLCategoryRes>(config.public.backendApi + '/learn/category', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(createFormData),
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('新增失敗')
    else {
      await MessagePlugin.success('新增成功')
      initCreateFormData()
      createVisible.value = false
      await refresh()
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}
</script>
