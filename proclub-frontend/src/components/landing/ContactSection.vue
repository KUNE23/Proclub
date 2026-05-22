<template>
  <section id="contact" class="mx-auto max-w-6xl px-4 py-24">
    <div class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-[#0D7A42]">Contact</p>
      <h2 class="mt-3 text-3xl font-black tracking-tight text-[#07111F] md:text-4xl">Hubungi Kami</h2>
      <p class="mt-4 text-sm leading-7 text-slate-500">Ada pertanyaan atau butuh bantuan? Kirim pesan dan tim Proclub akan menghubungi kamu.</p>
    </div>

    <form class="mx-auto mt-10 max-w-xl rounded-[1.5rem] border border-white bg-white/90 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)]" @submit.prevent="submitForm">
      <div class="space-y-5">
        <div>
          <label class="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Nama Lengkap</label>
          <input v-model.trim="form.name" type="text" class="landing-input" placeholder="Masukkan nama Anda" maxlength="100">
          <p v-if="errors.name" class="mt-2 text-xs font-bold text-red-500">{{ errors.name }}</p>
        </div>

        <div>
          <label class="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Email Address</label>
          <input v-model.trim="form.email" type="email" class="landing-input" placeholder="name@student.sttcipasung.ac.id" maxlength="255">
          <p v-if="errors.email" class="mt-2 text-xs font-bold text-red-500">{{ errors.email }}</p>
        </div>

        <div>
          <label class="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Pesan</label>
          <textarea v-model.trim="form.message" class="landing-input min-h-36 resize-none" placeholder="Ceritakan apa yang bisa kami bantu..." maxlength="1000"></textarea>
          <div class="mt-2 flex items-center justify-between gap-3">
            <p v-if="errors.message" class="text-xs font-bold text-red-500">{{ errors.message }}</p>
            <p class="ml-auto text-xs font-bold text-slate-400">{{ form.message.length }}/1000</p>
          </div>
        </div>

        <button type="submit" :disabled="isSubmitting" class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D7A42] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#096536] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
          <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
          <Send v-else class="h-4 w-4" />
          {{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Loader2, Send } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { sendContactMessage } from '../../services/contactService.js'

const toast = useToast()
const isSubmitting = ref(false)
const form = reactive({
  name: '',
  email: '',
  message: ''
})
const errors = reactive({
  name: '',
  email: '',
  message: ''
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.message = ''

  if (form.name.length < 2) errors.name = 'Nama minimal 2 karakter'
  if (form.name.length > 100) errors.name = 'Nama maksimal 100 karakter'
  if (!emailPattern.test(form.email)) errors.email = 'Email tidak valid'
  if (form.email.length > 255) errors.email = 'Email maksimal 255 karakter'
  if (form.message.length < 10) errors.message = 'Pesan minimal 10 karakter'
  if (form.message.length > 1000) errors.message = 'Pesan maksimal 1000 karakter'

  return !errors.name && !errors.email && !errors.message
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.message = ''
}

const submitForm = async () => {
  if (!validateForm()) {
    toast.warning('Periksa kembali data pesan kamu.')
    return
  }

  isSubmitting.value = true

  try {
    const response = await sendContactMessage({ ...form })
    toast.success(response.data?.message || 'Pesan berhasil dikirim.')
    resetForm()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal mengirim pesan. Coba lagi nanti.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.landing-input {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid #E6EFE9;
  background: #F8FBF9;
  padding: 0.9rem 1rem;
  color: #07111F;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.landing-input:focus {
  border-color: #0D7A42;
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(13, 122, 66, 0.1);
}
</style>
