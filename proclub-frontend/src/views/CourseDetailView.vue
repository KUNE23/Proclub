<template>
  <div class="min-h-screen bg-[#FAFCFB] p-4 md:p-6 font-sans text-slate-900">
    <div class="mx-auto max-w-full lg:max-w-[1400px]">
      <header class="mb-10 flex flex-wrap items-start justify-between gap-6 px-2">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-[11px] font-bold tracking-widest">
            <span class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <span class="text-emerald-600 uppercase">Ruang Belajar</span>
          </div>

          <div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              Alur Belajar Kamu
            </h1>

            <p class="mt-1 text-sm text-slate-500">
              Profil Mahasiswa:
              <span class="font-bold text-emerald-700">
                {{ profile.name }}
              </span>
            </p>
          </div>
        </div>
      </header>

      <div
        v-if="loading"
        class="flex min-h-[400px] flex-col items-center justify-center"
      >
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-600"></div>
      </div>

      <div v-else class="relative px-2">
        <div class="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent md:block"></div>

        <div class="absolute left-6 top-0 block h-full w-px bg-slate-200 md:hidden"></div>

        <div class="space-y-10 relative">
          <div
            v-for="(module, index) in sortedModules"
            :key="module.id"
            class="relative flex w-full items-center justify-center md:justify-between"
            :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
          >
            <div class="absolute left-6 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-white ring-2 ring-slate-200 md:left-1/2 md:-translate-x-1/2">
              <div
                class="h-2 w-2 rounded-full transition-all duration-500"
                :class="[
                  isLocked(module, index)
                    ? 'bg-slate-200'
                    : isCompleted(module)
                      ? 'bg-emerald-500'
                      : 'bg-emerald-600 scale-150 shadow-[0_0_12px_rgba(5,150,105,0.4)]'
                ]"
              ></div>
            </div>

            <div class="w-full pl-14 md:w-[47%] md:pl-0">
              <div
                class="group relative rounded-[1.5rem] border bg-white p-6 transition-all duration-500"
                :class="[
                  isLocked(module, index)
                    ? 'border-slate-100 opacity-60 grayscale-[0.5]'
                    : 'hover:-translate-y-1 hover:shadow-xl',

                  isCurrentActive(module, index)
                    ? 'border-emerald-500 ring-4 ring-emerald-50/50'
                    : 'border-slate-100'
                ]"
              >
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      v-if="isLocked(module, index)"
                      class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100"
                    >
                      <Lock class="w-4 h-4" />
                    </div>

                    <div
                      v-else-if="isCompleted(module)"
                      class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100"
                    >
                      <CheckCircle2 class="w-4 h-4" />
                    </div>

                    <div
                      v-else
                      class="flex items-center gap-2 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      <Layout class="w-3 h-3" />
                      {{ module.lessons.length }} Lesson
                    </div>

                    <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {{
                        isLocked(module, index)
                          ? 'Belum Terbuka'
                          : isCompleted(module)
                            ? 'Selesai'
                            : 'Sedang Dipelajari'
                      }}
                    </span>
                  </div>
                </div>

                <h3 class="text-lg font-bold text-slate-900 leading-tight transition-colors group-hover:text-emerald-700">
                  {{ module.title }}
                </h3>

                <p class="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                  {{ module.description || nextLesson(module)?.title || 'Belum ada lesson di module ini.' }}
                </p>

                <div v-if="module.lessons.length" class="mt-4 space-y-2">
                  <div
                    v-for="lesson in module.lessons"
                    :key="lesson.id"
                    class="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  >
                    <CheckCircle2
                      v-if="isLessonCompleted(lesson)"
                      class="h-3.5 w-3.5 text-emerald-600"
                    />
                    <Lock
                      v-else-if="isLessonLocked(lesson)"
                      class="h-3.5 w-3.5 text-slate-400"
                    />
                    <FileText
                      v-else
                      class="h-3.5 w-3.5 text-emerald-600"
                    />
                    <span class="truncate font-semibold">{{ lesson.title }}</span>
                  </div>
                </div>

                <div
                  v-if="!isLocked(module, index)"
                  class="mt-6"
                >
                  <div class="flex flex-col items-center md:items-end lg:flex-row lg:justify-between gap-6">
                    <div class="relative h-16 w-16 shrink-0">
                      <svg
                        class="h-full w-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          class="fill-none stroke-slate-50"
                          stroke-width="12"
                          cx="50"
                          cy="50"
                          r="40"
                        />

                        <circle
                          class="fill-none stroke-emerald-600 transition-all duration-1000 ease-out"
                          stroke-width="12"
                          stroke-linecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          :stroke-dasharray="251.2"
                          :stroke-dashoffset="251.2 * (1 - getProgress(module) / 100)"
                        />
                      </svg>

                      <div class="absolute inset-0 flex items-center justify-center text-[10px] font-black">
                        {{ getProgress(module) }}%
                      </div>
                    </div>

                    <button
                      v-if="!isCompleted(module)"
                      @click="continueLearning(module)"
                      class="w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3 text-[11px] font-black text-white hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-950/20"
                    >
                      Lanjut Belajar
                      <ArrowRight class="w-3.5 h-3.5" />
                    </button>

                    <button
                      v-else
                      @click="reviewArchive(module)"
                      class="flex items-center gap-2 rounded-lg bg-slate-50 px-5 py-2.5 text-[10px] font-black tracking-widest text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all uppercase border border-slate-200/50"
                    >
                      <FileText class="w-3.5 h-3.5" />
                      Arsip Materi
                    </button>
                  </div>
                </div>

                <div
                  v-else
                  class="mt-6 flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase"
                >
                  <Lock class="w-3 h-3" />
                  Terbuka setelah modul sebelumnya selesai
                </div>
              </div>
            </div>

            <div class="hidden md:block w-[47%]"></div>
          </div>
        </div>
      </div>

      <footer class="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 px-2">
        <div
          v-for="(info, key) in footerItems"
          :key="key"
          class="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-100"
        >
          <div
            :class="[
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
              info.bg,
              info.color
            ]"
          >
            <component :is="info.icon" class="w-5 h-5" />
          </div>

          <div class="min-w-0">
            <span class="text-[8px] font-black uppercase tracking-widest text-slate-400">
              {{ info.label }}
            </span>

            <p class="truncate text-[13px] font-bold text-slate-900 mt-0.5">
              {{ info.data.title }}
            </p>

            <span class="text-[10px] font-medium text-slate-500">
              {{ info.data.sub }}
            </span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../api/index.js'

import {
  CheckCircle2,
  Layout,
  ArrowRight,
  Calendar,
  FileText,
  Trophy,
  Lock
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(true)

const courseId = computed(() => route.params.id)

const modules = ref([])
const progressMap = ref({})

const profile = ref({
  name: ''
})

const sortedModules = computed(() => {
  return [...modules.value]
    .map(module => ({
      ...module,
      lessons: [...(module.lessons || [])].sort((a, b) => a.order - b.order)
    }))
    .sort((a, b) => a.order - b.order)
})

const flattenedLessons = computed(() => {
  return sortedModules.value.flatMap(module =>
    module.lessons.map(lesson => ({
      ...lesson,
      moduleId: module.id
    }))
  )
})

const getProgress = (module) => {
  if (!module.lessons.length) return 0

  const completed = module.lessons.filter(isLessonCompleted).length
  return Math.round((completed / module.lessons.length) * 100)
}

const isCompleted = (module) => {
  return module.lessons.length > 0 && module.lessons.every(isLessonCompleted)
}

const isCurrentActive = (module, index) => {
  if (isCompleted(module)) return false

  const previousModules = sortedModules.value.slice(0, index)

  return previousModules.every(
    (item) => isCompleted(item)
  )
}

const isLocked = (module, index) => {
  if (index === 0) return false

  const previousModule = sortedModules.value[index - 1]

  return previousModule && !isCompleted(previousModule)
}

const isLessonCompleted = (lesson) => {
  return progressMap.value[lesson.id]?.status === 'COMPLETED'
}

const isLessonLocked = (lesson) => {
  const index = flattenedLessons.value.findIndex(item => item.id === lesson.id)
  if (index <= 0) return false

  return !isLessonCompleted(flattenedLessons.value[index - 1])
}

const nextLesson = (module) => {
  return module.lessons.find(lesson => !isLessonCompleted(lesson)) || module.lessons[0] || null
}

const fetchProgress = async () => {
  const response = await api.get('/progress')
  const progress = Array.isArray(response.data?.data) ? response.data.data : []

  progressMap.value = progress.reduce((acc, item) => {
    acc[item.lessonId] = item
    return acc
  }, {})
}

const fetchUserData = async () => {
  const res = await api.get('/auth/me')

  profile.value = {
    name: res.data.name || ''
  }
}

const fetchModules = async () => {
  loading.value = true

  try {
    await Promise.all([
      fetchUserData(),
      fetchProgress()
    ])

    const response = await api.get(`/courses/${courseId.value}/modules`)

    if (response.data?.status === 'success') {
      modules.value = response.data.modules || []
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat alur belajar')
  } finally {
    loading.value = false
  }
}

const continueLearning = (module) => {
  const lesson = nextLesson(module)

  if (!lesson) {
    toast.warning('Module ini belum memiliki lesson')
    return
  }

  if (isLessonLocked(lesson)) {
    toast.warning('Selesaikan lesson sebelumnya terlebih dahulu')
    return
  }

  router.push(`/courses/${courseId.value}/lessons/${lesson.id}`)
}

const reviewArchive = (module) => {
  const lesson = module.lessons[0]

  if (!lesson) {
    toast.warning('Module ini belum memiliki lesson')
    return
  }

  router.push(`/courses/${courseId.value}/lessons/${lesson.id}`)
}

const footerItems = computed(() => ({
  deadline: {
    label: 'Tenggat Terdekat',
    icon: Calendar,
    bg: 'bg-rose-50',
    color: 'text-rose-500',
    data: {
      title: 'Quiz Dasar Pemrograman',
      sub: '1 Hari lagi'
    }
  },

  resource: {
    label: 'Materi Terbaru',
    icon: FileText,
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    data: {
      title: 'Module Array & Looping',
      sub: 'PDF • 3 MB'
    }
  },

  rank: {
    label: 'Peringkat Kamu',
    icon: Trophy,
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    data: {
      title: 'Top 5 Student',
      sub: 'Peringkat #5'
    }
  }
}))

onMounted(() => {
  fetchModules()
})
</script>
