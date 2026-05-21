<template>
  <div class="mx-auto max-w-6xl space-y-6 p-8">
    <div class="mb-1 flex items-center gap-3">
      <router-link
        to="/admin/courses"
        class="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 transition-colors hover:text-[#0A733F]"
      >
        <ChevronLeft class="h-4 w-4" />
        Back to Courses
      </router-link>
    </div>

    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#0A733F]">Course Content</p>
        <h1 class="text-2xl font-bold text-[#1A2E20]">{{ courseTitle || 'Module Management' }}</h1>
        <p class="mt-1 text-[13px] text-gray-500">Organize this course into modules, lessons, content blocks, and quiz.</p>
      </div>

      <button
        @click="openCreateModule"
        class="flex shrink-0 items-center gap-2 rounded-lg bg-[#0A733F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#085a31]"
        type="button"
      >
        <Plus class="h-4 w-4" />
        Add Module
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="flex items-center gap-3 rounded-xl border border-[#E6EFE9] bg-white p-4 shadow-sm">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4]">
          <PanelsTopLeft class="h-5 w-5 text-[#0A733F]" />
        </div>
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Modules</p>
          <p class="text-xl font-bold text-[#1A2E20]">{{ modules.length }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl border border-[#E6EFE9] bg-white p-4 shadow-sm">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF]">
          <BookOpen class="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Lessons</p>
          <p class="text-xl font-bold text-[#1A2E20]">{{ totalLessons }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl border border-[#E6EFE9] bg-white p-4 shadow-sm">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED]">
          <Hash class="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Course ID</p>
          <p class="text-xl font-bold text-[#1A2E20]">#{{ courseId }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="flex flex-col items-center gap-3">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-[#0A733F] border-t-transparent"></div>
        <span class="text-[13px] text-gray-500">Loading modules...</span>
      </div>
    </div>

    <div v-else-if="fetchError" class="flex items-center justify-center rounded-xl border border-[#E6EFE9] bg-white py-20">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <CircleAlert class="h-6 w-6 text-red-500" />
        </div>
        <p class="text-[14px] font-semibold text-gray-700">Gagal memuat module</p>
        <p class="text-[12px] text-gray-400">{{ fetchError }}</p>
        <button
          @click="fetchModules"
          class="rounded-lg bg-[#0A733F] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#085a31]"
          type="button"
        >
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="sortedModules.length === 0" class="flex items-center justify-center rounded-xl border border-[#E6EFE9] bg-white py-20">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-full border border-[#E6EFE9] bg-gray-50">
          <PanelsTopLeft class="h-6 w-6 text-gray-300" />
        </div>
        <p class="text-[14px] font-semibold text-gray-500">No modules yet</p>
        <p class="text-[12px] text-gray-400">Start building this course by adding the first module.</p>
        <button
          @click="openCreateModule"
          class="mt-1 rounded-lg bg-[#0A733F] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#085a31]"
          type="button"
        >
          Add First Module
        </button>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="mod in sortedModules"
        :key="mod.id"
        class="overflow-hidden rounded-xl border border-[#E6EFE9] bg-white shadow-sm transition-all duration-200 hover:border-[#0A733F]/30 hover:shadow-md"
      >
        <div class="flex items-start gap-4 p-5">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-[13px] font-bold text-[#0A733F]">
            {{ String(mod.order || 0).padStart(2, '0') }}
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-[14px] font-bold text-[#1A2E20]">{{ mod.title }}</p>
            <p v-if="mod.description" class="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-400">{{ mod.description }}</p>
            <p class="mt-1.5 text-[11px] text-gray-400">{{ mod.lessons?.length || 0 }} lesson tersedia</p>
            <p class="mt-1.5 text-[11px] text-gray-400">Updated {{ formatDate(mod.updatedAt) }}</p>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <button
              @click="openCreateLesson(mod)"
              class="flex items-center gap-1.5 rounded-lg bg-[#F0FDF4] px-3 py-2 text-[12px] font-bold text-[#0A733F] transition-all hover:bg-[#DCFCE7]"
              title="Add Lesson"
              type="button"
            >
              <Plus class="h-4 w-4" />
              Lesson
            </button>
            <button
              @click="openEditModule(mod)"
              class="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600"
              title="Edit Module"
              type="button"
            >
              <Pencil class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="border-t border-[#E6EFE9] bg-[#FCFDFD] px-5 py-4">
          <div v-if="!mod.lessons?.length" class="flex items-center justify-between rounded-xl border border-dashed border-[#D9E7DF] bg-white px-4 py-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6EFE9] bg-gray-50">
                <BookOpen class="h-5 w-5 text-gray-300" />
              </div>
              <div>
                <p class="text-[13px] font-semibold text-gray-500">Belum ada lesson</p>
                <p class="text-[12px] text-gray-400">Tambahkan lesson pertama untuk module ini.</p>
              </div>
            </div>
            <button
              @click="openCreateLesson(mod)"
              class="rounded-lg bg-[#0A733F] px-3 py-2 text-[12px] font-bold text-white transition-colors hover:bg-[#085a31]"
              type="button"
            >
              Add Lesson
            </button>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="lesson in sortedLessons(mod)"
              :key="lesson.id"
              class="flex items-center gap-4 rounded-xl border border-[#E6EFE9] bg-white px-4 py-3"
            >
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                :class="lesson.type === 'QUIZ' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-[#0A733F]'"
              >
                <CircleHelp v-if="lesson.type === 'QUIZ'" class="h-4 w-4" />
                <BookOpen v-else class="h-4 w-4" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <p class="truncate text-[13px] font-bold text-[#1A2E20]">{{ lesson.title }}</p>
                  <span
                    class="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    :class="lesson.type === 'QUIZ' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-[#0A733F]'"
                  >
                    {{ lesson.type }}
                  </span>
                </div>
                <p class="truncate text-[11px] text-gray-400">
                  #{{ lesson.order }} · {{ lesson.description || lesson.content || 'Tidak ada deskripsi' }}
                </p>
              </div>

              <div class="flex items-center gap-1">
                <button
                  @click="openEditLesson(mod, lesson)"
                  class="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                  title="Edit Lesson"
                  type="button"
                >
                  <Pencil class="h-4 w-4" />
                </button>
                <button
                  @click="confirmDeleteLesson(lesson)"
                  class="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                  title="Delete Lesson"
                  type="button"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModuleForm
      v-model="showModuleForm"
      :module="selectedModule"
      :course-id="courseId"
      :next-order="modules.length + 1"
      @saved="onModuleSaved"
    />

    <LessonForm
      v-model="showLessonForm"
      :module="selectedLessonModule"
      :lesson="selectedLesson"
      :next-order="nextLessonOrder"
      @saved="onLessonSaved"
    />

    <Teleport to="body">
      <div v-if="showDeleteLessonModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" @click="showDeleteLessonModal = false"></div>
        <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 class="h-7 w-7" />
          </div>
          <h3 class="text-lg font-bold text-[#1A2E20]">Hapus Lesson?</h3>
          <p class="my-4 text-[13px] leading-relaxed text-gray-500">
            Lesson "{{ lessonToDelete?.title }}" akan dihapus dari module ini.
          </p>
          <div class="flex gap-3">
            <button
              @click="showDeleteLessonModal = false"
              class="flex-1 rounded-xl bg-gray-100 py-2.5 text-[13px] font-semibold text-gray-600"
              type="button"
            >
              Batal
            </button>
            <button
              @click="deleteSelectedLesson"
              :disabled="deletingLesson"
              class="flex-1 rounded-xl bg-red-600 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
              type="button"
            >
              {{ deletingLesson ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  BookOpen,
  ChevronLeft,
  CircleAlert,
  CircleHelp,
  Hash,
  PanelsTopLeft,
  Pencil,
  Plus,
  Trash2
} from 'lucide-vue-next'
import ModuleForm from './ModuleForm.vue'
import LessonForm from './LessonForm.vue'
import { deleteLesson, getModules } from '../../../services/moduleService.js'
import api from '../../../api/index.js'

const route = useRoute()
const toast = useToast()
const courseId = computed(() => route.params.id)

const modules = ref([])
const courseTitle = ref('')
const loading = ref(false)
const fetchError = ref('')
const showModuleForm = ref(false)
const showLessonForm = ref(false)
const selectedModule = ref(null)
const selectedLessonModule = ref(null)
const selectedLesson = ref(null)
const lessonToDelete = ref(null)
const showDeleteLessonModal = ref(false)
const deletingLesson = ref(false)

const sortedModules = computed(() => {
  if (!Array.isArray(modules.value)) return []
  return [...modules.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

const totalLessons = computed(() => {
  return modules.value.reduce((acc, item) => acc + (item.lessons?.length || 0), 0)
})

const nextLessonOrder = computed(() => {
  return (selectedLessonModule.value?.lessons?.length || 0) + 1
})

function sortedLessons(module) {
  return [...(module.lessons || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

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
    } else {
      throw modRes.reason
    }

    if (courseRes.status === 'fulfilled') {
      const data = courseRes.value.data?.course ?? courseRes.value.data?.data ?? courseRes.value.data
      courseTitle.value = data?.title ?? ''
    }
  } catch (error) {
    fetchError.value = error?.response?.data?.message || error.message || 'Gagal memuat module.'
    toast.error(fetchError.value)
  } finally {
    loading.value = false
  }
}

function openCreateModule() {
  selectedModule.value = null
  showModuleForm.value = true
}

function openEditModule(module) {
  selectedModule.value = module
  showModuleForm.value = true
}

function onModuleSaved(action) {
  fetchModules()
  toast.success(action === 'updated' ? 'Module berhasil diperbarui' : 'Module berhasil dibuat')
}

function openCreateLesson(module) {
  selectedLessonModule.value = module
  selectedLesson.value = null
  showLessonForm.value = true
}

function openEditLesson(module, lesson) {
  selectedLessonModule.value = module
  selectedLesson.value = lesson
  showLessonForm.value = true
}

function onLessonSaved(action) {
  fetchModules()
  toast.success(action === 'updated' ? 'Lesson berhasil diperbarui' : 'Lesson berhasil dibuat')
}

function confirmDeleteLesson(lesson) {
  lessonToDelete.value = lesson
  showDeleteLessonModal.value = true
}

async function deleteSelectedLesson() {
  if (!lessonToDelete.value) return

  deletingLesson.value = true

  try {
    await deleteLesson(lessonToDelete.value.id)
    toast.success('Lesson berhasil dihapus')
    showDeleteLessonModal.value = false
    lessonToDelete.value = null
    await fetchModules()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus lesson')
  } finally {
    deletingLesson.value = false
  }
}

function formatDate(iso) {
  if (!iso) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
}

onMounted(fetchModules)
</script>
