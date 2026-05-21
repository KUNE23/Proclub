<template>
  <div class="bg-[#FAFAFA] font-sans antialiased text-gray-800">
    <main class="flex-1 flex flex-col overflow-hidden bg-[#FAFCFB]">

      <div v-if="isLoading" class="animate-pulse space-y-10 max-w-6xl mx-auto p-5">
        <div class="h-10 bg-gray-200 rounded w-1/3"></div>
        <div class="h-64 bg-gray-200 rounded-3xl w-full"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="h-28 bg-gray-200 rounded-2xl"></div>
          <div class="h-28 bg-gray-200 rounded-2xl"></div>
          <div class="h-28 bg-gray-200 rounded-2xl"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="n in 3"
            :key="n"
            class="h-64 bg-gray-200 rounded-2xl"
          ></div>
        </div>
      </div>

      <div v-else class="max-w-6xl mx-auto px-5 md:px-0 py-5">

        <div class="mb-10">
          <h2 class="text-3xl font-bold text-gray-800 tracking-tight">
            Welcome back,
            <span class="text-[#2C7047]">{{ user.name }}</span>!
          </h2>

          <p class="text-gray-500 mt-2 text-sm md:text-base">
            Perjalanan belajarmu terus berkembang. Berikut adalah progres
            belajarmu saat ini.
          </p>
        </div>

        <div
          v-if="featuredCourse"
          class="bg-white rounded-[2rem] border border-[#E6EFE9] flex flex-col md:flex-row overflow-hidden mb-10 shadow-sm"
        >

          <div
            class="w-full md:w-1/2 bg-[#F8F9FA] relative min-h-[250px] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#E6EFE9]"
          >
            <div
              class="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-gray-900/5"
            >


              <div
                class="absolute inset-0 bg-black/40 flex items-center justify-center flex-col text-white"
              >
                <div class="font-bold text-lg md:text-xl">
                  {{ featuredCourse.title }}
                </div>

                <div
                  class="text-xs font-medium text-gray-200 uppercase tracking-wider"
                >
                  Course
                </div>
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/2 p-10 flex flex-col justify-center">

            <div class="flex items-center gap-3 mb-4">
              <span
                class="px-3 py-1 bg-[#D1E6DA] text-[#2C7047] text-xs font-bold rounded-full uppercase tracking-wide"
              >
                Ongoing
              </span>

              <span class="text-xs text-gray-400 font-medium">
                Best Progress
              </span>
            </div>

            <h3
              class="text-2xl font-bold text-[#1A2E20] mb-3 leading-tight"
            >
              {{ featuredCourse.title }}
            </h3>

            <p class="text-gray-500 text-sm leading-relaxed mb-8">
              {{ featuredCourse.description }}
            </p>

            <div class="mb-8">
              <div
                class="flex justify-between text-sm font-bold text-gray-600 mb-2"
              >
                <span>Course Progress</span>

                <span class="text-[#2C7047]">
                  {{ featuredCourse.percentage }}%
                </span>
              </div>

              <div
                class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-[#2C7047] rounded-full transition-all duration-700"
                  :style="{ width: featuredCourse.percentage + '%' }"
                ></div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <router-link
                :to="`/courses/${featuredCourse.id}`"
                class="bg-[#2C7047] hover:bg-[#235838] transition-colors text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md shadow-[#2C7047]/20"
              >
                Continue Lesson

                <svg
                  class="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </router-link>

              <router-link
                :to="`/courses/${featuredCourse.id}`"
                class="text-[#2C7047] hover:bg-[#F2F7F4] transition-colors px-6 py-3 rounded-lg text-sm font-medium"
              >
                View Curriculum
              </router-link>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            class="bg-white border border-[#E6EFE9] rounded-2xl p-6 flex flex-col justify-between shadow-sm shadow-[#E6EFE9]/30"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-[#F2F7F4] flex items-center justify-center shrink-0"
                v-html="stat.icon"
              ></div>

              <div>
                <h4
                  class="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase"
                >
                  {{ stat.label }}
                </h4>

                <div class="text-3xl font-black text-[#1A2E20]">
                  {{ stat.value }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-end justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-[#1A2E20]">
                Recommended for You
              </h3>

              <p class="text-sm text-gray-500 mt-1">
                Curated courses to continue your learning journey.
              </p>
            </div>

            <router-link
              to="/courses-catalog"
              class="text-sm font-bold text-[#2C7047] hover:underline flex items-center gap-1"
            >
              See all courses

              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </router-link>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="course in recommendedCourses"
              :key="course.id"
              class="bg-white rounded-[1.5rem] border border-[#E6EFE9] overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >

              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-800 text-lg mb-2 leading-tight">
                    {{ course.title }}
                  </h4>

                  <p class="text-gray-500 text-sm leading-relaxed mb-6">
                    {{ course.description }}
                  </p>
                </div>

                <router-link
                  :to="`/courses/${course.id}`"
                  class="w-full bg-[#F5F8F6] hover:bg-[#E6EFE9] text-[#2C7047] text-sm font-bold py-3 rounded-xl transition-colors text-center"
                >
                  Learn More
                </router-link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { getMemberDashboard } from '../services/dashboardService'
import api from '../api/index.js'

const toast = useToast()

const isLoading = ref(true)

const user = ref({
  name: ''
})

const featuredCourse = ref(null)

const recommendedCourses = ref([])

const stats = ref([])

const loadDashboard = async () => {
  try {
    isLoading.value = true

    const response = await getMemberDashboard()
    const coursesResponse = await api.get('/courses')

    const data = response.data?.data || response.data

    user.value = data.user

    featuredCourse.value = data.featuredCourse

    recommendedCourses.value = coursesResponse.data?.data || []

    stats.value = [
      {
        label: 'COURSES IN PROGRESS',
        value: data.statistics.totalCoursesInProgress,
        icon: `
          <svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2">
            </path>
          </svg>
        `
      },

      {
        label: 'COMPLETED LESSONS',
        value: data.statistics.totalCompletedLessons || 0,
        icon: `
          <svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4">
            </path>
          </svg>
        `
      },

      {
        label: 'AVG QUIZ SCORE',
        value: data.statistics.avgQuizScore + '%',
        icon: `
          <svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">
            </path>
          </svg>
        `
      }
    ]
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat dashboard')
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {
  const didJustLogin = window.history.state?.loginSuccess

  loadDashboard()
  if (didJustLogin) {
    toast.success('Login berhasil! Selamat datang kembali', {
      timeout: 4000
    })
  }
})
</script>
