<template>
  <div class="p-8 max-w-[1600px] mx-auto space-y-10 bg-[#FCFDFD] min-h-screen">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-[32px] font-black text-slate-900 tracking-tight">Quiz Management</h1>
        <p class="text-slate-500 mt-1 text-[15px] font-medium">Create, manage, and track quiz performance across all courses.</p>
      </div>
      <button 
        @click="showDrawer = true"
        class="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all flex items-center gap-2 shadow-lg shadow-[#10B981]/20 active:scale-95"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Create New Quiz
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-1">{{ stat.label }}</p>
            <h3 class="text-3xl font-black text-slate-900">{{ stat.value }}</h3>
          </div>
          <div :class="`p-3 rounded-2xl ${stat.bgColor}`">
            <component :is="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
          </div>
        </div>
        <div class="mt-6 h-12 flex items-end">
          <svg viewBox="0 0 100 30" class="w-full h-full">
            <path 
              :d="stat.sparkline" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2.5" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              :class="stat.iconColor"
              class="opacity-60"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
        <div class="flex items-center gap-4">
          <div class="relative group">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#10B981] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              class="pl-11 pr-6 py-2.5 bg-slate-50 border border-transparent rounded-2xl text-[14px] w-80 focus:outline-none focus:bg-white focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/5 transition-all"
            >
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          </button>
          <button class="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Quiz Title</th>
              <th class="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Questions</th>
              <th class="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Pass Grade</th>
              <th class="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Duration</th>
              <th class="px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Status</th>
              <th class="px-8 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="quiz in quizzes" :key="quiz.id" class="hover:bg-slate-50/40 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#10B981] font-black text-sm">
                    {{ quiz.title.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-[15px] font-bold text-slate-900 group-hover:text-[#10B981] transition-colors">{{ quiz.title }}</p>
                    <p class="text-[12px] text-slate-400 font-medium">{{ quiz.module }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <span class="text-[14px] font-semibold text-slate-600">{{ quiz.questions }} Qs</span>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-2">
                  <div class="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-400" :style="{ width: quiz.passGrade + '%' }"></div>
                  </div>
                  <span class="text-[14px] font-bold text-slate-700">{{ quiz.passGrade }}%</span>
                </div>
              </td>
              <td class="px-8 py-5 text-[14px] font-semibold text-slate-600">
                {{ quiz.duration }}
              </td>
              <td class="px-8 py-5">
                <span 
                  class="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase"
                  :class="quiz.status === 'Active' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-slate-100 text-slate-500'"
                >
                  {{ quiz.status }}
                </span>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    @click="$router.push({ name: 'AdminQuestions', params: { id: quiz.id } })"
                    class="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <button class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                  <button class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
        <p class="text-[13px] text-slate-500 font-medium">Showing 1 to 5 of 24 quizzes</p>
        <div class="flex items-center gap-2">
          <button class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-[13px] shadow-sm">1</button>
          <button class="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent text-slate-500 hover:bg-white hover:border-slate-200 transition-all text-[13px] font-medium">2</button>
          <button class="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent text-slate-500 hover:bg-white hover:border-slate-200 transition-all text-[13px] font-medium">3</button>
          <button class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDrawer" class="fixed inset-0 z-50 overflow-hidden">
          <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="showDrawer = false"></div>
          
          <div class="absolute inset-y-0 right-0 w-full max-w-[560px] flex">
            <Transition
              enter-active-class="transform transition duration-500 ease-out"
              enter-from-class="translate-x-full"
              enter-to-class="translate-x-0"
              leave-active-class="transform transition duration-400 ease-in"
              leave-from-class="translate-x-0"
              leave-to-class="translate-x-full"
              appear
            >
              <div v-if="showDrawer" class="relative w-full bg-white shadow-2xl flex flex-col">
                <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div>
                    <h2 class="text-xl font-black text-slate-900">Create New Quiz</h2>
                    <p class="text-[13px] text-slate-500 mt-0.5">Configure details for the new assessment.</p>
                  </div>
                  <button @click="showDrawer = false" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                  <section class="space-y-6">
                    <div class="flex items-center gap-2 text-[#10B981]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <h3 class="text-[11px] font-bold uppercase tracking-[0.2em]">General Information</h3>
                    </div>
                    
                    <div class="space-y-4">
                      <div>
                        <label class="block text-[13px] font-bold text-slate-700 mb-2">Quiz Title <span class="text-red-500">*</span></label>
                        <input 
                          v-model="form.title"
                          type="text" 
                          placeholder="e.g., Module 1: Comprehensive Review" 
                          class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/5 transition-all"
                        >
                      </div>
                      <div>
                        <label class="block text-[13px] font-bold text-slate-700 mb-2">Description</label>
                        <textarea 
                          v-model="form.description"
                          rows="4" 
                          placeholder="Explain the purpose of this quiz..." 
                          class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/5 transition-all resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center gap-2 text-[#10B981]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      <h3 class="text-[11px] font-bold uppercase tracking-[0.2em]">Placement</h3>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[13px] font-bold text-slate-700 mb-2">Select Course <span class="text-red-500">*</span></label>
                        <select v-model="form.courseId" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#10B981] appearance-none transition-all">
                          <option value="" disabled>Select a course</option>
                          <option value="1">Introduction to Plant Biology</option>
                          <option value="2">Cell Biology</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-[13px] font-bold text-slate-700 mb-2">Select Module <span class="text-red-500">*</span></label>
                        <select v-model="form.moduleId" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#10B981] appearance-none transition-all">
                          <option value="" disabled>Select a module</option>
                          <option value="1">Botany Fundamentals</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-6">
                    <div class="flex items-center gap-2 text-[#10B981]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <h3 class="text-[11px] font-bold uppercase tracking-[0.2em]">Quiz Parameters</h3>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4">
                      <div>
                        <label class="block text-[13px] font-bold text-slate-700 mb-2">Passing Grade</label>
                        <div class="relative">
                          <input v-model="form.passGrade" type="number" placeholder="70" class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#10B981] transition-all">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">%</span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-[13px] font-bold text-slate-700 mb-2">Duration</label>
                        <div class="relative">
                          <input v-model="form.duration" type="number" placeholder="30" class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#10B981] transition-all">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">min</span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-[13px] font-bold text-slate-700 mb-2">Max Attempts</label>
                        <input v-model="form.maxAttempts" type="number" placeholder="1" class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:border-[#10B981] transition-all">
                      </div>
                    </div>
                  </section>
                </div>

                <div class="px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30 shrink-0">
                  <button @click="showDrawer = false" class="px-6 py-2.5 text-[14px] font-bold text-slate-500 hover:text-slate-700 transition-all">Cancel</button>
                  <button class="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 rounded-xl font-bold text-[14px] transition-all shadow-lg shadow-[#10B981]/20 active:scale-95 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Save Quiz
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const showDrawer = ref(false)
const form = reactive({
  title: '',
  description: '',
  courseId: '',
  moduleId: '',
  passGrade: 70,
  duration: 30,
  maxAttempts: 1
})

const stats = reactive([
  { 
    label: 'Total Quizzes', 
    value: '24', 
    icon: 'FileText', 
    iconColor: 'text-emerald-500', 
    bgColor: 'bg-emerald-50',
    sparkline: 'M0 25 L10 22 L20 28 L30 18 L40 22 L50 12 L60 15 L70 5 L80 12 L90 8 L100 15'
  },
  { 
    label: 'Active Participants', 
    value: '1,842', 
    icon: 'Users', 
    iconColor: 'text-blue-500', 
    bgColor: 'bg-blue-50',
    sparkline: 'M0 28 L10 25 L20 20 L30 22 L40 18 L50 22 L60 25 L70 20 L80 15 L90 10 L100 5'
  },
  { 
    label: 'Avg Completion Rate', 
    value: '84.2%', 
    icon: 'CheckCircle', 
    iconColor: 'text-amber-500', 
    bgColor: 'bg-amber-50',
    sparkline: 'M0 15 L10 18 L20 12 L30 15 L40 10 L50 8 L60 12 L70 15 L80 20 L90 25 L100 28'
  },
  { 
    label: 'Average Score', 
    value: '78.5', 
    icon: 'Award', 
    iconColor: 'text-purple-500', 
    bgColor: 'bg-purple-50',
    sparkline: 'M0 20 L10 15 L20 18 L30 12 L40 15 L50 10 L60 8 L70 5 L80 10 L90 12 L100 8'
  }
])

const quizzes = ref([
  { id: 1, title: 'Introduction to Plant Biology', module: 'Botany Fundamentals', questions: 15, passGrade: 70, duration: '20m', status: 'Active' },
  { id: 2, title: 'Cellular Respiration & ATP', module: 'Cell Biology', questions: 12, passGrade: 75, duration: '15m', status: 'Active' },
  { id: 3, title: 'Genetic Inheritance Patterns', module: 'Genetics', questions: 20, passGrade: 65, duration: '30m', status: 'Draft' },
  { id: 4, title: 'Photosynthesis Deep Dive', module: 'Plant Physiology', questions: 10, passGrade: 80, duration: '15m', status: 'Active' },
  { id: 5, title: 'Ecosystem Dynamics', module: 'Ecology', questions: 18, passGrade: 70, duration: '25m', status: 'Active' },
])

const FileText = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
}
const Users = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
}
const CheckCircle = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
}
const Award = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>

