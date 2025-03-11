<template>
  <client-only>
    <div class="flex h-[calc(100vh-105px)]">
      <!-- Preview -->
      <div class="h-full w-1/2 overflow-y-auto break-words border-r border-black p-4">
        <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="prose" />
      </div>

      <!-- Editor -->
      <div class="w-1/2">
        <div class="flex size-full flex-col">
          <div class="flex gap-2 px-4 py-1">
            <template v-for="i in editorBtn" :key="i.source">
              <t-tooltip :content="i.content">
                <t-button shape="square" variant="outline" @click="insertVal(i.source, i.lVal, i.rVal)">
                  <template #icon>
                    <t-icon :name="i.icon" />
                  </template>
                </t-button>
              </t-tooltip>
            </template>

            <div class="flex-1" />

            <t-tooltip content="編輯文章資訊">
              <t-button shape="square" variant="outline" @click="editVisible=true">
                <template #icon>
                  <EditIcon />
                </template>
              </t-button>
            </t-tooltip>
            <t-dialog v-model:visible="editVisible" header="編輯文章資訊">
              <template #cancelBtn />
              <template #confirmBtn />
              <t-form>
                <t-form-item label="Title" :required-mark="true">
                  <t-input v-model="title" :clearable="true" />
                </t-form-item>
                <t-form-item label="Topic ID" :required-mark="true">
                  <t-input-number v-model="topicId" theme="normal" />
                </t-form-item>
              </t-form>
            </t-dialog>

            <t-tooltip content="儲存">
              <t-button shape="square" variant="outline" @click="update()">
                <template #icon>
                  <SaveIcon />
                </template>
              </t-button>
            </t-tooltip>

            <t-tooltip content="幫助">
              <t-button shape="square" variant="outline">
                <template #icon>
                  <HelpIcon />
                </template>
              </t-button>
            </t-tooltip>
          </div>

          <MonacoEditor ref="editorRef" v-model="mdContent" class="flex-1" :options="editorOptions" />
        </div>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'
import { SaveIcon, HelpIcon, EditIcon } from 'tdesign-icons-vue-next'
import type { editor } from 'monaco-editor'
import { MonacoEditor } from '#components'
import type { UpdateLArticleRes } from '~/scripts/fetchInterface'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
      integrity: 'sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib',
      crossorigin: 'anonymous',
    },
  ],
})

const config = useRuntimeConfig()
const route = useRoute()

const id = route.params.id as string
const fn = route.query.fn as string
const title = ref<string>(route.query.title as string)
const topicId = ref<number>(parseInt(route.query.topicId as string))

const mdContent = ref('')
const ast = ref()
const editVisible = ref(false)

const getMDRaw = async () => {
  return await $fetch<string>(
    config.public.minioApi + '/stweb-learn-article/' + fn + '.md', {
      method: 'GET',
      cache: 'no-cache',
    },
  )
}

onMounted(async () => {
  if (!id || !fn || !title.value || !topicId.value)
    await navigateTo('/dashboard/learnmgmt')
  mdContent.value = await getMDRaw()
})

watch(mdContent, async (newContent) => {
  ast.value = await parseMarkdown(newContent)
})

const update = async () => {
  if (!id && !fn) return
  const resp = await $fetch<UpdateLArticleRes>(config.public.backendApi + '/learn/article/' + id, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({
      'Title': title.value,
      'TopicId': topicId.value,
      'Content': mdContent.value,
    }),
  })
  if (resp.error) await MessagePlugin.error(resp.error)
  else if (!resp.data) await MessagePlugin.error('更新失敗')
  else {
    await MessagePlugin.success('更新成功')
    await navigateTo('/dashboard/learnmgmt')
  }
}

const editorRef = useTemplateRef<InstanceType<typeof MonacoEditor>>('editorRef')
const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  language: 'markdown',
  theme: 'vs-dark',
  wordWrap: 'on',
  fontSize: 16,
  minimap: {
    enabled: false,
  },
}

const editorBtn = [
  { icon: 'textformat-bold', content: '粗體', source: 'insert-bold', lVal: '**', rVal: '**' },
  { icon: 'textformat-italic', content: '斜體', source: 'insert-italic', lVal: '*', rVal: '*' },
  { icon: 'textformat-strikethrough', content: '刪除線', source: 'insert-strike', lVal: '~~', rVal: '~~' },
  { icon: 'textformat-underline', content: '下劃線', source: 'insert-underline', lVal: '<u>', rVal: '</u>' },
  { icon: 'code', content: '行內程式碼', source: 'insert-code', lVal: '`', rVal: '`' },
]


const insertVal = (source: string, lVal: string, rVal: string) => {
  const monaco = useMonaco()
  if (!monaco) return

  const editor = editorRef.value?.$editor
  if (!editor) return

  const selection = editor.getSelection()
  if (!selection) return

  const range = new monaco.Range(
    selection.startLineNumber,
    selection.startColumn,
    selection.endLineNumber,
    selection.endColumn,
  )

  let text: string
  if (selection.isEmpty()) text = `${lVal}${rVal}`
  else text = `${lVal}${editor.getModel()?.getValueInRange(range)}${rVal}`

  editor.executeEdits(source, [{
    range,
    text,
    forceMoveMarkers: true,
  }])

  if (selection.isEmpty()) {
    editor.setPosition({
      lineNumber: selection.startLineNumber,
      column: selection.startColumn + lVal.length,
    })
  }
  editor.focus()
}
</script>
