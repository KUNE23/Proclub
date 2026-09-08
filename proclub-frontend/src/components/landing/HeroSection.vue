<template>
  <section id="home" class="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 pb-20 pt-32">
    <div class="grid w-full items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="animate-fade-up">
        <div class="mb-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#0D7A42]">
          Developer Community & Learning Platform
        </div>
        <h1 class="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-[#07111F] md:text-7xl">
          Belajar Programming dengan <span class="text-[#0D7A42]">Roadmap</span> yang Jelas.
        </h1>
        <p class="mt-6 max-w-xl text-base leading-8 text-slate-600">
          Platform belajar berbasis roadmap, project, quiz, dan sertifikasi untuk mahasiswa Informatika STT Cipasung.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <RouterLink to="/register" class="inline-flex items-center gap-2 rounded-xl bg-[#0D7A42] px-5 py-3 text-sm font-black text-white shadow-xl shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#096536]">
            Mulai Belajar
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
          <a href="#learning-paths" class="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-5 py-3 text-sm font-black text-[#10291D] shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200">
            Lihat Learning Path
          </a>
        </div>
      </div>

      <div class="relative animate-float lg:scale-105 lg:translate-x-4">
        <img
          src="/hero-section.png"
          alt="Proclub Learning Hub Mockup"
          class="h-auto w-full object-contain transition-transform duration-500 hover:scale-[1.01]"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
</script>
