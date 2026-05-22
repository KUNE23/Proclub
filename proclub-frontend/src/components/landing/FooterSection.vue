<template>
  <footer class="border-t border-emerald-100/70 bg-white/70 px-4 py-7">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
      <div class="flex items-center justify-center gap-3 md:justify-start">
        <img src="/proclub.png" alt="Proclub" class="h-9 w-9 rounded-xl object-contain">
        <div>
          <p class="text-sm font-black text-[#10291D]">Proclub Learning Hub</p>
          <p class="text-xs text-slate-400">© 2026 Proclub Learning Hub. All rights reserved.</p>
        </div>
      </div>
      <div class="flex justify-center gap-3 text-slate-400">
        <a href="https://www.instagram.com/proclub.sttc/" aria-label="Instagram Proclub" class="rounded-xl border border-emerald-100 bg-white p-2 transition hover:text-[#0D7A42]">
          <Instagram class="h-4 w-4" />
        </a>
        <a href="https://www.tiktok.com/@proclub.sttc" aria-label="TikTok Proclub" class="rounded-xl border border-emerald-100 bg-white p-2 transition hover:text-[#0D7A42]">
          <Music2 class="h-4 w-4" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Instagram, Music2 } from 'lucide-vue-next'
</script>
