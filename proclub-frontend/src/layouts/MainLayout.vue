<script setup>
import { ref, onMounted } from 'vue'
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

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await api.post('/auth/logout')
  } catch (error) {
    console.warn('Logout API error:', error)
  } finally {
    localStorage.removeItem('accessToken')
    toast.success('Berhasil logout. Sampai jumpa!')
    isLoggingOut.value = false
    router.push('/login')
  }
}

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/profile'); 
    userName.value = response.data.name;
    userRole.value = response.data.role;
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    router.push('/login');
  }
};

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses-catalog', icon: BookOpen },
  { name: 'Projects', href: '/project-submission', icon: CheckSquare },
  { name: 'Profile', href: '/profile', icon: User },
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  fetchUserProfile();
});
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

        <div class="p-4 border-t border-gray-100">
        <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <LogOut class="w-5 h-5" />
            <span class="font-medium">{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
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
          <button class="p-2 text-gray-400 hover:text-[#2C7047] relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div class="h-8 w-[1px] bg-gray-200 mx-1"></div>
          <div class="flex items-center gap-3 pl-2">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold text-gray-800 leading-none">{{ userName || 'Loading...'}}</p>
              <p class="text-xs text-gray-500 mt-1">{{ userRole || 'Loading...'}}</p>
            </div>
            <img src="https://ui-avatars.com/api/?name=KUNE&background=2C7047&color=fff" 
                 alt="Avatar" 
                 class="w-9 h-9 rounded-full border border-gray-200" />
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