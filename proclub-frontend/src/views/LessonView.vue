<template>
  <div class="flex flex-col h-screen w-full bg-[#FAFCFB] font-sans antialiased text-gray-800 overflow-hidden">
    <header class="h-14 px-6 flex items-center justify-between bg-white border-b border-[#E6EFE9] shrink-0 z-20">
      <div class="flex items-center gap-4">
        <router-link
          :to="`/courses/${courseId}`"
          class="flex items-center gap-2 text-gray-500 hover:text-[#2C7047] transition-colors text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Kursus
        </router-link>
        <div class="w-px h-5 bg-gray-200"></div>
        <span class="text-sm font-bold text-[#1A2E20] truncate max-w-xs">{{ courseTitle }}</span>
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
      <aside class="w-64 bg-white border-r border-[#E6EFE9] flex flex-col shrink-0 h-full">
        <div class="p-4 border-b border-[#E6EFE9]">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#2C7047] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Semua Modul</p>
              <h2 class="text-sm font-bold text-[#1A2E20] truncate">{{ courseTitle }}</h2>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 custom-scrollbar">
          <template v-if="isLoadingModules">
            <div v-for="i in 5" :key="i" class="px-3 py-2.5 rounded-xl animate-pulse">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-gray-200 shrink-0"></div>
                <div class="flex-1 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </template>

          <button
            v-for="(mod, index) in allModules"
            :key="mod.id"
            @click="navigateToModule(mod)"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all duration-200"
            :class="[
              String(mod.id) === String(activeModule?.id)
                ? 'bg-[#F2F7F4] text-[#2C7047] font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C7047] cursor-pointer'
            ]"
          >
            <span class="text-[11px] font-bold w-5 text-right shrink-0"
              :class="String(mod.id) === String(activeModule?.id) ? 'text-[#2C7047]' : 'text-gray-400'">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <div class="shrink-0">
              <div v-if="String(mod.id) === String(activeModule?.id)" class="w-3 h-3 rounded-full bg-[#E87C3E] ring-2 ring-[#E87C3E]/20"></div>
              <div v-else class="w-3 h-3 rounded-full bg-gray-200"></div>
            </div>

            <span class="truncate">{{ mod.title }}</span>
          </button>
        </nav>
      </aside>

      <main class="flex-1 overflow-y-auto relative bg-white custom-scrollbar">
        <div v-if="isLoading" class="animate-pulse p-8 lg:px-16 lg:py-10 w-full space-y-6">
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        <div v-else-if="fetchError" class="flex flex-col items-center justify-center min-h-full text-center p-12">
          <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Gagal memuat materi</h3>
          <button @click="fetchLesson" class="px-5 py-2.5 bg-[#2C7047] text-white rounded-xl text-sm font-semibold hover:bg-[#235838]">
            Coba Lagi
          </button>
        </div>

        <div v-else-if="activeModule" class="min-h-full flex flex-col">
          <div class="px-8 lg:px-16 pt-10 pb-6 border-b border-[#E6EFE9] w-full">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-[#2C7047] bg-[#F2F7F4] px-2.5 py-1 rounded-full">
                Modul {{ currentModuleIndex + 1 }}
              </span>
            </div>
            <h1 class="text-2xl lg:text-4xl font-black text-[#1A2E20] leading-tight">
              {{ activeModule.title }}
            </h1>
          </div>

          <div class="px-8 lg:px-16 py-8 flex-1 w-full max-w-6xl">
            <div v-if="!activeModule.content" class="flex flex-col items-center justify-center py-20 text-center">
              <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-300">
                 <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p class="text-gray-400 text-sm">Belum ada konten untuk modul ini.</p>
            </div>

            <div v-else class="prose-lesson">
              <div
                v-if="isHtmlContent(activeModule.content)"
                class="text-gray-700 text-[16px] leading-relaxed space-y-4"
                v-html="activeModule.content"
              ></div>
              <div v-else class="text-gray-700 text-[16px] leading-relaxed whitespace-pre-wrap">
                {{ activeModule.content }}
              </div>
            </div>
          </div>

          <div class="px-8 lg:px-16 py-10 w-full mt-auto">
            <div class="border-t border-[#E6EFE9] pt-8 flex items-center justify-between gap-4">
              <button
                v-if="prevModule"
                @click="navigateToModule(prevModule)"
                class="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-[#E6EFE9] hover:border-[#2C7047] hover:bg-[#F2F7F4] transition-all duration-200"
              >
                <svg class="w-5 h-5 text-gray-400 group-hover:text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <div class="text-left">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#2C7047]">Sebelumnya</p>
                  <p class="text-sm font-semibold text-[#1A2E20]">{{ prevModule.title }}</p>
                </div>
              </button>
              <div v-else></div>

              <button
                v-if="nextModule"
                @click="navigateToModule(nextModule)"
                class="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-[#2C7047] hover:bg-[#235838] transition-all duration-200 shadow-xl shadow-[#2C7047]/10"
              >
                <div class="text-right">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-[#a8d5bc]">Selanjutnya</p>
                  <p class="text-sm font-semibold text-white">{{ nextModule.title }}</p>
                </div>
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <router-link
                v-else
                :to="`/courses/${courseId}`"
                class="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#1A2E20] hover:bg-black text-white transition-all duration-200 shadow-lg"
              >
                <div class="text-right">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selesai!</p>
                  <p class="text-sm font-semibold">Kembali ke Kursus</p>
                </div>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="flex items-center justify-center h-full text-gray-400">
          <p>Pilih modul dari sidebar untuk mulai belajar.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/index.js'

const route = useRoute()
const router = useRouter()

const courseId = computed(() => route.params.courseId)
const moduleId = computed(() => route.params.moduleId)

const isLoading = ref(true)
const isLoadingModules = ref(true)
const fetchError = ref(false)
const courseTitle = ref('')
const allModules = ref([])
const activeModule = ref(null)

const currentModuleIndex = computed(() =>
  allModules.value.findIndex(m => String(m.id) === String(activeModule.value?.id))
)

const prevModule = computed(() => {
  const idx = currentModuleIndex.value
  return idx > 0 ? allModules.value[idx - 1] : null
})

const nextModule = computed(() => {
  const idx = currentModuleIndex.value
  return idx < allModules.value.length - 1 ? allModules.value[idx + 1] : null
})

const progressPercent = computed(() => {
  const total = allModules.value.length
  if (!total) return 0
  const idx = currentModuleIndex.value
  return Math.round(((idx + 1) / total) * 100)
})

function isHtmlContent(text) {
  return /<[a-z][\s\S]*>/i.test(text)
}

async function fetchAllModules() {

  
  isLoadingModules.value = true
  try {
    const res = await api.get(`/courses/${courseId.value}/modules`)
    const rawModules = res.data.modules || [] 
    
    allModules.value = rawModules.map((mod, idx) => ({
      id: mod.id,
      title: mod.title,
      content: mod.content || '',
      order: mod.order ?? idx + 1,
    }))

  } catch (e) {
    console.error('Gagal fetch modules:', e)
  } finally {
    isLoadingModules.value = false
  }
}

async function fetchLesson() {
  isLoading.value = true
  fetchError.value = false
  
  try {
    const targetId = moduleId.value
    const found = allModules.value.find(m => String(m.id) === String(targetId))

    if (found) {
      activeModule.value = found
    } else if (allModules.value.length > 0 && !targetId) {
      activeModule.value = allModules.value[0]
      router.replace(`/courses/${courseId.value}/lesson/${allModules.value[0].id}`)
    } else {
      fetchError.value = true
    }
  } catch (e) {
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
}

function navigateToModule(mod) {
  router.push(`/courses/${courseId.value}/lesson/${mod.id}`)
}

watch(moduleId, () => fetchLesson())

onMounted(async () => {
  await fetchAllModules()
  await fetchLesson()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E6EFE9;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1dfd6;
}

.prose-lesson :deep(h2) {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1A2E20;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.prose-lesson :deep(p) {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #4B5563;
  margin-bottom: 1.25rem;
}
.prose-lesson :deep(pre) {
  background: #0F172A;
  color: #E2E8F0;
  padding: 1.5rem;
  border-radius: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  margin: 1.5rem 0;
  overflow-x: auto;
}
.prose-lesson :deep(code) {
  background: #F1F5F9;
  color: #EF4444;
  padding: 0.2rem 0.4rem;
  border-radius: 0.4rem;
  font-size: 0.9em;
}
</style>