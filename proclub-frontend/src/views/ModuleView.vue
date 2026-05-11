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
        <span class="text-xs text-gray-400 font-medium">
          Modul {{ currentModuleIndex + 1 }} / {{ allModules.length }}
        </span>
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
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all duration-200 group relative disabled:cursor-not-allowed"
            :class="[
              !canAccess(index)
                ? 'opacity-50 pointer-events-none text-gray-400'
                : activeModule && module.id === activeModule.id
                ? 'bg-[#F2F7F4] text-[#2C7047] font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C7047] cursor-pointer',
            ]"
          >
            <span class="text-[11px] font-bold w-5 text-right shrink-0"
              :class="activeModule && module.id === activeModule.id ? 'text-[#2C7047]' : 'text-gray-400'">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="truncate flex-1">{{ module.title }}</span>
            <svg
              v-if="!canAccess(index)"
              class="w-4 h-4 text-gray-400 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
            <svg
              v-else-if="moduleProgress[module.id]?.status === 'completed'"
              class="w-4 h-4 text-green-500 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </button>
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto relative">
        <div v-if="isLoading" class="animate-pulse p-8 lg:px-16 lg:py-10 max-w-4xl mx-auto space-y-8">
          <div class="h-72 bg-gray-200 rounded-2xl"></div>
          <div class="h-10 bg-gray-200 rounded w-2/3"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-32 bg-gray-200 rounded-xl"></div>
        </div>

        <div v-else class="pb-16">
          <div class="px-6 lg:px-12 pt-8 max-w-4xl mx-auto">
            <h1 class="text-2xl lg:text-3xl font-black text-[#1A2E20] leading-tight mb-5">
              {{ activeModule?.title }}
            </h1>

            <div class="prose prose-green max-w-none text-gray-600 text-[15px] leading-relaxed mb-8 whitespace-pre-line">
              {{ activeModule?.content }}
            </div>

            <div class="border-t border-[#E6EFE9] pt-10 pb-4 text-center">
              <h3 class="text-xl font-bold text-[#1A2E20] mb-2">Module Completed?</h3>
              <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Keep track of your progress by marking this module as finished.
              </p>
              <button
                @click="handleComplete"
                :disabled="isCompleting || (activeModule && moduleProgress[activeModule.id]?.status === 'completed')"
                class="bg-[#2C7047] hover:bg-[#235838] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto shadow-lg shadow-[#2C7047]/25 transition-all duration-200"
              >
                <svg v-if="isCompleting" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                <span v-else-if="activeModule && moduleProgress[activeModule.id]?.status === 'completed'">
                  ✓ Completed
                </span>
                <span v-else>
                  Mark as Complete
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../api/index.js'

const route = useRoute()
const toast = useToast()
const isLoading = ref(true)
const isCompleting = ref(false)
const allModules = ref([])
const activeModule = ref(null)
const courseId = ref(null)
const courseTitle = ref('')
const currentModuleIndex = ref(0)
const moduleProgress = ref({})

const progressPercent = computed(() => {
  if (!allModules.value || allModules.value.length === 0) return 0
  const completedCount = allModules.value.filter(
    m => moduleProgress.value[m.id]?.status === 'completed'
  ).length
  return Math.round(((completedCount + 1) / allModules.value.length) * 100)
})

const canAccess = (index) => {
  if (index === 0) return true
  
  const previousModule = allModules.value[index - 1]
  if (!previousModule) return false
  
  const previousProgress = moduleProgress.value[previousModule.id]
  return previousProgress?.status === 'completed'
}

async function fetchData() {
  const id = route.params.courseId
  courseId.value = id
  isLoading.value = true
  
  try {
    const res = await api.get(`/courses/${id}`)

    const data = res.data.data || res.data
    
    courseTitle.value = data.title || (data.course && data.course.title)

    const rawModules = data.modules || (data.course && data.course.modules)
    allModules.value = Array.isArray(rawModules) ? rawModules : []

    await fetchModuleProgress()

    if (allModules.value.length > 0) {
      const moduleIdFromUrl = route.params.moduleId
      const foundIndex = allModules.value.findIndex(m => m.id == moduleIdFromUrl)
      const targetIndex = foundIndex !== -1 ? foundIndex : 0
      
      if (canAccess(targetIndex)) {
        activeModule.value = allModules.value[targetIndex]
        currentModuleIndex.value = targetIndex
      } else {
        activeModule.value = allModules.value[0]
        currentModuleIndex.value = 0
        toast.warning('Selesaikan modul sebelumnya terlebih dahulu!', {
          timeout: 3000
        })
      }
    }
  } catch (error) {
    console.error('Gagal memuat data:', error)
    toast.error('Gagal memuat data kursus', { timeout: 3000 })
  } finally {
    isLoading.value = false
  }
}

async function fetchModuleProgress() {
  try {
    allModules.value.forEach(module => {
      if (!moduleProgress.value[module.id]) {
        moduleProgress.value[module.id] = {
          status: 'locked',
          score: null
        }
      }
    })

    for (const module of allModules.value) {
      try {
        const res = await api.get(
          `/courses/${courseId.value}/modules/${module.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (res.data.progress) {
          moduleProgress.value[module.id] = res.data.progress
        } else if (module.order === 1) {
          moduleProgress.value[module.id] = { status: 'unlocked', score: null }
        }
      } catch (err) {
        if (err.response?.status === 403) {
          moduleProgress.value[module.id] = { status: 'locked', score: null }
        } else if (module.order === 1) {
          moduleProgress.value[module.id] = { status: 'unlocked', score: null }
        }
      }
    }
  } catch (error) {
    console.error('Gagal memuat progres modul:', error)
  }
}

function selectModule(module, index) {
  if (!canAccess(index)) {
    toast.error('Selesaikan modul sebelumnya!', { timeout: 2000 })
    return
  }

  activeModule.value = module
  currentModuleIndex.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleComplete() {
  if (!activeModule.value) return

  isCompleting.value = true

  try {
    const res = await api.post(
      `/modules/${activeModule.value.id}/complete`,
      { score: null },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    moduleProgress.value[activeModule.value.id] = {
      status: 'completed',
      score: res.data.progress?.score || null
    }

    toast.success('Progres disimpan!', { timeout: 2000 })

    setTimeout(() => {
      if (currentModuleIndex.value < allModules.value.length - 1) {
        const nextModule = allModules.value[currentModuleIndex.value + 1]
        selectModule(nextModule, currentModuleIndex.value + 1)
      }
    }, 500)
  } catch (error) {
    console.error('Gagal menyimpan progres:', error)
    toast.error(
      error.response?.data?.message || 'Gagal menyimpan progres',
      { timeout: 3000 }
    )
  } finally {
    isCompleting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>