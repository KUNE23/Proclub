<template>
  <div class="bg-[#FAFCFB] min-h-screen font-sans antialiased text-gray-800">
    <div class="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
      
      <div v-if="isLoading" class="animate-pulse space-y-8">
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 bg-gray-200 rounded-2xl"></div>
          <div class="space-y-3 flex-1">
            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div class="h-32 bg-gray-200 rounded-2xl w-full"></div>
        <div class="space-y-4">
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
          <div class="h-24 bg-gray-200 rounded-2xl w-full" v-for="n in 3" :key="n"></div>
        </div>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-2xl bg-[#0A733F] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#0A733F]/20 shrink-0">
              {{ initials }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-[#1A2E20]">{{ user.name || 'User' }}</h1>
              <div class="flex items-center gap-3 mt-1.5">
                <span class="px-2.5 py-0.5 bg-[#F0FDF4] text-[#16A34A] text-[11px] font-bold rounded-full border border-[#16A34A]/20 uppercase tracking-wide">
                  {{ user.role || 'Member' }}
                </span>
                <span class="text-gray-400 text-sm font-medium">{{ user.email }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <button class="flex-1 md:flex-none px-6 py-2.5 bg-white border border-[#E6EFE9] text-[#1A2E20] rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center shrink-0 text-[#16A34A]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <div>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Enrolled Courses</p>
              <h3 class="text-2xl font-bold text-[#1A2E20]">{{ activeCourses.length }}</h3>
            </div>
          </div>
          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center shrink-0 text-orange-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"></path></svg>
            </div>
            <div>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Learning Progress</p>
              <h3 class="text-2xl font-bold text-[#1A2E20]">65% <span class="text-xs font-normal text-gray-400 ml-1">Avg.</span></h3>
            </div>
          </div>
        </div>

        <!-- Course List -->
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-[#E6EFE9] pb-4">
            <h2 class="text-xl font-bold text-[#1A2E20]">Ongoing Courses</h2>
            <router-link to="/courses-catalog" class="text-sm font-bold text-[#0A733F] hover:underline">Explore More</router-link>
          </div>

          <div v-if="activeCourses.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p class="text-gray-400">You haven't enrolled in any courses yet.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4">
            <router-link
              v-for="course in activeCourses"
              :key="course.id"
              :to="`/courses/${course.id}`"
              class="group bg-white rounded-2xl border border-[#E6EFE9] p-5 shadow-sm hover:shadow-md hover:border-[#0A733F]/30 transition-all flex items-center gap-5"
            >
              <img :src="course.image" :alt="course.title" class="w-20 h-20 rounded-xl object-cover border border-[#E6EFE9] shrink-0" />
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-[#1A2E20] group-hover:text-[#0A733F] transition-colors truncate">{{ course.title }}</h4>
                <div class="flex items-center justify-between mt-2 mb-2">
                  <span class="text-[12px] text-gray-500 font-medium">{{ course.lessonsCompleted }} of {{ course.totalLessons }} lessons completed</span>
                  <span class="text-[12px] font-bold text-[#0A733F]">{{ course.progress }}%</span>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-[#0A733F] rounded-full transition-all duration-700" :style="{ width: course.progress + '%' }"></div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'

const isLoading = ref(true)
const user = ref({ name: '', email: '', role: '' })

const initials = computed(() => {
  if (!user.value.name) return 'U'
  const parts = user.value.name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})

const activeCourses = ref([
  {
    id: 1,
    title: 'Advanced UI Design Principles',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=256&q=80',
    progress: 65,
    lessonsCompleted: 16,
    totalLessons: 24,
  }
])

const loadUser = async () => {
  try {
    const raw = localStorage.getItem('user')
    if (raw && raw !== 'undefined') {
      user.value = JSON.parse(raw)
    }
    
    // Attempt to get fresh profile data
    const res = await api.get('/profile').catch(() => null)
    if (res?.data) {
      user.value = { ...user.value, ...res.data }
    }
  } catch (err) {
    console.error('Failed to load user data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>
