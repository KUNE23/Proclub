<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import api from '../api/index.js'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../services/notificationService.js'
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  CheckCircle2,
  Circle,
  Instagram,
  Inbox,
  Loader2,
  Music2,
  Settings,
  Zap
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isSidebarOpen = ref(false)
const isLoggingOut = ref(false)
const userName = ref('');
const userRole = ref('');
const showProfileMenu = ref(false)
const showNotificationMenu = ref(false)
const notifications = ref([])
const unreadCount = ref(0)
const isLoadingNotifications = ref(false)
const profileRef = ref(null)
const notificationRef = ref(null)
const learningStats = ref({
  level: 1,
  currentLevelXp: 0,
  nextLevelXp: 1200
})

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

const handleClickOutside = (e) => {
  if (profileRef.value && !profileRef.value.contains(e.target)) {
    showProfileMenu.value = false
  }

  if (notificationRef.value && !notificationRef.value.contains(e.target)) {
    showNotificationMenu.value = false
  }
}

const initials = computed(() => {
  if (!userName.value) return 'U'
  const parts = userName.value.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await api.post('/auth/logout')
  } catch (error) {
    console.warn('Logout API error:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  toast.success('Berhasil logout. Sampai jumpa!')
  isLoggingOut.value = false
    router.push('/login')
  }
}

const fetchNotifications = async () => {
  isLoadingNotifications.value = true

  try {
    const response = await getNotifications({ limit: 10 })
    notifications.value = Array.isArray(response.data?.data) ? response.data.data : []
    unreadCount.value = response.data?.unreadCount || 0
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat notifikasi')
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
    notifications.value = notifications.value.map((item) => ({
      ...item,
      isRead: true
    }))
    unreadCount.value = 0
    toast.success('Semua notifikasi ditandai sudah dibaca')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui notifikasi')
  }
}

const notificationIcon = (type) => {
  return type === 'MODULE_COMPLETED' ? CheckCircle2 : Bell
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

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem('user')
    if (raw && raw !== 'undefined') {
      const u = JSON.parse(raw)
      userName.value = u.name || ''
      userRole.value = u.role || ''
    }
  } catch {}
}

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/profile'); 
    userName.value = response.data.name;
    userRole.value = response.data.role;
    const raw = localStorage.getItem('user')
    if (raw) {
      const u = JSON.parse(raw)
      localStorage.setItem('user', JSON.stringify({ ...u, name: userName.value, role: userRole.value }))
    }
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    router.push('/login');
  }
};

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Learning Path', href: '/learning-path', icon: BookOpen },
  { name: 'Projects', href: '/project-submission', icon: CheckSquare },
]

const accountNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/edit-profile', icon: Settings }
]

const xpProgress = computed(() => {
  const current = learningStats.value.currentLevelXp || 0
  const next = learningStats.value.nextLevelXp || 1200

  return Math.min(Math.round((current / next) * 100), 100)
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const fetchLearningStats = async () => {
  try {
    const response = await api.get('/member/dashboard')
    const data = response.data?.data || response.data

    if (data.learningStats) {
      learningStats.value = data.learningStats
    }
  } catch {}
}

onMounted(() => {
  loadFromStorage();
  fetchUserProfile();
  fetchNotifications();
  fetchLearningStats();
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('notification:refresh', fetchNotifications)
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('notification:refresh', fetchNotifications)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    
    <div v-if="isSidebarOpen" 
         class="fixed inset-0 z-40 bg-black/50 lg:hidden" 
         @click="toggleSidebar">
    </div>

    <aside :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="h-full flex flex-col">
       <div class="px-6 py-7 flex flex-col items-center gap-3">

  <div class="w-16 h-16 flex items-center justify-center">
    <img 
      src="/proclub.png" 
      alt="Logo Proclub" 
      class="w-full h-full object-contain"
    />
  </div>
  
  <div class="flex flex-col items-center">
    <span class="text-2xl font-black text-[#1A2E20] tracking-tight">
      Proclub
    </span>
    <span class="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] -mt-1">
      Learning Hub
    </span>
  </div>
</div>

        <nav class="flex-1 px-4 space-y-6 mt-3 overflow-y-auto">
          <div>
            <p class="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Belajar</p>
            <div class="space-y-1.5">
              <RouterLink 
                v-for="item in navigation" 
                :key="item.name" 
                :to="item.href"
                :class="[
                  route.path === item.href || (item.href !== '/' && route.path.startsWith(item.href))
                    ? 'bg-[#2C7047]/10 text-[#2C7047]' 
                    : 'text-gray-600 hover:bg-gray-100',
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all'
                ]"
                @click="isSidebarOpen = false"
              >
                <component :is="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </RouterLink>
            </div>
          </div>

          <div>
            <p class="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Akun</p>
            <div class="space-y-1.5">
              <RouterLink 
                v-for="item in accountNavigation"
                :key="item.name"
                :to="item.href"
                :class="[
                  route.path === item.href 
                    ? 'bg-[#2C7047]/10 text-[#2C7047]' 
                    : 'text-gray-600 hover:bg-gray-100',
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all'
                ]"
                @click="isSidebarOpen = false"
              >
                <component :is="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </RouterLink>
            </div>
          </div>

          <div class="mx-2 rounded-2xl border border-[#E6EFE9] bg-[#F8FBF9] p-4">
            <div class="mb-3 flex items-center justify-between">
              <div>
                <p class="text-sm font-black text-[#1A2E20]">Level {{ learningStats.level || 1 }}</p>
                <p class="text-[11px] font-semibold text-gray-400">{{ learningStats.currentLevelXp || 0 }} / {{ learningStats.nextLevelXp || 1200 }} XP</p>
              </div>
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Zap class="h-5 w-5" />
              </div>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-white">
              <div class="h-full rounded-full bg-[#2C7047] transition-all duration-700" :style="{ width: `${xpProgress}%` }"></div>
            </div>
          </div>
        </nav>

        <div class="px-4 pb-8 space-y-2 mt-auto">
          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut class="w-5 h-5" />
            Logout
          </button>
        </div>


      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
        <button @click="toggleSidebar" class="lg:hidden p-2 text-gray-600">
          <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>

        <div class="hidden md:block">
          <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider">
            STT Cipasung • Informatics Engineering
          </h2>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative" ref="notificationRef">
            <button
              @click="toggleNotificationMenu"
              aria-label="Buka notifikasi"
              class="relative rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#2C7047]"
              type="button"
            >
              <Bell class="w-5 h-5" />
              <span
                v-if="unreadCount > 0"
                class="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white ring-2 ring-white"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="showNotificationMenu"
                class="fixed sm:absolute top-16 sm:top-auto left-4 right-4 sm:left-auto sm:right-0 mt-2 sm:mt-3 w-auto sm:w-[340px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl z-50"
              >
                <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <div>
                    <p class="text-sm font-bold text-[#1A2E20]">Notifikasi</p>
                    <p class="text-[11px] text-gray-400">{{ unreadCount }} belum dibaca</p>
                  </div>
                  <button
                    @click="readAllNotifications"
                    :disabled="!unreadCount"
                    class="text-[11px] font-bold text-[#2C7047] transition-colors hover:text-[#235838] disabled:text-gray-300"
                    type="button"
                  >
                    Tandai semua
                  </button>
                </div>

                <div v-if="isLoadingNotifications" class="flex items-center justify-center py-10 text-gray-400">
                  <Loader2 class="h-5 w-5 animate-spin" />
                </div>

                <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                  <Inbox class="h-8 w-8 text-gray-300" />
                  <p class="text-sm font-semibold text-gray-500">Belum ada notifikasi</p>
                  <p class="text-xs leading-relaxed text-gray-400">Kabar module baru dan pencapaian belajar akan muncul di sini.</p>
                </div>

                <div v-else class="max-h-[420px] overflow-y-auto p-2">
                  <button
                    v-for="notification in notifications"
                    :key="notification.id"
                    @click="readNotification(notification)"
                    class="flex w-full gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50"
                    type="button"
                  >
                    <div
                      class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      :class="notification.type === 'MODULE_COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'"
                    >
                      <component :is="notificationIcon(notification.type)" class="h-4 w-4" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-start justify-between gap-2">
                        <p class="line-clamp-1 text-[13px] font-bold text-[#1A2E20]">{{ notification.title }}</p>
                        <Circle v-if="!notification.isRead" class="mt-1 h-2.5 w-2.5 shrink-0 fill-red-500 text-red-500" />
                      </div>
                      <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500 break-all sm:break-words">{{ notification.message }}</p>
                      <p class="mt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-300">
                        {{ formatNotificationDate(notification.createdAt) }}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
          <div class="h-8 w-[1px] bg-gray-200 mx-1"></div>
          <div class="relative pl-2" ref="profileRef">
            <button 
              @click="toggleProfileMenu"
              class="flex items-center gap-3 hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors"
            >
              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-gray-800 leading-none capitalize">{{ userName || 'User'}}</p>
                <p class="text-xs text-gray-500 mt-1 lowercase">{{ userRole || 'Member'}}</p>
              </div>
              <div class="w-9 h-9 rounded-full bg-[#2C7047] flex items-center justify-center text-white text-[13px] font-bold border border-gray-200 shrink-0">
                {{ initials }}
              </div>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="showProfileMenu ? '-rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div class="p-2">
                  <router-link 
                    to="/profile" 
                    @click="showProfileMenu = false"
                    class="flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User class="w-4 h-4" />
                    My Profile
                  </router-link>
                  <div class="h-px bg-gray-100 my-1"></div>
                  <button 
                    @click="handleLogout"
                    :disabled="isLoggingOut"
                    class="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <LogOut class="w-4 h-4" />
                    {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-7">
        <div class="mx-auto">
          <RouterView />
        </div>
      </main>

      <footer class="bg-white border-t border-gray-200 py-6 px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-500 text-center">
            © 2026 Proclub STT Cipasung. Built with 💚 for the community.
          </p>
          <div class="flex gap-3 text-gray-400">
            <a href="#" aria-label="Instagram Proclub" class="rounded-xl border border-gray-100 p-2 transition hover:border-[#2C7047]/30 hover:text-[#2C7047]">
              <Instagram class="h-5 w-5" />
            </a>
            <a href="#" aria-label="TikTok Proclub" class="rounded-xl border border-gray-100 p-2 transition hover:border-[#2C7047]/30 hover:text-[#2C7047]">
              <Music2 class="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.translate-x-0 {
  box-shadow: 10px 0 30px -10px rgba(0,0,0,0.1);
}
</style>
