<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import api from '../api/index.js'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isSidebarOpen = ref(false)
const isLoggingOut = ref(false)
const userName = ref('');
const userRole = ref('');
const showProfileMenu = ref(false)
const profileRef = ref(null)

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleClickOutside = (e) => {
  if (profileRef.value && !profileRef.value.contains(e.target)) {
    showProfileMenu.value = false
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
    // Keep storage in sync
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
  { name: 'Courses', href: '/courses-catalog', icon: BookOpen },
  { name: 'Projects', href: '/project-submission', icon: CheckSquare },
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  loadFromStorage();
  fetchUserProfile();
  document.addEventListener('click', handleClickOutside)
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
       <div class="p-8 flex flex-col items-center gap-4">

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

        <nav class="flex-1 px-4 space-y-2 mt-4">
          <RouterLink 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.href"
            :class="[
              route.path === item.href 
                ? 'bg-[#2C7047]/10 text-[#2C7047]' 
                : 'text-gray-600 hover:bg-gray-100',
              'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all'
            ]"
            @click="isSidebarOpen = false"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </RouterLink>
        </nav>


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
          <button class="p-2 text-gray-400 hover:text-[#2C7047] relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
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

      <main class="flex-1 overflow-y-auto lg:p-20">
        <div class="mx-auto">
          <RouterView />
        </div>
      </main>

      <footer class="bg-white border-t border-gray-200 py-6 px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-500 text-center">
            © 2026 Proclub STT Cipasung. Built with 💚 for the community.
          </p>
          <div class="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#" class="hover:text-[#2C7047]">Instagram</a>
            <a href="#" class="hover:text-[#2C7047]">Support</a>
            <a href="#" class="hover:text-[#2C7047]">Privacy Policy</a>
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