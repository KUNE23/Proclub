<template>
  <section id="flow" class="mx-auto max-w-6xl px-4 py-24">
    <div class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-[#0D7A42]">Learning Flow</p>
      <h2 class="mt-3 text-3xl font-black tracking-tight text-[#07111F] md:text-4xl">Alur Belajar di Proclub</h2>
      <p class="mt-4 text-sm leading-7 text-slate-500">Kami merancang perjalanan belajar yang konsisten dari awal hingga akhir.</p>
    </div>

    <div class="relative mt-16 px-2">
      <div class="absolute left-6 top-0 h-full w-px bg-emerald-100 md:left-0 md:right-0 md:top-1/2 md:mx-auto md:h-px md:w-full md:-translate-y-1/2"></div>

      <div class="relative grid gap-6 md:grid-cols-6 md:gap-3">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="relative flex min-h-32 items-start gap-4 pl-16 md:min-h-64 md:flex-col md:items-center md:justify-center md:pl-0"
          :class="index % 2 === 0 ? 'md:pt-0 md:pb-28' : 'md:pt-28 md:pb-0'"
        >
          <div class="absolute left-1 top-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border-[6px] border-white bg-[#0D7A42] text-white shadow-xl shadow-emerald-900/15 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <component :is="step.icon" class="h-5 w-5" />
          </div>

          <div
            class="w-full rounded-2xl border border-white bg-white/85 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 md:max-w-[160px]"
            :class="index % 2 === 0 ? 'md:-translate-y-4' : 'md:translate-y-4'"
          >
            <span class="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-black text-[#0D7A42]">{{ index + 1 }}</span>
            <p class="text-sm font-black text-[#07111F]">{{ step.title }}</p>
            <p class="mt-2 text-xs leading-5 text-slate-500">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { BadgeCheck, BookOpen, ClipboardCheck, Rocket, Send, Trophy } from 'lucide-vue-next'

const steps = [
  { title: 'Pilih Path', description: 'Tentukan spesialisasi yang ingin kamu kuasai.', icon: BookOpen },
  { title: 'Belajar Materi', description: 'Akses video, artikel, dan content block.', icon: ClipboardCheck },
  { title: 'Quiz', description: 'Uji pemahaman melalui quiz berkala.', icon: Trophy },
  { title: 'Project', description: 'Bangun product nyata sebagai portofolio.', icon: Rocket },
  { title: 'Review Mentor', description: 'Project dicek sebelum lulus.', icon: Send },
  { title: 'Sertifikat', description: 'Klaim sertifikat digital setelah selesai.', icon: BadgeCheck }
]
</script>
