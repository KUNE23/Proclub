<template>
  <main class="mx-auto max-w-7xl space-y-7 p-2 text-[#13251A]">
    <section class="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div class="rounded-[28px] border border-[#E3EEE7] bg-white p-7 shadow-sm shadow-emerald-950/5">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-[#EAF7EF] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#0D7A42]">
              <Sparkles class="h-4 w-4" />
              Admin Overview
            </div>
            <h1 class="mt-4 text-3xl font-black tracking-tight text-[#07111F] md:text-4xl">Welcome back, Admin</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Pantau course, progress student, project review, dan jadwal kegiatan Proclub dari satu dashboard.
            </p>
          </div>

        </div>
      </div>

      <article class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0D7A42] to-[#075A32] p-6 text-white shadow-xl shadow-emerald-900/10">
        <div class="absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-white/10"></div>
        <div class="absolute -top-10 right-8 h-24 w-24 rounded-full bg-white/10"></div>
        <div class="relative">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <CalendarDays class="h-6 w-6 text-emerald-100" />
            </div>
            <div>
              <p class="text-xs font-black uppercase tracking-[0.18em] text-emerald-100">Upcoming</p>
              <h2 class="mt-1 text-xl font-black">{{ upcomingTitle }}</h2>
            </div>
          </div>
          <p class="mt-5 text-sm leading-relaxed text-emerald-50">{{ upcomingDescription }}</p>
          <div class="mt-5 flex items-center justify-between rounded-2xl bg-white/12 px-4 py-3">
            <span class="text-sm font-bold">{{ upcomingDate }}</span>
            <MapPin class="h-5 w-5 text-emerald-100" />
          </div>
          <div class="mt-4 flex items-center justify-between gap-3">
            <p class="text-xs font-semibold text-emerald-100">{{ upcomingLocation }}</p>
            <router-link to="/admin/upcoming-events" class="inline-flex items-center gap-1 text-xs font-black text-white">
              Kelola
              <ArrowRight class="h-3.5 w-3.5" />
            </router-link>
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="stat in statCards" :key="stat.label" class="rounded-2xl border border-[#E3EEE7] bg-white p-5 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl" :class="stat.bg">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.color" />
          </div>
          <span class="rounded-full bg-[#F8FBF9] px-3 py-1 text-[11px] font-black text-[#0D7A42]">{{ stat.badge }}</span>
        </div>
        <p class="text-xs font-black uppercase tracking-[0.16em] text-gray-400">{{ stat.label }}</p>
        <p class="mt-2 text-3xl font-black text-[#07111F]">{{ stat.value }}</p>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <article class="rounded-[24px] border border-[#E3EEE7] bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-[#07111F]">User Engagement & Progress</h2>
            <p class="mt-1 text-sm text-gray-500">Student completion statistics and engagement.</p>
          </div>
          <TrendingUp class="h-6 w-6 text-[#0D7A42]" />
        </div>

        <div v-if="userEngagement.length === 0" class="rounded-2xl bg-[#F8FBF9] p-8 text-center text-sm font-semibold text-gray-400">
          Belum ada data engagement.
        </div>

        <div v-else class="space-y-4">
          <div v-for="user in userEngagement.slice(0, 5)" :key="user.id" class="rounded-2xl border border-[#E3EEE7] p-4">
            <div class="mb-3 flex items-center justify-between gap-4">
              <div class="min-w-0">
                <h3 class="truncate font-black text-[#07111F]">{{ user.name }}</h3>
                <p class="mt-1 truncate text-xs text-gray-400">{{ user.email }}</p>
              </div>
              <span class="text-sm font-black text-[#0D7A42]">{{ user.percentage }}%</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-gray-100">
              <div class="h-full rounded-full bg-[#0D7A42] transition-all duration-700" :style="{ width: `${user.percentage}%` }"></div>
            </div>
            <div class="mt-3 flex justify-between text-xs font-semibold text-gray-500">
              <span>Completed {{ user.completedLessons }} Lessons</span>
              <span>Total {{ user.totalLessons }} Lessons</span>
            </div>
          </div>
        </div>
      </article>

      <aside class="space-y-5">
        <article class="rounded-[24px] border border-[#E3EEE7] bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-black text-[#07111F]">Recent Activities</h2>
              <p class="mt-1 text-sm text-gray-500">Latest user learning activities.</p>
            </div>
            <Bell class="h-5 w-5 text-[#0D7A42]" />
          </div>

          <div v-if="recentActivities.length === 0" class="rounded-2xl bg-[#F8FBF9] p-6 text-center text-sm font-semibold text-gray-400">
            Belum ada aktivitas terbaru.
          </div>

          <div v-else class="space-y-3">
            <div v-for="activity in recentActivities.slice(0, 4)" :key="activity.id" class="rounded-2xl border border-[#E3EEE7] p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate font-black text-[#07111F]">{{ activity.user }}</p>
                  <p class="mt-1 text-sm leading-relaxed text-gray-500">
                    Completed <span class="font-bold text-[#0D7A42]">{{ activity.module }}</span>
                  </p>
                  <p class="mt-2 text-xs text-gray-400">{{ formatDate(activity.updatedAt) }}</p>
                </div>
                <span class="rounded-full px-3 py-1 text-[11px] font-black" :class="activity.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                  {{ activity.status }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-[24px] border border-[#E3EEE7] bg-white p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <Trophy class="h-6 w-6" />
            </div>
            <div>
              <h2 class="font-black text-[#07111F]">Admin Focus</h2>
              <p class="text-sm text-gray-500">Review project pending dan update jadwal event secara rutin.</p>
            </div>
          </div>
        </article>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { ArrowRight, Bell, BookOpen, CalendarDays, FileText, MapPin, Sparkles, Tag, TrendingUp, Trophy, Users } from 'lucide-vue-next'
import { getDashboardAnalytics } from '../../services/dashboardService'
import { getUpcomingEvents } from '../../services/upcomingEventService'

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
const upcomingEvents = ref([])
const loading = ref(true)

const activeUpcomingEvent = computed(() => upcomingEvents.value.find(event => event.isActive) || upcomingEvents.value[0] || null)
const upcomingTitle = computed(() => activeUpcomingEvent.value?.title || 'Tidak ada jadwal mendatang')
const upcomingDescription = computed(() => activeUpcomingEvent.value?.description || 'Belum ada kegiatan yang dijadwalkan admin.')
const upcomingDate = computed(() => activeUpcomingEvent.value ? formatDate(activeUpcomingEvent.value.eventDate) : 'Kelola jadwal di halaman Upcoming Events')
const upcomingLocation = computed(() => activeUpcomingEvent.value?.location || 'Lokasi belum ditentukan')

const statCards = computed(() => [
  {
    label: 'Total Courses',
    value: statistics.value.totalCourses,
    badge: 'CMS',
    icon: BookOpen,
    bg: 'bg-[#EAF7EF]',
    color: 'text-[#0D7A42]'
  },
  {
    label: 'Total Users',
    value: statistics.value.totalUsers,
    badge: 'Active',
    icon: Users,
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  {
    label: 'Average Progress',
    value: `${statistics.value.averageProgress}%`,
    badge: 'Growth',
    icon: Tag,
    bg: 'bg-amber-50',
    color: 'text-amber-500'
  },
  {
    label: 'Total Lessons',
    value: statistics.value.totalLessons,
    badge: 'Lesson',
    icon: FileText,
    bg: 'bg-[#EAF7EF]',
    color: 'text-[#0D7A42]'
  }
])

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

const loadUpcomingEvents = async () => {
  const response = await getUpcomingEvents()
  upcomingEvents.value = response.data?.data || []
}

const loadDashboard = async () => {
  try {
    loading.value = true

    const [response] = await Promise.all([
      getDashboardAnalytics(),
      loadUpcomingEvents()
    ])
    const data = response.data?.data || response.data

    statistics.value = data.statistics || statistics.value
    userEngagement.value = data.engagement || []
    recentActivities.value = data.recentActivities || []
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat dashboard admin')
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>
