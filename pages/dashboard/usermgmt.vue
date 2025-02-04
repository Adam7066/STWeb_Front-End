<template>
  <client-only>
    <div class="flex items-center justify-center">
      <div class="mx-8 my-14 w-full">
        <!-- Create User -->
        <div class="mb-4">
          <t-button variant="outline" theme="success" @click="createUserVisible=true">新增使用者</t-button>
          <t-dialog v-model:visible="createUserVisible" header="新增使用者" width="550px">
            <template #cancelBtn />
            <template #confirmBtn />

            <t-form :data="createUserFormData" :rules="userFormRules" @submit="createUser">
              <t-form-item name="username" label="使用者名稱" help="長度須大於 3 個字元">
                <t-input v-model="createUserFormData.username" :clearable="true" placeholder="請輸入 使用者名稱" />
              </t-form-item>

              <t-form-item name="email" label="電子信箱">
                <t-input v-model="createUserFormData.email" :clearable="true" placeholder="請輸入 電子信箱" />
              </t-form-item>

              <t-form-item
                name="password" label="密碼"
                help="須包含大小寫字母、數字、特殊字元 且 密碼長度須在 12~18 之間"
              >
                <t-input
                  v-model="createUserFormData.password" type="password" :clearable="true"
                  placeholder="請輸入 密碼" />
              </t-form-item>

              <t-form-item name="phoneCountry" label="手機國碼">
                <t-select
                  v-model="createUserFormData.phoneCountry" :options="phoneCountryOptions" :clearable="true"
                  :filterable="true" />
              </t-form-item>

              <t-form-item name="phoneNumber" label="手機號碼">
                <t-input-number
                  v-model="createUserFormData.phoneNumber" theme="normal" :clearable="true"
                  placeholder="請輸入 手機號碼"
                  class="!w-full"
                />
              </t-form-item>

              <t-form-item class="flex justify-end">
                <t-button theme="primary" type="submit">新增</t-button>
              </t-form-item>
            </t-form>
          </t-dialog>
        </div>

        <!-- Users List -->
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
          <template #operation="{ row }">
            <t-space>
              <!-- Update User -->
              <t-button variant="text" theme="primary" shape="circle" @click="showUpdateUserDialog(row)">
                <template #icon>
                  <Edit1Icon />
                </template>
              </t-button>
              <t-dialog v-model:visible="updateUserVisible" header="編輯使用者">
                <template #cancelBtn />
                <template #confirmBtn />

                <t-form :data="updateUserFormData" :rules="userFormRules" @submit="updateUser">
                  <t-form-item name="username" label="使用者名稱" help="長度須大於 3 個字元">
                    <t-input v-model="updateUserFormData.username" :clearable="true" placeholder="請輸入 使用者名稱" />
                  </t-form-item>

                  <t-form-item name="email" label="電子信箱">
                    <t-input v-model="updateUserFormData.email" :disabled="true" />
                  </t-form-item>

                  <t-form-item name="phoneCountry" label="手機國碼">
                    <t-select
                      v-model="updateUserFormData.phoneCountry" :options="phoneCountryOptions" :clearable="true"
                      :filterable="true" />
                  </t-form-item>

                  <t-form-item name="phoneNumber" label="手機號碼">
                    <t-input-number
                      v-model="updateUserFormData.phoneNumber" theme="normal" :clearable="true"
                      placeholder="請輸入 手機號碼"
                      class="!w-full"
                    />
                  </t-form-item>

                  <t-form-item name="role" label="身份別">
                    <t-radio-group
                      v-model="updateUserFormData.role"
                      variant="primary-filled"
                      :disabled="userRole!=='SuperAdmin'"
                    >
                      <t-radio-button value="User">User</t-radio-button>
                      <t-radio-button value="Admin">Admin</t-radio-button>
                      <t-radio-button value="SuperAdmin">SuperAdmin</t-radio-button>
                    </t-radio-group>
                  </t-form-item>

                  <t-form-item class="flex justify-end">
                    <t-button theme="primary" type="submit">更新</t-button>
                  </t-form-item>
                </t-form>
              </t-dialog>

              <!-- Delete User -->
              <t-popconfirm theme="danger" :content="`確定要刪除 ${row.username} ?`" @confirm="deleteUser(row.id)">
                <t-button
                  variant="text"
                  theme="danger"
                  :disabled="userRole==='Admin' && row.role!=='User'"
                >
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
import { Edit1Icon, DeleteIcon } from 'tdesign-icons-vue-next'
import type { UserData, GetUsersRes, DeleteUserRes, CreateUserRes, UpdateUserRes } from '~/scripts/fetchInterface'
import { userFormRules } from '~/scripts/formRules'
import { phoneCountryOptions } from '~/scripts/formOptions'

definePageMeta({
  layout: 'dashboard',
})

const config = useRuntimeConfig()
const userRole = useState<string>('userRole')

const { data: getUsersRes, refresh } = await useFetch<GetUsersRes>(config.public.backendApi + '/users', {
  method: 'GET',
  credentials: 'include',
})
const tableData = computed(() => getUsersRes.value ? getUsersRes.value.data : [] as UserData[])

const tableColumns = ref<TableProps['columns']>([
  { colKey: 'id', title: 'ID' },
  { colKey: 'avatar', title: '頭像' },
  { colKey: 'username', title: '名稱' },
  { colKey: 'email', title: '電子信箱' },
  { colKey: 'phoneCountry', title: '手機國碼' },
  { colKey: 'phoneNumber', title: '手機號碼' },
  { colKey: 'role', title: '身份別' },
  { colKey: 'operation', title: '操作' },
])

const deleteUser = async (id: number) => {
  const resp = await $fetch<DeleteUserRes>(config.public.backendApi + '/user/' + id, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (resp.data === 'Success') await MessagePlugin.success('刪除成功')
  else await MessagePlugin.error('刪除失敗')
  await refresh()
}

const createUserVisible = ref(false)
const createUserFormData: FormProps['data'] = reactive({
  username: '',
  email: '',
  password: '',
  phoneCountry: '',
  phoneNumber: '',
})

const initCreateUserFormData = () => {
  Object.keys(createUserFormData).forEach((key) => {
    createUserFormData[key] = ''
  })
}

const createUser: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()

  if (validateResult === true) {
    if (!createUserFormData.phoneNumber) createUserFormData.phoneCountry = ''

    const resp = await $fetch<CreateUserRes>(config.public.backendApi + '/user', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(createUserFormData),
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('新增失敗')
    else {
      await MessagePlugin.success('新增成功')
      initCreateUserFormData()
      createUserVisible.value = false
      await refresh()
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}

const updateUserVisible = ref(false)
const updateUserFormData: FormProps['data'] = reactive({
  id: 0,
  username: '',
  email: '',
  phoneCountry: '',
  phoneNumber: '',
  role: '',
})

const showUpdateUserDialog = (row: UserData) => {
  Object.keys(updateUserFormData).forEach((key) => {
    updateUserFormData[key] = row[key as keyof UserData]
  })
  updateUserVisible.value = true
}

const updateUser: FormProps['onSubmit'] = async ({ validateResult, firstError, e }) => {
  if (e) e.preventDefault()

  if (validateResult === true) {
    if (!updateUserFormData.phoneNumber) updateUserFormData.phoneCountry = ''

    const resp = await $fetch<UpdateUserRes>(config.public.backendApi + '/user/' + updateUserFormData.id, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(updateUserFormData),
    })
    if (resp.error) await MessagePlugin.error(resp.error)
    else if (!resp.data) await MessagePlugin.error('更新失敗')
    else {
      await MessagePlugin.success('更新成功')
      updateUserVisible.value = false
      await refresh()
    }
  } else if (firstError) {
    await MessagePlugin.error(firstError)
  }
}

onMounted(async () => {
  await refresh()
  initCreateUserFormData()
})
</script>
