<template>
  <div class="flex bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <div class="flex-1 flex flex-col">

      <div class="flex-1">

        <div v-if="isLoading" class="animate-pulse max-w-5xl mx-auto p-8 lg:p-12 space-y-8">
          <div class="h-8 bg-gray-200 rounded w-1/4"></div>
          <div class="h-12 bg-gray-200 rounded w-1/2"></div>
          <div class="flex gap-8">
            <div class="flex-1 space-y-6">
              <div class="h-48 bg-gray-200 rounded-2xl"></div>
              <div class="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
            <div class="w-72 space-y-6">
              <div class="h-40 bg-gray-200 rounded-2xl"></div>
              <div class="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
      </div>

        <div v-else class="mx-auto px-5 md:px-0 py-5">

          <div class="mb-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2C7047] mb-2 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-[#2C7047] rounded-sm"></span>
              {{ projectBrief.courseName }}
            </p>
            <h1 class="text-3xl font-black text-[#1A2E20] leading-tight mb-2">Project Submission</h1>
            <p class="text-gray-500 text-sm max-w-xl leading-relaxed">{{ projectBrief.description }}</p>
          </div>

          <div class="flex flex-col lg:flex-row gap-8">

            <div class="flex-1 min-w-0 space-y-8">

              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <h3 class="font-bold text-[#1A2E20]">Project Requirements</h3>
                  </div>
                  <span class="px-3 py-1 bg-[#F2F7F4] text-[#2C7047] text-[10px] font-bold rounded-full border border-[#E6EFE9] uppercase tracking-wider">{{ projectBrief.projectType }}</span>
                </div>
                <p class="text-xs text-gray-500 mb-5">Review these criteria before submitting</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="req in projectBrief.requirements" :key="req.title" class="flex items-start gap-2.5">
                    <div class="w-5 h-5 rounded-full bg-[#D1E6DA] flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-[#2C7047]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-[#1A2E20]">{{ req.title }}</h4>
                      <p class="text-xs text-gray-500 leading-relaxed mt-0.5">{{ req.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <h3 class="font-bold text-[#1A2E20] text-lg mb-6">Submission Details</h3>

                <div class="mb-6">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">GitHub Repository URL</label>
                  <div class="relative">
                    <svg class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"></path></svg>
                    <input
                      v-model="submissionForm.githubUrl"
                      type="url"
                      placeholder="https://github.com/username/botanical-atelier"
                      class="w-full pl-11 pr-4 py-3 bg-[#FAFCFB] border border-[#E6EFE9] rounded-xl text-sm focus:ring-2 focus:ring-[#2C7047]/20 focus:border-[#2C7047] focus:outline-none transition-all placeholder-gray-400"
                      :class="errors.githubUrl ? 'border-red-400 ring-2 ring-red-100' : ''"
                    />
                  </div>
                  <p v-if="errors.githubUrl" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    {{ errors.githubUrl }}
                  </p>
                </div>

                <div class="mb-6">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Project Notes/Documentation</label>
                    <span class="text-[10px] text-gray-400 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      Markdown Supported
                    </span>
                  </div>
                  <textarea
                    v-model="submissionForm.notes"
                    rows="8"
                    placeholder="# Project Overview&#10;Describe your design choices, challenges, and implementation details here...&#10;&#10;## Key Features&#10;- Custom glassmorphism sidebar&#10;- Tonal background shifts"
                    class="w-full px-4 py-3 bg-[#FAFCFB] border border-[#E6EFE9] rounded-xl text-sm focus:ring-2 focus:ring-[#2C7047]/20 focus:border-[#2C7047] focus:outline-none transition-all placeholder-gray-400 font-mono text-xs leading-relaxed resize-none"
                  ></textarea>
                </div>

                <div class="mb-6">
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Screenshots & Media</label>
                  <div class="border-2 border-dashed border-[#E6EFE9] rounded-xl p-8 text-center hover:border-[#2C7047]/40 transition-colors cursor-pointer bg-[#FAFCFB]">
                    <div class="w-12 h-12 rounded-full bg-[#F2F7F4] flex items-center justify-center mx-auto mb-3">
                      <svg class="w-6 h-6 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <p class="text-sm font-semibold text-[#1A2E20]">Drag & Drop visual assets</p>
                    <p class="text-xs text-gray-400 mt-1">Upload high-res JPG or PNG (Max 10MB each)</p>
                  </div>
                </div>

                <button
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                  class="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
                  :class="isSubmitting
                    ? 'bg-[#2C7047]/70 text-white/80 cursor-wait'
                    : 'bg-[#2C7047] hover:bg-[#235838] text-white shadow-[#2C7047]/25 hover:scale-[1.005] active:scale-[0.995]'"
                >
                  <svg v-if="!isSubmitting" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Project for Review' }}
                </button>
              </div>

              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <div class="flex items-center justify-between mb-5">
                  <h3 class="font-bold text-[#1A2E20] text-lg">Submission History</h3>
                  <button class="text-xs font-medium text-gray-500 hover:text-[#2C7047] transition-colors flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Refresh
                  </button>
                </div>

                <div class="grid grid-cols-[100px_1fr_120px_50px] gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 pb-3 border-b border-[#E6EFE9]">
                  <span>Date</span>
                  <span>Project Name</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                <div v-for="entry in submissionHistory" :key="entry.id" class="grid grid-cols-[100px_1fr_120px_50px] gap-4 items-center py-4 border-b border-[#E6EFE9]/50 last:border-b-0">
                  <span class="text-xs text-gray-500">{{ entry.date }}</span>
                  <span class="text-sm font-medium text-[#1A2E20]">{{ entry.projectName }}</span>
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold w-fit"
                    :class="{
                      'bg-yellow-50 text-yellow-700 border border-yellow-200': entry.status === 'pending',
                      'bg-[#D1E6DA] text-[#2C7047] border border-[#2C7047]/20': entry.status === 'approved',
                      'bg-red-50 text-red-600 border border-red-200': entry.status === 'revision',
                    }"
                  >
                    <span v-if="entry.status === 'approved'" class="w-1.5 h-1.5 bg-[#2C7047] rounded-full"></span>
                    {{ entry.statusLabel }}
                  </span>
                  <button class="text-gray-400 hover:text-[#2C7047] transition-colors">
                    <svg v-if="entry.status === 'pending'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <svg v-else-if="entry.status === 'approved'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="w-full lg:w-72 shrink-0 space-y-6">

              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Assigned Reviewer</p>
                <div class="flex items-center gap-3 mb-4">
                  <img :src="reviewer.avatar" :alt="reviewer.name" class="w-11 h-11 rounded-full object-cover border border-[#E6EFE9]" />
                  <div>
                    <div class="text-sm font-bold text-[#1A2E20]">{{ reviewer.name }}</div>
                    <div class="text-xs text-gray-400">{{ reviewer.title }}</div>
                  </div>
                </div>
                <blockquote class="text-xs text-gray-500 italic leading-relaxed border-l-2 border-[#E6EFE9] pl-3">
                  "{{ reviewer.quote }}"
                </blockquote>
              </div>

              <div class="bg-[#1A2E20] rounded-2xl p-6 text-white shadow-lg">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-6 h-6 rounded-full bg-[#2C7047] flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path><path d="M10 5a5 5 0 100 10 5 5 0 000-10z"></path></svg>
                  </div>
                  <span class="text-sm font-bold">Pro Tip</span>
                </div>
                <p class="text-gray-400 text-xs leading-relaxed">{{ proTip }}</p>
              </div>

              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Submission Stats</p>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Average Turnaround</span>
                    <span class="text-sm font-bold text-[#1A2E20]">{{ submissionStats.turnaround }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Class Pass Rate</span>
                    <span class="text-sm font-bold text-[#2C7047]">{{ submissionStats.passRate }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Final Deadline</span>
                </div>
                <div class="text-2xl font-black text-[#1A2E20] mb-1">{{ deadline.date }}</div>
                <p class="text-xs font-bold flex items-center gap-1" :class="deadline.urgent ? 'text-red-500' : 'text-gray-400'">
                  <span v-if="deadline.urgent" class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  {{ deadline.remaining }}
                </p>
              </div>

              <router-link to="/module" class="flex items-center justify-between bg-white rounded-2xl border border-[#E6EFE9] p-5 shadow-sm hover:border-[#2C7047]/40 transition-all group">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span class="text-sm font-bold text-[#1A2E20]">View Design Guide</span>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-[#2C7047] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </router-link>

              <div v-if="submissionStatus !== 'not_submitted'" class="rounded-2xl border p-5"
                :class="{
                  'bg-yellow-50 border-yellow-200': submissionStatus === 'pending',
                  'bg-[#F2F7F4] border-[#2C7047]/20': submissionStatus === 'approved',
                  'bg-red-50 border-red-200': submissionStatus === 'revision',
                }"
              >

                <div v-if="submissionStatus === 'pending'" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div>
                    <h4 class="text-sm font-bold text-yellow-700">Under Review</h4>
                    <p class="text-xs text-yellow-600 mt-1">Your project is being reviewed by a Mentor. Average turnaround is 48 hours.</p>
                  </div>
                </div>

                <div v-else-if="submissionStatus === 'approved'" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-[#2C7047] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  <div>
                    <h4 class="text-sm font-bold text-[#2C7047]">Approved! 🏆</h4>
                    <p class="text-xs text-[#2C7047]/80 mt-1">Congratulations! Your project is approved. Badge Earned!</p>
                  </div>
                </div>

                <div v-else-if="submissionStatus === 'revision'" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                  <div>
                    <h4 class="text-sm font-bold text-red-600">Revision Requested</h4>
                    <p class="text-xs text-red-500 mt-1">{{ mentorFeedback }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const isLoading = ref(true)
const isSubmitting = ref(false)

const sidebarMenu = ref([
  { name: 'Gallery', path: '/atelier', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
  { name: 'Exhibits', path: '/courses-catalog', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>' },
  { name: 'Atelier', path: '/project-submission', active: true, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>' },
  { name: 'Archive', path: '/atelier', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>' },
])

const currentUser = ref({
  name: 'Julian Vane',
  role: 'Lead Designer',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
})

const projectBrief = ref({
  courseName: 'Advanced UI Design Principles',
  description: 'Demonstrate your mastery of the "Botanical Atelier" design system. Submit your high-fidelity dashboard for final review and certification.',
  projectType: 'Final Project',
  requirements: [
    { title: 'Botanical Aesthetics', description: 'Utilize tonal layering and forest-inspired palettes effectively.' },
    { title: 'Editorial Scale', description: 'Strong contrast between display titles and body copy.' },
    { title: 'No-Line Layout', description: 'Structural boundaries must use background shifts or rhythm.' },
    { title: 'Interactivity', description: 'Micro-interactions and subtle glassmorphism effects.' },
  ],
})

const submissionForm = reactive({
  githubUrl: '',
  notes: '',
})

const errors = reactive({
  githubUrl: '',
})

const submissionStatus = ref('not_submitted')
const mentorFeedback = ref('Please improve the spacing in the header component and add hover states to the cards. Refer to Section 2.3 of the Design Guide.')

const reviewer = ref({
  name: 'Evelyn Sterling',
  title: 'Creative Director, Atelier Studio',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80',
  quote: "I'm looking for exceptional use of negative space and tonal shifts. Avoid borders at all costs.",
})

const proTip = ref("Documentation matters. Explain your 'No-Line' logic clearly to earn extra points for theory application.")

const submissionStats = ref({
  turnaround: '48 Hours',
  passRate: '92%',
})

const deadline = ref({
  date: 'Oct 31, 2023',
  remaining: '7 Days remaining',
  urgent: true,
})

const submissionHistory = ref([
  { id: 1, date: 'Oct 24, 2023', projectName: 'Botanical Atelier Final', status: 'pending', statusLabel: 'Pending Review' },
  { id: 2, date: 'Oct 18, 2023', projectName: 'Module 4 Case Study', status: 'approved', statusLabel: 'Approved' },
  { id: 3, date: 'Oct 12, 2023', projectName: 'Prototype Concepts v1', status: 'revision', statusLabel: 'Needs Revision' },
])

function validateForm() {
  let isValid = true
  errors.githubUrl = ''

  if (!submissionForm.githubUrl) {
    errors.githubUrl = 'GitHub URL is required.'
    isValid = false
  } else if (!submissionForm.githubUrl.startsWith('https://github.com/')) {
    errors.githubUrl = 'URL must start with https://github.com/'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true

  await new Promise(resolve => setTimeout(resolve, 2000))

  isSubmitting.value = false
  submissionStatus.value = 'pending'

  submissionHistory.value.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    projectName: 'New Submission',
    status: 'pending',
    statusLabel: 'Pending Review',
  })
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>
