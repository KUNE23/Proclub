<template>
  <div class="flex bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <!-- ===== MAIN AREA ===== -->
    <div class="flex-1 flex flex-col">

      <!-- Scrollable Main Content -->
      <div class="flex-1">

        <!-- Loading State -->
        <div v-if="isLoading" class="animate-pulse p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
          <div class="h-72 bg-gray-200 rounded-3xl"></div>
          <div class="flex gap-8">
            <div class="flex-1 space-y-4">
              <div class="h-8 bg-gray-200 rounded w-1/3"></div>
              <div class="h-32 bg-gray-200 rounded-2xl"></div>
              <div class="h-32 bg-gray-200 rounded-2xl"></div>
              <div class="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
            <div class="w-72 space-y-4">
              <div class="h-64 bg-gray-200 rounded-2xl"></div>
              <div class="h-48 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>

        <!-- Error Banner -->
        <div v-if="fetchError && !isLoading" class="mx-auto px-5 md:px-0 py-5">
          <div class="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Gagal memuat detail kursus. <button @click="fetchCourseDetail" class="underline font-medium">Coba lagi</button></span>
          </div>
        </div>

        <!-- Loaded Content -->
        <div v-else-if="!isLoading" class="mx-auto px-5 md:px-0 py-5">

            <!-- Page Header -->
          <div class="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 class="text-3xl lg:text-4xl font-black text-[#1A2E20] leading-tight">Materi & Modul Pembelajaran</h2>
              <p class="text-gray-500 text-sm mt-3 max-w-xl leading-relaxed">
                Pelajari setiap modul yang telah disusun secara terstruktur untuk membantu kamu menguasai materi dari dasar hingga lanjutan.
              </p>
            </div>
          </div>

          <!-- Body: Syllabus + Insights -->
          <div class="mx-auto p-4 lg:px-12 lg:py-10 py-5">
            <div class="flex flex-col lg:flex-row gap-8">

              <!-- LEFT: Course Syllabus (scrollable) -->
              <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold text-[#1A2E20] mb-6">Silabus Materi</h2>

                <div class="space-y-5">
                  <div
                    v-for="(mod, modIndex) in modules"
                    :key="mod.id"
                    class="rounded-2xl border transition-all duration-300"
                    :class="mod.status === 'current'
                      ? 'border-[#2C7047] bg-white shadow-md shadow-[#2C7047]/5'
                      : mod.status === 'completed'
                        ? 'border-[#E6EFE9] bg-white'
                        : 'border-[#E6EFE9] bg-[#FAFCFB] opacity-70'"
                  >
                    <!-- Module Header -->
                    <div class="px-6 py-5 flex items-start gap-4 cursor-pointer" @click="!mod.is_locked && toggleModule(mod.id)">
                      <!-- Status Icon -->
                      <div class="mt-0.5 shrink-0">
                        <div v-if="mod.status === 'completed'" class="w-8 h-8 rounded-full bg-[#2C7047] flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        </div>
                        <div v-else-if="mod.status === 'current'" class="w-8 h-8 rounded-full bg-[#2C7047]/10 border-2 border-[#2C7047] flex items-center justify-center">
                          <svg class="w-4 h-4 text-[#2C7047]" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                        </div>
                        <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                        </div>
                      </div>

                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-[10px] font-bold uppercase tracking-wider"
                            :class="mod.status === 'current' ? 'text-[#2C7047]' : 'text-gray-400'">
                            Module {{ String(modIndex + 1).padStart(2, '0') }}
                            <span v-if="mod.status === 'current'" class="text-[#2C7047]"> · In Progress</span>
                          </span>
                        </div>
                        <h3 class="font-bold text-[#1A2E20] text-[15px] leading-snug">{{ mod.title }}</h3>
                      </div>

                      <!-- Right side label -->
                      <div class="shrink-0 pt-3">
                        <span v-if="mod.status === 'completed'" class="text-xs text-gray-400 font-medium">Completed</span>
                        <router-link v-else-if="mod.status === 'current'" :to="`/courses/${course.id}`" class="text-xs text-[#2C7047] font-bold hover:underline flex items-center gap-1">
                          Resume <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </router-link>  
                        <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                      </div>
                    </div>

                    <!-- Module Content (expandable) -->
                    <div v-if="expandedModules.includes(mod.id)" class="border-t border-[#E6EFE9] px-6 py-4">
                      <div class="flex items-start gap-3">
                        <div class="mt-0.5 shrink-0">
                          <svg class="w-4 h-4 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed">{{ mod.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT SIDEBAR: Course Insights -->
              <div class="w-full lg:w-72 shrink-0 space-y-6">

                <!-- Course Insights Card -->
                <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                  <h3 class="font-bold text-[#1A2E20] text-base mb-5">Course Insights</h3>
                  <div class="space-y-4">
                    <div v-for="insight in courseInsights" :key="insight.label" class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div v-html="insight.icon" class="w-5 h-5 text-[#2C7047]"></div>
                        <span class="text-sm text-gray-500">{{ insight.label }}</span>
                      </div>
                      <span class="text-sm font-bold text-[#1A2E20]">{{ insight.value }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/index.js'

const route = useRoute()
const isLoading = ref(true)
const fetchError = ref(false)
const expandedModules = ref([])

// Toggle lesson expansion
const toggleModule = (id) => {
  const idx = expandedModules.value.indexOf(id)
  if (idx > -1) expandedModules.value.splice(idx, 1)
  else expandedModules.value.push(id)
}

// Course Data
const course = ref({
  id: '',
  title: '',
  badge: '',
  description: '',
  progress: 0,
  coverImage: '',
})

// Modules Data
const modules = ref([])

// Mentor
const mentor = ref({
  name: '-',
  role: '-',
  avatar: '',
})

// Course Insights (derived from API data)
const courseInsights = computed(() => [
  {
    label: 'Estimate Duration',
    value: course.value.duration || '-',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
  },
  {
    label: 'Modules',
    value: course.value.total_lessons ? `${course.value.total_lessons} Modules` : `${modules.value.length} Modules`,
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
  },
  {
    label: 'Difficulty',
    value: course.value.level || course.value.difficulty || '-',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>'
  },
  {
    label: 'Certificate',
    value: course.value.has_certificate ? 'Included' : '-',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
  },
])

// Map module status from API (API tidak kirim status/locked, default 'current')
const mapModuleStatus = (mod) => {
  if (mod.is_locked ?? mod.locked) return 'locked'
  if (mod.status) return mod.status
  return 'current'
}

const fetchCourseDetail = async () => {
  isLoading.value = true
  fetchError.value = false
  try {
    const id = route.params.id
    const response = await api.get(`/courses/${id}`)
    const data = response.data.data ?? response.data

    // Map course fields
    course.value = {
      id: data.id ?? data._id ?? id,
      title: data.title ?? '',
      badge: data.badge ?? data.category?.cat_name ?? data.category ?? 'Course',
      description: data.description ?? '',
      progress: data.progress ?? data.user_progress ?? 0,
      coverImage: data.image ? `http://localhost:3000/${data.image}` : data.coverImage ?? '',
      duration: data.duration ?? '',
      total_lessons: data.total_lessons ?? null,
      level: data.level ?? data.difficulty ?? '',
      has_certificate: data.has_certificate ?? true,
    }

    // Map mentor fields
    if (data.mentor || data.instructor) {
      const m = data.mentor ?? data.instructor
      mentor.value = {
        name: m.name ?? m.username ?? '-',
        role: m.role ?? m.title ?? 'Mentor, Proclub',
        avatar: m.avatar ? `http://localhost:3000/${m.avatar}` : (m.profile_picture ? `http://localhost:3000/${m.profile_picture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name ?? 'M')}&background=2C7047&color=fff`),
      }
    }

    // Fetch modules dari endpoint terpisah
    let rawModules = data.modules ?? data.syllabus ?? []

    // Pastikan rawModules adalah array
    if (!Array.isArray(rawModules)) {
      rawModules = rawModules ? [rawModules] : []
    }

    if (!rawModules.length) {
      try {
        const modRes = await api.get(`/courses/${id}/modules`)
        const modData = modRes.data

        // Handle berbagai shape response: array langsung, .data, .modules
        if (Array.isArray(modData)) {
          rawModules = modData
        } else if (Array.isArray(modData?.data)) {
          rawModules = modData.data
        } else if (Array.isArray(modData?.modules)) {
          rawModules = modData.modules
        } else {
          rawModules = []
        }
      } catch (e) {
        console.warn('Endpoint /modules tidak tersedia atau kosong:', e.message)
        rawModules = []
      }
    }

    // Sesuaikan dengan struktur API: { id, title, content, order, courseId }
    modules.value = [...rawModules]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((mod, idx) => ({
        id: mod.id ?? mod._id ?? `mod-${idx}`,
        title: mod.title ?? mod.name ?? `Module ${idx + 1}`,
        content: mod.content ?? '',
        order: mod.order ?? idx + 1,
        courseId: mod.courseId ?? mod.course_id ?? id,
        status: mapModuleStatus(mod),
        is_locked: mod.is_locked ?? mod.locked ?? false,
      }))

    // Auto-expand semua module (tidak ada is_locked dari API)
    expandedModules.value = modules.value.map(m => m.id)
  } catch (error) {
    console.error('Gagal mengambil detail kursus:', error)
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCourseDetail()
})
</script>
