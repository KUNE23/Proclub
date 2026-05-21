<template>
  <div class="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div class="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <button
            @click="backToCourse"
            class="text-slate-500 transition-colors hover:text-emerald-600"
            type="button"
          >
            <ArrowLeft class="h-5 w-5" />
          </button>

          <div class="hidden h-6 w-px bg-slate-200 sm:block"></div>

          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {{ courseData?.title || 'Learning Path' }}
            </div>
            <div class="max-w-[150px] truncate text-sm font-bold text-slate-900 sm:max-w-[220px] md:max-w-md">
              {{ activeLesson?.title || 'Memuat...' }}
            </div>
          </div>
        </div>

        <div class="hidden items-center gap-2 sm:flex">
          <span class="text-xs font-semibold text-slate-600">
            Progress <span class="font-bold text-emerald-600">{{ progressPercent }}%</span>
          </span>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 pb-32 pt-8 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-8 w-3/4 rounded bg-slate-200"></div>
        <div class="h-64 rounded-[20px] bg-slate-200"></div>
        <div class="space-y-3">
          <div class="h-4 w-full rounded bg-slate-200"></div>
          <div class="h-4 w-5/6 rounded bg-slate-200"></div>
          <div class="h-4 w-4/6 rounded bg-slate-200"></div>
        </div>
      </div>

      <div v-else-if="activeLesson" class="space-y-8">
        <div>
          <span class="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            <CircleHelp v-if="activeLesson.type === 'QUIZ'" class="h-3.5 w-3.5" />
            <BookOpen v-else class="h-3.5 w-3.5" />
            {{ activeLesson.type === 'QUIZ' ? 'Quiz' : 'Materi' }}
          </span>

          <p class="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            {{ activeLesson.module?.title }}
          </p>

          <h1 class="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
            {{ activeLesson.title }}
          </h1>

          <p v-if="activeLesson.description" class="mt-3 text-sm leading-relaxed text-slate-500">
            {{ activeLesson.description }}
          </p>
        </div>

        <div v-if="activeLesson.type === 'QUIZ'" class="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <QuizPlayer
            :key="activeLesson.id + '-' + retryCount"
            :questions="activeLesson.quizzes || []"
            :lesson-id="activeLesson.id"
            :saved-answers="lessonProgress[activeLesson.id]?.answers || []"
            :is-completed="isLessonCompleted(activeLesson.id)"
            @completed="handleQuizCompleted"
          />
        </div>

        <div v-else class="space-y-4">
          <div class="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
            <div
              v-if="activeLesson.content"
              class="prose prose-slate prose-emerald max-w-none whitespace-pre-line text-base leading-loose text-slate-600"
            >
              {{ activeLesson.content }}
            </div>

            <div v-if="activeLesson.contentBlocks?.length" class="space-y-5">
              <div
                v-for="block in activeLesson.contentBlocks"
                :key="block.id"
                class="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <div class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  <component :is="blockIcon(block.type)" class="h-4 w-4" />
                  {{ block.title || block.type }}
                </div>

                <pre
                  v-if="block.type === 'CODE'"
                  class="overflow-auto rounded-xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-100"
                >{{ block.content?.code || block.content?.text || '' }}</pre>

                <div v-else-if="block.type === 'IMAGE'" class="space-y-3">
                  <img
                    :src="block.content?.url"
                    :alt="block.title || 'Lesson image'"
                    class="max-h-[520px] w-full rounded-xl border border-slate-200 object-contain bg-white"
                  >
                  <p v-if="block.content?.caption" class="text-xs leading-relaxed text-slate-500">
                    {{ block.content.caption }}
                  </p>
                </div>

                <div v-else-if="isPdfBlock(block)" class="space-y-3">
                  <iframe
                    :src="block.content?.url"
                    class="h-[560px] w-full rounded-xl border border-slate-200 bg-white"
                  ></iframe>
                  <a
                    :href="block.content?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0A733F] ring-1 ring-[#D9E7DF] transition-colors hover:bg-[#F0FDF4]"
                  >
                    <ExternalLink class="h-3.5 w-3.5" />
                    Buka PDF
                  </a>
                </div>

                <div v-else-if="block.type === 'VIDEO'" class="space-y-3">
                  <iframe
                    v-if="isYoutubeBlock(block)"
                    :src="block.content?.url"
                    class="aspect-video w-full rounded-xl border border-slate-200 bg-slate-950"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                  <video
                    v-else
                    :src="block.content?.url"
                    controls
                    class="max-h-[520px] w-full rounded-xl border border-slate-200 bg-slate-950"
                  ></video>
                  <p v-if="block.content?.caption" class="text-xs leading-relaxed text-slate-500">
                    {{ block.content.caption }}
                  </p>
                </div>

                <a
                  v-else-if="isLinkBlock(block)"
                  :href="block.content?.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between gap-4 rounded-xl border border-[#D9E7DF] bg-white p-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#F0FDF4] hover:text-[#0A733F]"
                >
                  <span class="min-w-0 truncate">{{ block.content?.caption || block.content?.url }}</span>
                  <ExternalLink class="h-4 w-4 shrink-0" />
                </a>

                <p
                  v-else
                  class="whitespace-pre-line text-sm leading-relaxed text-slate-600"
                >
                  {{ blockText(block) }}
                </p>
              </div>
            </div>

            <div v-if="!activeLesson.content && !activeLesson.contentBlocks?.length" class="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <FileText class="mb-3 h-10 w-10" />
              <p class="text-sm font-semibold">Materi lesson ini belum tersedia.</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="!isLoading && activeLesson" class="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 p-4 backdrop-blur-md">
      <div class="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          @click="goToPrevLesson"
          :disabled="currentLessonIndex === 0"
          class="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          type="button"
        >
          <ChevronLeft class="h-4 w-4" />
          <span class="hidden sm:inline">Sebelumnya</span>
        </button>

        <div class="flex flex-1 justify-center">
          <button
            v-if="activeLesson.type !== 'QUIZ'"
            @click="handleComplete"
            :disabled="isCompleting || isLessonCompleted(activeLesson.id)"
            class="flex w-full max-w-[240px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all sm:px-8"
            :class="[
              isLessonCompleted(activeLesson.id)
                ? 'cursor-default bg-emerald-100 text-emerald-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
            ]"
            type="button"
          >
            <CheckCircle2 class="h-5 w-5 shrink-0" />
            <span class="truncate">{{ isLessonCompleted(activeLesson.id) ? 'Selesai' : 'Tandai Selesai' }}</span>
          </button>
        </div>

        <button
          @click="goToNextLesson"
          :disabled="currentLessonIndex === allLessons.length - 1 || !isLessonCompleted(activeLesson.id)"
          class="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          type="button"
        >
          <span class="hidden sm:inline">Berikutnya</span>
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div v-if="showQuizResult" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-sm rounded-[24px] bg-white p-8 text-center shadow-2xl">
        <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50">
          <span class="text-4xl font-black text-emerald-600">{{ quizData.score }}</span>
        </div>

        <h2 class="mb-2 text-2xl font-bold text-slate-900">
          {{ quizData.isPassed ? 'Luar Biasa!' : 'Belum Berhasil' }}
        </h2>

        <p class="mb-8 text-sm leading-relaxed text-slate-500">
          {{ quizData.message }}
        </p>

        <div class="flex flex-col gap-3">
          <button
            @click="closeResultAndNext"
            class="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            type="button"
          >
            {{ quizData.isPassed ? 'Lanjut ke Lesson Berikutnya' : 'Oke, Mengerti' }}
          </button>

          <button
            @click="retryQuiz"
            class="w-full rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
            type="button"
          >
            Ulangi Kuis
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Code2,
  ExternalLink,
  FileText,
  Image,
  Info,
  Link,
  Video
} from 'lucide-vue-next'
import api from '../api/index.js'
import QuizPlayer from '../components/QuizPlayer.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isLoading = ref(true)
const isCompleting = ref(false)
const courseData = ref(null)
const activeLesson = ref(null)
const lessonProgress = ref({})
const showQuizResult = ref(false)
const quizData = ref({ score: 0, isPassed: false, message: '' })
const retryCount = ref(0)

const courseId = computed(() => route.params.courseId)
const lessonId = computed(() => Number(route.params.lessonId))

const allLessons = computed(() => {
  const modules = courseData.value?.modules || []

  return modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap(module =>
      (module.lessons || [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(lesson => ({
          ...lesson,
          module
        }))
    )
})

const currentLessonIndex = computed(() => {
  return allLessons.value.findIndex(lesson => lesson.id === activeLesson.value?.id)
})

const progressPercent = computed(() => {
  if (!allLessons.value.length) return 0

  const completed = allLessons.value.filter(lesson => isLessonCompleted(lesson.id)).length
  return Math.round((completed / allLessons.value.length) * 100)
})

const isLessonCompleted = (id) => {
  return lessonProgress.value[id]?.status === 'COMPLETED'
}

const blockIcon = (type) => {
  const icons = {
    TEXT: FileText,
    VIDEO: Video,
    IMAGE: Image,
    CODE: Code2,
    CALLOUT: Info,
    RESOURCE: Link
  }

  return icons[type] || FileText
}

const blockText = (block) => {
  const content = block.content || {}

  return content.text || content.url || content.caption || JSON.stringify(content, null, 2)
}

const isPdfBlock = (block) => {
  return block.type === 'RESOURCE' && block.content?.kind === 'PDF'
}

const isLinkBlock = (block) => {
  return block.type === 'RESOURCE' && block.content?.kind === 'LINK'
}

const isYoutubeBlock = (block) => {
  return block.content?.kind === 'YOUTUBE'
}

const loadProgress = async () => {
  const response = await api.get('/progress')
  const progress = Array.isArray(response.data?.data) ? response.data.data : []

  lessonProgress.value = progress.reduce((acc, item) => {
    acc[item.lessonId] = item
    return acc
  }, {})
}

const loadCourse = async () => {
  const response = await api.get(`/courses/${courseId.value}`)
  courseData.value = response.data?.course || response.data?.data || null
}

const loadLesson = async (id) => {
  const response = await api.get(`/lessons/${id}`)
  activeLesson.value = response.data?.lesson || null

  if (response.data?.progress) {
    lessonProgress.value[id] = response.data.progress
  }
}

const canAccess = (index) => {
  if (index <= 0) return true

  const previousLesson = allLessons.value[index - 1]
  return isLessonCompleted(previousLesson.id)
}

const fetchData = async () => {
  isLoading.value = true

  try {
    await Promise.all([
      loadCourse(),
      loadProgress()
    ])

    const targetIndex = allLessons.value.findIndex(lesson => lesson.id === lessonId.value)
    const safeIndex = targetIndex >= 0 ? targetIndex : 0

    if (!allLessons.value.length) {
      toast.warning('Learning path ini belum memiliki lesson')
      backToCourse()
      return
    }

    if (!canAccess(safeIndex)) {
      toast.warning('Selesaikan lesson sebelumnya terlebih dahulu')
      const firstAvailable = allLessons.value.find((lesson, index) => canAccess(index) && !isLessonCompleted(lesson.id)) || allLessons.value[0]
      router.replace(`/courses/${courseId.value}/lessons/${firstAvailable.id}`)
      await loadLesson(firstAvailable.id)
      return
    }

    await loadLesson(allLessons.value[safeIndex].id)
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat lesson')
  } finally {
    isLoading.value = false
  }
}

const handleComplete = async () => {
  if (!activeLesson.value) return

  isCompleting.value = true

  try {
    const response = await api.post(`/lessons/${activeLesson.value.id}/progress`)
    lessonProgress.value[activeLesson.value.id] = response.data.progress
    toast.success(response.data.moduleCompleted ? 'Selamat, module berhasil diselesaikan' : 'Lesson berhasil diselesaikan')
    window.dispatchEvent(new CustomEvent('notification:refresh'))
    goToNextLesson()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan progress lesson')
  } finally {
    isCompleting.value = false
  }
}

const handleQuizCompleted = async (data) => {
  quizData.value = {
    score: data.score,
    isPassed: data.isPassed,
    message: data.message || (data.isPassed ? 'Selamat, kamu lulus kuis ini.' : 'Skormu belum mencapai KKM.')
  }

  if (data.isPassed) {
    lessonProgress.value[activeLesson.value.id] = {
      ...(lessonProgress.value[activeLesson.value.id] || {}),
      status: 'COMPLETED',
      score: data.score
    }
    toast.success(data.moduleCompleted ? 'Selamat, module berhasil diselesaikan' : 'Quiz berhasil diselesaikan')
    window.dispatchEvent(new CustomEvent('notification:refresh'))
  } else {
    toast.warning('Skor kamu belum mencapai KKM')
  }

  showQuizResult.value = true
}

const backToCourse = () => {
  router.push(`/courses/${courseId.value}`)
}

const goToLesson = async (lesson) => {
  router.push(`/courses/${courseId.value}/lessons/${lesson.id}`)
  await loadLesson(lesson.id)
}

const goToPrevLesson = () => {
  const previousLesson = allLessons.value[currentLessonIndex.value - 1]

  if (previousLesson) {
    goToLesson(previousLesson)
  }
}

const goToNextLesson = () => {
  const nextLesson = allLessons.value[currentLessonIndex.value + 1]

  if (nextLesson) {
    goToLesson(nextLesson)
    return
  }

  toast.info('Selamat, semua lesson telah selesai')
  backToCourse()
}

const retryQuiz = () => {
  showQuizResult.value = false
  retryCount.value++
}

const closeResultAndNext = () => {
  showQuizResult.value = false

  if (quizData.value.isPassed) {
    goToNextLesson()
  }
}

onBeforeRouteUpdate((to) => {
  const nextId = Number(to.params.lessonId)
  const nextIndex = allLessons.value.findIndex(lesson => lesson.id === nextId)

  if (nextIndex >= 0 && !canAccess(nextIndex)) {
    toast.warning('Lesson ini masih terkunci')
    return false
  }

  return true
})

watch(() => route.params.lessonId, async (newId) => {
  const parsedId = Number(newId)

  if (parsedId && activeLesson.value?.id !== parsedId && !isLoading.value) {
    await loadLesson(parsedId)
  }
})

onMounted(fetchData)
</script>
