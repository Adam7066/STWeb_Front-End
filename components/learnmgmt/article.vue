<template>
  <div class="flex justify-between">
    <div class="mb-4 text-xl font-medium">文章 Article</div>
    <t-button variant="outline" theme="success" @click="createVisible=true">新增文章</t-button>
    <t-dialog v-model:visible="createVisible" header="新增文章" width="550px">
      <template #cancelBtn />
      <template #confirmBtn />
      <t-form :data="createFormData" :rules="learnArticleFormRules" @submit="createArticle">
        <t-form-item name="title" label="Title">
          <t-input v-model="createFormData.title" :clearable="true" />
        </t-form-item>
        <t-form-item name="topicId" label="Topic ID">
          <t-input v-model="createFormData.topicId" :clearable="true" />
        </t-form-item>
        <t-form-item class="flex justify-end">
          <t-button theme="primary" type="submit">新增</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>

  <t-table
    row-key="id"
    :data="articleTableData"
    :columns="articleTableColumns"
    :stripe="true"
    :bordered="true"
    :hover="true"
    :pagination="pagination"
    table-layout="auto"
  >
    <template #operation="{ row }">
      <t-space>
        <!-- Update -->
        <t-button
          variant="text" theme="primary" shape="circle"
          @click="editArticle(row.id, row.filename, row.title, row.topic_id)"
        >
          <template #icon>
            <Edit1Icon />
          </template>
        </t-button>

        <!-- Delete -->
        <t-popconfirm theme="danger" :content="`確定要刪除 ${row.title} ?`" @confirm="deleteArticle(row.id)">
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
import type { LArticle, GetLArticlesRes, DeleteLArticleRes, CreateLTopicRes } from '~/scripts/fetchInterface'
import type { TableProps, FormProps } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { DeleteIcon, Edit1Icon } from 'tdesign-icons-vue-next'
import { learnArticleFormRules } from '~/scripts/formRules'


const config = useRuntimeConfig()

const {
  data: getLArticlesRes,
  refresh,
} = await useFetch<GetLArticlesRes>(config.public.backendApi + '/learn/articles/basic', {
  method: 'GET',
  credentials: 'include',
})
const articleTableData = computed(() => getLArticlesRes.value ? getLArticlesRes.value.data : [] as LArticle[])
const articleTableColumns = ref<TableProps['columns']>([
  { colKey: 'id', title: 'ID' },
  { colKey: 'title', title: 'Title' },
  { colKey: 'filename', title: 'Filename' },
  { colKey: 'topic_id', title: 'Topic ID' },
  { colKey: 'author_id', title: 'Author ID' },
  { colKey: 'operation', title: '操作' },
])
const pagination = computed(() => {
  return {
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: articleTableData.value.length,
  }
})

const createVisible = ref<boolean>(false)
const createFormData: FormProps['data'] = reactive({
  title: '',
  topicId: 0,
  content: '## ',
})
const initCreateFormData = () => {
  createFormData.title = ''
  createFormData.topicId = 0
}
const createArticle: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()
  if (validateResult === true) {
    const resp = await $fetch<CreateLTopicRes>(config.public.backendApi + '/learn/article', {
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

const deleteArticle = async (id: number) => {
  const resp = await $fetch<DeleteLArticleRes>(config.public.backendApi + '/learn/article/' + id, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (resp.data === 'Success') await MessagePlugin.success('刪除成功')
  else await MessagePlugin.error('刪除失敗')
  await refresh()
}

const editArticle = async (id: string, filename: string, title: string, topicId: number) => {
  await navigateTo({
    path: `/dashboard/learnmgmt/edit/${id}`,
    query: {
      fn: filename,
      title: title,
      topicId: topicId,
    },
  })
}
</script>
