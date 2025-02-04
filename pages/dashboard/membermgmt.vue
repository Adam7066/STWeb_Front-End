<template>
  <client-only>
    <div class="flex items-center justify-center">
      <div class="mx-8 my-14 w-full">
        <!-- Create Member -->
        <div class="mb-4">
          <t-button variant="outline" theme="success" @click="createMemberVisible=true">新增團隊成員</t-button>
          <t-dialog v-model:visible="createMemberVisible" header="新增團隊成員" width="550px">
            <template #cancelBtn />
            <template #confirmBtn />

            <t-form :data="createMemberFormData" :rules="memberFormRules" @submit="createMember">
              <t-form-item name="name" label="成員名稱">
                <t-input v-model="createMemberFormData.name" :clearable="true" placeholder="請輸入 成員名稱" />
              </t-form-item>

              <t-form-item name="description" label="成員簡介">
                <t-textarea v-model="createMemberFormData.description" placeholder="請輸入 成員簡介" />
              </t-form-item>

              <t-form-item name="urlGithub" label="Github">
                <t-input v-model="createMemberFormData.urlGithub" :clearable="true" placeholder="請輸入 Github 連結" />
              </t-form-item>

              <t-form-item name="urlBlog" label="Blog">
                <t-input v-model="createMemberFormData.urlBlog" :clearable="true" placeholder="請輸入 Blog 連結" />
              </t-form-item>

              <t-form-item name="avatar" label="頭像">
                <t-upload
                  v-model="createMemberAvatarFiles"
                  theme="image"
                  tips="請選擇單張圖片上傳"
                  accept="image/*"
                  :auto-upload="false"
                />
              </t-form-item>

              <t-form-item class="flex justify-end">
                <t-button theme="primary" type="submit">新增</t-button>
              </t-form-item>
            </t-form>
          </t-dialog>
        </div>

        <!-- Members List -->
        <t-table
          row-key="id"
          :data="tableData"
          :columns="tableColumns"
          :stripe="true"
          :bordered="true"
          :hover="true"
          table-layout="auto"
        >
          <template #avatar="{ row }">
            <t-avatar :image="row.avatar" />
          </template>

          <template #links="{ row }">
            <t-space>
              <t-link v-if="row.urlGithub" :href="row.urlGithub" target="_blank">
                <template #suffix-icon>
                  <JumpIcon />
                </template>
                Github
              </t-link>
              <t-link v-if="row.urlBlog" :href="row.urlBlog" target="_blank">
                <template #suffix-icon>
                  <JumpIcon />
                </template>
                Blog
              </t-link>
            </t-space>
          </template>

          <template #operation="{ row }">
            <t-space>
              <!-- Update Member -->
              <t-button variant="text" theme="primary" shape="circle" @click="showUpdateMemberDialog(row)">
                <template #icon>
                  <Edit1Icon />
                </template>
              </t-button>
              <t-dialog v-model:visible="updateMemberVisible" header="編輯團隊成員">
                <template #cancelBtn />
                <template #confirmBtn />

                <t-form :data="updateMemberFormData" :rules="memberFormRules" @submit="updateMember">
                  <t-form-item name="name" label="成員名稱">
                    <t-input v-model="updateMemberFormData.name" :clearable="true" placeholder="請輸入 成員名稱" />
                  </t-form-item>

                  <t-form-item name="description" label="成員簡介">
                    <t-textarea v-model="updateMemberFormData.description" placeholder="請輸入 成員簡介" />
                  </t-form-item>

                  <t-form-item name="urlGithub" label="Github">
                    <t-input
                      v-model="updateMemberFormData.urlGithub" :clearable="true"
                      placeholder="請輸入 Github 連結" />
                  </t-form-item>

                  <t-form-item name="urlBlog" label="Blog">
                    <t-input v-model="updateMemberFormData.urlBlog" :clearable="true" placeholder="請輸入 Blog 連結" />
                  </t-form-item>

                  <t-form-item name="avatar" label="頭像">
                    <t-space class="w-full">
                      <t-image
                        v-if="updateMemberFormData.avatar"
                        :src="updateMemberFormData.avatar"
                        class="size-[110px]"
                      />

                      <t-upload
                        v-model="updateMemberAvatarFiles"
                        theme="image"
                        tips="請選擇新頭像上傳"
                        accept="image/*"
                        :auto-upload="false"
                      />
                    </t-space>
                  </t-form-item>

                  <t-form-item class="flex justify-end">
                    <t-button theme="primary" type="submit">更新</t-button>
                  </t-form-item>
                </t-form>
              </t-dialog>

              <!-- Delete Member -->
              <t-popconfirm theme="danger" :content="`確定要刪除 ${row.name} ?`" @confirm="deleteMember(row.id)">
                <t-button variant="text" theme="danger">
                  <template #icon>
                    <DeleteIcon />
                  </template>
                </t-button>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import type { FormProps, TableProps } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { JumpIcon, Edit1Icon, DeleteIcon } from 'tdesign-icons-vue-next'
import type {
  MemberData,
  GetMembersRes,
  DeleteMemberRes,
  CreateMemberRes,
  UpdateMemberRes,
} from '~/scripts/fetchInterface'
import { memberFormRules } from '~/scripts/formRules'

definePageMeta({
  layout: 'dashboard',
})

const config = useRuntimeConfig()

const { data: getMembersRes, refresh } = await useFetch<GetMembersRes>(config.public.backendApi + '/members', {
  method: 'GET',
  credentials: 'include',
})
const tableData = computed(() => getMembersRes.value ? getMembersRes.value.data : [] as MemberData[])

const tableColumns = ref<TableProps['columns']>([
  { colKey: 'id', title: 'ID' },
  { colKey: 'avatar', title: '頭像' },
  { colKey: 'name', title: '名稱' },
  { colKey: 'description', title: '成員簡介' },
  { colKey: 'links', title: '社群連結' },
  { colKey: 'operation', title: '操作' },
])

const deleteMember = async (id: number) => {
  const resp = await $fetch<DeleteMemberRes>(config.public.backendApi + '/member/' + id, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (resp.data === 'Success') await MessagePlugin.success('刪除成功')
  else await MessagePlugin.error('刪除失敗')
  await refresh()
}

const createMemberVisible = ref(false)
const createMemberAvatarFiles = ref([])
const createMemberFormData: FormProps['data'] = reactive({
  name: '',
  description: '',
  urlGithub: '',
  urlBlog: '',
})

const initCreateMemberFormData = () => {
  createMemberAvatarFiles.value = []
  Object.keys(createMemberFormData).forEach((key) => {
    createMemberFormData[key] = ''
  })
}

const createMember: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()

  if (validateResult === true) {
    const formData = new FormData()
    formData.append('name', createMemberFormData.name)
    formData.append('description', createMemberFormData.description)
    formData.append('urlGithub', createMemberFormData.urlGithub)
    formData.append('urlBlog', createMemberFormData.urlBlog)
    if (createMemberAvatarFiles.value.length > 0) {
      formData.append('avatar', createMemberAvatarFiles.value[0]['raw'])
    }

    const resp = await $fetch<CreateMemberRes>(config.public.backendApi + '/member', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('新增失敗')
    else {
      await MessagePlugin.success('新增成功')
      initCreateMemberFormData()
      createMemberVisible.value = false
      await refresh()
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}

const updateMemberVisible = ref(false)
const updateMemberAvatarFiles = ref([])
const updateMemberFormData: FormProps['data'] = reactive({
  id: 0,
  name: '',
  avatar: '',
  description: '',
  urlGithub: '',
  urlBlog: '',
})
const showUpdateMemberDialog = (row: MemberData) => {
  updateMemberAvatarFiles.value = []
  Object.keys(updateMemberFormData).forEach((key) => {
    updateMemberFormData[key] = row[key as keyof MemberData]
  })
  updateMemberVisible.value = true
}

const updateMember: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()

  if (validateResult === true) {
    const formData = new FormData()
    formData.append('name', updateMemberFormData.name)
    formData.append('description', updateMemberFormData.description)
    formData.append('urlGithub', updateMemberFormData.urlGithub)
    formData.append('urlBlog', updateMemberFormData.urlBlog)
    if (updateMemberAvatarFiles.value.length > 0) {
      formData.append('avatar', updateMemberAvatarFiles.value[0]['raw'])
    }

    const resp = await $fetch<UpdateMemberRes>(config.public.backendApi + '/member/' + updateMemberFormData.id, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('更新失敗')
    else {
      await MessagePlugin.success('更新成功')
      updateMemberVisible.value = false
      await refresh()
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}

onMounted(async () => {
  await refresh()
  initCreateMemberFormData()
})
</script>
