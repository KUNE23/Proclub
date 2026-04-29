<template>
  <div class="flex flex-col h-full bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <!-- ===== TOP BAR ===== -->
    <header class="h-14 px-6 flex items-center justify-between bg-white border-b border-[#E6EFE9] shrink-0 z-20">
      <div class="flex items-center gap-4">
        <!-- Back to Course -->
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

      <!-- Progress indicator -->
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

    <!-- ===== BODY ===== -->
    <div class="flex flex-1 overflow-hidden">

      <!-- ===== LEFT SIDEBAR ===== -->
      <aside class="w-64 bg-white border-r border-[#E6EFE9] flex flex-col shrink-0 overflow-hidden">
        <!-- Course info -->
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

        <!-- Module List -->
        <nav class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          <!-- Loading skeleton sidebar -->
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
            @click="navigateToModule(mod, index)"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all duration-200"
            :class="[
              mod.id === activeModule?.id
                ? 'bg-[#F2F7F4] text-[#2C7047] font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C7047] cursor-pointer'
            ]"
          >
            <!-- Number -->
            <span class="text-[11px] font-bold w-5 text-right shrink-0"
              :class="mod.id === activeModule?.id ? 'text-[#2C7047]' : 'text-gray-400'">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <!-- Status dot -->
            <div class="shrink-0">
              <div v-if="mod.id === activeModule?.id" class="w-3 h-3 rounded-full bg-[#E87C3E] ring-2 ring-[#E87C3E]/20"></div>
              <div v-else class="w-3 h-3 rounded-full bg-gray-200"></div>
            </div>

            <!-- Title -->
            <span class="truncate">{{ mod.title }}</span>
          </button>
        </nav>
      </aside>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="flex-1 overflow-y-auto relative">

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="animate-pulse p-8 lg:px-16 lg:py-10 max-w-4xl mx-auto space-y-6">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/5"></div>
          <div class="h-32 bg-gray-200 rounded-xl"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-48 bg-gray-200 rounded-xl"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="flex flex-col items-center justify-center h-full text-center p-12">
          <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Gagal memuat materi</h3>
          <p class="text-gray-400 text-sm mb-6">Terjadi kesalahan saat mengambil data dari server.</p>
          <button @click="fetchLesson" class="px-5 py-2.5 bg-[#2C7047] text-white rounded-xl text-sm font-semibold hover:bg-[#235838] transition-colors">
            Coba Lagi
          </button>
        </div>

        <!-- Lesson Content -->
        <div v-else-if="activeModule" class="pb-24">

          <!-- Module Header -->
          <div class="px-8 lg:px-16 pt-10 pb-6 border-b border-[#E6EFE9] max-w-4xl">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-[#2C7047] bg-[#F2F7F4] px-2.5 py-1 rounded-full">
                Modul {{ currentModuleIndex + 1 }}
              </span>
            </div>
            <h1 class="text-2xl lg:text-3xl font-black text-[#1A2E20] leading-tight">
              {{ activeModule.title }}
            </h1>
          </div>

          <!-- Content Body -->
          <div class="px-8 lg:px-16 py-8 max-w-4xl">

            <!-- Empty content fallback -->
            <div v-if="!activeModule.content" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p class="text-gray-400 text-sm">Belum ada konten untuk modul ini.</p>
            </div>

            <!-- Rich content -->
            <div v-else class="prose-lesson">
              <!-- Content rendered as HTML if it contains tags, else plain text -->
              <div
                v-if="isHtmlContent(activeModule.content)"
                class="text-gray-700 text-[15px] leading-relaxed space-y-4"
                v-html="activeModule.content"
              ></div>
              <div v-else class="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                {{ activeModule.content }}
              </div>
            </div>
          </div>

          <!-- ===== PREV / NEXT NAVIGATION ===== -->
          <div class="px-8 lg:px-16 pb-10 max-w-4xl">
            <div class="border-t border-[#E6EFE9] pt-8 flex items-center justify-between gap-4">

              <!-- Previous -->
              <button
                v-if="prevModule"
                @click="navigateToModule(prevModule, currentModuleIndex - 1)"
                class="group flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-[#E6EFE9] hover:border-[#2C7047] hover:bg-[#F2F7F4] transition-all duration-200"
              >
                <svg class="w-4 h-4 text-gray-400 group-hover:text-[#2C7047] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <div class="text-left">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#2C7047]">Sebelumnya</p>
                  <p class="text-sm font-semibold text-[#1A2E20] truncate max-w-[180px]">{{ prevModule.title }}</p>
                </div>
              </button>
              <div v-else></div>

              <!-- Next -->
              <button
                v-if="nextModule"
                @click="navigateToModule(nextModule, currentModuleIndex + 1)"
                class="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#2C7047] hover:bg-[#235838] transition-all duration-200 shadow-lg shadow-[#2C7047]/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div class="text-right">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-[#a8d5bc]">Selanjutnya</p>
                  <p class="text-sm font-semibold text-white truncate max-w-[180px]">{{ nextModule.title }}</p>
                </div>
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- Last module CTA -->
              <router-link
                v-else
                :to="`/courses/${courseId}`"
                class="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#1A2E20] hover:bg-[#0f1c14] transition-all duration-200 shadow-lg"
              >
                <div class="text-right">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selesai!</p>
                  <p class="text-sm font-semibold text-white">Kembali ke Kursus</p>
                </div>
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center h-full text-center p-12">
          <p class="text-gray-400 text-sm">Pilih modul dari sidebar untuk mulai belajar.</p>
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

// Params
const courseId = computed(() => route.params.courseId)
const moduleId = computed(() => route.params.moduleId)

// State
const isLoading = ref(true)
const isLoadingModules = ref(true)
const fetchError = ref(false)
const courseTitle = ref('')
const allModules = ref([])
const activeModule = ref(null)

// ===== Computed =====
const currentModuleIndex = computed(() =>
  allModules.value.findIndex(m => m.id === activeModule.value?.id)
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

// ===== Helpers =====
function isHtmlContent(text) {
  return /<[a-z][\s\S]*>/i.test(text)
}

// ===== Fetch all modules (sidebar) =====
async function fetchAllModules() {
  isLoadingModules.value = true
  try {
    // Try to get course detail including modules
    const res = await api.get(`/courses/${courseId.value}`)
    const data = res.data.data ?? res.data

    courseTitle.value = data.title ?? 'Kursus'

    let rawModules = data.modules ?? data.syllabus ?? []
    if (!Array.isArray(rawModules)) rawModules = []

    if (!rawModules.length) {
      try {
        const modRes = await api.get(`/courses/${courseId.value}/modules`)
        const modData = modRes.data
        if (Array.isArray(modData)) rawModules = modData
        else if (Array.isArray(modData?.data)) rawModules = modData.data
        else if (Array.isArray(modData?.modules)) rawModules = modData.modules
      } catch (e) {
        console.warn('Modules endpoint error:', e.message)
      }
    }

    allModules.value = [...rawModules]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((mod, idx) => ({
        id: mod.id ?? mod._id ?? `mod-${idx}`,
        title: mod.title ?? mod.name ?? `Modul ${idx + 1}`,
        content: mod.content ?? '',
        order: mod.order ?? idx + 1,
      }))

  } catch (e) {
    console.error('Gagal fetch modules:', e)
  } finally {
    isLoadingModules.value = false
  }
}

// ===== Set active lesson from allModules =====
async function fetchLesson() {
  isLoading.value = true
  fetchError.value = false
  try {
    // Wait until allModules is populated (string vs number ID comparison safe)
    const targetId = moduleId.value
    const found = allModules.value.find(
      m => String(m.id) === String(targetId)
    )

    if (found) {
      activeModule.value = found
    } else if (allModules.value.length > 0) {
      // Fallback: first module
      activeModule.value = allModules.value[0]
    }
  } catch (e) {
    console.error('Gagal set lesson:', e)
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
}


// ===== Navigate =====
function navigateToModule(mod, index) {
  router.push(`/courses/${courseId.value}/lesson/${mod.id}`)
}

// ===== Watch route param changes =====
watch(moduleId, () => {
  fetchLesson()
})

// ===== Init =====
onMounted(async () => {
  await fetchAllModules()
  await fetchLesson()
})
</script>

<style scoped>
/* Prose-like styling for HTML content from API */
.prose-lesson :deep(h1),
.prose-lesson :deep(h2),
.prose-lesson :deep(h3) {
  font-weight: 700;
  color: #1A2E20;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.prose-lesson :deep(h1) { font-size: 1.5rem; }
.prose-lesson :deep(h2) { font-size: 1.25rem; }
.prose-lesson :deep(h3) { font-size: 1.1rem; }
.prose-lesson :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
  color: #374151;
}
.prose-lesson :deep(ul),
.prose-lesson :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
}
.prose-lesson :deep(li) { margin-bottom: 0.4rem; }
.prose-lesson :deep(strong) { font-weight: 700; color: #1A2E20; }
.prose-lesson :deep(em) { font-style: italic; }
.prose-lesson :deep(code) {
  background: #1A1A2E;
  color: #C3E88D;
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
  font-size: 0.875rem;
  font-family: monospace;
}
.prose-lesson :deep(pre) {
  background: #1A1A2E;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}
.prose-lesson :deep(blockquote) {
  border-left: 4px solid #2C7047;
  padding-left: 1rem;
  margin-left: 0;
  color: #6b7280;
  background: #F2F7F4;
  padding: 0.75rem 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
  margin-bottom: 1rem;
}
.prose-lesson :deep(a) {
  color: #2C7047;
  text-decoration: underline;
}
.prose-lesson :deep(hr) {
  border: none;
  border-top: 1px solid #E6EFE9;
  margin: 1.5rem 0;
}
.prose-lesson :deep(img) {
  max-width: 100%;
  border-radius: 0.75rem;
  margin: 1rem 0;
}
</style>
