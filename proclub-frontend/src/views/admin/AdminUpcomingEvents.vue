<template>
  <main class="mx-auto max-w-7xl space-y-6 p-5 text-[#13251A]">
    <section class="flex flex-col gap-4 rounded-[24px] border border-[#E3EEE7] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.18em] text-[#0D7A42]">Upcoming Events</p>
        <h1 class="mt-2 text-2xl font-black text-[#07111F]">Jadwal Kegiatan Proclub</h1>
        <p class="mt-1 text-sm text-gray-500">Buat dan kelola kegiatan terdekat yang tampil di dashboard student.</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D7A42] px-4 py-3 text-sm font-black text-white transition hover:bg-[#096336]"
        @click="resetEventForm"
      >
        <Plus class="h-4 w-4" />
        Jadwal Baru
      </button>
    </section>

    <section class="grid gap-6 xl:grid-cols-[380px_1fr]">
      <article class="rounded-[24px] border border-[#E3EEE7] bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.18em] text-[#0D7A42]">Form Jadwal</p>
            <h2 class="mt-1 text-xl font-black text-[#07111F]">{{ editingEventId ? 'Edit Jadwal' : 'Tambah Jadwal' }}</h2>
          </div>
          <Edit3 v-if="editingEventId" class="h-5 w-5 text-[#0D7A42]" />
          <CalendarDays v-else class="h-5 w-5 text-[#0D7A42]" />
        </div>

        <form class="space-y-4" @submit.prevent="submitEvent">
          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Judul</label>
            <input
              v-model="eventForm.title"
              type="text"
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#0D7A42]"
              :class="eventErrors.title ? 'border-red-300 bg-red-50' : 'border-[#E3EEE7] bg-white'"
              placeholder="Pelatihan Offline Proclub"
            >
            <p v-if="eventErrors.title" class="mt-1 text-xs font-semibold text-red-500">{{ eventErrors.title }}</p>
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Tanggal & Waktu</label>
            <input
              v-model="eventForm.eventDate"
              type="datetime-local"
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#0D7A42]"
              :class="eventErrors.eventDate ? 'border-red-300 bg-red-50' : 'border-[#E3EEE7] bg-white'"
            >
            <p v-if="eventErrors.eventDate" class="mt-1 text-xs font-semibold text-red-500">{{ eventErrors.eventDate }}</p>
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Lokasi</label>
            <input
              v-model="eventForm.location"
              type="text"
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#0D7A42]"
              :class="eventErrors.location ? 'border-red-300 bg-red-50' : 'border-[#E3EEE7] bg-white'"
              placeholder="Lab Komputer STT Cipasung"
            >
            <p v-if="eventErrors.location" class="mt-1 text-xs font-semibold text-red-500">{{ eventErrors.location }}</p>
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">Deskripsi</label>
            <textarea
              v-model="eventForm.description"
              rows="4"
              class="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#0D7A42]"
              :class="eventErrors.description ? 'border-red-300 bg-red-50' : 'border-[#E3EEE7] bg-white'"
              placeholder="Deskripsikan kegiatan terdekat untuk student."
            ></textarea>
            <div class="mt-1 flex justify-between text-xs">
              <p class="font-semibold text-red-500">{{ eventErrors.description }}</p>
              <span class="text-gray-400">{{ eventForm.description.length }}/500</span>
            </div>
          </div>

          <label class="flex items-center justify-between rounded-xl border border-[#E3EEE7] px-4 py-3">
            <span class="text-sm font-bold text-[#07111F]">Aktif tampil di dashboard</span>
            <input v-model="eventForm.isActive" type="checkbox" class="h-4 w-4 accent-[#0D7A42]">
          </label>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="isSavingEvent"
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0D7A42] px-4 py-3 text-sm font-black text-white transition hover:bg-[#096336] disabled:opacity-60"
            >
              <Loader2 v-if="isSavingEvent" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              {{ editingEventId ? 'Simpan Perubahan' : 'Tambah Jadwal' }}
            </button>
            <button
              v-if="editingEventId"
              type="button"
              class="rounded-xl border border-[#E3EEE7] px-4 py-3 text-sm font-black text-gray-500 transition hover:bg-gray-50"
              @click="resetEventForm"
            >
              Batal
            </button>
          </div>
        </form>
      </article>

      <article class="rounded-[24px] border border-[#E3EEE7] bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.18em] text-[#0D7A42]">Daftar Jadwal</p>
            <h2 class="mt-1 text-xl font-black text-[#07111F]">Kegiatan Terdekat</h2>
          </div>
          <CalendarDays class="h-6 w-6 text-[#0D7A42]" />
        </div>

        <div v-if="upcomingEvents.length === 0" class="rounded-2xl bg-[#F8FBF9] p-8 text-center">
          <CalendarDays class="mx-auto h-8 w-8 text-gray-300" />
          <p class="mt-3 text-sm font-bold text-gray-500">Belum ada jadwal kegiatan</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="event in upcomingEvents" :key="event.id" class="rounded-2xl border border-[#E3EEE7] p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-black text-[#07111F]">{{ event.title }}</h3>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black"
                    :class="event.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  >
                    <CheckCircle2 v-if="event.isActive" class="h-3.5 w-3.5" />
                    {{ event.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </div>
                <p class="mt-2 text-sm text-gray-500">{{ event.description || 'Tanpa deskripsi' }}</p>
                <div class="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-gray-400">
                  <span>{{ formatDate(event.eventDate) }}</span>
                  <span>{{ event.location || 'Lokasi belum ditentukan' }}</span>
                </div>
              </div>
              <div class="flex shrink-0 gap-2">
                <button class="rounded-xl p-2 text-gray-400 transition hover:bg-[#F2F7F4] hover:text-[#0D7A42]" type="button" @click="editEvent(event)">
                  <Edit3 class="h-4 w-4" />
                </button>
                <button class="rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600" type="button" @click="confirmDeleteEvent(event)">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <Teleport to="body">
      <div v-if="eventToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" @click="eventToDelete = null"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Trash2 class="h-6 w-6" />
          </div>
          <h2 class="text-xl font-black text-[#07111F]">Hapus jadwal kegiatan?</h2>
          <p class="mt-2 text-sm leading-relaxed text-gray-500">Jadwal "{{ eventToDelete.title }}" akan dihapus dari dashboard student dan admin.</p>
          <div class="mt-6 flex justify-end gap-3">
            <button class="rounded-xl border border-[#E3EEE7] px-4 py-2.5 text-sm font-black text-gray-500 transition hover:bg-gray-50" type="button" @click="eventToDelete = null">
              Batal
            </button>
            <button class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700" type="button" @click="removeEvent">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { CalendarDays, CheckCircle2, Edit3, Loader2, Plus, Save, Trash2 } from 'lucide-vue-next'
import { createUpcomingEvent, deleteUpcomingEvent, getUpcomingEvents, updateUpcomingEvent } from '../../services/upcomingEventService'

const toast = useToast()
const upcomingEvents = ref([])
const isSavingEvent = ref(false)
const eventToDelete = ref(null)
const editingEventId = ref(null)
const eventForm = ref({
  title: '',
  description: '',
  location: '',
  eventDate: '',
  isActive: true
})
const eventErrors = ref({})

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

const toInputDateTime = (value) => {
  if (!value) return ''

  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60000)

  return localDate.toISOString().slice(0, 16)
}

const resetEventForm = () => {
  editingEventId.value = null
  eventErrors.value = {}
  eventToDelete.value = null
  eventForm.value = {
    title: '',
    description: '',
    location: '',
    eventDate: '',
    isActive: true
  }
}

const validateEventForm = () => {
  const errors = {}
  const selectedDate = eventForm.value.eventDate ? new Date(eventForm.value.eventDate) : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!eventForm.value.title.trim()) {
    errors.title = 'Judul kegiatan wajib diisi'
  } else if (eventForm.value.title.trim().length < 3) {
    errors.title = 'Judul minimal 3 karakter'
  }

  if (!eventForm.value.eventDate) {
    errors.eventDate = 'Tanggal kegiatan wajib diisi'
  } else if (Number.isNaN(selectedDate.getTime())) {
    errors.eventDate = 'Tanggal kegiatan tidak valid'
  } else if (selectedDate < today) {
    errors.eventDate = 'Tanggal kegiatan tidak boleh sebelum hari ini'
  }

  if (eventForm.value.description.length > 500) {
    errors.description = 'Deskripsi maksimal 500 karakter'
  }

  if (eventForm.value.location.length > 120) {
    errors.location = 'Lokasi maksimal 120 karakter'
  }

  eventErrors.value = errors
  return Object.keys(errors).length === 0
}

const loadUpcomingEvents = async () => {
  try {
    const response = await getUpcomingEvents()
    upcomingEvents.value = response.data?.data || []
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat jadwal kegiatan')
  }
}

const submitEvent = async () => {
  if (!validateEventForm()) {
    toast.warning('Periksa kembali input jadwal kegiatan')
    return
  }

  try {
    isSavingEvent.value = true
    const payload = {
      title: eventForm.value.title.trim(),
      description: eventForm.value.description.trim() || null,
      location: eventForm.value.location.trim() || null,
      eventDate: new Date(eventForm.value.eventDate).toISOString(),
      isActive: eventForm.value.isActive
    }

    if (editingEventId.value) {
      await updateUpcomingEvent(editingEventId.value, payload)
      toast.success('Jadwal kegiatan berhasil diperbarui')
    } else {
      await createUpcomingEvent(payload)
      toast.success('Jadwal kegiatan berhasil dibuat')
    }

    resetEventForm()
    await loadUpcomingEvents()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan jadwal kegiatan')
  } finally {
    isSavingEvent.value = false
  }
}

const editEvent = (event) => {
  editingEventId.value = event.id
  eventErrors.value = {}
  eventForm.value = {
    title: event.title,
    description: event.description || '',
    location: event.location || '',
    eventDate: toInputDateTime(event.eventDate),
    isActive: event.isActive
  }
}

const confirmDeleteEvent = (event) => {
  eventToDelete.value = event
}

const removeEvent = async () => {
  if (!eventToDelete.value) return

  try {
    await deleteUpcomingEvent(eventToDelete.value.id)
    toast.success('Jadwal kegiatan berhasil dihapus')
    eventToDelete.value = null
    await loadUpcomingEvents()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus jadwal kegiatan')
  }
}

onMounted(loadUpcomingEvents)
</script>
