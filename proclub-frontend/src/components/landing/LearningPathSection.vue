<template>
  <section id="learning-paths" class="mx-auto max-w-6xl px-4 py-24">
    <div class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-[#0D7A42]">Learning Paths</p>
      <h2 class="mt-3 text-3xl font-black tracking-tight text-[#07111F] md:text-4xl">Learning Paths Unggulan</h2>
      <p class="mt-4 text-sm leading-7 text-slate-500">Pilih jalur belajar yang paling relevan dengan skill yang ingin kamu kuasai.</p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-2">
      <article v-for="path in paths" :key="path.title" class="rounded-[1.5rem] border border-white bg-white/85 p-7 shadow-[0_20px_80px_rgba(15,23,42,0.07)] transition hover:-translate-y-1">
        <div class="mb-7 flex items-start justify-between">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl" :class="path.iconColor">
            <component :is="path.icon" class="h-7 w-7" />
          </div>
          <span class="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]" :class="path.badgeColor">{{ path.badge }}</span>
        </div>
        <h3 class="text-xl font-black text-[#07111F]">{{ path.title }}</h3>
        <p class="mt-3 min-h-20 text-sm leading-7 text-slate-600">{{ path.description }}</p>
        <div class="mt-6 inline-flex rounded-xl bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
          {{ path.modules }} Modules
        </div>
        <RouterLink to="/login" class="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#07111F] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0D7A42]">
          Jelajahi Jalur Ini
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, BrainCircuit, Code2 } from 'lucide-vue-next'
import api from '../../api/index.js'

const paths = ref([
  {
    title: 'Fundamental Programming',
    badge: 'Beginner Friendly',
    modules: 0,
    icon: Code2,
    iconColor: 'bg-emerald-50 text-[#0D7A42]',
    badgeColor: 'bg-emerald-50 text-[#0D7A42]',
    description: 'Pelajari dasar pemrograman, HTML/CSS modern, dan JavaScript berbasis roadmap yang cocok untuk anggota baru.'
  },
  {
    title: 'Vibe Coding & AI Workflow',
    badge: 'Advanced Path',
    modules: 0,
    icon: BrainCircuit,
    iconColor: 'bg-rose-50 text-rose-500',
    badgeColor: 'bg-rose-50 text-rose-500',
    description: 'Maksimalkan produktivitas dengan AI-assisted development, design implementation, dan workflow modern untuk membangun MVP.'
  }
])

onMounted(async () => {
  try {
    const response = await api.get('/public/courses')
    if (response.data && response.data.status === 'success') {
      const backendCourses = response.data.data
      paths.value = paths.value.map((path) => {
        const matched = backendCourses.find(
          (c) => c.title.toLowerCase().trim() === path.title.toLowerCase().trim()
        )
        if (matched) {
          return {
            ...path,
            modules: matched.totalModules || matched.modules?.length || 0
          }
        }
        return path
      })
    }
  } catch (error) {}
})
</script>
