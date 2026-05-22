<template>
  <section id="team" class="mx-auto max-w-6xl px-4 py-24">
    <div class="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.2em] text-[#0D7A42]">Team</p>
        <h2 class="mt-3 text-3xl font-black tracking-tight text-[#07111F] md:text-4xl">Badan Pengurus Harian</h2>
        <p class="mt-4 max-w-xl text-sm leading-7 text-slate-500">Didukung oleh developer berdedikasi yang ingin berbagi ilmu.</p>
      </div>
      <a href="#contact" class="text-sm font-black text-[#0D7A42]">Gabung Sebagai Mentor</a>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <article v-for="member in members" :key="member.name" class="overflow-hidden rounded-[1.5rem] border border-white bg-white/85 shadow-[0_20px_80px_rgba(15,23,42,0.07)]">
        <div class="flex aspect-[4/3] items-end justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-emerald-50">
          <div class="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#07111F] text-4xl font-black text-white shadow-2xl">
            {{ member.initials }}
          </div>
        </div>
        <div class="p-5 text-center">
          <h3 class="font-black text-[#07111F]">{{ member.name }}</h3>
          <p class="mt-1 text-xs font-bold text-slate-400">{{ member.role }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const members = [
  { name: 'Alfiansyah Sibyanurrizki', role: 'Ketua', initials: 'AS' },
  { name: 'Iffah', role: 'Sekretaris', initials: 'IS' },
  { name: 'Abdul Rojak', role: 'Bendahara', initials: 'AR' }
]
</script>
