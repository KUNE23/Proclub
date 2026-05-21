<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" @click="close"></div>

        <div class="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div class="flex items-start justify-between border-b border-[#E6EFE9] p-6">
            <div>
              <p class="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#0A733F]">
                {{ module?.title }}
              </p>
              <h2 class="text-lg font-bold text-[#1A2E20]">
                {{ isEditing ? 'Edit Lesson' : 'Create Lesson' }}
              </h2>
              <p class="mt-1 text-[12px] text-gray-500">
                Susun materi, quiz, dan resource pendukung untuk student.
              </p>
            </div>

            <button
              @click="close"
              class="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              type="button"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="flex-1 space-y-6 overflow-y-auto p-6">
            <div class="grid gap-4 md:grid-cols-[1fr_160px_130px]">
              <div>
                <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">
                  Judul Lesson <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  maxlength="140"
                  autocomplete="off"
                  placeholder="Contoh: Apa itu Pemrograman"
                  class="w-full rounded-xl border px-4 py-2.5 text-[13px] outline-none transition-all focus:ring-1"
                  :class="errors.title ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
                  @input="errors.title = ''"
                >
                <p v-if="errors.title" class="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
                  <CircleAlert class="h-3.5 w-3.5" />
                  {{ errors.title }}
                </p>
              </div>

              <div>
                <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">
                  Type
                </label>
                <select
                  v-model="form.type"
                  class="w-full rounded-xl border border-[#E6EFE9] bg-white px-4 py-2.5 text-[13px] outline-none transition-all focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20"
                >
                  <option value="MATERIAL">Material</option>
                  <option value="QUIZ">Quiz</option>
                </select>
              </div>

              <div>
                <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">
                  Urutan
                </label>
                <input
                  v-model.number="form.order"
                  min="1"
                  max="999"
                  type="number"
                  class="w-full rounded-xl border px-4 py-2.5 text-[13px] outline-none transition-all focus:ring-1"
                  :class="errors.order ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
                  @input="errors.order = ''"
                >
                <p v-if="errors.order" class="mt-1.5 text-[11px] text-red-500">
                  {{ errors.order }}
                </p>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">
                Deskripsi
              </label>
              <input
                v-model="form.description"
                maxlength="240"
                placeholder="Ringkasan singkat lesson"
                class="w-full rounded-xl border border-[#E6EFE9] px-4 py-2.5 text-[13px] outline-none transition-all focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20"
              >
            </div>

            <div v-if="form.type === 'MATERIAL'" class="rounded-2xl border border-[#D9E7DF] bg-white">
              <div class="flex flex-wrap items-center gap-1 border-b border-[#E6EFE9] bg-[#F8FBF9] px-4 py-2">
                <button
                  v-for="tool in editorTools"
                  :key="tool.label"
                  @click="applyMarkdown(tool)"
                  class="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[12px] font-bold text-gray-500 transition-colors hover:bg-white hover:text-[#0A733F]"
                  type="button"
                  :title="tool.label"
                >
                  <component v-if="tool.icon" :is="tool.icon" class="h-4 w-4" />
                  <span v-else>{{ tool.text }}</span>
                </button>
              </div>

              <textarea
                ref="editorRef"
                v-model="form.content"
                rows="8"
                placeholder="Tulis materi utama lesson di sini. Markdown sederhana boleh digunakan."
                class="min-h-[220px] w-full resize-y rounded-b-2xl border-0 px-4 py-4 text-[13px] leading-relaxed text-slate-700 outline-none"
              ></textarea>
            </div>

            <div v-if="form.type === 'MATERIAL'" class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-[#1A2E20]">Content Blocks</h3>
                  <p class="mt-0.5 text-[12px] text-gray-500">
                    Tambahkan image, PDF, video, YouTube, atau link pendukung.
                  </p>
                </div>
                <button
                  @click="addBlock"
                  class="flex items-center gap-2 rounded-lg bg-[#F0FDF4] px-3 py-2 text-[12px] font-bold text-[#0A733F] transition-colors hover:bg-[#DCFCE7]"
                  type="button"
                >
                  <Plus class="h-4 w-4" />
                  Add Block
                </button>
              </div>

              <div v-if="form.blocks.length === 0" class="rounded-2xl border border-dashed border-[#D9E7DF] py-10 text-center">
                <FilePlus2 class="mx-auto mb-3 h-8 w-8 text-gray-300" />
                <p class="text-[13px] font-semibold text-gray-400">Belum ada content block tambahan.</p>
              </div>

              <div
                v-for="(block, index) in form.blocks"
                :key="block.uid"
                class="rounded-2xl border border-[#E6EFE9] bg-[#FCFDFD] p-4"
              >
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#0A733F]">
                      <component :is="blockIcon(block.kind)" class="h-4 w-4" />
                    </div>
                    <span class="text-[12px] font-bold uppercase tracking-widest text-gray-500">
                      Block {{ index + 1 }}
                    </span>
                  </div>

                  <button
                    @click="removeBlock(index)"
                    class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    type="button"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>

                <div class="grid gap-3 md:grid-cols-[180px_1fr]">
                  <select
                    v-model="block.kind"
                    class="rounded-xl border border-[#E6EFE9] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="PDF">PDF</option>
                    <option value="VIDEO">Video URL</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="LINK">Link</option>
                  </select>

                  <input
                    v-model="block.title"
                    placeholder="Judul block"
                    maxlength="120"
                    class="rounded-xl border border-[#E6EFE9] px-3 py-2.5 text-[13px] outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20"
                  >

                  <div class="md:col-span-2">
                    <input
                      v-model="block.url"
                      placeholder="https://..."
                      class="w-full rounded-xl border px-3 py-2.5 text-[13px] outline-none focus:ring-1"
                      :class="block.error ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
                      @input="block.error = ''"
                    >
                    <p v-if="block.error" class="mt-1.5 text-[11px] text-red-500">{{ block.error }}</p>
                  </div>

                  <textarea
                    v-model="block.caption"
                    rows="2"
                    placeholder="Caption atau catatan opsional"
                    maxlength="240"
                    class="md:col-span-2 resize-none rounded-xl border border-[#E6EFE9] px-3 py-2.5 text-[13px] outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20"
                  ></textarea>
                </div>
              </div>
            </div>

            <div v-if="form.type === 'QUIZ'" class="space-y-4 rounded-2xl border border-[#E6EFE9] bg-[#FCFDFD] p-5">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-[#1A2E20]">Quiz Questions</h3>
                  <p class="mt-0.5 text-[12px] text-gray-500">Minimal satu pertanyaan dengan empat opsi jawaban.</p>
                </div>
                <button
                  @click="addQuestion"
                  class="flex items-center gap-2 rounded-lg bg-[#F0FDF4] px-3 py-2 text-[12px] font-bold text-[#0A733F] transition-colors hover:bg-[#DCFCE7]"
                  type="button"
                >
                  <Plus class="h-4 w-4" />
                  Add Question
                </button>
              </div>

              <div>
                <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">KKM</label>
                <input
                  v-model.number="form.kkm"
                  min="1"
                  max="100"
                  type="number"
                  class="w-32 rounded-xl border px-4 py-2.5 text-[13px] outline-none"
                  :class="errors.kkm ? 'border-red-400 bg-red-50' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20'"
                >
                <p v-if="errors.kkm" class="mt-1.5 text-[11px] text-red-500">{{ errors.kkm }}</p>
              </div>

              <div
                v-for="(question, qIndex) in form.questions"
                :key="question.uid"
                class="rounded-2xl border border-[#E6EFE9] bg-white p-4"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-[12px] font-bold uppercase tracking-widest text-gray-500">
                    Question {{ qIndex + 1 }}
                  </span>
                  <button
                    @click="removeQuestion(qIndex)"
                    class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    type="button"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>

                <input
                  v-model="question.question"
                  placeholder="Tulis pertanyaan"
                  class="mb-3 w-full rounded-xl border px-3 py-2.5 text-[13px] outline-none"
                  :class="question.error ? 'border-red-400 bg-red-50' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20'"
                  @input="question.error = ''"
                >
                <p v-if="question.error" class="mb-3 text-[11px] text-red-500">{{ question.error }}</p>

                <div class="grid gap-3 md:grid-cols-2">
                  <div
                    v-for="(_, optIndex) in question.options"
                    :key="optIndex"
                    class="flex items-center gap-2"
                  >
                    <input
                      v-model="question.correctIndex"
                      :value="optIndex"
                      type="radio"
                      :name="`correct-${question.uid}`"
                      class="h-4 w-4 text-[#0A733F]"
                    >
                    <input
                      v-model="question.options[optIndex]"
                      :placeholder="`Opsi ${String.fromCharCode(65 + optIndex)}`"
                      class="w-full rounded-xl border border-[#E6EFE9] px-3 py-2.5 text-[13px] outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20"
                    >
                  </div>
                </div>
              </div>
            </div>

            <div v-if="submitError" class="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
              <CircleAlert class="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p class="text-[12px] text-red-700">{{ submitError }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-[#E6EFE9] bg-white px-6 py-5">
            <button
              @click="close"
              :disabled="submitting"
              class="rounded-xl bg-gray-100 px-5 py-2.5 text-[13px] font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
              type="button"
            >
              Batal
            </button>
            <button
              @click="handleSubmit"
              :disabled="submitting"
              class="flex items-center gap-2 rounded-xl bg-[#0A733F] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm shadow-[#0A733F]/30 transition-colors hover:bg-[#085a31] disabled:opacity-60"
              type="button"
            >
              <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              {{ submitting ? 'Menyimpan...' : (isEditing ? 'Update Lesson' : 'Create Lesson') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import {
  Bold,
  CircleAlert,
  Code2,
  FilePlus2,
  Heading,
  Image,
  Italic,
  Link,
  Link2,
  List,
  Loader2,
  Plus,
  Save,
  Trash2,
  Video,
  X
} from 'lucide-vue-next'
import { createLesson, updateLesson } from '../../../services/moduleService.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  module: { type: Object, default: null },
  lesson: { type: Object, default: null },
  nextOrder: { type: Number, default: 1 }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const editorRef = ref(null)
const submitting = ref(false)
const submitError = ref('')
const isEditing = computed(() => !!props.lesson)

const form = reactive({
  title: '',
  description: '',
  type: 'MATERIAL',
  order: 1,
  content: '',
  kkm: 70,
  blocks: [],
  questions: []
})

const errors = reactive({
  title: '',
  order: '',
  kkm: ''
})

const editorTools = [
  { label: 'Heading', icon: Heading, prefix: '### ', suffix: '' },
  { label: 'Bold', icon: Bold, prefix: '**', suffix: '**' },
  { label: 'Italic', icon: Italic, prefix: '*', suffix: '*' },
  { label: 'List', icon: List, prefix: '- ', suffix: '' },
  { label: 'Code', icon: Code2, prefix: '`', suffix: '`' },
  { label: 'Link', icon: Link2, prefix: '[', suffix: '](https://)' }
]

const makeUid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const close = () => {
  if (!submitting.value) {
    emit('update:modelValue', false)
  }
}

const blockIcon = (kind) => {
  const icons = {
    IMAGE: Image,
    PDF: FilePlus2,
    VIDEO: Video,
    YOUTUBE: Video,
    LINK: Link
  }

  return icons[kind] || Link
}

const addBlock = () => {
  form.blocks.push({
    uid: makeUid(),
    kind: 'IMAGE',
    title: '',
    url: '',
    caption: '',
    error: ''
  })
}

const removeBlock = (index) => {
  form.blocks.splice(index, 1)
}

const addQuestion = () => {
  form.questions.push({
    uid: makeUid(),
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    error: ''
  })
}

const removeQuestion = (index) => {
  form.questions.splice(index, 1)
}

const applyMarkdown = (tool) => {
  const textarea = editorRef.value

  if (!textarea) {
    form.content += `${tool.prefix}${tool.suffix}`
    return
  }

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = form.content.slice(start, end)
  const value = `${tool.prefix}${selected || tool.label}${tool.suffix}`

  form.content = `${form.content.slice(0, start)}${value}${form.content.slice(end)}`

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + tool.prefix.length, start + tool.prefix.length + (selected || tool.label).length)
  })
}

const isValidUrl = (value) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const youtubeEmbedUrl = (url) => {
  const parsed = new URL(url)
  const host = parsed.hostname.replace('www.', '')

  if (host === 'youtu.be') {
    return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
  }

  if (host.includes('youtube.com')) {
    const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop()
    return id ? `https://www.youtube.com/embed/${id}` : url
  }

  return url
}

const mapBlockToPayload = (block, index) => {
  const base = {
    order: index + 1,
    title: block.title.trim() || block.kind,
    content: {
      url: block.kind === 'YOUTUBE' ? youtubeEmbedUrl(block.url.trim()) : block.url.trim(),
      originalUrl: block.url.trim(),
      caption: block.caption.trim() || null,
      kind: block.kind
    }
  }

  if (block.kind === 'IMAGE') return { ...base, type: 'IMAGE' }
  if (block.kind === 'VIDEO' || block.kind === 'YOUTUBE') return { ...base, type: 'VIDEO' }

  return { ...base, type: 'RESOURCE' }
}

const mapLessonToForm = () => {
  form.title = props.lesson?.title || ''
  form.description = props.lesson?.description || ''
  form.type = props.lesson?.type || 'MATERIAL'
  form.order = props.lesson?.order ?? props.nextOrder
  form.content = props.lesson?.content || ''
  form.kkm = props.lesson?.kkm || 70

  form.blocks = (props.lesson?.contentBlocks || [])
    .filter(block => !(block.type === 'TEXT' && block.content?.role === 'main'))
    .map(block => ({
      uid: makeUid(),
      kind: block.content?.kind || block.type,
      title: block.title || '',
      url: block.content?.originalUrl || block.content?.url || '',
      caption: block.content?.caption || '',
      error: ''
    }))

  form.questions = (props.lesson?.quizzes || []).map(quiz => {
    const options = Array.isArray(quiz.options) ? quiz.options : ['', '', '', '']
    const correctIndex = Math.max(0, options.findIndex(option => option === quiz.correctAnswer))

    return {
      uid: makeUid(),
      question: quiz.question || '',
      options: [...options, '', '', '', ''].slice(0, 4),
      correctIndex,
      error: ''
    }
  })

  if (form.type === 'QUIZ' && form.questions.length === 0) {
    addQuestion()
  }
}

const validateMaterial = () => {
  if (!form.content.trim() && form.blocks.length === 0) {
    submitError.value = 'Isi materi atau tambahkan minimal satu content block.'
    return false
  }

  let valid = true

  form.blocks.forEach(block => {
    block.error = ''

    if (!block.url.trim()) {
      block.error = 'URL wajib diisi.'
      valid = false
    } else if (!isValidUrl(block.url.trim())) {
      block.error = 'Format URL tidak valid.'
      valid = false
    }
  })

  return valid
}

const validateQuiz = () => {
  const kkm = Number(form.kkm)

  if (!Number.isInteger(kkm) || kkm < 1 || kkm > 100) {
    errors.kkm = 'KKM harus angka 1 sampai 100.'
    return false
  }

  if (form.questions.length === 0) {
    submitError.value = 'Quiz wajib memiliki minimal satu pertanyaan.'
    return false
  }

  let valid = true

  form.questions.forEach(question => {
    question.error = ''

    if (!question.question.trim()) {
      question.error = 'Pertanyaan wajib diisi.'
      valid = false
    } else if (question.options.some(option => !option.trim())) {
      question.error = 'Semua opsi jawaban wajib diisi.'
      valid = false
    }
  })

  return valid
}

const validate = () => {
  errors.title = ''
  errors.order = ''
  errors.kkm = ''
  submitError.value = ''

  const title = form.title.trim()
  const order = Number(form.order)

  if (!title) {
    errors.title = 'Judul lesson wajib diisi.'
  } else if (title.length < 3) {
    errors.title = 'Judul lesson minimal 3 karakter.'
  } else if (title.length > 140) {
    errors.title = 'Judul lesson maksimal 140 karakter.'
  }

  if (!Number.isInteger(order) || order < 1 || order > 999) {
    errors.order = 'Urutan harus angka 1 sampai 999.'
  }

  const validTypeContent = form.type === 'QUIZ' ? validateQuiz() : validateMaterial()

  return !errors.title && !errors.order && validTypeContent
}

const buildPayload = () => {
  const contentBlocks = []

  form.blocks.forEach((block, index) => {
    contentBlocks.push(mapBlockToPayload(block, index))
  })

  return {
    title: form.title.trim(),
    description: form.description.trim() || null,
    type: form.type,
    order: Number(form.order),
    content: form.type === 'MATERIAL' ? form.content.trim() || null : null,
    kkm: Number(form.kkm),
    contentBlocks: form.type === 'MATERIAL' ? contentBlocks : [],
    quizzes: form.type === 'QUIZ'
      ? form.questions.map(question => ({
        question: question.question.trim(),
        options: question.options.map(option => option.trim()),
        correctAnswer: question.options[question.correctIndex].trim()
      }))
      : []
  }
}

const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true

  try {
    const payload = buildPayload()

    if (isEditing.value) {
      await updateLesson(props.lesson.id, payload)
    } else {
      await createLesson(props.module.id, payload)
    }

    emit('saved', isEditing.value ? 'updated' : 'created')
    emit('update:modelValue', false)
  } catch (error) {
    submitError.value = error.response?.data?.message || 'Gagal menyimpan lesson.'
  } finally {
    submitting.value = false
  }
}

watch(() => props.modelValue, open => {
  if (open) {
    mapLessonToForm()
    errors.title = ''
    errors.order = ''
    errors.kkm = ''
    submitError.value = ''
  }
}, { immediate: true })

watch(() => props.lesson, () => {
  if (props.modelValue) {
    mapLessonToForm()
  }
}, { deep: true })
</script>
