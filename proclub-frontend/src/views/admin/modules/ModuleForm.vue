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

        <div class="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div class="flex items-start justify-between border-b border-[#E6EFE9] p-6">
            <div>
              <h2 class="text-[17px] font-bold text-[#1A2E20]">
                {{ isEditing ? 'Edit Module' : 'Create New Module' }}
              </h2>

              <p class="mt-0.5 text-[12px] text-gray-500">
                Module adalah container untuk sekumpulan lesson.
              </p>
            </div>

            <button
              @click="close"
              class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100"
              type="button"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="flex-1 space-y-5 overflow-y-auto p-6">
            <div>
              <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">
                Module Title <span class="text-red-500">*</span>
              </label>

              <input
                v-model="form.title"
                type="text"
                placeholder="Contoh: Introduction & Algorithm"
                autocomplete="off"
                maxlength="120"
                class="w-full rounded-xl border px-4 py-2.5 text-[13px] transition-all focus:outline-none focus:ring-1"
                :class="errors.title ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
                @input="errors.title = ''"
              >

              <p v-if="errors.title" class="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
                <CircleAlert class="h-3 w-3 shrink-0" />
                {{ errors.title }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">
                Description
              </label>

              <textarea
                v-model="form.description"
                rows="5"
                maxlength="500"
                placeholder="Jelaskan ringkasan module ini."
                class="w-full resize-none rounded-xl border border-[#E6EFE9] px-4 py-2.5 text-[13px] transition-all focus:border-[#0A733F] focus:outline-none focus:ring-1 focus:ring-[#0A733F]/20"
              ></textarea>

              <div class="mt-1 flex items-center justify-between text-[11px] text-gray-400">
                <span>{{ errors.description }}</span>
                <span>{{ form.description.length }}/500</span>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">
                Order <span class="text-red-500">*</span>
              </label>

              <input
                v-model.number="form.order"
                type="number"
                min="1"
                max="999"
                placeholder="1"
                class="w-full rounded-xl border px-4 py-2.5 text-[13px] transition-all focus:outline-none focus:ring-1"
                :class="errors.order ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
                @input="errors.order = ''"
              >

              <p v-if="errors.order" class="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
                <CircleAlert class="h-3 w-3 shrink-0" />
                {{ errors.order }}
              </p>
            </div>

            <div v-if="submitError" class="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
              <CircleAlert class="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p class="text-[12px] text-red-700">{{ submitError }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-[#E6EFE9] px-6 py-5">
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
              class="flex items-center gap-2 rounded-xl bg-[#0A733F] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm shadow-[#0A733F]/30 transition-all hover:bg-[#085a31] disabled:opacity-60"
              type="button"
            >
              <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              {{ submitting ? 'Menyimpan...' : (isEditing ? 'Update Module' : 'Create Module') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { CircleAlert, Loader2, Save, X } from 'lucide-vue-next'
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
  description: '',
  order: null
})
const errors = reactive({
  title: '',
  description: '',
  order: ''
})
const submitting = ref(false)
const submitError = ref('')

const close = () => {
  if (!submitting.value) {
    emit('update:modelValue', false)
  }
}

const fillFormData = () => {
  form.title = props.module?.title || ''
  form.description = props.module?.description || ''
  form.order = props.module?.order ?? props.nextOrder
}

const validate = () => {
  errors.title = ''
  errors.description = ''
  errors.order = ''
  submitError.value = ''

  const title = form.title.trim()
  const description = form.description.trim()
  const order = Number(form.order)

  if (!title) {
    errors.title = 'Judul module wajib diisi.'
  } else if (title.length < 3) {
    errors.title = 'Judul module minimal 3 karakter.'
  } else if (title.length > 120) {
    errors.title = 'Judul module maksimal 120 karakter.'
  }

  if (description.length > 500) {
    errors.description = 'Deskripsi maksimal 500 karakter.'
  }

  if (!Number.isInteger(order) || order < 1 || order > 999) {
    errors.order = 'Urutan harus berupa angka 1 sampai 999.'
  }

  return !errors.title && !errors.description && !errors.order
}

const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true

  try {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      order: Number(form.order)
    }

    if (isEditing.value) {
      await updateModule(props.module.id, payload)
    } else {
      await createModule(props.courseId, payload)
    }

    emit('saved', isEditing.value ? 'updated' : 'created')
    emit('update:modelValue', false)
  } catch (err) {
    submitError.value = err?.response?.data?.message || 'Gagal menyimpan module.'
  } finally {
    submitting.value = false
  }
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    await nextTick()
    fillFormData()
    errors.title = ''
    errors.description = ''
    errors.order = ''
    submitError.value = ''
  }
}, { immediate: true })

watch(() => props.module, () => {
  if (props.modelValue) {
    fillFormData()
  }
}, { deep: true })
</script>
