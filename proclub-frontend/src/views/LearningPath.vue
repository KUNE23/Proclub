<template>
  <main class="bg-[#F8FAFC] min-h-screen font-sans">

    <section class="pb-8 px-10 max-w-6xl mx-auto">
      <span class="inline-block bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-green-200 mb-5">
        Mulai Perjalananmu
      </span>
      <h1 class="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-4 max-w-2xl">
        Kuasai Skill Teknologi Masa Kini
      </h1>
      <p class="text-slate-500 text-base md:text-lg max-w-xl leading-relaxed">
        Tingkatkan kemampuan coding melalui pembelajaran terstruktur yang dirancang untuk membangun skill industri.
      </p>
    </section>

    <section class="max-w-6xl mx-auto px-6 pb-14 grid md:grid-cols-2 gap-6">

      <div 
        v-for="(course, index) in courses" 
        :key="course.id"
        :class="[
          'relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col',
          index === 0 ? 'border-2 border-[#16A34A]' : 'border border-slate-200 hover:border-slate-300'
        ]"
      >
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            :class="[
              'absolute -right-12 -bottom-12 w-64 h-64 rounded-full opacity-70',
              index === 0 ? 'bg-green-50' : 'bg-slate-50'
            ]"
          ></div>
          <div 
            :class="[
              'absolute -right-4 -bottom-4 w-36 h-36 rounded-full opacity-50',
              index === 0 ? 'bg-green-100' : 'bg-slate-100'
            ]"
          ></div>
        </div>

        <div class="relative p-8 flex flex-col flex-1">
          <div class="flex items-start justify-between mb-6">
            <span 
              :class="[
                'text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full',
                index === 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 border border-slate-200'
              ]"
            >
              {{ index === 0 ? 'direkomendasikan' : 'kelas terbaru' }}
            </span>
            <div class="flex flex-col items-center bg-slate-900 text-white rounded-xl px-5 py-3 text-center min-w-[72px]">
              <span class="text-2xl font-bold leading-none">{{ course.totalModules || course.modules?.length || 0 }}</span>
              <span class="text-[10px] font-medium opacity-70 mt-1">Module</span>
            </div>
          </div>

          <h2 class="text-2xl font-bold text-slate-900 mb-3">{{ course.title }}</h2>
          <p class="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
            {{ course.description }}
          </p>

          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-medium text-slate-500">Progress Belajar</span>
              <span 
                :class="[
                  'text-sm font-bold',
                  course.percentage > 0 ? 'text-[#16A34A]' : 'text-slate-400'
                ]"
              >
                {{ course.percentage }}%
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5">
              <div 
                :class="[
                  'h-2.5 rounded-full',
                  course.percentage > 0 ? 'bg-[#16A34A]' : 'bg-slate-300'
                ]" 
                :style="{ width: course.percentage + '%' }"
              ></div>
            </div>
          </div>

          <button 
            :class="[
              'w-full font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-2 text-white',
              isLocked(index) ? 'bg-slate-300 cursor-not-allowed' : index === 0 ? 'bg-[#1B8745] hover:bg-green-800' : 'bg-slate-900 hover:bg-slate-700'
            ]"
            @click="handleClick(course, index)"
          >
            {{ isLocked(index) ? 'Terkunci' : course.percentage > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar' }}
            <svg v-if="!isLocked(index) && course.percentage > 0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
            <svg v-else-if="!isLocked(index)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a5 5 0 00-10 0v4H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
      </div>

    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const courses = ref([])
const router = useRouter()
const toast = useToast()


onMounted(async () => {
  try {
    const response = await api.get('/courses')
    if (response.data && response.data.status === 'success') {
      courses.value = response.data.data
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat learning path')
  }
})

const isLocked = (index) => {
  if (index === 0) return false
  return !courses.value[index - 1]?.completed
}

const handleClick = (course, index) => {
  if (isLocked(index)) {
    toast.warning('Selesaikan kelas sebelumnya terlebih dahulu')
    return
  }

  router.push(`/courses/${course.id}`)
}
</script>
