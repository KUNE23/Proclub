<template>
  <div class="p-8 max-w-6xl mx-auto space-y-8">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-[#1A2E20]">Welcome back, Admin</h1>
        <p class="text-gray-500 mt-1.5 text-[15px]">Here's what happened in the Proclub Learning Hub since your last login.</p>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Total Courses</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">{{ statistics.totalCourses }}</h3>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Total Users</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">{{ statistics.totalUsers }}</h3>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
          </div>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Average Progress</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">{{ statistics.averageProgress }} %</h3>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </div>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Total Lessons</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">{{ statistics.totalLessons }}</h3>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-2 bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm flex flex-col">
        <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h3 class="text-lg font-bold text-[#1A2E20]">
        User Engagement & Progress
      </h3>

      <p class="text-sm text-gray-400 mt-1">
        Student completion statistics and engagement
      </p>
    </div>
  </div>

  <div class="space-y-5">
    <div
      v-for="user in userEngagement"
      :key="user.id"
      class="p-4 border border-[#E6EFE9] rounded-2xl"
    >
      <div class="flex items-center justify-between mb-3">
        <div>
          <h4 class="font-bold text-[#1A2E20]">
            {{ user.name }}
          </h4>

          <p class="text-xs text-gray-400 mt-1">
            {{ user.email }}
          </p>
        </div>

        <span class="text-sm font-bold text-[#16A34A]">
          {{ user.percentage }}%
        </span>
      </div>

      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-[#16A34A] rounded-full transition-all duration-700"
          :style="{ width: user.percentage + '%' }"
        ></div>
      </div>

      <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>
          Completed {{ user.completedLessons }} Lessons
        </span>

        <span>
          Total {{ user.totalLessons }} Lessons
        </span>
      </div>
    </div>
  </div>
</div>
        
        <div class="flex-1 min-h-[220px] flex items-end justify-between gap-6 px-2 mt-auto">
    
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[20%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[30%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">MON</span>
          </div>
          
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[15%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[40%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">TUE</span>
          </div>
     
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[40%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[25%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">WED</span>
          </div>
     
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[35%]"></div>
              <div class="w-full bg-[#157134] rounded-b-sm h-[60%] shadow-lg shadow-[#157134]/20"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">THU</span>
          </div>
 
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[10%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[35%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">FRI</span>
          </div>

          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[25%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[35%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">SAT</span>
          </div>
     
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[50%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[35%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">SUN</span>
          </div>
        </div>
      </div>

     <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h3 class="text-lg font-bold text-[#1A2E20]">
        Recent Activities
      </h3>

      <p class="text-sm text-gray-400 mt-1">
        Latest user learning activities
      </p>
    </div>
  </div>

  <div class="space-y-4">
    <div
      v-for="activity in recentActivities"
      :key="activity.id"
      class="flex items-start justify-between gap-4 p-4 border border-[#E6EFE9] rounded-2xl"
    >
      <div>
        <h4 class="font-bold text-[#1A2E20]">
          {{ activity.user }}
        </h4>

        <p class="text-sm text-gray-500 mt-1">
          Completed module
          <span class="font-semibold text-[#16A34A]">
            {{ activity.module }}
          </span>
          in
          <span class="font-semibold">
            {{ activity.course }}
          </span>
        </p>

        <p class="text-xs text-gray-400 mt-2">
          {{ new Date(activity.updatedAt).toLocaleString() }}
        </p>
      </div>

      <div class="text-right shrink-0">
        <span
          class="px-3 py-1 rounded-full text-xs font-bold"
          :class="activity.status === 'COMPLETED'
            ? 'bg-green-100 text-green-600'
            : 'bg-blue-100 text-blue-600'"
        >
          {{ activity.status }}
        </span>

        <p class="text-sm font-bold text-[#16A34A] mt-2">
          {{ activity.score }}%
        </p>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardAnalytics } from '../../services/dashboardService'
import { useToast } from 'vue-toastification'

const toast = useToast()

const statistics = ref({
  totalUsers: 0,
  totalCourses: 0,
  totalModules: 0,
  totalLessons: 0,
  averageProgress: 0
})

const userEngagement = ref([])
const recentActivities = ref([])
const loading = ref(true)

const loadDashboard = async () => {
  try {
    loading.value = true

    const response = await getDashboardAnalytics()

    statistics.value = response.data.data.statistics
    userEngagement.value = response.data.data.engagement
    recentActivities.value = response.data.data.recentActivities
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat dashboard admin')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
