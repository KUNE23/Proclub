<template>
  <main class="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
    <div class="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#E6EFE9] bg-white shadow-xl">
      <div class="grid md:grid-cols-[1fr_340px]">
        <div class="p-8 md:p-10">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#0A733F]">
            <BadgeCheck class="h-8 w-8" />
          </div>

          <p class="text-[11px] font-bold uppercase tracking-widest text-[#0A733F]">Certificate Verification</p>
          <h1 class="mt-2 text-3xl font-black text-[#1A2E20]">Sertifikat Terverifikasi</h1>
          <p class="mt-3 text-sm leading-relaxed text-gray-500">
            Sertifikat ini diterbitkan oleh Proclub Learning Hub dan dapat diverifikasi melalui kode unik berikut.
          </p>

          <div v-if="loading" class="mt-8 h-32 animate-pulse rounded-2xl bg-gray-100"></div>

          <div v-else-if="certificate" class="mt-8 space-y-4">
            <div class="rounded-2xl border border-[#E6EFE9] p-5">
              <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Penerima</p>
              <p class="mt-1 text-xl font-bold text-[#1A2E20]">{{ certificate.userName }}</p>
            </div>
            <div class="rounded-2xl border border-[#E6EFE9] p-5">
              <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Learning Path</p>
              <p class="mt-1 text-xl font-bold text-[#1A2E20]">{{ certificate.learningPath }}</p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-[#E6EFE9] p-5">
                <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Kode</p>
                <p class="mt-1 text-lg font-black text-[#0A733F]">{{ certificate.code }}</p>
              </div>
              <div class="rounded-2xl border border-[#E6EFE9] p-5">
                <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Tanggal</p>
                <p class="mt-1 text-lg font-bold text-[#1A2E20]">{{ formatDate(certificate.issuedAt) }}</p>
              </div>
            </div>
          </div>

          <div v-else class="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            Sertifikat tidak ditemukan.
          </div>
        </div>

        <div class="flex flex-col justify-between bg-[#0A733F] p-8 text-white">
          <div>
            <img src="/proclub.png" alt="Proclub" class="h-16 w-16 rounded-2xl bg-white object-contain p-2">
            <h2 class="mt-6 text-2xl font-black">Proclub Certificate</h2>
            <p class="mt-2 text-sm leading-relaxed text-white/70">Scan QR pada sertifikat untuk membuka halaman verifikasi ini.</p>
          </div>

          <a
            v-if="certificate"
            :href="assetUrl(certificate.pdfUrl)"
            target="_blank"
            class="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0A733F]"
          >
            <Download class="h-4 w-4" />
            Lihat PDF
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { BadgeCheck, Download } from 'lucide-vue-next'
import { verifyCertificate } from '../services/certificateService.js'
import { assetUrl } from '../config/api.js'

const route = useRoute()
const loading = ref(true)
const certificate = ref(null)

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))
}

onMounted(async () => {
  try {
    const response = await verifyCertificate(route.params.code)
    certificate.value = response.data?.data || null
  } catch {
    certificate.value = null
  } finally {
    loading.value = false
  }
})
</script>
