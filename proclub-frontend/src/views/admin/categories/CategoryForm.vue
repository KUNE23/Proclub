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
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        ></div>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="modelValue"
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-start justify-between p-6 border-b border-[#E6EFE9]">
              <div>
                <h2 class="text-[17px] font-bold text-[#1A2E20]">
                  {{ isEditing ? 'Edit Category' : 'Create New Category' }}
                </h2>
                <p class="text-[12px] text-gray-500 mt-0.5">
                  {{ isEditing ? 'Update the category details below.' : 'Add a new classification to your hub.' }}
                </p>
              </div>
              <button
                @click="$emit('update:modelValue', false)"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5">
              <!-- Category Name -->
              <div>
                <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">
                  Category Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.cat_name"
                  type="text"
                  id="category-name-input"
                  placeholder="e.g. Frontend Development"
                  autocomplete="off"
                  class="w-full px-4 py-2.5 border rounded-xl text-[13px] focus:outline-none focus:ring-1 transition-all"
                  :class="errors.cat_name
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200 bg-red-50'
                    : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
                  @input="clearError('cat_name')"
                >
                <p v-if="errors.cat_name" class="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  {{ errors.cat_name }}
                </p>
                <p v-else class="mt-1.5 text-[11px] text-gray-400">
                  Minimum 3 characters. This name will appear in course listings.
                </p>
              </div>

              <!-- Char counter hint -->
              <div class="flex items-center justify-between -mt-3">
                <span></span>
                <span
                  class="text-[11px] font-medium transition-colors"
                  :class="form.cat_name.length < 3 && form.cat_name.length > 0
                    ? 'text-amber-500'
                    : form.cat_name.length >= 3
                      ? 'text-[#0A733F]'
                      : 'text-gray-300'"
                >
                  {{ form.cat_name.length }} / 80
                </span>
              </div>

              <!-- Info box -->
              <div class="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#D1FAE5] flex items-start gap-2.5">
                <svg class="w-4 h-4 text-[#0A733F] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-[12px] text-[#166534] leading-relaxed">
                  Categories help users discover content faster. You can assign courses to categories after creation.
                </p>
              </div>

              <!-- Submit error -->
              <div
                v-if="submitError"
                class="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5"
              >
                <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-[12px] text-red-700">{{ submitError }}</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 pb-6">
              <button
                @click="$emit('update:modelValue', false)"
                :disabled="submitting"
                class="px-5 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id="category-submit-btn"
                @click="handleSubmit"
                :disabled="submitting"
                class="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#0A733F] rounded-xl hover:bg-[#085a31] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm shadow-[#0A733F]/30"
              >
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isEditing ? 'M5 13l4 4L19 7' : 'M12 4v16m8-8H4'" />
                </svg>
                {{ submitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { createCategory, updateCategory } from '../../../services/categoryService.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  category: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const isEditing = computed(() => !!props.category)

const form = reactive({ cat_name: '' })
const errors = reactive({ cat_name: '' })
const submitting = ref(false)
const submitError = ref('')

import { ref, computed } from 'vue'

watch(() => props.modelValue, (open) => {
  if (open) {
    form.cat_name = props.category?.cat_name ?? ''
    errors.cat_name = ''
    submitError.value = ''
  }
})

function clearError(field) {
  errors[field] = ''
}

function validate() {
  errors.cat_name = ''
  if (!form.cat_name.trim()) {
    errors.cat_name = 'Category name is required.'
    return false
  }
  if (form.cat_name.trim().length < 3) {
    errors.cat_name = 'Category name must be at least 3 characters.'
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = ''
  try {
    const payload = { cat_name: form.cat_name.trim() }
    if (isEditing.value) {
      await updateCategory(props.category.id, payload)
    } else {
      await createCategory(payload)
    }
    emit('saved', isEditing.value ? 'updated' : 'created')
    emit('update:modelValue', false)
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Something went wrong. Please try again.'
    submitError.value = msg
  } finally {
    submitting.value = false
  }
}
</script>
