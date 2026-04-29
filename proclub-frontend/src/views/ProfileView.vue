<template>
  <div class="flex \ bg-[#F5F6F8] font-sans antialiased text-gray-800">

    <!-- ===== MAIN AREA ===== -->
    <div class="flex-1 flex flex-col">

      <!-- Scrollable Content -->
      <div class="flex-1">

        <!-- Loading -->
        <div v-if="isLoading" class="animate-pulse max-w-5xl mx-auto p-8 lg:p-12 space-y-8">
          <div class="flex items-center gap-6"><div class="w-28 h-28 bg-gray-200 rounded-2xl"></div><div class="space-y-3 flex-1"><div class="h-10 bg-gray-200 rounded w-1/3"></div><div class="h-5 bg-gray-200 rounded w-1/4"></div></div></div>
          <div class="flex gap-6"><div class="flex-1 h-36 bg-gray-200 rounded-2xl"></div><div class="w-64 h-36 bg-gray-200 rounded-2xl"></div></div>
          <div class="grid grid-cols-3 gap-6"><div class="h-28 bg-gray-200 rounded-2xl"></div><div class="h-28 bg-gray-200 rounded-2xl"></div><div class="h-28 bg-gray-200 rounded-2xl"></div></div>
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
          <div class="grid grid-cols-5 gap-4"><div class="h-36 bg-gray-200 rounded-2xl" v-for="n in 5" :key="n"></div></div>
        </div>

        <!-- Loaded -->
        <div v-else class="mx-auto px-5 md:px-0 py-5">

          <!-- ===== PROFILE HEADER ===== -->
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div class="flex items-center gap-5">
              <!-- Avatar -->
              <div class="relative shrink-0">
                <img :src="user.avatar_url" :alt="user.name" class="w-28 h-28 rounded-2xl object-cover border-4 border-[#2C7047]/20 shadow-lg" />
                <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2C7047] flex items-center justify-center border-3 border-white shadow-md">
                  <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
              </div>
              <!-- Info -->
              <div>
                <h1 class="text-3xl font-black text-[#1A2E20] leading-tight">{{ user.name }}</h1>
                <div class="flex items-center gap-3 mt-2">
                  <span class="px-3 py-1 bg-[#F2F7F4] text-[#2C7047] text-[10px] font-bold rounded-md border border-[#2C7047]/20 uppercase tracking-wider">{{ user.level_title }}</span>
                  <span class="flex items-center gap-1 text-sm text-gray-500 font-medium">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    {{ user.current_xp.toLocaleString() }} XP
                  </span>
                </div>
              </div>
            </div>
            <!-- Actions -->
            <div class="flex items-center gap-3 shrink-0">
              <button class="px-5 py-2.5 border-2 border-[#1A2E20] text-[#1A2E20] rounded-xl text-sm font-bold hover:bg-[#1A2E20] hover:text-white transition-all">
                Edit Profile
              </button>
              <button class="px-5 py-2.5 bg-[#2C7047] hover:bg-[#235838] text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-[#2C7047]/20">
                Share Portfolio
              </button>
            </div>
          </div>

          <!-- ===== LEVEL PROGRESS + STREAK ===== -->
          <div class="flex flex-col lg:flex-row gap-6 mb-8">
            <!-- Level Progress -->
            <div class="flex-1 bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Growth Journey</p>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-[#1A2E20]">Level {{ user.level }} Progress</h3>
                <span class="text-sm italic text-[#2C7047] font-medium">{{ user.next_level_xp - user.current_xp_in_level }} XP to next level</span>
              </div>
              <div class="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div class="h-full bg-[#2C7047] rounded-full transition-all duration-700 ease-out" :style="{ width: levelProgress + '%' }"></div>
              </div>
              <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <span>Level {{ user.level }}</span>
                <span>Level {{ user.level + 1 }}</span>
              </div>
            </div>

            <!-- Activity Streak -->
            <div class="w-full lg:w-72 shrink-0 bg-[#2C7047] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <!-- Decorative leaf -->
              <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
              <div class="absolute top-4 right-6 w-16 h-16 bg-white/5 rounded-full"></div>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-green-200 mb-2">Activity Streak</p>
              <div class="text-4xl font-black leading-tight mb-3">{{ streak.days }} Days</div>
              <div class="flex items-center gap-2 text-green-200 text-xs">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
                {{ streak.message }}
              </div>
            </div>
          </div>

          <!-- ===== STATS ROW ===== -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-[#F2F7F4] flex items-center justify-center shrink-0" v-html="stat.icon"></div>
              <div>
                <div class="text-3xl font-black text-[#1A2E20]">{{ stat.value }}</div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- ===== ACHIEVEMENT GALLERY ===== -->
          <div class="mb-12">
            <div class="flex items-center gap-4 mb-8">
              <h2 class="text-xl font-bold text-[#1A2E20]">Achievement Gallery</h2>
              <div class="flex-1 h-px bg-[#E6EFE9]"></div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              <div
                v-for="badge in badges"
                :key="badge.name"
                class="bg-white rounded-2xl border p-5 text-center transition-all duration-300 group"
                :class="badge.earned
                  ? 'border-[#2C7047]/20 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                  : 'border-[#E6EFE9] opacity-50 grayscale'"
              >
                <div
                  class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl"
                  :class="badge.earned ? 'bg-[#F2F7F4] border border-[#2C7047]/20' : 'bg-gray-100 border border-gray-200'"
                >
                  <div v-html="badge.icon" class="w-8 h-8" :class="badge.earned ? 'text-[#2C7047]' : 'text-gray-400'"></div>
                </div>
                <h4 class="text-sm font-bold text-[#1A2E20] leading-tight">{{ badge.name }}</h4>
                <p v-if="!badge.earned && badge.requirement" class="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-1">{{ badge.requirement }}</p>
              </div>
            </div>
          </div>

          <!-- ===== ACTIVE COURSES ===== -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-[#1A2E20]">Active Courses</h2>
              <router-link to="/courses-catalog" class="text-sm font-bold text-[#2C7047] hover:underline flex items-center gap-1">
                View All <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </router-link>
            </div>

            <div class="space-y-4">
              <router-link
                v-for="course in activeCourses"
                :key="course.id"
                :to="`/courses/${course.id}`"
                class="block bg-white rounded-2xl border border-[#E6EFE9] p-5 shadow-sm hover:shadow-md hover:border-[#2C7047]/30 transition-all duration-200 group"
              >
                <div class="flex items-center gap-5">
                  <img :src="course.image" :alt="course.title" class="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E6EFE9]" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="font-bold text-[#1A2E20] text-sm truncate group-hover:text-[#2C7047] transition-colors">{{ course.title }}</h4>
                      <span class="text-sm font-bold text-[#2C7047] shrink-0 ml-2">{{ course.progress }}%</span>
                    </div>
                    <p class="text-xs text-gray-400 mb-2">{{ course.lessonsCompleted }} of {{ course.totalLessons }} lessons completed</p>
                    <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-[#2C7047] rounded-full transition-all duration-500" :style="{ width: course.progress + '%' }"></div>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'

const isLoading = ref(true)
const UserName = ref('');
const UserEmail = ref('');
const UserRole   = ref('');

const fetchUserName = async () => {
  try {
    const response = await api.get('/profile')
    UserName.value = response.data.name
    UserEmail.value = response.data.email
    UserRole.value = response.data.role
  } catch (error) {
    console.error('Error fetching user name:', error)
  }
}

// ===== User Data =====
const user = ref({
  name: UserName,
  email: UserEmail,
  avatar_url: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=256&q=80',
  level: 14,
  level_title: 'Code Architect',
  current_xp: 12450,
  current_xp_in_level: 650,
  next_level_xp: 1500,
})

const levelProgress = computed(() => Math.round((user.value.current_xp_in_level / user.value.next_level_xp) * 100))

// ===== Streak =====
const streak = ref({
  days: 15,
  message: 'Consistently learning for 2 weeks!',
})

// ===== Stats =====
const stats = ref([
  { value: '12', label: 'Courses Completed', icon: '<svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>' },
  { value: '94%', label: 'Average Score', icon: '<svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>' },
  { value: 'Top 5%', label: 'Global Ranking', icon: '<svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>' },
])

// ===== Badges =====
const badges = ref([
  { name: 'Quiz Master', earned: true, requirement: '', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>' },
  { name: 'Project Finisher', earned: true, requirement: '', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>' },
  { name: 'Early Bird', earned: true, requirement: '', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' },
  { name: 'First Code', earned: true, requirement: '', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>' },
  { name: 'Community Helper', earned: true, requirement: '', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
  { name: 'Course Marathoner', earned: false, requirement: '3 Courses in 24h', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>' },
  { name: 'Master Architect', earned: false, requirement: 'Reach Level 25', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>' },
  { name: 'Mentor', earned: false, requirement: 'Help 10 Students', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' },
  { name: 'Legacy Builder', earned: false, requirement: '1 Year Membership', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' },
  { name: 'Pixel Perfect', earned: false, requirement: 'Submit UI Challenge', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>' },
])

// ===== Active Courses =====
const activeCourses = ref([
  {
    id: 'adv-ui-design',
    title: 'Advanced UI Design Principles',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=128&q=80',
    progress: 65,
    lessonsCompleted: 16,
    totalLessons: 24,
  },
  {
    id: 2,
    title: 'Architectural React Components',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=128&q=80',
    progress: 40,
    lessonsCompleted: 10,
    totalLessons: 24,
  },
  {
    id: 4,
    title: 'Macro Botanical Composition',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=128&q=80',
    progress: 15,
    lessonsCompleted: 2,
    totalLessons: 8,
  },
])

onMounted(() => {
  fetchUserName();
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>
