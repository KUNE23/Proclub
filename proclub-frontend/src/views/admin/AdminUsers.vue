<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#1A2E20]">User Management</h1>
        <p class="text-gray-500 mt-1 text-[13px]">Manage platform participants, assign roles, and track learning progress.</p>
      </div>
      <router-link to="/admin/users/create" class="px-4 py-2.5 bg-[#0D7A42] text-white rounded-lg text-sm font-semibold hover:bg-[#0A6034] flex items-center gap-2 transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
        Add New User
      </router-link>
    </div>

    <div class="bg-white p-4 rounded-xl border border-[#E6EFE9] flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <span class="text-[13px] font-medium text-gray-600">Filter by Role:</span>
          <div class="relative">
          <select 
            v-model="selectedRole"
            class="appearance-none bg-white border border-[#E6EFE9] rounded-lg px-3 py-1.5 pr-8 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-[#0D7A42]"
          >
            <option value="All Roles">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="mentor">Mentor</option>
          </select>
          <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
        </div>
    
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#E6EFE9] overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-white border-b border-[#E6EFE9]">
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Name</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Role</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E6EFE9]">
          <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full object-cover border border-[#E6EFE9]">
                <div>
                  <p class="text-[14px] font-bold text-[#1A2E20]">{{ user.name }}</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">Joined {{ user.joinedAt }}</p>
                </div>
              </div>
            </td>
            <td class="py-4 px-6">
              <span class="text-[13px] text-gray-600">{{ user.email }}</span>
            </td>
            <td class="py-4 px-6">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize"
                :class="{
                  'bg-[#F0FDF4] text-[#16A34A]': user.role === 'Student' || user.role === 'member',
                  'bg-[#FEF2F2] text-[#DC2626]': user.role === 'Mentor' || user.role === 'mentor',
                  'bg-gray-900 text-white': user.role === 'Admin' || user.role === 'admin',
                }">
                {{ user.role }}
              </span>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <router-link :to="`/admin/users/edit/${user.id}`" class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </router-link>
                <button @click="deleteUser(user.id)" class="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete User">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
    <td colspan="5" class="py-10 text-center text-gray-400">
      No users found for role "{{ selectedRole }}"
    </td>
  </tr>
        </tbody>
      </table>

      <div class="p-4 border-t border-[#E6EFE9] flex items-center justify-between bg-white">

  <span class="text-[12px] text-gray-500 font-medium">
    Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }} users
  </span>

  <div class="flex items-center gap-1">

    <button 
      @click="setPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-30"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>

 
    <button 
      v-for="page in totalPages" 
      :key="page"
      @click="setPage(page)"
      :class="[
        'w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-bold transition-colors',
        currentPage === page ? 'bg-[#0D7A42] text-white' : 'hover:bg-gray-50 text-gray-600'
      ]"
    >
      {{ page }}
    </button>

    <button 
      @click="setPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-30"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </button>
  </div>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../api/index.js'

const users = ref([])
const selectedRole = ref('All Roles');

const currentPage = ref(1);
const itemsPerPage = ref(5);

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await api.delete(`/${id}`)
      users.value = users.value.filter(u => u.id !== id)
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user. Please try again.')
    }
  }
}

const fetchUsers = async () => {
  try {
    const response = await api.get('/')

    const rawData = response.data.users || response.data.data || response.data

    const actualArray = Array.isArray(rawData) ? rawData : []

    if (actualArray.length > 0) {
      users.value = actualArray.map(u => {
        const date = u.createdAt ? new Date(u.createdAt) : new Date()
        const joinedAt = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        
        return {
          id: u.id,
          name: u.name || 'Unknown User',
          email: u.email || '-',
          role: u.role || 'member',
          progress: u.progress || 0, 
          joinedAt: joinedAt,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=random`
        }
      })
    } else {
      console.warn('Array data kosong atau tidak ditemukan')
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const filteredUsers = computed(() => {
  if (selectedRole.value === 'All Roles') {
    return users.value
  }
  return users.value.filter(user => 
    user.role.toLowerCase() === selectedRole.value.toLowerCase()
  )
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1
})

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
