<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex items-center gap-2 text-sm mb-4">
      <router-link to="/admin/users" class="text-gray-500 hover:text-gray-700">User Management</router-link>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      <span class="text-[#0D7A42] font-medium">{{ isEditMode ? 'Edit User' : 'Create User' }}</span>
    </div>

    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#1A2E20]">{{ isEditMode ? 'Edit User' : 'Add New User' }}</h1>
      <p class="text-gray-500 mt-2 text-[15px]">
        {{ isEditMode ? 'Update user information for the platform.' : 'Register a new account to the system.' }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl border border-[#E6EFE9] p-8 shadow-sm">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-[#E6EFE9]">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-[#0D7A42]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              <h2 class="text-xl font-bold text-[#1A2E20]">Account Information</h2>
            </div>
          </div>

          <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D7A42]"></div>
            <p class="text-gray-500 mt-4 text-sm">Loading...</p>
          </div>

          <form v-else @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  v-model="form.name"
                  placeholder="e.g. John Doe"
                  class="w-full bg-white border border-[#E6EFE9] rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D7A42]/20 focus:border-[#0D7A42] transition-colors"
                  :class="{ 'border-red-500': errors.name }"
                />
                <p v-if="errors.name" class="text-red-500 text-xs mt-1.5">{{ errors.name }}</p>
              </div>

              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="text" 
                  v-model="form.email"
                  placeholder="john@proclub"
                  class="w-full bg-white border border-[#E6EFE9] rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D7A42]/20 focus:border-[#0D7A42] transition-colors"
                  :class="{ 'border-red-500 text-red-600': errors.email }"
                />
                <p v-if="errors.email" class="text-red-500 text-xs mt-1.5">{{ errors.email }}</p>
              </div>

              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-2">System Role</label>
                <div class="relative">
                  <select 
                    v-model="form.role"
                    class="w-full appearance-none bg-white border border-[#E6EFE9] rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D7A42]/20 focus:border-[#0D7A42] transition-colors"
                    :class="{ 'border-red-500': errors.role }"
                  >
                    <option value="" disabled>Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Member">Member</option>
                  </select>
                  <svg class="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-2">
                  {{ isEditMode ? 'New Password (Optional)' : 'Password' }}
                </label>
                <div class="relative">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    v-model="form.password"
                    :placeholder="isEditMode ? 'Leave blank to keep current' : 'Min. 8 characters'"
                    class="w-full bg-white border border-[#E6EFE9] rounded-xl px-4 py-3 pr-12 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D7A42]/20 focus:border-[#0D7A42] transition-colors"
                    :class="{ 'border-red-500': errors.password }"
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  </button>
                </div>
                <p v-if="errors.password" class="text-red-500 text-xs mt-1.5">{{ errors.password }}</p>
              </div>
            </div>

            <div class="mt-8 flex items-center justify-end gap-4 pt-4">
              <button type="button" @click="goBack" class="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button type="submit" :disabled="isSubmitting" class="px-6 py-2.5 bg-[#0D7A42] text-white rounded-lg text-sm font-bold hover:bg-[#0A6034] transition-colors disabled:opacity-70 flex items-center gap-2">
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isEditMode ? 'Update User' : 'Save User' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-[#EAF3EE] rounded-2xl p-6 border border-[#D5E6DC]">
          <h3 class="text-sm font-bold text-[#1A2E20] mb-3">Permissions Note</h3>
          <p class="text-[13px] text-gray-700 leading-relaxed">
            {{ isEditMode 
              ? 'Updating the role will immediately change the user\'s access level.' 
              : 'New users will receive a welcome email with their account details.' 
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../../api/index.js'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const userId = route.params.id 
const isEditMode = computed(() => !!userId)
const isLoading = ref(isEditMode.value)
const isSubmitting = ref(false)
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  role: '',
  password: '',
  isActive: true
})

const errors = reactive({
  name: '',
  email: '',
  role: '',
  password: ''
})

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await api.get(`/${userId}`)
      const userData = response.data.data || response.data
      
      form.name = userData.name
      form.email = userData.email
      form.role = userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
      form.isActive = userData.isActive
    } catch (error) {
      toast.error('Failed to load user data.')
      router.push('/admin/users')
    } finally {
      isLoading.value = false
    }
  }
})

const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach(key => errors[key] = '')

  if (!form.name.trim()) {
    errors.name = 'Full Name is required'
    isValid = false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Email Address is required'
    isValid = false
  } else if (!emailPattern.test(form.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }

  if (!isEditMode.value && !form.password) {
    errors.password = 'Password is required for new users'
    isValid = false
  } else if (form.password && form.password.length < 8) {
    errors.password = 'Must contain at least 8 characters'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role.toLowerCase(),
      isActive: form.isActive
    }

    if (form.password) payload.password = form.password

    if (isEditMode.value) {
      await api.put(`/${userId}`, payload)
      toast.success('User updated successfully.')
    } else {
      await api.post('/', payload)
      toast.success('User created successfully.')
    }
    
    router.push('/admin/users')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed.')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/admin/users')
}
</script>