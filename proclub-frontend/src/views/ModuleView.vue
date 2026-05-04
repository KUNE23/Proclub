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
        <div class="p-5 border-b border-[#E6EFE9]">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl bg-[#2C7047] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12 2C8 2 4 5 4 10c0 4.5 3.5 10 8 12 4.5-2 8-7.5 8-12 0-5-4-8-8-10z"></path>
              </svg>
            </div>
            <div class="min-w-0">
              <h2 class="text-sm font-bold text-[#1A2E20] truncate">{{ courseTitle }}</h2>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Course Syllabus</p>
            </div>
          </div>
          <div class="mt-1">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ progressPercent }}% Complete</span>
            </div>
            <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#2C7047] rounded-full transition-all duration-700 ease-out" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <button
            v-for="(module, index) in allModules"
            :key="module.id"
            @click="selectModule(module, index)"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all duration-200 group relative"
            :class="[
              activeModule && module.id === activeModule.id
                ? 'bg-[#F2F7F4] text-[#2C7047] font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C7047] cursor-pointer',
            ]"
          >
            <span class="text-[11px] font-bold w-5 text-right shrink-0"
              :class="activeModule && module.id === activeModule.id ? 'text-[#2C7047]' : 'text-gray-400'">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="truncate">{{ module.title }}</span>
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
                class="bg-[#2C7047] hover:bg-[#235838] text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto shadow-lg shadow-[#2C7047]/25 transition-all duration-200"
              >
                Mark as Complete
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
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
import api from '../api/index.js'

const route = useRoute()
const isLoading = ref(true)
const allModules = ref([])
const activeModule = ref(null)
const courseId = ref(null)
const courseTitle = ref('')
const currentModuleIndex = ref(0)

const progressPercent = computed(() => {
  if (!allModules.value || allModules.value.length === 0) return 0
  return Math.round(((currentModuleIndex.value + 1) / allModules.value.length) * 100)
})

async function fetchData() {
  const id = route.params.courseId;
  courseId.value = id;
  isLoading.value = true;
  
  try {
    const res = await api.get(`/courses/${id}`);
    console.log("Raw Response:", res.data);

    const data = res.data.data || res.data; 
    
    courseTitle.value = data.title || (data.course && data.course.title);

    const rawModules = data.modules || (data.course && data.course.modules);
    allModules.value = Array.isArray(rawModules) ? rawModules : [];

    console.log("Final Modules Value:", allModules.value);

    if (allModules.value.length > 0) {
      const moduleIdFromUrl = route.params.moduleId;
      const foundIndex = allModules.value.findIndex(m => m.id == moduleIdFromUrl);
      const targetIndex = foundIndex !== -1 ? foundIndex : 0;
      
      activeModule.value = allModules.value[targetIndex];
      currentModuleIndex.value = targetIndex;
    }
  } catch (error) {
    console.error("Gagal memuat data:", error);
  } finally {
    isLoading.value = false;
  }
}
function selectModule(module, index) {
  activeModule.value = module
  currentModuleIndex.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchData()
})
</script>