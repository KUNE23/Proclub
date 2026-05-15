<template>
  <div class="p-8 max-w-5xl mx-auto space-y-6">

    <div class="flex items-center gap-3 mb-1">
      <router-link to="/admin/courses" class="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-[#0A733F] transition-colors font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to Courses
      </router-link>
    </div>

    <div class="flex items-start justify-between">
      <div>
        <p class="text-[11px] font-bold text-[#0A733F] uppercase tracking-widest mb-1">Course Content</p>
        <h1 class="text-2xl font-bold text-[#1A2E20]">{{ courseTitle || 'Module Management' }}</h1>
        <p class="text-gray-500 mt-1 text-[13px]">Organize this course into structured sections (modules).</p>
      </div>
      <button @click="openCreate" id="create-module-btn" class="px-4 py-2.5 bg-[#0A733F] text-white rounded-lg text-sm font-semibold hover:bg-[#085a31] flex items-center gap-2 transition-colors shadow-sm shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Module
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-[#E6EFE9] p-4 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-[#0A733F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        </div>
        <div>
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Modules</p>
          <p class="text-xl font-bold text-[#1A2E20]">{{ modules.length }}</p>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-[#E6EFE9] p-4 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Course ID</p>
          <p class="text-xl font-bold text-[#1A2E20]">#{{ courseId }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-2 border-[#0A733F] border-t-transparent rounded-full animate-spin"></div>
        <span class="text-[13px] text-gray-500">Loading modules...</span>
      </div>
    </div>

    <div v-else-if="fetchError" class="bg-white rounded-xl border border-[#E6EFE9] flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <p class="text-[14px] font-semibold text-gray-700">Failed to load modules</p>
        <p class="text-[12px] text-gray-400">{{ fetchError }}</p>
        <button @click="fetchModules" class="px-4 py-2 bg-[#0A733F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#085a31] transition-colors">Retry</button>
      </div>
    </div>

    <div v-else-if="sortedModules.length === 0" class="bg-white rounded-xl border border-[#E6EFE9] flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="w-14 h-14 rounded-full bg-gray-50 border border-[#E6EFE9] flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        </div>
        <p class="text-[14px] font-semibold text-gray-500">No modules yet</p>
        <p class="text-[12px] text-gray-400">Start building this course by adding the first module.</p>
        <button @click="openCreate" class="mt-1 px-4 py-2 bg-[#0A733F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#085a31] transition-colors">Add First Module</button>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="mod in sortedModules"
        :key="mod.id"
        class="bg-white rounded-xl border border-[#E6EFE9] shadow-sm hover:border-[#0A733F]/30 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-start gap-4 p-5">
          <div class="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#0A733F] flex items-center justify-center shrink-0 font-bold text-[13px]">
            {{ String(mod.order || 0).padStart(2, '0') }}
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-bold text-[#1A2E20]">{{ mod.title }}</p>
            <p v-if="mod.content" class="text-[12px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{{ mod.content }}</p>
            <p class="text-[11px] text-gray-400 mt-1.5">Updated {{ formatDate(mod.updatedAt) }}</p>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button @click="openEdit(mod)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>

          </div>
        </div>
      </div>
    </div>

    <ModuleForm
      v-model="showForm"
      :module="selectedModule"
      :course-id="courseId"
      :next-order="modules.length + 1"
      @saved="onSaved"
    />

    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="translate-y-4 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-4 opacity-0"
      >
        <div v-if="toast.show" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-[13px] font-semibold"
          :class="toast.type === 'success' ? 'bg-[#0A733F]' : 'bg-red-600'">
          <svg v-if="toast.type === 'success'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <svg v-else class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ModuleForm from './ModuleForm.vue'
import { getModules } from '../../../services/moduleService.js'
import api from '../../../api/index.js'

const route = useRoute()
const courseId = computed(() => route.params.id)

const modules = ref([])
const courseTitle = ref('')
const loading = ref(false)
const fetchError = ref('')

const showForm = ref(false)
const selectedModule = ref(null)
const showDeleteModal = ref(false)
const moduleToDelete = ref(null)
const deleting = ref(false)
const deleteError = ref('')

const toast = reactive({ show: false, message: '', type: 'success' })

const sortedModules = computed(() => {
  if (!Array.isArray(modules.value)) return []
  return [...modules.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

async function fetchModules() {
  loading.value = true
  fetchError.value = ''
  try {
    const [modRes, courseRes] = await Promise.allSettled([
      getModules(courseId.value),
      api.get(`/courses/${courseId.value}`)
    ])
    if (modRes.status === 'fulfilled') {
      const response = modRes.value.data
      modules.value = Array.isArray(response?.modules) ? response.modules : []
    }
    if (courseRes.status === 'fulfilled') {
      const d = courseRes.value.data?.data ?? courseRes.value.data
      courseTitle.value = d?.title ?? ''
    }
  } catch (err) {
    fetchError.value = err?.response?.data?.message || err.message || 'Unable to connect.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  selectedModule.value = null
  showForm.value = true
}

function openEdit(mod) {
  selectedModule.value = mod
  showForm.value = true
}

function onSaved(action) {
  fetchModules()
  showToast(action === 'updated' ? 'Module updated successfully!' : 'Module created successfully!')
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
}

function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => toast.show = false, 3500)
}

onMounted(fetchModules)
</script>
