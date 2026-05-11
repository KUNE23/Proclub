<template>
  <div class="p-8 max-w-5xl mx-auto space-y-8 pb-20">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-[#1A2E20]">Profile Settings</h1>
        <p class="text-gray-500 mt-1.5 text-[15px]">Manage your personal information and account security.</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#E6EFE9] shadow-sm overflow-hidden">
      <div class="p-6 border-b border-[#E6EFE9] flex items-center gap-3">
        <div class="text-[#16A34A]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <h2 class="text-[17px] font-bold text-[#1A2E20]">Personal Information</h2>
      </div>
      
      <div class="p-8">
        <div class="flex flex-col md:flex-row gap-12 items-start">
          <div class="flex-1 space-y-6 w-full">
            <div class="space-y-2">
              <label class="text-[13px] font-bold text-[#1A2E20]">Full Name</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-[#16A34A] transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <input 
                  type="text" 
                  v-model="formData.name"
                  placeholder="Enter your full name"
                  class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                >
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[13px] font-bold text-[#1A2E20]">Email Address</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-[#16A34A] transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <input 
                  type="email" 
                  v-model="formData.email"
                  placeholder="Enter your email address"
                  class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gray-50/50 border-t border-[#E6EFE9] flex items-center justify-end gap-3">
        <button class="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
        <button 
          @click="saveChanges"
          class="px-6 py-2.5 bg-[#16A34A] text-white text-sm font-bold rounded-lg hover:bg-[#138a3e] transition-all shadow-md shadow-[#16A34A]/20"
        >
          Save Changes
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#E6EFE9] shadow-sm overflow-hidden">
      <div class="p-6 border-b border-[#E6EFE9] flex items-center gap-3">
        <div class="text-[#16A34A]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 class="text-[17px] font-bold text-[#1A2E20]">Security Settings</h2>
      </div>

      <div class="p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[13px] font-bold text-[#1A2E20]">Current Password</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input 
                  type="password" 
                  v-model="passwordData.currentPassword"
                  placeholder="••••••••••••"
                  class="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                >
                <button class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[13px] font-bold text-[#1A2E20]">New Password</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input 
                  type="password" 
                  v-model="passwordData.newPassword"
                  placeholder="Min. 8 characters"
                  class="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                >
                <button class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                </button>
              </div>
              <div class="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
                <div :class="['h-full transition-all duration-500', passwordStrength.color, passwordStrength.width]"></div>
              </div>
              <p :class="['text-[10px] font-bold uppercase tracking-wider', passwordStrength.text]">Password Strength: {{ passwordStrength.label }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-[13px] font-bold text-[#1A2E20]">Confirm New Password</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input 
                  type="password" 
                  v-model="passwordData.confirmPassword"
                  placeholder="Repeat new password"
                  class="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                >
              </div>
            </div>
          </div>

          <div class="bg-[#F9FAFB] rounded-xl p-8 border border-[#E6EFE9]">
            <h4 class="text-sm font-bold text-[#1A2E20] mb-6">Password Requirements</h4>
            <ul class="space-y-4">
              <li class="flex items-center gap-3 text-[13px]" :class="passwordReqs.length ? 'text-gray-600' : 'text-gray-400'">
                <div v-if="passwordReqs.length" class="w-5 h-5 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div v-else class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center"></div>
                Minimum 8 characters
              </li>
              <li class="flex items-center gap-3 text-[13px]" :class="passwordReqs.uppercase ? 'text-gray-600' : 'text-gray-400'">
                <div v-if="passwordReqs.uppercase" class="w-5 h-5 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div v-else class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center"></div>
                At least one uppercase letter
              </li>
              <li class="flex items-center gap-3 text-[13px]" :class="passwordReqs.number ? 'text-gray-600' : 'text-gray-400'">
                <div v-if="passwordReqs.number" class="w-5 h-5 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div v-else class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center"></div>
                At least one number (0-9)
              </li>
              <li class="flex items-center gap-3 text-[13px]" :class="passwordReqs.special ? 'text-gray-600' : 'text-gray-400'">
                <div v-if="passwordReqs.special" class="w-5 h-5 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div v-else class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center"></div>
                At least one special character (!@#)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gray-50/50 border-t border-[#E6EFE9] flex items-center justify-end">
        <button 
          @click="updatePassword"
          class="px-6 py-2.5 bg-[#16A34A] text-white text-sm font-bold rounded-lg hover:bg-[#138a3e] transition-all shadow-md shadow-[#16A34A]/20">
          Update Password
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../../api/index.js'

const toast = useToast()

const user = ref({
  name: '',
  email: '',
  role: '',
  avatar: ''
})

const formData = ref({
  name: '',
  email: ''
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordReqs = computed(() => {
  const p = passwordData.value.newPassword;
  return {
    length: p.length >= 8,
    uppercase: /[A-Z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[^A-Za-z0-9]/.test(p)
  }
})

const passwordStrength = computed(() => {
  const reqs = passwordReqs.value;
  const passed = Object.values(reqs).filter(Boolean).length;
  if (passed === 0) return { label: 'Weak', color: 'bg-red-500', width: 'w-0', text: 'text-red-500' };
  if (passed <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3', text: 'text-red-500' };
  if (passed === 3) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3', text: 'text-yellow-500' };
  return { label: 'Strong', color: 'bg-[#16A34A]', width: 'w-full', text: 'text-[#16A34A]' };
})

function loadUser() {
  try {
    const raw = localStorage.getItem('user')
    if (raw && raw !== 'undefined') {
      const u = JSON.parse(raw)
      user.value = u
      formData.value.name = u.name || ''
      formData.value.email = u.email || ''
    }
  } catch {}
}

async function saveChanges() {
  if (!user.value.id) return;
  try {
    const res = await api.put(`/${user.value.id}`, {
      name: formData.value.name,
      email: formData.value.email
    })
    
    const u = { ...user.value, ...res.data }
    localStorage.setItem('user', JSON.stringify(u))
    user.value = u
    
    toast.success('Settings updated successfully!')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update settings')
  }
}

async function updatePassword() {
  if (!user.value.id) return;
  
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    toast.error('New password and confirm password must match')
    return
  }

  try {
    await api.put(`/${user.value.id}`, {
      currentPassword: passwordData.value.currentPassword,
      password: passwordData.value.newPassword
    })
    
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    toast.success('Password updated successfully!')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update password')
  }
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.3s ease-out forwards;
}
</style>
