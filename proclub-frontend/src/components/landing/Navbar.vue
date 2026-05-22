<template>
  <header class="fixed left-0 right-0 top-4 z-50 px-4">
    <nav class="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <a href="#home" class="flex items-center gap-3">
        <img src="/proclub.png" alt="Proclub" class="h-10 w-10 rounded-xl object-contain ring-1 ring-emerald-100">
        <div class="leading-tight">
          <p class="text-sm font-black text-[#10291D]">Proclub</p>
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Learning Hub</p>
        </div>
      </a>

      <div class="hidden items-center gap-7 text-[12px] font-bold text-slate-500 md:flex">
        <a v-for="item in navItems" :key="item.href" :href="item.href" class="transition hover:text-[#0D7A42]">
          {{ item.label }}
        </a>
      </div>

      <RouterLink to="/login" class="rounded-xl bg-[#0D7A42] px-4 py-2 text-[12px] font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#096536]">
        Masuk LMS
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Learning Paths', href: '#learning-paths' },
  { label: 'Flow', href: '#flow' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' }
]
</script>
