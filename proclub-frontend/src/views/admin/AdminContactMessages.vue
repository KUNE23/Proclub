<template>
  <div class="min-h-full bg-[#FAFCFB] px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.2em] text-[#0D7A42]">Landing Page</p>
        <h1 class="mt-2 text-2xl font-black text-[#07111F]">Contact Messages</h1>
        <p class="mt-1 text-sm text-gray-500">Kelola pesan yang dikirim pengunjung dari landing page Proclub.</p>
      </div>
      <div class="rounded-2xl border border-[#E6EFE9] bg-white px-5 py-4 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Unread</p>
        <p class="text-2xl font-black text-[#0D7A42]">{{ unreadCount }}</p>
      </div>
    </div>

    <div class="mb-5 grid gap-3 rounded-2xl border border-[#E6EFE9] bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
      <div class="relative">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model.trim="filters.search"
          type="text"
          class="w-full rounded-xl border border-[#E6EFE9] bg-[#F8FBF9] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0D7A42] focus:bg-white focus:ring-4 focus:ring-[#0D7A42]/10"
          placeholder="Cari nama, email, atau isi pesan..."
          @keyup.enter="fetchMessages"
        >
      </div>
      <select
        v-model="filters.status"
        class="rounded-xl border border-[#E6EFE9] bg-[#F8FBF9] px-4 py-3 text-sm font-bold text-[#1A2E20] outline-none transition focus:border-[#0D7A42] focus:bg-white focus:ring-4 focus:ring-[#0D7A42]/10"
        @change="fetchMessages"
      >
        <option value="">Semua Status</option>
        <option value="unread">Belum Dibaca</option>
        <option value="read">Sudah Dibaca</option>
      </select>
    </div>

    <div class="overflow-hidden rounded-2xl border border-[#E6EFE9] bg-white shadow-sm">
      <div v-if="isLoading" class="flex items-center justify-center py-20 text-[#0D7A42]">
        <Loader2 class="h-8 w-8 animate-spin" />
      </div>

      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center px-6 py-20 text-center">
        <Inbox class="h-12 w-12 text-gray-300" />
        <h2 class="mt-4 text-lg font-black text-[#1A2E20]">Belum ada pesan</h2>
        <p class="mt-2 max-w-sm text-sm leading-6 text-gray-500">Pesan dari form landing page akan muncul di sini.</p>
      </div>

      <div v-else class="divide-y divide-[#EEF4F0]">
        <article v-for="message in messages" :key="message.id" class="grid gap-4 p-5 transition hover:bg-[#F8FBF9] lg:grid-cols-[1fr_auto]">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]" :class="message.isRead ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-[#0D7A42]'">
                {{ message.isRead ? 'Sudah Dibaca' : 'Belum Dibaca' }}
              </span>
              <span class="text-xs font-semibold text-gray-400">{{ formatDate(message.createdAt) }}</span>
            </div>
            <h3 class="mt-3 text-base font-black text-[#07111F]">{{ message.name }}</h3>
            <a :href="`mailto:${message.email}`" class="mt-1 inline-flex items-center gap-2 text-sm font-bold text-[#0D7A42]">
              <Mail class="h-4 w-4" />
              {{ message.email }}
            </a>
            <p class="mt-4 whitespace-pre-line rounded-2xl bg-[#F8FBF9] p-4 text-sm leading-7 text-gray-600">{{ message.message }}</p>
          </div>

          <div class="flex items-start gap-2 lg:justify-end">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-[#E6EFE9] px-4 py-2 text-xs font-black text-[#1A2E20] transition hover:border-[#0D7A42]/30 hover:bg-emerald-50 hover:text-[#0D7A42]"
              @click="toggleRead(message)"
            >
              <CheckCircle2 class="h-4 w-4" />
              {{ message.isRead ? 'Tandai Belum' : 'Tandai Dibaca' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
              @click="openDeleteModal(message)"
            >
              <Trash2 class="h-4 w-4" />
              Hapus
            </button>
          </div>
        </article>
      </div>
    </div>

    <div v-if="pagination.totalPages > 1" class="mt-5 flex items-center justify-end gap-2">
      <button
        type="button"
        class="rounded-xl border border-[#E6EFE9] bg-white px-4 py-2 text-sm font-black text-[#1A2E20] disabled:opacity-40"
        :disabled="pagination.page <= 1"
        @click="changePage(pagination.page - 1)"
      >
        Prev
      </button>
      <span class="px-3 text-sm font-bold text-gray-500">{{ pagination.page }} / {{ pagination.totalPages }}</span>
      <button
        type="button"
        class="rounded-xl border border-[#E6EFE9] bg-white px-4 py-2 text-sm font-black text-[#1A2E20] disabled:opacity-40"
        :disabled="pagination.page >= pagination.totalPages"
        @click="changePage(pagination.page + 1)"
      >
        Next
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Trash2 class="h-6 w-6" />
          </div>
          <h2 class="mt-4 text-xl font-black text-[#07111F]">Hapus pesan?</h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">Pesan dari {{ deleteTarget.name }} akan dihapus dari daftar admin.</p>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="rounded-xl bg-gray-100 px-4 py-2 text-sm font-black text-gray-600" @click="deleteTarget = null">Batal</button>
            <button type="button" class="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white disabled:bg-gray-300" :disabled="isDeleting" @click="removeMessage">
              {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { CheckCircle2, Inbox, Loader2, Mail, Search, Trash2 } from 'lucide-vue-next'
import { deleteContactMessage, getContactMessages, updateContactMessage } from '../../services/contactService.js'

const toast = useToast()
const messages = ref([])
const unreadCount = ref(0)
const isLoading = ref(false)
const isDeleting = ref(false)
const deleteTarget = ref(null)
const filters = reactive({
  search: '',
  status: ''
})
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
})

const fetchMessages = async () => {
  isLoading.value = true

  try {
    const response = await getContactMessages({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search || undefined,
      status: filters.status || undefined
    })
    messages.value = response.data?.data || []
    unreadCount.value = response.data?.unreadCount || 0
    Object.assign(pagination, response.data?.pagination || pagination)
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat pesan kontak')
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  pagination.page = page
  fetchMessages()
}

const toggleRead = async (message) => {
  try {
    const response = await updateContactMessage(message.id, { isRead: !message.isRead })
    toast.success(response.data?.message || 'Status pesan berhasil diperbarui')
    await fetchMessages()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui pesan')
  }
}

const openDeleteModal = (message) => {
  deleteTarget.value = message
}

const removeMessage = async () => {
  if (!deleteTarget.value) return
  isDeleting.value = true

  try {
    const response = await deleteContactMessage(deleteTarget.value.id)
    toast.success(response.data?.message || 'Pesan berhasil dihapus')
    deleteTarget.value = null
    await fetchMessages()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus pesan')
  } finally {
    isDeleting.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

onMounted(fetchMessages)
</script>
