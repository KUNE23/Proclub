<template>
  <div class="flex h-screen overflow-hidden bg-[#FAFCFB] font-sans text-gray-800">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
      @click="closeSidebar"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-[#E6EFE9] bg-white transition-transform duration-300 lg:static lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="px-6 py-5 text-center">
        <img src="/proclub.png" alt="Proclub Logo" class="mx-auto mb-3 h-14 w-14 object-contain">
        <h1 class="text-lg font-bold leading-tight text-[#1A2E20]">Proclub Learning Hub</h1>
        <span class="mt-1 block text-[12px] font-medium text-gray-400">Admin Console</span>
      </div>

      <nav class="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-4">
        <div v-for="group in navGroups" :key="group.title">
          <p class="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{{ group.title }}</p>
          <div class="space-y-1.5">
            <router-link
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              class="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors"
              :class="item.active(route.path) ? 'bg-[#F2F7F4] text-[#0D7A42]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
            >
              <div v-if="item.active(route.path)" class="absolute left-0 top-1/2 -ml-4 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#16A34A]"></div>
              <component :is="item.icon" class="h-5 w-5" />
              {{ item.label }}
            </router-link>
          </div>
        </div>
      </nav>

      <div class="relative mx-4 mb-6 mt-auto p-4" ref="profileRef">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-xl bg-[#0A733F] px-3 py-2.5 text-white shadow-lg shadow-[#0A733F]/20 transition-colors hover:bg-[#085a31]"
          @click="toggleProfileMenu"
        >
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-[13px] font-bold tracking-wide">
            {{ initials }}
          </div>
          <div class="min-w-0 flex-1 text-left">
            <p class="truncate text-[13px] font-bold text-white">{{ user.name || 'Admin' }}</p>
            <p class="truncate text-[10px] capitalize text-green-100">{{ user.role || 'Administrator' }}</p>
          </div>
          <ChevronDown class="h-4 w-4 shrink-0 text-white/60 transition-transform duration-200" :class="showProfileMenu ? '-rotate-180' : ''" />
        </button>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="translate-y-2 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-2 opacity-0"
        >
          <div v-if="showProfileMenu" class="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-[#E6EFE9] bg-white shadow-xl">
            <div class="border-b border-[#E6EFE9] px-4 py-3">
              <p class="truncate text-[12px] font-bold text-[#1A2E20]">{{ user.name || 'Admin' }}</p>
              <p class="truncate text-[11px] text-gray-400">{{ user.email || '' }}</p>
            </div>
            <button
              type="button"
              class="flex w-full items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
              :disabled="isLoggingOut"
              @click="handleLogout"
            >
              <Loader2 v-if="isLoggingOut" class="h-4 w-4 animate-spin" />
              <LogOut v-else class="h-4 w-4" />
              {{ isLoggingOut ? 'Logout...' : 'Logout' }}
            </button>
          </div>
        </Transition>
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#FAFCFB]">
      <header class="z-10 flex h-16 shrink-0 items-center justify-between border-b border-[#E6EFE9] bg-white px-4 shadow-sm sm:px-6 lg:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6EFE9] text-[#0D7A42] lg:hidden"
            @click="toggleSidebar"
          >
            <X v-if="isSidebarOpen" class="h-5 w-5" />
            <Menu v-else class="h-5 w-5" />
          </button>
          <h2 class="truncate text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-sm">
            STT Cipasung - Informatics Engineering
          </h2>
        </div>

        <div class="relative" ref="notificationRef">
          <button
            type="button"
            class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6EFE9] text-[#0D7A42] transition hover:bg-[#F2F7F4]"
            @click="toggleNotificationMenu"
          >
            <Bell class="h-5 w-5" />
            <span
              v-if="unreadCount > 0"
              class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-2 opacity-0"
          >
            <div v-if="showNotificationMenu" class="absolute right-0 top-12 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-[#E6EFE9] bg-white shadow-2xl">
              <div class="flex items-center justify-between border-b border-[#E6EFE9] px-4 py-3">
                <div>
                  <p class="text-sm font-black text-[#07111F]">Notifikasi Admin</p>
                  <p class="text-xs text-gray-400">{{ unreadCount }} belum dibaca</p>
                </div>
                <button
                  type="button"
                  class="text-xs font-black text-[#0D7A42] disabled:text-gray-300"
                  :disabled="unreadCount === 0"
                  @click="readAllNotifications"
                >
                  Baca semua
                </button>
              </div>

              <div v-if="isLoadingNotifications" class="flex items-center justify-center py-10">
                <Loader2 class="h-6 w-6 animate-spin text-[#0D7A42]" />
              </div>

              <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                <Inbox class="h-8 w-8 text-gray-300" />
                <p class="text-sm font-semibold text-gray-400">Belum ada notifikasi</p>
              </div>

              <div v-else class="max-h-[360px] overflow-y-auto">
                <button
                  v-for="notification in notifications"
                  :key="notification.id"
                  type="button"
                  class="flex w-full items-start gap-3 border-b border-[#F1F5F2] px-4 py-3 text-left transition hover:bg-[#F8FBF9]"
                  @click="readNotification(notification)"
                >
                  <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" :class="iconStyle(notification.type)">
                    <component :is="notificationIcon(notification.type)" class="h-4 w-4" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <p class="line-clamp-1 text-[13px] font-bold text-[#1A2E20]">{{ notification.title }}</p>
                      <Circle v-if="!notification.isRead" class="mt-1 h-2.5 w-2.5 shrink-0 fill-red-500 text-red-500" />
                    </div>
                    <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{{ notification.message }}</p>
                    <p class="mt-2 text-[11px] font-semibold text-gray-400">{{ formatNotificationDate(notification.createdAt) }}</p>
                  </div>
                </button>
              </div>

              <router-link
                to="/admin/notifications"
                class="flex items-center justify-center gap-2 bg-[#F8FBF9] px-4 py-3 text-xs font-black text-[#0D7A42]"
                @click="showNotificationMenu = false"
              >
                Lihat semua notifikasi
                <ArrowRight class="h-3.5 w-3.5" />
              </router-link>
            </div>
          </Transition>
        </div>
      </header>

      <main class="custom-scrollbar min-w-0 flex-1 overflow-y-auto">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../api/index.js'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../services/notificationService.js'
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BookCheck,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FolderGit2,
  Gauge,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
  X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const user = ref({ name: '', email: '', role: '' })
const showProfileMenu = ref(false)
const showNotificationMenu = ref(false)
const isSidebarOpen = ref(false)
const isLoggingOut = ref(false)
const profileRef = ref(null)
const notificationRef = ref(null)
const notifications = ref([])
const unreadCount = ref(0)
const isLoadingNotifications = ref(false)

const navGroups = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, active: (path) => path === '/admin' }
    ]
  },
  {
    title: 'Learning CMS',
    items: [
      { to: '/admin/courses', label: 'Courses / Quizzes', icon: BookOpen, active: (path) => path.startsWith('/admin/courses') },
      { to: '/admin/quiz-results', label: 'Quiz Result', icon: BarChart3, active: (path) => path.startsWith('/admin/quiz-results') },
      { to: '/admin/project-review', label: 'Project Review', icon: ClipboardCheck, active: (path) => path.startsWith('/admin/project-review') },
      { to: '/admin/certificates', label: 'Certificates', icon: ShieldCheck, active: (path) => path.startsWith('/admin/certificates') },
      { to: '/admin/upcoming-events', label: 'Upcoming Events', icon: CalendarDays, active: (path) => path.startsWith('/admin/upcoming-events') }
    ]
  },
  {
    title: 'Members',
    items: [
      { to: '/admin/users', label: 'Users', icon: Users, active: (path) => path.startsWith('/admin/users') },
      { to: '/admin/progress', label: 'User Progress', icon: TrendingUp, active: (path) => path.startsWith('/admin/progress') },
      { to: '/admin/contacts', label: 'Contact Messages', icon: Mail, active: (path) => path.startsWith('/admin/contacts') },
      { to: '/admin/notifications', label: 'Notifications', icon: Bell, active: (path) => path.startsWith('/admin/notifications') },
      { to: '/admin/settings', label: 'Account Settings', icon: Settings, active: (path) => path.startsWith('/admin/settings') }
    ]
  }
]

const initials = computed(() => {
  const name = user.value.name || ''
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return 'AD'
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showNotificationMenu.value = false
}

const toggleNotificationMenu = async () => {
  showNotificationMenu.value = !showNotificationMenu.value
  showProfileMenu.value = false

  if (showNotificationMenu.value) {
    await fetchNotifications()
  }
}

const handleClickOutside = (event) => {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    showProfileMenu.value = false
  }

  if (notificationRef.value && !notificationRef.value.contains(event.target)) {
    showNotificationMenu.value = false
  }
}

const loadUser = () => {
  try {
    const raw = localStorage.getItem('user')
    if (raw && raw !== 'undefined') user.value = JSON.parse(raw)
  } catch {}
}

const handleLogout = async () => {
  isLoggingOut.value = true

  try {
    await api.post('/auth/logout')
  } catch (error) {
    console.warn('Logout API error:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    showProfileMenu.value = false
    toast.success('Logout berhasil. Sampai jumpa!')
    isLoggingOut.value = false
    router.push('/login')
  }
}

const fetchNotifications = async () => {
  isLoadingNotifications.value = true

  try {
    const response = await getNotifications({ limit: 8 })
    notifications.value = Array.isArray(response.data?.data) ? response.data.data : []
    unreadCount.value = response.data?.unreadCount || 0
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat notifikasi admin')
  } finally {
    isLoadingNotifications.value = false
  }
}

const readNotification = async (notification) => {
  try {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id)
      notification.isRead = true
      unreadCount.value = Math.max(unreadCount.value - 1, 0)
    }

    showNotificationMenu.value = false

    if (notification.link) {
      router.push(notification.link)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal membuka notifikasi')
  }
}

const readAllNotifications = async () => {
  if (!unreadCount.value) return

  try {
    await markAllNotificationsAsRead()
    notifications.value = notifications.value.map((notification) => ({
      ...notification,
      isRead: true
    }))
    unreadCount.value = 0
    toast.success('Semua notifikasi admin sudah dibaca')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui notifikasi admin')
  }
}

const notificationIcon = (type) => {
  const icons = {
    USER_REGISTERED: UserPlus,
    LESSON_COMPLETED: BookCheck,
    MODULE_COMPLETED: CheckCircle2,
    COURSE_COMPLETED: Gauge,
    PROJECT_SUBMITTED: FolderGit2
  }

  return icons[type] || Bell
}

const iconStyle = (type) => {
  if (type === 'USER_REGISTERED') return 'bg-blue-50 text-blue-600'
  if (type === 'PROJECT_SUBMITTED') return 'bg-amber-50 text-amber-600'
  if (type === 'COURSE_COMPLETED') return 'bg-emerald-100 text-emerald-700'
  return 'bg-[#EAF7EF] text-[#0D7A42]'
}

const formatNotificationDate = (date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

watch(() => route.path, () => {
  closeSidebar()
  showProfileMenu.value = false
  showNotificationMenu.value = false
})

onMounted(() => {
  loadUser()
  fetchNotifications()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('notification:refresh', fetchNotifications)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('notification:refresh', fetchNotifications)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E6EFE9;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1dfd6;
}
</style>
