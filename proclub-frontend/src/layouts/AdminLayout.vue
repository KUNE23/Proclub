<template>
  <div class="flex h-screen bg-[#FAFCFB] font-sans antialiased text-gray-800 overflow-hidden">
    <aside class="w-64 bg-white border-r border-[#E6EFE9] flex flex-col shrink-0">
      <div class="p-6 pb-4 flex flex-col items-center text-center">
        <img src="/proclub.png" alt="Proclub Logo" class="w-14 h-14 object-contain mb-3">
        <div>
          <h1 class="text-lg font-bold text-[#1A2E20] leading-tight">Proclub Learning Hub</h1>
          <span class="text-[12px] font-medium text-gray-400 mt-1 block">Admin Console</span>
        </div>
      </div>
      <nav class="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <router-link to="/admin" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors relative" :class="route.path === '/admin' ? 'text-[#0D7A42] bg-[#F2F7F4]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'">
          <div v-if="route.path === '/admin'" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#16A34A] rounded-r-full -ml-4"></div>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Dashboard
        </router-link>
        <router-link to="/admin/courses" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors relative" :class="route.path.startsWith('/admin/courses') ? 'text-[#0D7A42] bg-[#F2F7F4]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'">
          <div v-if="route.path.startsWith('/admin/courses')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#16A34A] rounded-r-full -ml-4"></div>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          Courses / Quizzes
        </router-link>

        <router-link to="/admin/users" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors relative" :class="route.path.startsWith('/admin/users') ? 'text-[#0D7A42] bg-[#F2F7F4]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'">
          <div v-if="route.path.startsWith('/admin/users')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#16A34A] rounded-r-full -ml-4"></div>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Users
        </router-link>
        <router-link to="/admin/progress" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors relative" :class="route.path.startsWith('/admin/progress') ? 'text-[#0D7A42] bg-[#F2F7F4]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'">
          <div v-if="route.path.startsWith('/admin/progress')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#16A34A] rounded-r-full -ml-4"></div>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          User Progress
        </router-link>
        <router-link to="/admin/quiz-results" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors relative" :class="route.path.startsWith('/admin/quiz-results') ? 'text-[#0D7A42] bg-[#F2F7F4]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'">
          <div v-if="route.path.startsWith('/admin/quiz-results')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#16A34A] rounded-r-full -ml-4"></div>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Quiz Result
        </router-link>
        <router-link to="/admin/settings" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors relative" :class="route.path.startsWith('/admin/settings') ? 'text-[#0D7A42] bg-[#F2F7F4]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'">
          <div v-if="route.path.startsWith('/admin/settings')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#16A34A] rounded-r-full -ml-4"></div>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Account Settings
        </router-link>
      </nav>
      <div class="relative p-4 mx-4 mb-6 mt-auto" ref="profileRef">
        <button
          @click="toggleProfileMenu"
          class="w-full bg-[#0A733F] rounded-xl flex items-center gap-3 text-white shadow-lg shadow-[#0A733F]/20 px-3 py-2.5 hover:bg-[#085a31] transition-colors"
        >
          <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[13px] font-bold tracking-wide">
            {{ initials }}
          </div>
          <div class="min-w-0 flex-1 text-left">
            <p class="text-[13px] font-bold truncate text-white">{{ user.name || 'Admin' }}</p>
            <p class="text-[10px] text-green-100 truncate capitalize">{{ user.role || 'Administrator' }}</p>
          </div>
          <svg class="w-4 h-4 text-white/60 shrink-0 transition-transform duration-200" :class="showProfileMenu ? '-rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <div v-if="showProfileMenu" class="absolute bottom-full left-0 right-0 mb-2 mx-0 bg-white rounded-xl shadow-xl border border-[#E6EFE9] overflow-hidden z-50">
            <div class="px-4 py-3 border-b border-[#E6EFE9]">
              <p class="text-[12px] font-bold text-[#1A2E20] truncate">{{ user.name || 'Admin' }}</p>
              <p class="text-[11px] text-gray-400 truncate">{{ user.email || '' }}</p>
            </div>
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Logout
            </button>
          </div>
        </Transition>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden bg-[#FAFCFB]">
  
      <header class="h-16 border-b border-[#E6EFE9] flex items-center justify-between px-8 shrink-0 bg-white shadow-sm z-10">
        <div class="flex-1 max-w-xl">
          <div class="relative group">
          <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider">
            STT Cipasung • Informatics Engineering
          </h2>
           
          </div>
        </div>
        
        <div class="flex items-center gap-5">
          <button class="relative text-gray-400 hover:text-[#16A34A] transition-colors p-2 rounded-lg hover:bg-gray-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>
      
      <main class="flex-1 overflow-y-auto custom-scrollbar">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route  = useRoute()
const router = useRouter()

const user = ref({ name: '', email: '', role: '' })
const showProfileMenu = ref(false)
const profileRef = ref(null)

const initials = computed(() => {
  const name = user.value.name || ''
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase(d)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return 'AD'
})

function loadUser() {
  try {
    const raw = localStorage.getItem('user')
    if (raw && raw !== 'undefined') user.value = JSON.parse(raw)
  } catch {}
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function handleClickOutside(e) {
  if (profileRef.value && !profileRef.value.contains(e.target)) {
    showProfileMenu.value = false
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  loadUser()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
