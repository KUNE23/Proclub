<template>
  <div class="flex flex-col h-screen bg-[#FAFCFB] font-sans antialiased text-gray-800">
    <header class="h-14 px-6 flex items-center justify-between bg-white border-b border-[#E6EFE9] shrink-0 z-20">
      <div class="flex items-center gap-4">
        <router-link
          v-if="courseId"
          :to="`/courses/${courseId}`"
          class="flex items-center gap-2 text-gray-500 hover:text-[#2C7047] transition-colors text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Kursus
        </router-link>
        <div class="w-px h-5 bg-gray-200"></div>
        <span class="text-sm font-bold text-[#1A2E20] truncate max-w-xs">{{ activeModule?.title || 'Memuat...' }}</span>
      </div>

      <div class="hidden md:flex items-center gap-3">
        <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-[#2C7047] rounded-full transition-all duration-700"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <span class="text-xs font-bold text-[#2C7047]">{{ progressPercent }}%</span>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside class="w-64 bg-white border-r border-[#E6EFE9] flex flex-col shrink-0 overflow-hidden">
        <nav class="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <button
            v-for="(module, index) in allModules"
            :key="module.id"
            @click="selectModule(module, index)"
            :disabled="!canAccess(index)"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all duration-200 disabled:cursor-not-allowed"
            :class="[
              !canAccess(index)
                ? 'opacity-50 pointer-events-none text-gray-400'
                : activeModule?.id === module.id
                ? 'bg-[#F2F7F4] text-[#2C7047] font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C7047]'
            ]"
          >
            <span class="text-[11px] font-bold w-5 text-right shrink-0">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="truncate flex-1">{{ module.title }}</span>
            <div class="flex items-center gap-1 shrink-0">
              <span v-if="module.type === 'QUIZ'" class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 text-[9px] font-bold uppercase">Quiz</span>
              <svg v-if="isModuleCompleted(module.id)" class="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
          </button>
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto relative">
        <div v-if="isLoading" class="p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
          <div class="h-72 bg-gray-200 rounded-2xl"></div>
          <div class="h-10 bg-gray-200 rounded w-2/3"></div>
        </div>

        <div v-else class="pb-16">
          <div class="px-6 lg:px-12 pt-8 max-w-4xl mx-auto">
            <h1 class="text-2xl lg:text-3xl font-black text-[#1A2E20] mb-5">{{ activeModule?.title }}</h1>

            <div v-if="activeModule?.type === 'QUIZ'">
             <QuizPlayer 
              :key="activeModule.id + '-' + retryCount"
              :questions="activeModule.quizzes || []"
              :moduleId="activeModule.id"
              :savedAnswers="moduleProgress[activeModule.id]?.answers || []"
              :isCompleted="isModuleCompleted(activeModule.id)"
              @completed="handleQuizCompleted"
            />
            </div>

            <div v-else>
              <div class="prose prose-green max-w-none text-gray-600 text-[15px] leading-relaxed mb-8 whitespace-pre-line">
                {{ activeModule?.content }}
              </div>
              <div class="border-t border-[#E6EFE9] pt-10 text-center">
                <button
                  @click="handleComplete"
                  :disabled="isCompleting || isModuleCompleted(activeModule?.id)"
                  class="bg-[#2C7047] hover:bg-[#235838] disabled:bg-gray-400 text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto transition-all"
                >
                  <span v-if="isModuleCompleted(activeModule?.id)">✓ Selesai</span>
                  <span v-else>Selesaikan Modul</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showQuizResult" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl">
        <div class="w-24 h-24 bg-[#F2F7F4] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#E6EFE9]">
          <span class="text-4xl font-black text-[#2C7047]">{{ quizData.score }}</span>
        </div>
        <h2 class="text-2xl font-bold text-[#1A2E20] mb-2">{{ quizData.isPassed ? 'Luar Biasa!' : 'Belum Berhasil' }}</h2>
        <p class="text-gray-500 text-sm mb-8 leading-relaxed">{{ quizData.message }}</p>
        <div class="flex flex-col gap-3">
          <button @click="closeResultAndNext" class="w-full bg-[#2C7047] text-white py-4 rounded-2xl text-sm font-bold hover:bg-[#235838]">
            {{ quizData.isPassed ? 'Lanjut ke Modul Berikutnya' : 'Oke, Mengerti' }}
          </button>
          <button @click="retryQuiz" class="w-full bg-white border border-gray-200 text-gray-600 py-4 rounded-2xl text-sm font-bold hover:bg-gray-50">
            Ulangi Kuis
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../api/index.js'
import QuizPlayer from '../components/QuizPlayer.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isLoading = ref(true)
const isCompleting = ref(false)
const allModules = ref([])
const activeModule = ref(null)
const courseId = ref(null)
const currentModuleIndex = ref(0)
const moduleProgress = ref({})

const showQuizResult = ref(false)
const quizData = ref({ score: 0, isPassed: false, message: '' })
const retryCount = ref(0)

const isModuleCompleted = (id) => {
  if (!id || !moduleProgress.value[id]) return false
  const status = moduleProgress.value[id].status
  return status === 'COMPLETED' || status === 'completed'
}

const progressPercent = computed(() => {
  if (!allModules.value.length) return 0
  const completed = allModules.value.filter(m => isModuleCompleted(m.id)).length
  return Math.round((completed / allModules.value.length) * 100)
})

const canAccess = (index) => {
  if (index === 0) return true
  const prevModuleId = allModules.value[index - 1]?.id
  return isModuleCompleted(prevModuleId)
}

async function fetchData() {
  courseId.value = route.params.courseId
  isLoading.value = true
  try {
    const res = await api.get(`/courses/${courseId.value}`)
    const modules = res.data.data?.modules || res.data.course?.modules || []
    allModules.value = modules.sort((a, b) => a.order - b.order)
    
    allModules.value.forEach((m, i) => {
      moduleProgress.value[m.id] = { status: i === 0 ? 'IN_PROGRESS' : 'LOCKED' }
    })

    await fetchModuleProgress()

    const targetId = route.params.moduleId || allModules.value[0]?.id
    const index = allModules.value.findIndex(m => m.id == targetId)
    const safeIndex = index !== -1 ? index : 0

    if (allModules.value.length > 0) {
      if (canAccess(safeIndex)) {
        await getModuleContent(allModules.value[safeIndex].id, safeIndex)
      } else {
        await getModuleContent(allModules.value[0].id, 0)
        router.replace(`/courses/${courseId.value}/modules/${allModules.value[0].id}`)
      }
    }
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error('Akses ditolak. Silakan login ulang.')
    } else {
      toast.error('Gagal memuat data kursus')
    }
  } finally {
    isLoading.value = false
  }
}

async function getModuleContent(moduleId, index) {
  try {
    const res = await api.get(`/courses/${courseId.value}/modules/${moduleId}`)
    activeModule.value = res.data.module
    currentModuleIndex.value = index
    if (res.data.progress) {
      moduleProgress.value[moduleId] = res.data.progress
    }
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error('Selesaikan modul sebelumnya terlebih dahulu!')
    } else {
      toast.error('Gagal memuat konten modul')
    }
  }
}

async function fetchModuleProgress() {
  try {
    const promises = allModules.value.map(m => 
      api.get(`/courses/${courseId.value}/modules/${m.id}`)
        .catch(() => ({ data: { progress: { status: 'LOCKED' } } }))
    )
    const results = await Promise.all(promises)
    results.forEach((res, i) => {
      const mId = allModules.value[i].id
      moduleProgress.value[mId] = res.data?.progress || { status: 'LOCKED' }
    })
  } catch (e) {
    console.error("Progress sync failed")
  }
}

async function handleComplete() {
  if (!activeModule.value) return
  isCompleting.value = true
  try {
    await api.post(`/modules/${activeModule.value.id}/progress`, { answers: [] })
    moduleProgress.value[activeModule.value.id].status = 'COMPLETED'
    toast.success('Modul selesai!')
    goToNextModule()
  } catch (error) {
    toast.error('Gagal menyimpan progres')
  } finally {
    isCompleting.value = false
  }
}

async function handleQuizCompleted(data) {
  quizData.value = {
    score: data.score,
    isPassed: data.isPassed,
    message: data.isPassed
      ? 'Selamat! Kamu lulus kuis ini.'
      : 'Maaf, skormu belum mencapai KKM.'
  }

  if (data.isPassed) {
    try {
      await api.post(`/modules/${activeModule.value.id}/progress`, {
        score: data.score
      })

      moduleProgress.value[activeModule.value.id].status = 'COMPLETED'
    } catch (err) {
      toast.error('Gagal menyimpan progress quiz')
    }
  }

  showQuizResult.value = true
}

function backToCourse() {
  router.push(`/courses/${courseId.value}`)
}

function retryQuiz() {
  showQuizResult.value = false
  retryCount.value++
}

function closeResultAndNext() {
  showQuizResult.value = false
  if (quizData.value.isPassed) {
    goToNextModule()
  } else {
    backToCourse()
  }
}

function goToNextModule() {
  const nextIndex = currentModuleIndex.value + 1
  if (nextIndex < allModules.value.length) {
    const next = allModules.value[nextIndex]
    router.push(`/courses/${courseId.value}/modules/${next.id}`)
    getModuleContent(next.id, nextIndex)
  } else {
    toast.info('Selamat! Semua modul telah selesai.')
    backToCourse()
  }
}

function selectModule(m, i) {
  if (canAccess(i)) {
    router.push(`/courses/${courseId.value}/modules/${m.id}`)
    getModuleContent(m.id, i)
  } else {
    toast.warning('Selesaikan modul sebelumnya terlebih dahulu!')
  }
}

onBeforeRouteUpdate((to, from) => {
  const nextModuleId = to.params.moduleId
  const nextIndex = allModules.value.findIndex(m => m.id == nextModuleId)
  if (nextIndex !== -1 && !canAccess(nextIndex)) { 
    toast.error('Modul ini masih terkunci!')
    return false
  } else {
    return true
  }
})

onMounted(fetchData)

watch(() => route.params.moduleId, (newId) => {
  if (newId && allModules.value.length > 0) {
    const index = allModules.value.findIndex(m => m.id == newId)
    if (index !== -1 && activeModule.value?.id != newId) {
      getModuleContent(newId, index)
    }
  }
})
</script>