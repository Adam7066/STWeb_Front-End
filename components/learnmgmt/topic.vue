<template>
  <div class="flex justify-between">
    <div class="mb-4 text-xl font-medium">主題 Topic</div>
    <t-button variant="outline" theme="success" @click="showCreateDialog">新增主題</t-button>
    <t-dialog v-model:visible="createVisible" header="新增主題" width="550px">
      <template #cancelBtn />
      <template #confirmBtn />
      <t-form :data="createFormData" :rules="learnTopicFormRules" @submit="createTopic">
        <t-form-item name="name" label="名稱">
          <t-input v-model="createFormData.name" :clearable="true" placeholder="請輸入 名稱" />
        </t-form-item>
        <t-form-item name="value" label="Value">
          <t-input v-model="createFormData.value" :clearable="true" placeholder="請輸入 Value" />
        </t-form-item>
        <t-form-item name="icon" label="Icon">
          <t-input v-model="createFormData.icon" :clearable="true" placeholder="請輸入 Icon" />
        </t-form-item>
        <t-form-item name="category_id" label="Category ID">
          <t-input-number v-model="createFormData.category_id" theme="normal" />
        </t-form-item>
        <t-form-item class="flex justify-end">
          <t-button theme="primary" type="submit">新增</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>

  <t-table
    row-key="id"
    :data="topicTableData"
    :columns="topicTableColumns"
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
        <t-dialog v-model:visible="updateVisible" header="編輯主題">
          <template #cancelBtn />
          <template #confirmBtn />
          <t-form :data="updateFormData" :rules="learnTopicFormRules" @submit="updateTopic">
            <t-form-item name="name" label="名稱">
              <t-input v-model="updateFormData.name" :clearable="true" placeholder="請輸入 名稱" />
            </t-form-item>
            <t-form-item name="value" label="Value">
              <t-input v-model="updateFormData.value" :clearable="true" placeholder="請輸入 Value" />
            </t-form-item>
            <t-form-item name="icon" label="Icon">
              <t-input v-model="updateFormData.icon" :clearable="true" placeholder="請輸入 Icon" />
            </t-form-item>
            <t-form-item name="category_id" label="Category ID">
              <t-input-number v-model="updateFormData.category_id" theme="normal" />
            </t-form-item>
            <t-form-item class="flex justify-end">
              <t-button theme="primary" type="submit">更新</t-button>
            </t-form-item>
          </t-form>
        </t-dialog>

        <!-- Delete -->
        <t-popconfirm theme="danger" :content="`確定要刪除 ${row.name} ?`" @confirm="deleteTopic(row.id)">
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
import type { LTopic, GetLTopicsRes, CreateLTopicRes, UpdateLTopicRes, DeleteLTopicRes } from '~/scripts/fetchInterface'
import type { TableProps, FormProps } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { DeleteIcon, Edit1Icon } from 'tdesign-icons-vue-next'
import { learnTopicFormRules } from '~/scripts/formRules'

const config = useRuntimeConfig()

const {
  data: getLTopicsRes,
  refresh,
} = await useFetch<GetLTopicsRes>(config.public.backendApi + '/learn/topics', {
  method: 'GET',
  credentials: 'include',
})
const topicTableData = computed(() => getLTopicsRes.value ? getLTopicsRes.value.data : [] as LTopic[])
const topicTableColumns = ref<TableProps['columns']>([
  { colKey: 'id', title: 'ID' },
  { colKey: 'name', title: 'Name' },
  { colKey: 'value', title: 'Value' },
  { colKey: 'icon', title: 'Icon' },
  { colKey: 'category_id', title: 'Category ID' },
  { colKey: 'operation', title: '操作' },
])
const pagination = computed<TableProps['pagination']>(() => {
  return {
    defaultCurrent: 1,
    defaultPageSize: 5,
    total: topicTableData.value.length,
  }
})

const deleteTopic = async (id: number) => {
  const resp = await $fetch<DeleteLTopicRes>(config.public.backendApi + '/learn/topic/' + id, {
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
  icon: '',
  category_id: 0,
})
const showUpdateDialog = (row: LTopic) => {
  Object.keys(updateFormData).forEach((key) => {
    updateFormData[key] = row[key as keyof LTopic]
  })
  updateVisible.value = true
}
const updateTopic: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()
  if (validateResult === true) {
    const resp = await $fetch<UpdateLTopicRes>(config.public.backendApi + '/learn/topic/' + updateFormData.id, {
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
  icon: '',
  category_id: 0,
})
const initCreateFormData = () => {
  createFormData.name = ''
  createFormData.value = ''
  createFormData.icon = ''
  createFormData.category_id = 0
}
const showCreateDialog = () => {
  initCreateFormData()
  createVisible.value = true
}
const createTopic: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()
  if (validateResult === true) {
    const resp = await $fetch<CreateLTopicRes>(config.public.backendApi + '/learn/topic', {
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
