<template>
  <div class="bg-[#FAFCFB] min-h-screen font-sans antialiased text-[#1A2E20]">
    <div class="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      
      <div v-if="isLoading" class="animate-pulse space-y-8">
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 bg-gray-200 rounded-2xl"></div>
          <div class="space-y-3 flex-1">
            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div class="h-64 bg-gray-200 rounded-2xl w-full"></div>
      </div>

      <template v-else>
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <div class="relative">
              <div class="w-24 h-24 rounded-2xl bg-[#0A733F] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#0A733F]/20 shrink-0 overflow-hidden">
                <span v-if="!user.avatar">{{ initials }}</span>
                <img v-else :src="user.avatar" class="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-[#1A2E20]">{{ user.name }}</h1>
                <span class="px-2.5 py-0.5 bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold rounded-full border border-[#16A34A]/20 uppercase tracking-wide">
                  {{ user.role || 'Student' }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">Manage your account information and security settings.</p>
            </div>
          </div>
          <router-link to="/profile" class="px-5 py-2 bg-white border border-[#E6EFE9] text-[#1A2E20] rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
            View Public Profile
          </router-link>
        </div>

        <div class="bg-white rounded-2xl border border-[#E6EFE9] shadow-sm overflow-hidden">
          <div class="p-6 border-b border-[#E6EFE9] flex items-center gap-3">
            <div class="text-[#0A733F]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 class="font-bold text-lg">Personal Information</h2>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  class="w-full px-4 py-3 bg-[#F9FBFA] border border-[#E6EFE9] rounded-xl focus:ring-2 focus:ring-[#0A733F]/20 focus:border-[#0A733F] outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  class="w-full px-4 py-3 bg-[#F9FBFA] border border-[#E6EFE9] rounded-xl focus:ring-2 focus:ring-[#0A733F]/20 focus:border-[#0A733F] outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E6EFE9]">
              <button 
                @click="resetForm"
                class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="handleUpdateProfile"
                :disabled="isUpdating"
                class="px-8 py-2.5 bg-[#0A733F] text-white rounded-xl text-sm font-bold hover:bg-[#086336] transition-all shadow-lg shadow-[#0A733F]/20 disabled:opacity-50"
              >
                {{ isUpdating ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-[#E6EFE9] shadow-sm overflow-hidden">
          <div class="p-6 border-b border-[#E6EFE9] flex items-center gap-3">
            <div class="text-[#0A733F]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 class="font-bold text-lg">Security Settings</h2>
          </div>

          <div class="p-6 space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
              <div class="relative">
                <input 
                  v-model="passwordData.currentPassword"
                  :type="showPass.current ? 'text' : 'password'"
                  class="w-full px-4 py-3 bg-[#F9FBFA] border border-[#E6EFE9] rounded-xl focus:ring-2 focus:ring-[#0A733F]/20 focus:border-[#0A733F] outline-none transition-all"
                  placeholder="••••••••••••"
                />
                <button @click="showPass.current = !showPass.current" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg v-if="!showPass.current" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                <div class="relative">
                  <input 
                    v-model="passwordData.newPassword"
                    :type="showPass.new ? 'text' : 'password'"
                    class="w-full px-4 py-3 bg-[#F9FBFA] border border-[#E6EFE9] rounded-xl focus:ring-2 focus:ring-[#0A733F]/20 focus:border-[#0A733F] outline-none transition-all"
                    placeholder="Min. 8 characters"
                  />
                  <button @click="showPass.new = !showPass.new" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg v-if="!showPass.new" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                <input 
                  v-model="passwordData.confirmPassword"
                  type="password" 
                  class="w-full px-4 py-3 bg-[#F9FBFA] border border-[#E6EFE9] rounded-xl focus:ring-2 focus:ring-[#0A733F]/20 focus:border-[#0A733F] outline-none transition-all"
                  placeholder="Re-type new password"
                />
              </div>
            </div>

            <div class="bg-[#F0FDF4]/50 border border-[#16A34A]/10 rounded-2xl p-5">
              <p class="text-[11px] font-bold text-[#0A733F] uppercase tracking-wider mb-4">Password Requirements</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                <div class="flex items-center gap-2">
                  <div :class="[hasMinLength ? 'text-[#16A34A]' : 'text-gray-300']">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  </div>
                  <span :class="['text-xs font-medium', hasMinLength ? 'text-[#1A2E20]' : 'text-gray-400']">Minimum 8 characters</span>
                </div>
                <div class="flex items-center gap-2">
                  <div :class="[hasSpecial ? 'text-[#16A34A]' : 'text-gray-300']">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  </div>
                  <span :class="['text-xs font-medium', hasSpecial ? 'text-[#1A2E20]' : 'text-gray-400']">At least one special character</span>
                </div>
                <div class="flex items-center gap-2">
                  <div :class="[hasUppercase ? 'text-[#16A34A]' : 'text-gray-300']">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  </div>
                  <span :class="['text-xs font-medium', hasUppercase ? 'text-[#1A2E20]' : 'text-gray-400']">One uppercase letter</span>
                </div>
                <div class="flex items-center gap-2">
                  <div :class="[hasNumber ? 'text-[#16A34A]' : 'text-gray-300']">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  </div>
                  <span :class="['text-xs font-medium', hasNumber ? 'text-[#1A2E20]' : 'text-gray-400']">One number (0-9)</span>
                </div>
                <div class="flex items-center gap-2">
                  <div :class="[passwordsMatch ? 'text-[#16A34A]' : 'text-gray-300']">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  </div>
                  <span :class="['text-xs font-medium', passwordsMatch ? 'text-[#1A2E20]' : 'text-gray-400']">Passwords match</span>
                </div>
              </div>
            </div>

            <div class="flex justify-start">
              <button 
                @click="handleUpdatePassword"
                :disabled="!canUpdatePassword || isUpdating"
                class="px-8 py-3 bg-[#0A733F] text-white rounded-xl text-sm font-bold hover:bg-[#086336] transition-all shadow-lg shadow-[#0A733F]/20 disabled:opacity-50 disabled:shadow-none"
              >
                {{ isUpdating ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const isLoading = ref(true)
const isUpdating = ref(false)

const user = ref({
  id: '',
  name: '',
  email: '',
  role: '',
  avatar: ''
})

const formData = reactive({
  name: '',
  email: ''
})

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPass = reactive({
  current: false,
  new: false
})

const initials = computed(() => {
  if (!user.value.name) return 'U'
  const parts = user.value.name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})

const hasMinLength = computed(() => passwordData.newPassword.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(passwordData.newPassword))
const hasNumber = computed(() => /[0-9]/.test(passwordData.newPassword))
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(passwordData.newPassword))
const passwordsMatch = computed(() => 
  passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword
)

const canUpdatePassword = computed(() => 
  passwordData.currentPassword && 
  hasMinLength.value && 
  hasUppercase.value && 
  hasNumber.value && 
  hasSpecial.value && 
  passwordsMatch.value
)

const loadUser = async () => {
  try {
    const raw = localStorage.getItem('user')
    if (raw && raw !== 'undefined') {
      const parsed = JSON.parse(raw)
      user.value = parsed
      formData.name = parsed.name
      formData.email = parsed.email
    }
    
    const res = await api.get('/profile').catch(() => null)
    if (res?.data) {
      user.value = { ...user.value, ...res.data }
      formData.name = user.value.name
      formData.email = user.value.email
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.name = user.value.name
  formData.email = user.value.email
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const handleUpdateProfile = async () => {
  if (isUpdating.value) return
  isUpdating.value = true
  try {
    const res = await api.put('/profile', {
      name: formData.name,
      email: formData.email
    })
    
    if (res.data) {
      user.value = { ...user.value, ...res.data }
      localStorage.setItem('user', JSON.stringify(user.value))
      toast.success('Profile updated successfully!')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update profile')
  } finally {
    isUpdating.value = false
  }
}

const handleUpdatePassword = async () => {
  if (!canUpdatePassword.value || isUpdating.value) return
  isUpdating.value = true
  try {
    await api.put('/profile', {
      name: formData.name,    
      email: formData.email,
      currentPassword: passwordData.currentPassword, 
      newPassword: passwordData.newPassword          
    })
    
    toast.success('Password updated successfully! Please log in again.')
    logout()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update password')
  } finally {
    isUpdating.value = false
  }
}

onMounted(loadUser)
</script>
