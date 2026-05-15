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
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="modelValue" class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <div class="flex items-start justify-between p-6 border-b border-[#E6EFE9] shrink-0">
              <div>
                <h2 class="text-[17px] font-bold text-[#1A2E20]">{{ isEditing ? 'Edit Module' : 'Create New Module' }}</h2>
                <p class="text-[12px] text-gray-500 mt-0.5">{{ isEditing ? 'Update module details below.' : 'Add a new section to this course.' }}</p>
              </div>
              <button @click="$emit('update:modelValue', false)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors shrink-0 mt-0.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="p-6 space-y-5 overflow-y-auto flex-1">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Module Title <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder="e.g. Introduction to JavaScript"
                    autocomplete="off"
                    class="w-full px-4 py-2.5 border rounded-xl text-[13px] focus:outline-none focus:ring-1 transition-all"
                    :class="errors.title ? 'border-red-400 focus:border-red-400 focus:ring-red-200 bg-red-50' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
                    @input="errors.title = ''"
                  >
                  <p v-if="errors.title" class="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                    <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    {{ errors.title }}
                  </p>
                </div>

                <div>
                  <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Module Type</label>
                  <select
                    v-model="form.type"
                    class="w-full px-4 py-2.5 border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
                    style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22%2F%3E%3C%2Fsvg%3E'); background-size: 1.25rem;"
                  >
                    <option value="MATERIAL">Material</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                </div>
              </div>

              <div v-if="form.type === 'MATERIAL'">
                <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Content</label>
                <textarea
                  v-model="form.content"
                  rows="8"
                  placeholder="Write the module content here..."
                  class="w-full px-4 py-2.5 border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all resize-none"
                ></textarea>
              </div>

              <div v-else-if="form.type === 'QUIZ'" class="space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-[13px] font-bold text-[#1A2E20]">Quiz Questions</h3>
                  <button @click="addQuestion" type="button" class="text-[11px] font-bold text-[#0A733F] hover:underline flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Add Question
                  </button>
                </div>

                <div v-if="form.questions.length === 0" class="py-10 border-2 border-dashed border-[#E6EFE9] rounded-2xl flex flex-col items-center justify-center text-center">
                  <div class="w-12 h-12 bg-[#F2F7F4] rounded-full flex items-center justify-center mb-3">
                    <svg class="w-6 h-6 text-[#0A733F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <p class="text-[12px] text-gray-500 max-w-[200px]">No questions added yet.</p>
                </div>

                <div v-for="(q, qIndex) in form.questions" :key="qIndex" class="p-5 border border-[#E6EFE9] rounded-2xl bg-gray-50/30 relative group">
                  <button @click="removeQuestion(qIndex)" type="button" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Question {{ qIndex + 1 }}</label>
                      <input
                        v-model="q.question_text"
                        type="text"
                        placeholder="Enter question text..."
                        class="w-full px-4 py-2 border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all bg-white"
                      >
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div v-for="opt in ['a', 'b', 'c', 'd']" :key="opt">
                        <label class="block text-[11px] font-semibold text-gray-400 mb-1">Option {{ opt.toUpperCase() }}</label>
                        <input
                          v-model="q['option_' + opt]"
                          type="text"
                          :placeholder="'Option ' + opt.toUpperCase()"
                          class="w-full px-4 py-2 border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all bg-white"
                        >
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-semibold text-gray-500 mb-1.5">Correct Answer</label>
                      <div class="flex gap-4">
                        <label v-for="opt in ['a', 'b', 'c', 'd']" :key="opt" class="flex items-center gap-2 cursor-pointer">
                          <input
                            v-model="q.correct_answer"
                            type="radio"
                            :name="'correct-' + qIndex"
                            :value="opt"
                            class="w-4 h-4 text-[#0A733F] focus:ring-[#0A733F]"
                          >
                          <span class="text-[13px] text-gray-600 uppercase">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Order</label>
                <input
                  v-model.number="form.order"
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  class="w-full px-4 py-2.5 border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all"
                >
              </div>

              <div v-if="submitError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <p class="text-[12px] text-red-700">{{ submitError }}</p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 px-6 py-5 border-t border-[#E6EFE9] shrink-0">
              <button @click="$emit('update:modelValue', false)" :disabled="submitting" class="px-5 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
              <button @click="handleSubmit" :disabled="submitting" class="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#0A733F] rounded-xl hover:bg-[#085a31] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm shadow-[#0A733F]/30">
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isEditing ? 'M5 13l4 4L19 7' : 'M12 4v16m8-8H4'"/></svg>
                {{ submitting ? 'Saving...' : (isEditing ? 'Update Module' : 'Create Module') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { createModule, updateModule } from '../../../services/moduleService.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  module: { type: Object, default: null },
  courseId: { type: [Number, String], required: true },
  nextOrder: { type: Number, default: 1 }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const isEditing = computed(() => !!props.module)
const form = reactive({ 
  title: '', 
  type: 'MATERIAL',
  content: '', 
  questions: [],
  order: null 
})
const errors = reactive({ title: '' })
const submitting = ref(false)
const submitError = ref('')

function getLetterFromText(answer, options) {
  if (!answer || !options || !Array.isArray(options)) return 'a'
  const index = options.indexOf(answer)
  return index !== -1 ? ['a', 'b', 'c', 'd'][index] : 'a'
}

const fillFormData = () => {
  if (props.module) {
    const data = JSON.parse(JSON.stringify(props.module))
    form.title = data.title || ''
    form.type = data.type || 'MATERIAL'
    form.content = data.content || ''
    form.order = data.order ?? props.nextOrder

    const rawQuizzes = data.quizzes || data.questions || []
    
    if (Array.isArray(rawQuizzes) && rawQuizzes.length > 0) {
      form.questions = rawQuizzes.map(q => {
        const opts = Array.isArray(q.options) ? q.options : []
        return {
          question_text: q.question || '',
          option_a: opts[0] || '',
          option_b: opts[1] || '',
          option_c: opts[2] || '',
          option_d: opts[3] || '',
          correct_answer: getLetterFromText(q.correctAnswer || q.answer, opts)
        }
      })
    } else {
      form.questions = []
    }
  } else {
    form.title = ''
    form.type = 'MATERIAL'
    form.content = ''
    form.questions = []
    form.order = props.nextOrder
  }
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    await nextTick()
    fillFormData()
    errors.title = ''
    submitError.value = ''
  }
}, { immediate: true })

watch(() => props.module, () => {
  if (props.modelValue) {
    fillFormData()
  }
}, { deep: true })

function addQuestion() {
  form.questions.push({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'a'
  })
}

function removeQuestion(index) {
  form.questions.splice(index, 1)
}

function validate() {
  errors.title = ''
  if (!form.title.trim()) { errors.title = 'Module title is required.'; return false }
  if (form.type === 'QUIZ') {
    if (form.questions.length === 0) {
      submitError.value = 'Please add at least one question.'
      return false
    }
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  
  try {
    const formattedQuizzes = form.questions.map(q => {
      const selectedLetter = q.correct_answer
      const textOfAnswer = q[`option_${selectedLetter}`]
      return {
        question: q.question_text,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: textOfAnswer 
      }
    })

    const payload = { 
      title: form.title.trim(), 
      type: form.type,
      content: form.type === 'MATERIAL' ? form.content.trim() : null, 
      quizzes: form.type === 'QUIZ' ? formattedQuizzes : [],
      order: form.order,
      kkm: props.module?.kkm || 70 
    }
    
    if (isEditing.value) {
      await updateModule(props.module.id, { ...payload, course_id: props.courseId })
    } else {
      await createModule(props.courseId, payload)
    }
    
    emit('saved', isEditing.value ? 'updated' : 'created')
    emit('update:modelValue', false)
  } catch (err) {
    submitError.value = err?.response?.data?.message || err.message || 'Error saving module.'
  } finally {
    submitting.value = false
  }
}
</script>