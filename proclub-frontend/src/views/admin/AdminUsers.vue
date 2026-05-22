<template>
  <div class="p-5 max-w-7xl mx-auto space-y-5">

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

    <div class="overflow-x-auto rounded-xl border border-[#E6EFE9] bg-white shadow-sm">
      <table class="min-w-[900px] w-full text-left border-collapse">
        <thead>
          <tr class="bg-white border-b border-[#E6EFE9]">
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Name</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Role</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E6EFE9]">
          <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div class="relative h-10 w-10 shrink-0">
                  <img :src="user.avatar" :alt="user.name" class="h-10 w-10 rounded-full border border-[#E6EFE9] object-cover">
                  <span
                    v-if="user.isOnline"
                    class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
                    title="Sedang login"
                  ></span>
                </div>
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
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="activatingUserId === user.id"
                  class="relative h-7 w-12 rounded-full transition disabled:opacity-60"
                  :class="user.isActive ? 'bg-[#0D7A42]' : 'bg-gray-300'"
                  :title="user.isActive ? 'Nonaktifkan akun' : 'Aktifkan akun'"
                  @click="toggleActivation(user)"
                >
                  <span
                    class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
                    :class="user.isActive ? 'left-6' : 'left-1'"
                  ></span>
                </button>
                <span class="text-[12px] font-bold" :class="user.isActive ? 'text-[#0D7A42]' : 'text-gray-400'">
                  {{ user.isActive ? 'Aktif' : 'Menunggu' }}
                </span>
              </div>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <router-link :to="`/admin/users/edit/${user.id}`" class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </router-link>
                <button @click="confirmDeleteUser(user)" class="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete User">
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
    <Teleport to="body">
      <div v-if="userToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" @click="userToDelete = null"></div>
        <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </div>
          <h3 class="text-lg font-bold text-[#1A2E20]">Hapus User?</h3>
          <p class="my-4 text-[13px] leading-relaxed text-gray-500">
            User "{{ userToDelete.name }}" akan dihapus dari sistem.
          </p>
          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-xl bg-gray-100 py-2.5 text-[13px] font-semibold text-gray-600"
              @click="userToDelete = null"
            >
              Batal
            </button>
            <button
              type="button"
              class="flex-1 rounded-xl bg-red-600 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
              :disabled="deleting"
              @click="deleteSelectedUser"
            >
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../api/index.js'
import { useToast } from 'vue-toastification'

const users = ref([])
const selectedRole = ref('All Roles');
const toast = useToast()
const userToDelete = ref(null)
const deleting = ref(false)
const activatingUserId = ref(null)

const currentPage = ref(1);
const itemsPerPage = ref(5);

const confirmDeleteUser = (user) => {
  userToDelete.value = user
}

const deleteSelectedUser = async () => {
  if (!userToDelete.value) return

  deleting.value = true

  try {
    await api.delete(`/${userToDelete.value.id}`)
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    toast.warning('User berhasil dihapus')
    userToDelete.value = null
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus user')
  } finally {
    deleting.value = false
  }
}

const toggleActivation = async (user) => {
  try {
    activatingUserId.value = user.id
    const nextStatus = !user.isActive
    const response = await api.patch(`/${user.id}/activation`, { isActive: nextStatus })
    const updatedUser = response.data?.user

    users.value = users.value.map((item) => {
      if (item.id !== user.id) return item
      return {
        ...item,
        isActive: updatedUser?.isActive ?? nextStatus
      }
    })

    toast.success(nextStatus ? 'Akun berhasil diaktifkan' : 'Akun berhasil dinonaktifkan')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal mengubah status akun')
  } finally {
    activatingUserId.value = null
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
          isActive: u.isActive ?? true,
          isOnline: Boolean(u.isOnline),
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
