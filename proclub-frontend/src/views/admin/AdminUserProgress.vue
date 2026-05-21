<template>
  <div class="p-8 max-w-[1600px] mx-auto space-y-8 bg-[#FAFCFB] min-h-screen">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#1A2E20]">User Progress</h1>
        <p class="text-gray-500 mt-1 text-[13px]">
          Monitor student learning progress, quiz completion, and overall course activity.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <select
            v-model="filters.course"
            class="appearance-none bg-white border border-[#E6EFE9] rounded-lg px-4 py-2 pr-10 text-[13px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
          >
            <option value="All Courses">All Courses</option>
            <option
              v-for="course in courseOptions"
              :key="course"
              :value="course"
            >
              {{ course }}
            </option>
          </select>

          <ChevronDown
            class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        <div class="relative">
          <select
            v-model="filters.status"
            class="appearance-none bg-white border border-[#E6EFE9] rounded-lg px-4 py-2 pr-10 text-[13px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
          >
            <option value="All Status">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>

          <ChevronDown
            class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div class="p-2.5 bg-[#F2F7F4] rounded-xl text-[#16A34A]">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>

          <div
            v-if="stat.trend"
            class="flex items-center gap-1 text-[12px] font-bold"
            :class="stat.trendUp ? 'text-green-600' : 'text-red-500'"
          >
            <TrendingUp
              v-if="stat.trendUp"
              class="w-3.5 h-3.5"
            />
            {{ stat.trend }}
          </div>
        </div>

        <div class="mt-4">
          <p class="text-[13px] font-medium text-gray-400">
            {{ stat.label }}
          </p>

          <p class="text-3xl font-bold text-[#1A2E20] mt-1">
            {{ stat.value }}
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-[#E6EFE9] shadow-sm overflow-hidden">
      <div class="p-6 border-b border-[#E6EFE9] flex items-center justify-between">
        <h3 class="font-bold text-[#1A2E20]">
          User Enrollment Details
        </h3>

        <div class="flex items-center gap-3">
          <div class="relative group">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search user..."
              class="pl-9 pr-4 py-2 bg-gray-50 border border-[#E6EFE9] rounded-xl text-[13px] w-64 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:bg-white"
            />

            <Search
              class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-[#E6EFE9]">
              <th class="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase">
                Student
              </th>

              <th class="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase">
                Course
              </th>

              <th class="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase text-center">
                Completed
              </th>

              <th class="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase text-center">
                Avg Quiz
              </th>

              <th class="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase">
                Progress
              </th>

              <th class="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase">
                Status
              </th>

              <th class="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-[#E6EFE9]">
            <tr
              v-if="loading"
              v-for="i in 5"
              :key="i"
              class="animate-pulse"
            >
              <td colspan="7" class="py-4 px-6">
                <div class="h-12 bg-gray-100 rounded-lg w-full"></div>
              </td>
            </tr>

            <tr v-else-if="paginatedProgress.length === 0">
              <td
                colspan="7"
                class="py-20 text-center text-gray-400 font-medium"
              >
                No progress records found.
              </td>
            </tr>

            <tr
              v-for="item in paginatedProgress"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="py-5 px-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-[#F2F7F4] flex items-center justify-center text-[#16A34A] font-bold text-sm border border-[#E6EFE9]"
                  >
                    {{ getInitials(item.name) }}
                  </div>

                  <div>
                    <p class="text-[14px] font-bold text-[#1A2E20]">
                      {{ item.name }}
                    </p>

                    <p class="text-[11px] text-gray-400 mt-0.5">
                      {{ item.email }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="py-5 px-6">
                <div>
                  <p class="text-[13px] font-bold text-[#16A34A]">
                    {{ item.course }}
                  </p>

                  <p class="text-[11px] text-gray-400 mt-0.5">
                    {{ item.current_module }}
                  </p>
                </div>
              </td>

              <td class="py-5 px-6 text-center">
                <span class="text-[13px] font-bold text-[#1A2E20]">
                  {{ item.completed_modules }}/{{ item.total_modules }}
                </span>
              </td>

              <td class="py-5 px-6 text-center">
                <span class="text-[14px] font-black text-[#16A34A]">
                  {{ item.avg_quiz_score }}%
                </span>
              </td>

              <td class="py-5 px-6 min-w-[180px]">
                <div class="flex items-center gap-3">
                  <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-[#16A34A] to-[#10b981]"
                      :style="{ width: item.progress_percentage + '%' }"
                    ></div>
                  </div>

                  <span class="text-[12px] font-bold text-gray-600 min-w-[35px]">
                    {{ item.progress_percentage }}%
                  </span>
                </div>
              </td>

              <td class="py-5 px-6">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                  :class="statusClasses[item.status]"
                >
                  {{ item.status }}
                </span>
              </td>

              <td class="py-5 px-6 text-right">
                <button
                  @click="viewDetail(item)"
                  class="text-[11px] font-bold text-gray-400 hover:text-[#16A34A]"
                >
                  View Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-[#E6EFE9] flex items-center justify-between">
        <span class="text-[12px] text-gray-500 font-medium">
          Showing {{ paginationStart }}-{{ paginationEnd }} of
          {{ filteredProgress.length }} students
        </span>

        <div class="flex items-center gap-1">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E6EFE9] text-gray-400 disabled:opacity-30"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-xl text-[12px] font-bold border',
              currentPage === page
                ? 'bg-[#0D7A42] border-[#0D7A42] text-white'
                : 'bg-white border-[#E6EFE9] text-gray-600'
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E6EFE9] text-gray-400 disabled:opacity-30"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="showModal = false"
      >
        <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex">
          <div class="w-80 bg-gray-50 p-8 border-r border-[#E6EFE9]">
            <div class="flex flex-col items-center text-center">
              <div
                class="w-24 h-24 rounded-3xl bg-[#F2F7F4] flex items-center justify-center text-[#16A34A] text-3xl font-bold"
              >
                {{ getInitials(selectedUser.name || '') }}
              </div>

              <h2 class="mt-5 text-xl font-bold text-[#1A2E20]">
                {{ selectedUser.name }}
              </h2>

              <p class="text-[13px] text-gray-400 mt-1">
                {{ selectedUser.email }}
              </p>
            </div>

            <div class="mt-10 space-y-4">
              <div class="bg-white p-4 rounded-2xl border border-[#E6EFE9]">
                <p class="text-[11px] text-gray-400 uppercase font-bold">
                  Course
                </p>

                <p class="text-lg font-bold text-[#1A2E20] mt-1">
                  {{ selectedUser.course }}
                </p>
              </div>

              <div class="bg-white p-4 rounded-2xl border border-[#E6EFE9]">
                <p class="text-[11px] text-gray-400 uppercase font-bold">
                  Completed
                </p>

                <p class="text-lg font-bold text-[#1A2E20] mt-1">
                  {{ selectedUser.completed_modules }}/{{ selectedUser.total_modules }}
                </p>
              </div>

              <div class="bg-white p-4 rounded-2xl border border-[#E6EFE9]">
                <p class="text-[11px] text-gray-400 uppercase font-bold">
                  Average Quiz
                </p>

                <p class="text-lg font-bold text-[#1A2E20] mt-1">
                  {{ selectedUser.avg_quiz_score }}%
                </p>
              </div>
            </div>
          </div>

          <div class="flex-1 p-8 overflow-y-auto">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-bold text-[#1A2E20]">
                Module Progress
              </h3>

              <button
                @click="showModal = false"
                class="p-2 rounded-xl hover:bg-gray-100"
              >
                <X class="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="module in selectedUser.modules"
                :key="module.id"
                class="border border-[#E6EFE9] rounded-2xl p-5"
              >
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h4 class="font-bold text-[#1A2E20]">
                      {{ module.title }}
                    </h4>

                    <p class="text-[12px] text-gray-400 mt-1">
                      {{ module.type }}
                    </p>
                  </div>

                  <span
                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                    :class="statusClasses[module.status]"
                  >
                    {{ module.status }}
                  </span>
                </div>

                <div class="flex items-center justify-between text-[13px]">
                  <span class="text-gray-500">
                    Quiz Score
                  </span>

                  <span class="font-bold text-[#16A34A]">
                    {{ module.score || 0 }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Users,
  BookOpen,
  TrendingUp,
  FileCheck,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-vue-next'

import { getUserProgress } from '../../services/userProgressService'
import { useToast } from 'vue-toastification'

const loading = ref(true)
const toast = useToast()
const userProgressList = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const showModal = ref(false)
const selectedUser = ref({})

const filters = ref({
  course: 'All Courses',
  status: 'All Status'
})

const stats = computed(() => {
  const totalStudents = userProgressList.value.length

  const completedCourses = userProgressList.value.reduce((acc, user) => {
    return acc + (user.courses?.filter(c => c.progress >= 100).length || 0)
  }, 0)

  const averageProgress =
    totalStudents > 0
      ? Math.round(
          userProgressList.value.reduce(
            (acc, user) => acc + (user.progress_percentage || 0),
            0
          ) / totalStudents
        )
      : 0

  const averageQuiz =
    totalStudents > 0
      ? Math.round(
          userProgressList.value.reduce(
            (acc, user) => acc + (user.avg_quiz_score || 0),
            0
          ) / totalStudents
        )
      : 0

  return [
    {
      label: 'Total Active Students',
      value: totalStudents,
      icon: Users,
      trend: totalStudents > 0 ? `${totalStudents} Active` : 'No Users',
      trendUp: totalStudents > 0
    },
    {
      label: 'Courses Completed',
      value: completedCourses,
      icon: BookOpen,
      trend: completedCourses > 0 ? 'Growing' : 'No Completion',
      trendUp: completedCourses > 0
    },
    {
      label: 'Average Progress',
      value: averageProgress + '%',
      icon: TrendingUp,
      trend:
        averageProgress >= 70
          ? 'Excellent'
          : averageProgress >= 40
          ? 'Improving'
          : 'Low',
      trendUp: averageProgress >= 40
    },
    {
      label: 'Quiz Completion Rate',
      value: averageQuiz + '%',
      icon: FileCheck,
      trend:
        averageQuiz >= 80
          ? 'High Score'
          : averageQuiz >= 50
          ? 'Average'
          : 'Needs Improvement',
      trendUp: averageQuiz >= 50
    }
  ]
})

const courseOptions = computed(() => {
  const courses = userProgressList.value.map(i => i.course)
  return [...new Set(courses)]
})

const statusClasses = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Not Started': 'bg-gray-100 text-gray-500'
}

const filteredProgress = computed(() => {
  return userProgressList.value.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCourse =
      filters.value.course === 'All Courses' ||
      item.course === filters.value.course

    const matchesStatus =
      filters.value.status === 'All Status' ||
      item.status === filters.value.status

    return matchesSearch && matchesCourse && matchesStatus
  })
})

const paginatedProgress = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  return filteredProgress.value.slice(
    start,
    start + itemsPerPage
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredProgress.value.length / itemsPerPage) || 1
})

const paginationStart = computed(() => {
  if (filteredProgress.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredProgress.value.length
  )
})

const fetchProgress = async () => {
  loading.value = true

  try {
    const response = await getUserProgress()
    userProgressList.value = (response.data.data || []).map(user => {
      const firstCourse = user.courses?.[0]
      const progress = user.overallPercentage || 0

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        course: firstCourse?.title || '-',
        current_module: firstCourse?.title || '-',
        completed_modules: user.completedLessonsAll || 0,
        total_modules: user.totalLessonsAll || 0,
        avg_quiz_score: progress,
        progress_percentage: progress,
        status:
          progress >= 100
            ? 'Completed'
            : progress > 0
            ? 'In Progress'
            : 'Not Started',
        modules: (user.courses || []).map(course => ({
          id: course.id,
          title: course.title,
          type: 'Learning Path',
          status:
            course.percentage >= 100
              ? 'Completed'
              : course.percentage > 0
              ? 'In Progress'
              : 'Not Started',
          score: course.percentage || 0
        })),
        courses: (user.courses || []).map(course => ({
          name: course.title,
          progress: course.percentage,
          lessons_completed: course.completedLessons,
          total_lessons: course.totalLessons
        }))
      }
    })
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat progress user')
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const viewDetail = (user) => {
  selectedUser.value = user
  showModal.value = true
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

watch([searchQuery, filters], () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  fetchProgress()
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #d1dfd6;
  border-radius: 999px;
}
</style>
