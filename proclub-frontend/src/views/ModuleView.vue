<template>
  <div class="flex flex-col h-screen bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <!-- ===== TOP NAVIGATION BAR ===== -->
    <header class="h-14 px-6 flex items-center justify-between bg-white border-b border-[#E6EFE9] shrink-0 z-20">
      <div class="flex items-center gap-8">
        <router-link to="/atelier" class="text-[15px] font-extrabold text-[#1A2E20] tracking-tight">Botanical Academy</router-link>
        <nav class="hidden md:flex items-center gap-1">
          <router-link
            v-for="link in topNavLinks"
            :key="link.name"
            :to="link.path"
            class="px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors"
            :class="link.active ? 'text-[#2C7047] bg-[#F2F7F4]' : 'text-gray-500 hover:text-[#2C7047]'"
          >{{ link.name }}</router-link>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-gray-400 hover:text-[#2C7047] transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        <button class="text-gray-400 hover:text-[#2C7047] transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
        <div class="w-8 h-8 rounded-full bg-[#1A2E20] flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
      </div>
    </header>

    <!-- ===== BODY: Sidebar + Content ===== -->
    <div class="flex flex-1 overflow-hidden">

      <!-- ===== LEFT SIDEBAR (Curriculum) — Independently Scrollable ===== -->
      <aside class="w-64 bg-white border-r border-[#E6EFE9] flex flex-col shrink-0 overflow-hidden">

        <!-- Module Info + Progress -->
        <div class="p-5 border-b border-[#E6EFE9]">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl bg-[#2C7047] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M12 2C8 2 4 5 4 10c0 4.5 3.5 10 8 12 4.5-2 8-7.5 8-12 0-5-4-8-8-10z"></path></svg>
            </div>
            <div class="min-w-0">
              <h2 class="text-sm font-bold text-[#1A2E20] truncate">{{ currentModule.title }}</h2>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{ currentModule.subtitle }}</p>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="mt-1">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ moduleProgress }}% Complete</span>
            </div>
            <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#2C7047] rounded-full transition-all duration-700 ease-out" :style="{ width: moduleProgress + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Lesson List (Scrollable) -->
        <nav class="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <button
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            @click="selectLesson(lesson)"
            :disabled="lesson.status === 'locked'"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all duration-200 group relative"
            :class="[
              lesson.id === activeLesson.id
                ? 'bg-[#F2F7F4] text-[#2C7047] font-semibold'
                : lesson.status === 'locked'
                  ? 'text-gray-400 cursor-not-allowed opacity-60'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C7047] cursor-pointer',
            ]"
          >
            <!-- Lesson Number -->
            <span class="text-[11px] font-bold w-5 text-right shrink-0"
              :class="lesson.id === activeLesson.id ? 'text-[#2C7047]' : lesson.status === 'locked' ? 'text-gray-300' : 'text-gray-400'">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <!-- Status Dot / Lock -->
            <div class="shrink-0">
              <div v-if="lesson.status === 'completed'" class="w-3 h-3 rounded-full bg-[#2C7047] flex items-center justify-center">
                <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              </div>
              <div v-else-if="lesson.status === 'current'" class="w-3 h-3 rounded-full bg-[#E87C3E] ring-2 ring-[#E87C3E]/20"></div>
              <div v-else class="w-3.5 h-3.5 flex items-center justify-center">
                <svg class="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
              </div>
            </div>

            <!-- Lesson Name -->
            <span class="truncate" :class="lesson.status === 'locked' ? 'text-gray-400' : ''">{{ lesson.title }}</span>
          </button>
        </nav>

        <!-- Bottom Actions -->
        <div class="p-4 border-t border-[#E6EFE9] space-y-2">
          <button class="w-full flex items-center justify-center gap-2 bg-[#2C7047] hover:bg-[#235838] text-white py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-colors shadow-sm shadow-[#2C7047]/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Resources
          </button>
          <div class="flex gap-4 pt-1">
            <router-link to="/atelier" class="text-[12px] text-gray-500 hover:text-[#2C7047] flex items-center gap-1.5 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
              Support
            </router-link>
            <router-link to="/atelier" class="text-[12px] text-gray-500 hover:text-[#2C7047] flex items-center gap-1.5 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Community
            </router-link>
          </div>
        </div>
      </aside>

      <!-- ===== MAIN CONTENT AREA (Independently Scrollable) ===== -->
      <main class="flex-1 overflow-y-auto relative">

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="animate-pulse p-8 lg:px-16 lg:py-10 max-w-4xl mx-auto space-y-8">
          <div class="h-72 bg-gray-200 rounded-2xl"></div>
          <div class="h-10 bg-gray-200 rounded w-2/3"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-32 bg-gray-200 rounded-xl"></div>
          <div class="h-64 bg-gray-200 rounded-xl"></div>
        </div>

        <!-- Loaded Content -->
        <div v-else class="pb-16">

          <!-- ---- Video Player Placeholder ---- -->
          <div class="relative mx-6 lg:mx-12 mt-6 rounded-2xl overflow-hidden shadow-lg shadow-black/10 group cursor-pointer aspect-video max-w-4xl">
            <img :src="activeLesson.videoThumbnail" :alt="activeLesson.videoTitle" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <!-- Play Button -->
            <button class="absolute inset-0 flex items-center justify-center">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <svg class="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
              </div>
            </button>
            <!-- Video Title Overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h3 class="text-white font-bold text-lg leading-snug">{{ activeLesson.videoTitle }}</h3>
              <p class="text-gray-300 text-xs mt-1">{{ activeLesson.videoDuration }} • {{ activeLesson.videoLevel }}</p>
            </div>
          </div>

          <!-- ---- Lesson Content ---- -->
          <div class="px-6 lg:px-12 pt-8 max-w-4xl">

            <!-- Content Title -->
            <h1 class="text-2xl lg:text-3xl font-black text-[#1A2E20] leading-tight mb-5">
              {{ activeLesson.contentTitle }}
            </h1>

            <!-- Content Body Text -->
            <p class="text-gray-600 text-[15px] leading-relaxed mb-8">
              {{ activeLesson.contentBody }}
            </p>

            <!-- ---- Key Concept Callout ---- -->
            <div class="bg-[#F2F7F4] border-l-4 border-[#2C7047] rounded-r-xl p-5 mb-8">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-5 h-5 rounded-full bg-[#2C7047] flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zm4.657 2.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zm7 6a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-4.95-2.05a1 1 0 00.707.707l-.707.707a1 1 0 01-1.414-1.414l.707-.707z"></path><path d="M10 5a5 5 0 100 10 5 5 0 000-10z"></path></svg>
                </span>
                <h4 class="font-bold text-[#2C7047] text-sm">{{ activeLesson.keyConcept.title }}</h4>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed pl-7 italic">
                {{ activeLesson.keyConcept.description }}
              </p>
            </div>

            <!-- ---- Technical Section ---- -->
            <h2 class="text-xl font-bold text-[#1A2E20] mb-3">{{ activeLesson.technicalSection.title }}</h2>
            <p class="text-gray-600 text-[15px] leading-relaxed mb-6">
              {{ activeLesson.technicalSection.body }}
            </p>

            <!-- ---- Code Snippet Block ---- -->
            <div class="rounded-2xl overflow-hidden mb-10 shadow-lg shadow-black/5">
              <!-- Code Header Bar -->
              <div class="bg-[#1E1E2E] px-5 py-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
                  <span class="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
                  <span class="w-3 h-3 rounded-full bg-[#27C93F]"></span>
                </div>
                <span class="text-[11px] text-gray-500 font-mono">{{ activeLesson.codeSnippet.filename }}</span>
              </div>
              <!-- Code Content -->
              <div class="bg-[#1A1A2E] p-6 overflow-x-auto">
                <pre class="text-sm leading-relaxed font-mono"><code><template v-for="(line, i) in activeLesson.codeSnippet.lines" :key="i"><span class="select-none text-gray-600 mr-4 inline-block w-6 text-right">{{ i + 1 }}</span><span :class="getLineColor(line.type)">{{ line.text }}</span>
</template></code></pre>
              </div>
            </div>

            <!-- ---- Summary of Learnings ---- -->
            <div class="mb-10">
              <h2 class="text-xl font-bold text-[#1A2E20] mb-4">Summary of Learnings</h2>
              <div class="space-y-3">
                <div v-for="(item, idx) in activeLesson.summaryItems" :key="idx" class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-[#D1E6DA] flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-[#2C7047]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  </div>
                  <p class="text-gray-700 text-sm leading-relaxed">{{ item }}</p>
                </div>
              </div>
            </div>

            <!-- ---- Quiz / Completion CTA ---- -->
            <div class="border-t border-[#E6EFE9] pt-10 pb-4 text-center">
              <h3 class="text-xl font-bold text-[#1A2E20] mb-2">Ready for the next challenge?</h3>
              <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Complete the knowledge check to demonstrate mastery of {{ activeLesson.title }} and unlock {{ nextLockedLesson }}.
              </p>
              <button
                @click="handleMarkComplete"
                class="bg-[#2C7047] hover:bg-[#235838] text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto shadow-lg shadow-[#2C7047]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Take Quiz to Unlock Next Module
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-3">Estimated Time: 5 Minutes</p>
            </div>
          </div>
        </div>

        <!-- Floating Chat / Comment Button -->
        <button class="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#1A2E20] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-30">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </button>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isLoading = ref(true)

// ===== Top Nav =====
const topNavLinks = ref([
  { name: 'Explore', path: '/courses-catalog', active: true },
  { name: 'Dashboard', path: '/atelier', active: false },
  { name: 'My Learning', path: '/atelier', active: false },
])

// ===== Current Module Info =====
const currentModule = ref({
  title: 'Mastering Urban Flora',
  subtitle: 'Module 3: Ecosystems',
})

// ===== Lessons Array (with status & unlock system) =====
const lessons = ref([
  {
    id: 'lesson-1',
    title: 'Introduction',
    status: 'completed', // 'completed' | 'current' | 'locked'
    videoThumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Part 1: Welcome to Urban Ecosystems',
    videoDuration: '08:30',
    videoLevel: 'Introductory',
    contentTitle: 'Introduction to Urban Ecosystems',
    contentBody: 'An overview of how urban environments create unique ecological niches. We explore the foundational concepts of plant biology in constrained spaces, covering the basics of light, water, and nutrient cycles in city settings.',
    keyConcept: { title: 'Urban Ecology', description: 'The study of the relationships of living organisms with each other and their surroundings in the context of an urban environment.' },
    technicalSection: { title: 'Getting Started with Monitoring', body: 'We begin by setting up a basic sensor array to monitor ambient conditions in your urban garden.' },
    codeSnippet: {
      filename: 'setup.js',
      lines: [
        { text: "import { initSensor } from '@proclub/sensors';", type: 'import' },
        { text: '', type: 'blank' },
        { text: 'const sensor = initSensor({ type: "ambient" });', type: 'code' },
        { text: 'sensor.start();', type: 'code' },
      ]
    },
    summaryItems: ['Definition and scope of urban ecology.', 'Key environmental factors affecting plant life in cities.'],
  },
  {
    id: 'lesson-2',
    title: 'Plant Biology',
    status: 'completed',
    videoThumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Part 2: Cellular Structures of Urban Plants',
    videoDuration: '14:20',
    videoLevel: 'Fundamental Level',
    contentTitle: 'Plant Biology for the Urban Cultivator',
    contentBody: 'Understanding cellular respiration and photosynthesis adaptation in low-light urban environments is crucial for selecting the right species for your growing space.',
    keyConcept: { title: 'Photosynthetic Adaptation', description: 'Some plants have evolved C4 and CAM metabolic pathways to optimize carbon fixation under conditions of drought, high temperature, and limited CO2.' },
    technicalSection: { title: 'Monitoring Photosynthesis Rates', body: 'Using a PAR sensor to measure Photosynthetically Active Radiation available to your plants.' },
    codeSnippet: {
      filename: 'parSensor.js',
      lines: [
        { text: "import { PARSensor } from '@proclub/sensors';", type: 'import' },
        { text: '', type: 'blank' },
        { text: 'const par = new PARSensor({ interval: 60 });', type: 'code' },
        { text: "par.on('reading', (data) => {", type: 'code' },
        { text: '  console.log(`PAR: ${data.value} µmol/m²/s`);', type: 'string' },
        { text: '});', type: 'code' },
      ]
    },
    summaryItems: ['Core principles of plant cellular biology.', 'Photosynthesis in low-light conditions.', 'Selecting species for urban environments.'],
  },
  {
    id: 'lesson-3',
    title: 'Soil Composition',
    status: 'current',
    videoThumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Part 3: Understanding Microbial Substrates',
    videoDuration: '12:45',
    videoLevel: 'Fundamental Level',
    contentTitle: 'Soil Composition & The Microbiome',
    contentBody: 'In this module, we delve deep into the unseen world of microbial interactions within urban soil environments. Unlike traditional agricultural soil, urban substrates require a specific balance of aeration and nutrient density to support life in contained ecosystems.',
    keyConcept: { title: 'Key Concept: The Rhizosphere', description: 'The rhizosphere is the narrow region of soil or substrate that is directly influenced by root secretions and associated soil microorganisms known as the root microbiome.' },
    technicalSection: { title: 'Programmable Soil Monitoring', body: 'To maintain optimal growth, we utilize automated sensors. Below is an example of a React component that visualizes soil moisture and pH levels in real-time. This logic allows for autonomous irrigation triggers based on the plant species\' specific needs.' },
    codeSnippet: {
      filename: 'SoilMonitor.jsx',
      lines: [
        { text: "import React, { useState, useEffect } from 'react';", type: 'import' },
        { text: '', type: 'blank' },
        { text: 'const SoilMonitor = ({ sensorId }) => {', type: 'code' },
        { text: '  const [levels, setLevels] = useState({ moisture: 0, pH: 7.0 });', type: 'code' },
        { text: '', type: 'blank' },
        { text: '  useEffect(() => {', type: 'keyword' },
        { text: '    const stream = SensorAPI.connect(sensorId);', type: 'code' },
        { text: "    stream.on('data', (data) => setLevels(data));", type: 'string' },
        { text: '    return () => stream.disconnect();', type: 'code' },
        { text: '  }, [sensorId]);', type: 'code' },
        { text: '', type: 'blank' },
        { text: '  return (', type: 'keyword' },
        { text: '    <div className="sensor-card">', type: 'jsx' },
        { text: '      <h3>Soil Status: {levels.moisture}%</h3>', type: 'jsx' },
        { text: '      <progress value={levels.moisture} max="100" />', type: 'jsx' },
        { text: '    </div>', type: 'jsx' },
        { text: '  );', type: 'code' },
        { text: '};', type: 'code' },
      ]
    },
    summaryItems: [
      'Identification of the three primary components of healthy urban substrate.',
      'Techniques for microbial inoculation to prevent root rot.',
      'Understanding the nitrogen cycle in closed-loop systems.',
    ],
  },
  {
    id: 'lesson-4',
    title: 'Hydroponic Basics',
    status: 'locked',
    videoThumbnail: '',
    videoTitle: '',
    videoDuration: '',
    videoLevel: '',
    contentTitle: '',
    contentBody: '',
    keyConcept: { title: '', description: '' },
    technicalSection: { title: '', body: '' },
    codeSnippet: { filename: '', lines: [] },
    summaryItems: [],
  },
  {
    id: 'lesson-5',
    title: 'Pest Management',
    status: 'locked',
    videoThumbnail: '',
    videoTitle: '',
    videoDuration: '',
    videoLevel: '',
    contentTitle: '',
    contentBody: '',
    keyConcept: { title: '', description: '' },
    technicalSection: { title: '', body: '' },
    codeSnippet: { filename: '', lines: [] },
    summaryItems: [],
  },
  {
    id: 'lesson-6',
    title: 'Final Assessment',
    status: 'locked',
    videoThumbnail: '',
    videoTitle: '',
    videoDuration: '',
    videoLevel: '',
    contentTitle: '',
    contentBody: '',
    keyConcept: { title: '', description: '' },
    technicalSection: { title: '', body: '' },
    codeSnippet: { filename: '', lines: [] },
    summaryItems: [],
  },
])

// ===== Active Lesson (defaults to the 'current' lesson) =====
const activeLesson = ref(lessons.value.find(l => l.status === 'current') || lessons.value[0])

// ===== Computed Progress =====
const moduleProgress = computed(() => {
  const completed = lessons.value.filter(l => l.status === 'completed').length
  const total = lessons.value.length
  return Math.round((completed / total) * 100)
})

const nextLockedLesson = computed(() => {
  const next = lessons.value.find(l => l.status === 'locked')
  return next ? `Chapter ${lessons.value.indexOf(next) + 1}: ${next.title}` : 'the next chapter'
})

// ===== Methods =====
function selectLesson(lesson) {
  if (lesson.status !== 'locked') {
    activeLesson.value = lesson
  }
}

function handleMarkComplete() {
  // Mark current lesson as completed
  const currentIdx = lessons.value.findIndex(l => l.id === activeLesson.value.id)
  if (currentIdx > -1) {
    lessons.value[currentIdx].status = 'completed'

    // Unlock next lesson if exists
    if (currentIdx + 1 < lessons.value.length) {
      const nextLesson = lessons.value[currentIdx + 1]
      if (nextLesson.status === 'locked') {
        nextLesson.status = 'current'
        // Provide default content for the newly unlocked lesson
        if (!nextLesson.videoThumbnail) {
          nextLesson.videoThumbnail = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80'
          nextLesson.videoTitle = `Part ${currentIdx + 2}: ${nextLesson.title}`
          nextLesson.videoDuration = '10:00'
          nextLesson.videoLevel = 'Intermediate'
          nextLesson.contentTitle = nextLesson.title
          nextLesson.contentBody = `This lesson covers the fundamentals of ${nextLesson.title.toLowerCase()}. Content will be loaded from your API when connected.`
          nextLesson.keyConcept = { title: `Key Concept: ${nextLesson.title}`, description: 'Detailed concept explanation will be provided by your API data source.' }
          nextLesson.technicalSection = { title: `Applied ${nextLesson.title}`, body: 'Technical walkthrough content will be loaded dynamically.' }
          nextLesson.codeSnippet = { filename: 'example.js', lines: [{ text: '// Code example coming soon...', type: 'comment' }] }
          nextLesson.summaryItems = ['Key takeaway will appear here once content is loaded.']
        }
      }
      activeLesson.value = lessons.value[currentIdx + 1]
    }
  }
}

function getLineColor(type) {
  const colors = {
    import: 'text-[#C792EA]',
    keyword: 'text-[#C792EA]',
    code: 'text-[#EEFFFF]',
    string: 'text-[#C3E88D]',
    comment: 'text-gray-500',
    jsx: 'text-[#89DDFF]',
    blank: '',
  }
  return colors[type] || 'text-[#EEFFFF]'
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
