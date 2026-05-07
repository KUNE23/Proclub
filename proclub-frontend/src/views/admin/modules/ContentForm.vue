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
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="modelValue" class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            <div class="flex items-start justify-between p-6 border-b border-[#E6EFE9]">
              <div>
                <h2 class="text-[17px] font-bold text-[#1A2E20]">{{ isEditing ? 'Edit Content' : 'Add New Content' }}</h2>
                <p class="text-[12px] text-gray-500 mt-0.5">{{ isEditing ? 'Update content details below.' : 'Add new content to this module.' }}</p>
              </div>
              <button @click="close" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors shrink-0 mt-0.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="p-6 space-y-5">
              <div>
                <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
                <input
                  v-model="form.title"
                  type="text"
                  id="content-title-input"
                  placeholder="e.g. Introduction to Variables"
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
                <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Body / Description</label>
                <textarea
                  v-model="form.body"
                  id="content-body-input"
                  rows="4"
                  placeholder="Write the content body here..."
                  class="w-full px-4 py-2.5 border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
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
                <div>
                  <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Type</label>
                  <select
                    v-model="form.type"
                    class="w-full px-4 py-2.5 border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all bg-white"
                  >
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
              </div>

              <div v-if="submitError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <p class="text-[12px] text-red-700">{{ submitError }}</p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 px-6 pb-6">
              <button @click="close" :disabled="submitting" class="px-5 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
              <button id="content-submit-btn" @click="handleSubmit" :disabled="submitting" class="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#0A733F] rounded-xl hover:bg-[#085a31] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm shadow-[#0A733F]/30">
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isEditing ? 'M5 13l4 4L19 7' : 'M12 4v16m8-8H4'"/></svg>
                {{ submitting ? 'Saving...' : (isEditing ? 'Update Content' : 'Add Content') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { createContent, updateContent } from '../../../services/contentService.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  content: { type: Object, default: null },
  moduleId: { type: [Number, String], required: true },
  nextOrder: { type: Number, default: 1 }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const isEditing = computed(() => !!props.content)
const form = reactive({ title: '', body: '', order: null, type: 'text' })
const errors = reactive({ title: '' })
const submitting = ref(false)
const submitError = ref('')

watch(() => props.modelValue, (open) => {
  if (open) {
    form.title = props.content?.title ?? ''
    form.body  = props.content?.body  ?? ''
    form.order = props.content?.order ?? props.nextOrder
    form.type  = props.content?.type  ?? 'text'
    errors.title = ''
    submitError.value = ''
  }
})

function close() {
  emit('update:modelValue', false)
}

function validate() {
  errors.title = ''
  if (!form.title.trim()) { errors.title = 'Content title is required.'; return false }
  if (form.title.trim().length < 3) { errors.title = 'Title must be at least 3 characters.'; return false }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload = {
      module_id: props.moduleId,
      title: form.title.trim(),
      body: form.body.trim(),
      order: form.order,
      type: form.type
    }
    if (isEditing.value) {
      await updateContent(props.content.id, payload)
    } else {
      await createContent(props.moduleId, payload)
    }
    emit('saved', isEditing.value ? 'updated' : 'created')
    emit('update:modelValue', false)
  } catch (err) {
    submitError.value = err?.response?.data?.message || err.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>
