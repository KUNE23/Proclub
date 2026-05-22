<template>
  <main class="min-h-full bg-[#F8FBF9] text-[#13251A]">
    <div v-if="isLoading" class="mx-auto max-w-7xl animate-pulse space-y-7 px-2 py-2">
      <div class="h-12 w-1/2 rounded-2xl bg-gray-200"></div>
      <div class="h-72 rounded-[28px] bg-gray-200"></div>
      <div class="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div class="grid gap-5 md:grid-cols-3">
          <div v-for="n in 3" :key="n" class="h-28 rounded-2xl bg-gray-200"></div>
        </div>
        <div class="h-80 rounded-2xl bg-gray-200"></div>
      </div>
    </div>

    <div v-else class="mx-auto max-w-7xl space-y-7 px-2 py-2">
      <section class="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#0D7A42] shadow-sm">
            <Sparkles class="h-4 w-4" />
            Proclub Learning
          </div>
          <div>
            <h1 class="text-3xl font-black tracking-tight text-[#07111F] md:text-4xl">
              Welcome back, <span class="text-[#0D7A42]">{{ displayName }}</span>!
            </h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
              Perjalanan belajarmu terus berkembang. Berikut adalah progres belajar saat ini.
            </p>
          </div>
        </div>

        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D7A42] to-[#075A32] p-5 text-white shadow-xl shadow-emerald-900/10">
          <div class="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-white/10"></div>
          <div class="absolute -top-14 right-10 h-28 w-28 rounded-full bg-white/10"></div>
          <div class="relative flex items-start gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Flame class="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <p class="font-black">Keep it up!</p>
              <p class="mt-1 text-sm leading-relaxed text-emerald-50">
                Konsistensi adalah kunci menjadi luar biasa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="featuredCourse"
        class="overflow-hidden rounded-[28px] border border-[#E3EEE7] bg-white p-6 shadow-sm shadow-emerald-950/5 md:p-8"
      >
        <div class="grid items-center gap-8 lg:grid-cols-[1fr_220px_330px]">
          <div class="flex flex-col gap-5 md:flex-row md:items-start">
            <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#EAF7EF] text-[#0D7A42]">
              <BookOpen class="h-12 w-12" />
            </div>
            <div class="min-w-0">
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-[#DFF3E7] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#0D7A42]">
                  Ongoing
                </span>
                <span class="text-xs font-semibold text-gray-400">Best Progress</span>
              </div>
              <h2 class="text-2xl font-black leading-tight text-[#07111F]">
                {{ featuredCourse.title }}
              </h2>
              <p class="mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
                {{ featuredCourse.description || 'Learning path Proclub untuk meningkatkan skill secara bertahap.' }}
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-3">
                <router-link
                  :to="`/courses/${featuredCourse.id}`"
                  class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D7A42] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-[#096336]"
                >
                  Lanjutkan Belajar
                  <ArrowRight class="h-4 w-4" />
                </router-link>
              </div>
            </div>
          </div>

          <div class="mx-auto flex h-40 w-40 items-center justify-center rounded-full" :style="progressRingStyle">
            <div class="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <span class="text-3xl font-black text-[#0D7A42]">{{ featuredCourse.percentage || 0 }}%</span>
              <span class="text-sm text-gray-500">Completed</span>
            </div>
          </div>

          <div class="space-y-4 border-[#E7EFEA] lg:border-l lg:pl-8">
            <div class="flex items-center gap-3 text-sm font-semibold text-[#13251A]">
              <CheckCircle2 class="h-5 w-5 text-[#0D7A42]" />
              <span>{{ featuredCourse.completedModules || 0 }} / {{ featuredCourse.totalModules || 0 }} Modules Completed</span>
            </div>
            <div class="flex items-center gap-3 text-sm font-semibold text-[#13251A]">
              <CheckCircle2 class="h-5 w-5 text-[#0D7A42]" />
              <span>{{ featuredCourse.completedLessons || 0 }} / {{ featuredCourse.totalLessons || 0 }} Lessons Completed</span>
            </div>
            <div class="flex items-center gap-3 text-sm font-semibold text-[#13251A]">
              <CheckCircle2 class="h-5 w-5 text-[#0D7A42]" />
              <span>Quizzes Average {{ featuredCourse.avgQuiz || statistics.avgQuizScore || 0 }}%</span>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div class="space-y-7">
          <div class="grid gap-5 md:grid-cols-3">
            <article v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-[#E3EEE7] bg-white p-5 shadow-sm">
              <div class="flex items-center gap-4">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl" :class="stat.iconBg">
                  <component :is="stat.icon" class="h-7 w-7" :class="stat.iconColor" />
                </div>
                <div>
                  <p class="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">{{ stat.label }}</p>
                  <p class="mt-1 text-3xl font-black text-[#07111F]">{{ stat.value }}</p>
                  <p class="mt-1 text-xs font-semibold text-gray-400">{{ stat.caption }}</p>
                </div>
              </div>
            </article>
          </div>

          <section>
            <div class="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 class="text-xl font-black text-[#07111F]">Recommended for You</h2>
                <p class="mt-1 text-sm text-gray-500">Curated courses to continue your learning journey.</p>
              </div>
              <router-link to="/learning-path" class="inline-flex items-center gap-2 text-sm font-black text-[#0D7A42]">
                See all courses
                <ArrowRight class="h-4 w-4" />
              </router-link>
            </div>

            <div class="grid gap-5 lg:grid-cols-2">
              <article
                v-for="(course, index) in recommendedCourses"
                :key="course.id"
                class="rounded-2xl border border-[#E3EEE7] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5"
              >
                <div class="mb-5 flex items-start justify-between gap-4">
                  <div class="flex h-16 w-16 items-center justify-center rounded-2xl" :class="courseTone(index).bg">
                    <component :is="courseTone(index).icon" class="h-8 w-8" :class="courseTone(index).text" />
                  </div>
                  <span class="rounded-full px-3 py-1 text-xs font-black" :class="courseTone(index).badge">
                    {{ index === 0 ? 'New' : 'Popular' }}
                  </span>
                </div>
                <h3 class="text-lg font-black text-[#07111F]">{{ course.title }}</h3>
                <p class="mt-2 line-clamp-3 min-h-[64px] text-sm leading-relaxed text-gray-500">
                  {{ course.description || 'Materi pilihan untuk meningkatkan skill coding secara bertahap.' }}
                </p>
                <div class="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                  <span class="inline-flex items-center gap-1.5">
                    <CalendarDays class="h-4 w-4" />
                    {{ course.totalModules || course.modules?.length || 0 }} modul
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <Clock3 class="h-4 w-4" />
                    {{ estimatedHours(course) }} jam
                  </span>
                </div>
                <div class="mt-5">
                  <div class="mb-2 flex justify-between text-xs font-semibold text-gray-500">
                    <span>{{ course.completed ? 'Completed' : 'Beginner' }}</span>
                    <span class="inline-flex items-center gap-1 text-amber-500">
                      <Star class="h-3.5 w-3.5 fill-amber-400" />
                      {{ index === 0 ? '4.8' : '4.9' }}
                    </span>
                  </div>
                  <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div class="h-full rounded-full bg-[#0D7A42]" :style="{ width: `${course.percentage || 0}%` }"></div>
                  </div>
                </div>
                <router-link
                  :to="`/courses/${course.id}`"
                  class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2F7F4] px-4 py-3 text-sm font-black text-[#0D7A42] transition-colors hover:bg-[#E6F2EA]"
                >
                  Learn More
                  <ArrowRight class="h-4 w-4" />
                </router-link>
              </article>
            </div>
          </section>
        </div>

        <aside class="space-y-5">
          <article class="rounded-2xl border border-[#E3EEE7] bg-white p-5 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF7EF] text-[#0D7A42]">
                <CalendarDays class="h-6 w-6" />
              </div>
              <div>
                <h3 class="font-black text-[#07111F]">Upcoming</h3>
                <p class="text-xs text-gray-400">Jadwal kegiatan terdekat</p>
              </div>
            </div>
            <div class="mt-5 rounded-2xl bg-[#F8FBF9] p-4">
              <p class="text-sm font-black text-[#13251A]">{{ upcomingTitle }}</p>
              <p class="mt-1 text-xs leading-relaxed text-gray-500">{{ upcomingDate }}</p>
              <p class="mt-3 text-xs leading-relaxed text-gray-500">{{ upcomingDescription }}</p>
            </div>
               <div class="mt-4 flex items-center justify-between gap-3">
                 <MapPin class="h-5 w-5 text-emerald-500" />
                 <p class="text-xs font-semibold text-emerald-500">
                  {{ upcomingLocation || "Lokasi belum tersedia" }}</p>
                </div>
          </article>

          <article class="rounded-2xl border border-[#E3EEE7] bg-white p-5 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Flame class="h-6 w-6" />
              </div>
              <h3 class="font-black text-[#07111F]">Your Streak</h3>
            </div>
            <div class="mt-5 flex items-end gap-2">
              <span class="text-4xl font-black text-[#07111F]">{{ learningStats.streakDays || 0 }}</span>
              <span class="pb-1 text-sm font-semibold text-gray-500">Days</span>
            </div>
            <div class="mt-5 grid grid-cols-7 gap-2">
              <div v-for="day in weekStreak" :key="day.date" class="flex flex-col items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full" :class="day.completed ? 'bg-[#0D7A42] text-white' : 'border border-gray-200 bg-white text-gray-300'">
                  <Check v-if="day.completed" class="h-4 w-4" />
                </div>
                <span class="text-[11px] font-bold text-gray-500">{{ day.label }}</span>
              </div>
            </div>
            <p class="mt-4 text-xs leading-relaxed text-gray-500">
              Selesaikan minimal satu lesson per hari untuk menjaga streak tetap menyala.
            </p>
          </article>

          <article class="rounded-2xl border border-[#E3EEE7] bg-white p-5 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <Medal class="h-6 w-6" />
              </div>
              <h3 class="font-black text-[#07111F]">Recent Achievement</h3>
            </div>
            <div class="mt-5 flex gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-white">
                <Trophy class="h-7 w-7" />
              </div>
              <div>
                <p class="font-black text-[#07111F]">{{ achievement.title }}</p>
                <p class="mt-1 text-sm leading-relaxed text-gray-500">{{ achievement.description }}</p>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  Flame,
  FileText,
  Medal,
  Sparkles,
  Star,
  Trophy,
  MapPin
} from 'lucide-vue-next'
import { getMemberDashboard } from '../services/dashboardService'
import { getNearestUpcomingEvent } from '../services/upcomingEventService'
import api from '../api/index.js'

const toast = useToast()
const isLoading = ref(true)
const user = ref({ name: '' })
const featuredCourse = ref(null)
const recommendedCourses = ref([])
const learningStats = ref({
  xp: 0,
  level: 1,
  currentLevelXp: 0,
  nextLevelXp: 1200,
  streakDays: 0,
  weekStreak: [],
  recentAchievement: null
})
const statistics = ref({
  totalCoursesInProgress: 0,
  totalCompletedLessons: 0,
  totalCompletedModules: 0,
  avgQuizScore: 0
})
const upcomingEvent = ref(null)

const displayName = computed(() => user.value?.name || 'Student')
const weekStreak = computed(() => {
  if (learningStats.value.weekStreak?.length) return learningStats.value.weekStreak

  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => ({
    label,
    date: String(index),
    completed: false
  }))
})
const achievement = computed(() => learningStats.value.recentAchievement || {
  title: 'Mulai Perjalananmu',
  description: 'Selesaikan lesson pertama untuk membuka achievement.'
})
const progressRingStyle = computed(() => {
  const percentage = featuredCourse.value?.percentage || 0
  return {
    background: `conic-gradient(#0D7A42 ${percentage * 3.6}deg, #E7F0EA 0deg)`
  }
})
const stats = computed(() => [
  {
    label: 'Courses in Progress',
    value: statistics.value.totalCoursesInProgress || 0,
    caption: 'Keep going!',
    icon: BookOpen,
    iconBg: 'bg-[#EAF7EF]',
    iconColor: 'text-[#0D7A42]'
  },
  {
    label: 'Completed Modules',
    value: statistics.value.totalCompletedModules || 0,
    caption: 'Great progress!',
    icon: FileText,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500'
  },
  {
    label: 'Avg Quiz Score',
    value: `${statistics.value.avgQuizScore || 0}%`,
    caption: 'Excellent!',
    icon: Trophy,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500'
  }
])

const courseTone = (index) => {
  const tones = [
    {
      bg: 'bg-[#EAF7EF]',
      text: 'text-[#0D7A42]',
      badge: 'bg-[#E2F2E8] text-[#0D7A42]',
      icon: Code2
    },
    {
      bg: 'bg-blue-50',
      text: 'text-blue-500',
      badge: 'bg-amber-50 text-amber-600',
      icon: Database
    }
  ]

  return tones[index % tones.length]
}

const estimatedHours = (course) => {
  const modules = course.totalModules || course.modules?.length || 1
  return Math.max(modules * 2, 4)
}

const normalizeCourse = (course) => ({
  ...course,
  completedModules: course.completedModules || Math.round(((course.percentage || 0) / 100) * (course.totalModules || course.modules?.length || 0))
})

const upcomingLocation = computed(() => upcomingEvent.value?.location || 'Lokasi belum ditentukan')
const upcomingTitle = computed(() => upcomingEvent.value?.title || 'Tidak ada jadwal mendatang')
const upcomingDate = computed(() => {
  if (!upcomingEvent.value?.eventDate) return 'Jadwal pelatihan offline akan muncul di sini.'

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(upcomingEvent.value.eventDate))
})
const upcomingDescription = computed(() => upcomingEvent.value?.description || 'Admin dapat menggunakan card ini sebagai area informasi kegiatan Proclub berikutnya.')

const loadDashboard = async () => {
  try {
    isLoading.value = true

    const [dashboardResponse, coursesResponse, upcomingResponse] = await Promise.all([
      getMemberDashboard(),
      api.get('/courses'),
      getNearestUpcomingEvent()
    ])
    const data = dashboardResponse.data || dashboardResponse
    const courses = coursesResponse.data?.data || []

    user.value = data.user || { name: '' }
    statistics.value = data.statistics || statistics.value
    learningStats.value = data.learningStats || learningStats.value
    featuredCourse.value = data.featuredCourse || courses[0] || null
    recommendedCourses.value = courses.slice(0, 2).map(normalizeCourse)
    upcomingEvent.value = upcomingResponse.data?.data || null
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat dashboard')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
