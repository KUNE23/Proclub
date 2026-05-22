<template>
  <section id="about" class="mx-auto max-w-6xl px-4 py-24">
    <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.2em] text-[#0D7A42]">Tentang Kami</p>
        <h2 class="mt-3 text-3xl font-black tracking-tight text-[#07111F] md:text-4xl">Ruang belajar praktis untuk calon developer kampus.</h2>
        <p class="mt-5 text-sm leading-7 text-slate-600">
          Proclub membantu mahasiswa memahami konsep pemrograman dengan materi bertahap, praktik langsung, dan project akhir yang bisa menjadi portofolio.
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <div v-for="item in features" :key="item.title" class="group rounded-2xl border border-white bg-white/85 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
          <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl" :class="item.color">
            <component :is="item.icon" class="h-5 w-5" />
          </div>
          <h3 class="text-base font-black text-[#07111F]">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-slate-500">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Award, BookOpenCheck, Code2 } from 'lucide-vue-next'

const features = [
  {
    title: 'Interactive Learning',
    description: 'Belajar materi terstruktur dengan latihan, quiz, dan evaluasi.',
    icon: BookOpenCheck,
    color: 'bg-emerald-50 text-[#0D7A42]'
  },
  {
    title: 'Project-based Learning',
    description: 'Terapkan ilmu langsung ke project yang siap dipakai.',
    icon: Code2,
    color: 'bg-sky-50 text-sky-600'
  },
  {
    title: 'Certification System',
    description: 'Sertifikat otomatis setelah seluruh syarat selesai.',
    icon: Award,
    color: 'bg-amber-50 text-amber-600'
  }
]
</script>
