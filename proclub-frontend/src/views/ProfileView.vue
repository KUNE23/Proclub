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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="h-32 bg-gray-200 rounded-2xl"></div>
          <div class="h-32 bg-gray-200 rounded-2xl"></div>
        </div>

        <div class="space-y-4">
          <div class="h-6 bg-gray-200 rounded w-1/4"></div>
          <div class="h-24 bg-gray-200 rounded-2xl w-full" v-for="n in 3" :key="n"></div>
        </div>
      </div>

      <template v-else>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-2xl bg-[#0A733F] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#0A733F]/20 shrink-0">
              {{ initials }}
            </div>

            <div>
              <h1 class="text-3xl font-bold text-[#1A2E20]">
                {{ user.name || 'User' }}
              </h1>

              <div class="flex items-center gap-3 mt-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 bg-[#F0FDF4] text-[#16A34A] text-[11px] font-bold rounded-full border border-[#16A34A]/20 uppercase tracking-wide">
                  {{ user.role || 'Member' }}
                </span>

                <span class="text-gray-400 text-sm font-medium">
                  {{ user.email }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <router-link
              to="/edit-profile"
              class="flex-1 md:flex-none px-6 py-2.5 bg-white border border-[#E6EFE9] text-[#1A2E20] rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors text-center"
            >
              Edit Profile
            </router-link>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center shrink-0 text-[#16A34A]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>

            <div>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Enrolled Courses
              </p>

              <h3 class="text-2xl font-bold text-[#1A2E20]">
                {{ totalCourses }}
              </h3>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0 text-blue-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h8"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l-4 4 4 4"></path>
              </svg>
            </div>

            <div>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Completed Modules
              </p>

              <h3 class="text-2xl font-bold text-[#1A2E20]">
                {{ completedModules }}/{{ totalModules }}
              </h3>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center shrink-0 text-orange-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"></path>
              </svg>
            </div>

            <div>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Learning Progress
              </p>

              <h3 class="text-2xl font-bold text-[#1A2E20]">
                {{ overallProgress }}%
              </h3>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-[#E6EFE9] pb-4">
            <h2 class="text-xl font-bold text-[#1A2E20]">
              My Learning Progress
            </h2>

            <router-link
              to="/learning-path"
              class="text-sm font-bold text-[#0A733F] hover:underline"
            >
              Explore More
            </router-link>
          </div>

          <div
            v-if="activeCourses.length === 0"
            class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300"
          >
            <p class="text-gray-400">
              You haven't enrolled in any courses yet.
            </p>
          </div>

          <div v-else class="grid grid-cols-1 gap-5">
            <router-link
              v-for="course in activeCourses"
              :key="course.id"
              :to="`/courses/${course.id}`"
              class="group bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm hover:shadow-md hover:border-[#0A733F]/30 transition-all"
            >
              <div class="flex flex-col md:flex-row gap-5">
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h4 class="font-bold text-lg text-[#1A2E20] group-hover:text-[#0A733F] transition-colors">
                        {{ course.title }}
                      </h4>

                      <p class="text-[12px] text-gray-500 mt-1">
                        {{ course.completedModules }}/{{ course.totalModules }} modules completed
                      </p>
                    </div>

                    <div
                      class="px-3 py-1 rounded-full text-[11px] font-bold border text-center shrink-0 whitespace-nowrap"
                      :class="course.progress >= 100
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : course.progress > 0
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-gray-50 text-gray-500 border-gray-200'"
                    >
                      {{
                        course.progress >= 100
                          ? 'Completed'
                          : course.progress > 0
                          ? 'In Progress'
                          : 'Not Started'
                      }}
                    </div>
                  </div>

                  <div class="mt-5">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[12px] font-medium text-gray-500">
                        Progress
                      </span>

                      <span class="text-[13px] font-bold text-[#0A733F]">
                        {{ course.progress }}%
                      </span>
                    </div>

                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-[#0A733F] rounded-full transition-all duration-700"
                        :style="{ width: course.progress + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-[#E6EFE9] pb-4">
            <h2 class="text-xl font-bold text-[#1A2E20]">My Certificates</h2>
          </div>

          <div
            v-if="certificates.length === 0"
            class="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center"
          >
            <p class="text-sm font-semibold text-gray-400">Sertifikat akan muncul setelah learning path selesai dan project approved.</p>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2">
            <div
              v-for="certificate in certificates"
              :key="certificate.id"
              class="rounded-2xl border border-[#E6EFE9] bg-white p-6 shadow-sm"
            >
              <p class="text-[11px] font-bold uppercase tracking-widest text-[#0A733F]">{{ certificate.code }}</p>
              <h3 class="mt-2 text-lg font-bold text-[#1A2E20]">{{ certificate.learningPath }}</h3>
              <p class="mt-1 text-xs text-gray-400">Terbit {{ formatDate(certificate.issuedAt) }}</p>
              <div class="mt-5 flex gap-3">
                <a
                  :href="`http://localhost:3000${certificate.pdfUrl}`"
                  target="_blank"
                  class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A733F] px-4 py-2.5 text-[13px] font-bold text-white"
                >
                  Download PDF
                </a>
                <router-link
                  :to="`/certificate/${certificate.code}`"
                  class="inline-flex flex-1 items-center justify-center rounded-xl border border-[#E6EFE9] px-4 py-2.5 text-[13px] font-bold text-[#1A2E20]"
                >
                  Verifikasi
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'
import { useToast } from 'vue-toastification'
import { getMyCertificates } from '../services/certificateService.js'

const isLoading = ref(true)
const toast = useToast()

const user = ref({
  name: '',
  email: '',
  role: ''
})

const activeCourses = ref([])
const certificates = ref([])

const initials = computed(() => {
  if (!user.value.name) return 'U'

  const parts = user.value.name.trim().split(' ').filter(Boolean)

  if (parts.length >= 2) {
    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase()
  }

  return parts[0].slice(0, 2).toUpperCase()
})

const totalCourses = computed(() => activeCourses.value.length)

const completedModules = computed(() => {
  return activeCourses.value.reduce(
    (acc, course) => acc + course.completedModules,
    0
  )
})

const totalModules = computed(() => {
  return activeCourses.value.reduce(
    (acc, course) => acc + course.totalModules,
    0
  )
})

const overallProgress = computed(() => {
  if (totalModules.value === 0) return 0

  return Math.round(
    (completedModules.value / totalModules.value) * 100
  )
})

const loadUser = async () => {
  try {
    const raw = localStorage.getItem('user')

    if (raw && raw !== 'undefined') {
      user.value = JSON.parse(raw)
    }

    const profileRes = await api.get('/profile').catch(() => null)

    if (profileRes?.data) {
      user.value = {
        ...user.value,
        ...profileRes.data
      }
    }

    const [coursesRes, progressRes, certificatesRes] = await Promise.all([
      api.get('/courses'),
      api.get('/progress'),
      getMyCertificates()
    ])

    const progressItems = Array.isArray(progressRes.data?.data) ? progressRes.data.data : []
    const completedLessonIds = new Set(
      progressItems
        .filter(item => item.status === 'COMPLETED')
        .map(item => item.lessonId)
    )

    activeCourses.value = (coursesRes.data?.data || []).map(course => {
      const modules = course.modules || []
      const lessons = modules.flatMap(module => module.lessons || [])
      const completedLessons = lessons.filter(lesson => completedLessonIds.has(lesson.id)).length
      const completedModules = modules.filter(module => {
        const moduleLessons = module.lessons || []
        return moduleLessons.length > 0 && moduleLessons.every(lesson => completedLessonIds.has(lesson.id))
      }).length

      return {
        id: course.id,
        title: course.title,
        totalModules: modules.length,
        completedModules,
        progress: lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0
      }
    })

    certificates.value = certificatesRes.data?.data || []
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal memuat profil')
  } finally {
    isLoading.value = false
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))
}

onMounted(() => {
  loadUser()
})
</script>
