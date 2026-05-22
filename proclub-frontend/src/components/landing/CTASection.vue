<template>
  <section class="mx-auto max-w-6xl px-4 py-20">
    <div class="relative overflow-hidden rounded-[2rem] bg-[#07111F] px-6 py-14 text-center shadow-[0_28px_100px_rgba(15,23,42,0.22)]">
      <div class="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-emerald-500/20"></div>
      <div class="absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-cyan-500/10"></div>
      <div class="relative mx-auto max-w-2xl">
        <h2 class="text-3xl font-black tracking-tight text-white md:text-4xl">Siap Memulai Perjalanan Belajarmu?</h2>
        <p class="mt-4 text-sm leading-7 text-slate-300">Jangan biarkan waktu menunggu. Join sekarang dan mulai bangun product pertamamu.</p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <RouterLink to="/register" class="rounded-xl bg-[#0D7A42] px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-600">Masuk LMS</RouterLink>
          <a href="#contact" class="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15">Gabung Komunitas</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
