<template>
  <div class="p-8 max-w-[1600px] mx-auto space-y-10 bg-[#FCFDFD] min-h-screen">

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div>
          <h1 class="text-[32px] font-black text-slate-900 tracking-tight">Manage Questions</h1>
          <p class="text-slate-500 mt-1 text-[15px] font-medium">Plant Biology Fundamentals • 10 Questions Total</p>
        </div>
      </div>
      <button class="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all flex items-center gap-2 shadow-lg shadow-[#10B981]/20 active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add New Question
      </button>
    </div>

    <div class="grid grid-cols-12 gap-8 items-start">
      <div class="col-span-8 space-y-6">
        <div v-for="(q, index) in questions" :key="q.id" class="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <span class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-sm">
                Q{{ index + 1 }}
              </span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                Multiple Choice
              </span>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
              <button class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>

          <h3 class="text-lg font-bold text-slate-900 leading-relaxed mb-8">
            {{ q.text }}
          </h3>

          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="(opt, oIdx) in q.options" 
              :key="oIdx"
              class="relative flex items-center p-4 rounded-2xl border transition-all cursor-pointer group/opt"
              :class="[
                opt.isCorrect 
                  ? 'bg-emerald-50/50 border-emerald-100 ring-1 ring-emerald-500/10' 
                  : 'bg-slate-50/30 border-slate-100 hover:border-slate-200'
              ]"
            >
              <div 
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all"
                :class="[
                  opt.isCorrect 
                    ? 'border-emerald-500 bg-emerald-500 text-white' 
                    : 'border-slate-200 group-hover/opt:border-slate-300'
                ]"
              >
                <svg v-if="opt.isCorrect" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <span v-else class="text-[10px] font-bold text-slate-400 group-hover/opt:text-slate-500 uppercase">{{ String.fromCharCode(65 + oIdx) }}</span>
              </div>
              <span class="text-[14px] font-semibold" :class="opt.isCorrect ? 'text-emerald-900' : 'text-slate-600'">
                {{ opt.text }}
              </span>
            </div>
          </div>
        </div>

        <div class="border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-[#10B981] hover:bg-emerald-50/10 transition-all">
          <div class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#10B981] group-hover:bg-white transition-all shadow-sm">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div class="text-center">
            <p class="text-[15px] font-bold text-slate-900">Drag questions to reorder</p>
            <p class="text-[13px] text-slate-400 font-medium">or click the button above to create a new one.</p>
          </div>
        </div>
      </div>
      
      <div class="col-span-4 space-y-6 sticky top-8">
        <div class="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
          <div>
            <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Difficulty</h4>
            <div class="flex items-end justify-between">
              <span class="text-3xl font-black text-slate-900">Med</span>
              <div class="flex gap-1.5 h-2 items-end">
                <div class="w-8 h-full bg-[#10B981] rounded-full"></div>
                <div class="w-8 h-full bg-[#10B981] rounded-full"></div>
                <div class="w-8 h-full bg-slate-100 rounded-full"></div>
              </div>
            </div>
          </div>

          <div class="pt-8 border-t border-slate-50">
            <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Time Limit</h4>
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-black text-slate-900">20m</span>
              <span class="text-[13px] text-slate-400 font-medium">2 mins / question</span>
            </div>
            <div class="mt-4 w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div class="h-full bg-blue-400 w-2/3"></div>
            </div>
          </div>

          <div class="pt-8 border-t border-slate-50">
            <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Knowledge Domain</h4>
            <div class="bg-slate-900 rounded-3xl p-6 relative overflow-hidden group">
              <div class="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
                <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
              </div>
              <p class="text-white font-bold text-[15px] mb-4 relative z-10">Cellular Biology & Botanical Anatomy</p>
              <div class="flex flex-wrap gap-2 relative z-10">
                <span v-for="tag in ['Botany', 'Genetics', 'Photosynthesis']" :key="tag" class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-[10px] font-bold rounded-lg transition-colors cursor-pointer">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-emerald-50/50 p-6 rounded-[28px] border border-emerald-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p class="text-[14px] font-bold text-emerald-900">Quiz is Ready</p>
              <p class="text-[12px] text-emerald-600/70 font-medium">All settings validated</p>
            </div>
          </div>
          <button class="text-[13px] font-black text-emerald-700 hover:underline">Publish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const questions = ref([
  {
    id: 1,
    text: "Which part of the plant cell is primarily responsible for photosynthesis?",
    options: [
      { text: "Chloroplast", isCorrect: true },
      { text: "Mitochondria", isCorrect: false },
      { text: "Nucleus", isCorrect: false },
      { text: "Cell Wall", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "What is the main function of the xylem in vascular plants?",
    options: [
      { text: "Transport of water and minerals", isCorrect: true },
      { text: "Transport of sugars and nutrients", isCorrect: false },
      { text: "Regulation of gas exchange", isCorrect: false },
      { text: "Support and protection", isCorrect: false }
    ]
  },
  {
    id: 3,
    text: "Which of the following is NOT a characteristic of dicotyledonous plants?",
    options: [
      { text: "Two seed leaves (cotyledons)", isCorrect: false },
      { text: "Floral parts in multiples of 4 or 5", isCorrect: false },
      { text: "Parallel leaf venation", isCorrect: true },
      { text: "Presence of a taproot system", isCorrect: false }
    ]
  }
])
</script>

<style scoped>
</style>
