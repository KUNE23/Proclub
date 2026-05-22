<template>
  <main class="mx-auto max-w-5xl space-y-5 p-5 text-[#13251A]">
    <section class="flex flex-col gap-4 rounded-[24px] border border-[#E3EEE7] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.18em] text-[#0D7A42]">Admin Notifications</p>
        <h1 class="mt-2 text-2xl font-black text-[#07111F]">Pusat Notifikasi</h1>
        <p class="mt-1 text-sm text-gray-500">Pantau aktivitas penting dari student dan sistem Proclub.</p>
      </div>
      <button
        type="button"
        :disabled="unreadCount === 0 || isMarkingAll"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D7A42] px-4 py-3 text-sm font-black text-white transition hover:bg-[#096336] disabled:cursor-not-allowed disabled:opacity-50"
        @click="readAll"
      >
        <CheckCheck class="h-4 w-4" />
        Tandai Dibaca
      </button>
    </section>

    <section class="rounded-[24px] border border-[#E3EEE7] bg-white p-4 shadow-sm sm:p-6">
      <div v-if="isLoading" class="space-y-3">
        <div v-for="item in 5" :key="item" class="h-20 animate-pulse rounded-2xl bg-gray-100"></div>
      </div>

      <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center rounded-2xl bg-[#F8FBF9] px-6 py-16 text-center">
        <Inbox class="h-10 w-10 text-gray-300" />
        <p class="mt-3 text-sm font-bold text-gray-500">Belum ada notifikasi admin</p>
      </div>

      <div v-else class="space-y-3">
        <button
          v-for="notification in notifications"
          :key="notification.id"
          type="button"
          class="flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition hover:border-[#0D7A42]/40 hover:bg-[#F8FBF9]"
          :class="notification.isRead ? 'border-[#E3EEE7] bg-white' : 'border-[#BFE8CE] bg-[#F3FBF6]'"
          @click="openNotification(notification)"
        >
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" :class="iconStyle(notification.type)">
            <component :is="notificationIcon(notification.type)" class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-black text-[#07111F]">{{ notification.title }}</h2>
              <Circle v-if="!notification.isRead" class="mt-1 h-2.5 w-2.5 shrink-0 fill-red-500 text-red-500" />
            </div>
            <p class="mt-1 text-sm leading-relaxed text-gray-500 break-all sm:break-words">{{ notification.message }}</p>
            <p class="mt-3 text-xs font-bold text-gray-400">{{ formatDate(notification.createdAt) }}</p>
          </div>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Bell, BookCheck, CheckCheck, CheckCircle2, Circle, FolderGit2, Inbox, UserPlus } from 'lucide-vue-next'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../../services/notificationService'

const router = useRouter()
const toast = useToast()
const notifications = ref([])
const unreadCount = ref(0)
const isLoading = ref(false)
const isMarkingAll = ref(false)

const notificationIcon = (type) => {
  const icons = {
    USER_REGISTERED: UserPlus,
    LESSON_COMPLETED: BookCheck,
    MODULE_COMPLETED: CheckCircle2,
    COURSE_COMPLETED: CheckCircle2,
    PROJECT_SUBMITTED: FolderGit2
  }

  return icons[type] || Bell
}

const iconStyle = (type) => {
  if (type === 'USER_REGISTERED') return 'bg-blue-50 text-blue-600'
  if (type === 'PROJECT_SUBMITTED') return 'bg-amber-50 text-amber-600'
  if (type === 'COURSE_COMPLETED') return 'bg-emerald-100 text-emerald-700'
  return 'bg-[#EAF7EF] text-[#0D7A42]'
}

const formatDate = (value) => {
  if (!value) return ''

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

const fetchNotifications = async () => {
  try {
    isLoading.value = true
    const response = await getNotifications({ limit: 50 })
    notifications.value = Array.isArray(response.data?.data) ? response.data.data : []
    unreadCount.value = response.data?.unreadCount || 0
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat notifikasi admin')
  } finally {
    isLoading.value = false
  }
}

const openNotification = async (notification) => {
  try {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id)
      notification.isRead = true
      unreadCount.value = Math.max(unreadCount.value - 1, 0)
    }

    if (notification.link) {
      router.push(notification.link)
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal membuka notifikasi')
  }
}

const readAll = async () => {
  try {
    isMarkingAll.value = true
    await markAllNotificationsAsRead()
    notifications.value = notifications.value.map((notification) => ({
      ...notification,
      isRead: true
    }))
    unreadCount.value = 0
    toast.success('Semua notifikasi admin sudah dibaca')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui notifikasi')
  } finally {
    isMarkingAll.value = false
  }
}

onMounted(fetchNotifications)
</script>
