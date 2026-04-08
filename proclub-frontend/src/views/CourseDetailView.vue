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

        <!-- Loaded Content -->
        <div v-else class="mx-auto px-5 md:px-0 py-5">

          <!-- Hero Banner -->
          <div class="relative w-full h-80 overflow-hidden rounded-4xl">
            <img :src="course.coverImage" :alt="course.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#1A2E20]/90 via-[#1A2E20]/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8 lg:px-12 lg:pb-10">
              <div class="max-w-7xl mx-auto">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2C7047] text-white text-[11px] font-bold rounded-full uppercase tracking-wider mb-4">
                  <span class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                  {{ course.badge }}
                </span>
                <h1 class="text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                  {{ course.title.split(' ').slice(0, -1).join(' ') }}
                  <span class="text-[#6FCF97]">{{ course.title.split(' ').slice(-1)[0] }}</span>
                </h1>
                <p class="text-gray-300 text-sm leading-relaxed max-w-2xl mt-3">{{ course.description }}</p>
                <div class="flex items-center gap-5 mt-6">
                  <button class="bg-[#2C7047] hover:bg-[#235838] text-white px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2C7047]/30 transition-colors uppercase tracking-wider">
                    Continue Learning
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                  </button>
                  <div class="text-white">
                    <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Progress</div>
                    <div class="flex items-center gap-3">
                      <div class="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div class="h-full bg-[#2C7047] rounded-full transition-all duration-500" :style="{ width: course.progress + '%' }"></div>
                      </div>
                      <span class="text-[#6FCF97] font-bold text-sm">{{ course.progress }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Body: Syllabus + Insights -->
          <div class="mx-auto p-4 lg:px-12 lg:py-10 py-5">
            <div class="flex flex-col lg:flex-row gap-8">

              <!-- LEFT: Course Syllabus (scrollable) -->
              <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold text-[#1A2E20] mb-6">Course Syllabus</h2>

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

                    <!-- Lessons (expandable for non-locked) -->
                    <div v-if="!mod.is_locked && expandedModules.includes(mod.id)" class="border-t border-[#E6EFE9] px-6 pb-4">
                      <div
                        v-for="lesson in mod.lessons"
                        :key="lesson.id"
                        class="flex items-center gap-3 py-3 border-b border-[#E6EFE9]/50 last:border-b-0 group cursor-pointer"
                        :class="lesson.playing ? 'text-[#2C7047]' : 'text-gray-600 hover:text-[#2C7047]'"
                      >
                        <!-- Lesson Icon -->
                        <div v-if="lesson.playing" class="w-5 flex items-center justify-center shrink-0">
                          <span class="w-2 h-2 bg-[#2C7047] rounded-full animate-pulse"></span>
                        </div>
                        <div v-else class="w-5 flex items-center justify-center shrink-0">
                          <svg v-if="lesson.type === 'video'" class="w-4 h-4 text-gray-400 group-hover:text-[#2C7047] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <svg v-else-if="lesson.type === 'quiz'" class="w-4 h-4 text-gray-400 group-hover:text-[#2C7047] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <svg v-else class="w-4 h-4 text-gray-400 group-hover:text-[#2C7047] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>

                        <span class="text-sm flex-1">{{ lesson.title }}</span>
                        <span class="text-xs font-medium shrink-0"
                          :class="lesson.playing ? 'text-[#2C7047] font-bold' : 'text-gray-400'">
                          {{ lesson.playing ? 'Playing' : lesson.duration }}
                        </span>
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

                  <!-- Mentor -->
                  <div class="border-t border-[#E6EFE9] mt-6 pt-5">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Mentor</p>
                    <div class="flex items-center gap-3">
                      <img :src="mentor.avatar" :alt="mentor.name" class="w-10 h-10 rounded-full object-cover border border-[#E6EFE9]" />
                      <div>
                        <div class="font-bold text-sm text-[#1A2E20]">{{ mentor.name }}</div>
                        <div class="text-xs text-gray-400">{{ mentor.role }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Download -->
                  <button class="mt-5 w-full py-2.5 border-2 border-[#1A2E20] text-[#1A2E20] rounded-xl text-[13px] font-bold hover:bg-[#1A2E20] hover:text-white transition-all duration-200 uppercase tracking-wider">
                    Download Course Guide
                  </button>
                </div>

                <!-- Master Class Plus Card -->
                <div class="bg-[#1A2E20] rounded-2xl p-6 text-white shadow-lg">
                  <h3 class="font-bold text-base mb-2">Master Class Plus</h3>
                  <p class="text-gray-400 text-sm leading-relaxed mb-5">
                    Join live workshop sessions with {{ mentor.name }} and get direct feedback on your atelier projects.
                  </p>
                  <router-link to="/atelier" class="text-[#6FCF97] font-bold text-sm flex items-center gap-1 hover:underline uppercase tracking-wider">
                    Upgrade Path
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7v10"></path></svg>
                  </router-link>
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
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const expandedModules = ref([])

// Toggle lesson expansion
const toggleModule = (id) => {
  const idx = expandedModules.value.indexOf(id)
  if (idx > -1) expandedModules.value.splice(idx, 1)
  else expandedModules.value.push(id)
}

// Course Data
const course = ref({
  id: 'adv-ui-design',
  title: 'Advanced UI Design Principles.',
  badge: 'Professional Certification',
  description: 'Master the art of organic precision. Learn to compose interfaces that breathe, using tonal layering, vertical rhythm, and editorial typography to create high-end botanical digital experiences.',
  progress: 40,
  coverImage: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80',
})

// Modules Data with lesson details, lock & status
const modules = ref([
  {
    id: 'mod-1',
    title: 'Foundations of The Botanical Atelier',
    status: 'completed', // 'completed' | 'current' | 'locked'
    is_locked: false,
    lessons: [
      { id: 'l-1-1', title: '1.1 Introduction to Organic Precision', duration: '12:45', type: 'video', playing: false },
      { id: 'l-1-2', title: '1.2 History of Editorial Web Design', duration: '08:20', type: 'video', playing: false },
    ]
  },
  {
    id: 'mod-2',
    title: 'Tonal Layering & The No-Line Rule',
    status: 'current',
    is_locked: false,
    lessons: [
      { id: 'l-2-1', title: '2.1 Structural Boundaries Without Borders', duration: '', type: 'video', playing: true },
      { id: 'l-2-2', title: '2.2 Vertical Rhythm & Spacing Scale', duration: '15:10', type: 'video', playing: false },
      { id: 'l-2-3', title: 'Module 2 Knowledge Check', duration: '5 Questions', type: 'quiz', playing: false },
    ]
  },
  {
    id: 'mod-3',
    title: 'Editorial Typography & Visual Vistas',
    status: 'locked',
    is_locked: true,
    lessons: []
  },
  {
    id: 'mod-4',
    title: 'Interactive Textures & Soulful UI',
    status: 'locked',
    is_locked: true,
    lessons: []
  },
])

// Course Insights
const courseInsights = ref([
  { label: 'Duration', value: '12h 45m', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
  { label: 'Lessons', value: '24 Sessions', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
  { label: 'Difficulty', value: 'Advanced', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>' },
  { label: 'Certificate', value: 'Included', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>' },
])

// Mentor
const mentor = ref({
  name: 'Elena Sterling',
  role: 'Design Director, Proclub',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
})

onMounted(() => {
  // Auto-expand non-locked modules
  expandedModules.value = modules.value.filter(m => !m.is_locked).map(m => m.id)
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
