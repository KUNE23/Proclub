<template>
  <div class="bg-[#FAFAFA] font-sans antialiased text-gray-800">
  
    <main class="flex-1 flex flex-col overflow-hidden bg-[#FAFCFB]">

        <div v-if="isLoading" class="animate-pulse space-y-10 max-w-6xl mx-auto">
           <div class="h-10 bg-gray-200 rounded w-1/3"></div>
           <div class="h-64 bg-gray-200 rounded-3xl w-full"></div>
           <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div class="h-28 bg-gray-200 rounded-2xl"></div>
             <div class="h-28 bg-gray-200 rounded-2xl"></div>
             <div class="h-28 bg-gray-200 rounded-2xl"></div>
           </div>
           <div class="h-6 bg-gray-200 rounded w-1/4"></div>
           <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div class="h-64 bg-gray-200 rounded-2xl border border-gray-100"></div>
             <div class="h-64 bg-gray-200 rounded-2xl border border-gray-100"></div>
             <div class="h-64 bg-gray-200 rounded-2xl border border-gray-100"></div>
           </div>
        </div>

        <div v-else class="mx-auto px-5 md:px-0 py-5">
          
          <div class="mb-10">
            <h2 class="text-3xl font-bold text-gray-800 tracking-tight">
              Welcome back, <span class="text-[#2C7047]">{{ user.name }}</span>!
            </h2>
            <p class="text-gray-500 mt-2 text-sm md:text-base border-gray-100 pb-2">
            Perjalanan belajarmu terus berkembang. Berikut adalah progres belajarmu saat ini.
            </p>
          </div>

          <div class="bg-white rounded-[2rem] border border-[#E6EFE9] flex flex-col md:flex-row overflow-hidden mb-10 shadow-sm shrink-0">
      
            <div class="w-full md:w-1/2 bg-[#F8F9FA] relative min-h-[250px] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#E6EFE9]">
           
               <div class="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
                 <img :src="featuredCourse.image" alt="Course Cover" class="w-full aspect-[4/3] object-cover" />
                 <div class="absolute inset-0 bg-black/40 flex items-center justify-center flex-col text-white">
                   <div class="font-bold text-lg md:text-xl">UI Design</div>
                   <div class="text-xs font-medium text-gray-200 uppercase tracking-wider">Course</div>
                 </div>
               </div>
            </div>

            <div class="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-[#D1E6DA] text-[#2C7047] text-xs font-bold rounded-full uppercase tracking-wide">
                  {{ featuredCourse.tag }}
                </span>
                <span class="text-xs text-gray-400 font-medium">{{ featuredCourse.updatedAt }}</span>
              </div>
              <h3 class="text-2xl font-bold text-[#1A2E20] mb-3 leading-tight">{{ featuredCourse.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed mb-8">{{ featuredCourse.description }}</p>
              
              <div class="mb-8">
                <div class="flex justify-between text-sm font-bold text-gray-600 mb-2">
                  <span>Course Progress</span>
                  <span class="text-[#2C7047]">{{ featuredCourse.progress }}%</span>
                </div>
                <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-[#2C7047] rounded-full" :style="{ width: `${featuredCourse.progress}%` }"></div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <button class="bg-[#2C7047] hover:bg-[#235838] transition-colors text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md shadow-[#2C7047]/20">
                  Continue Lesson
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
                <button class="text-[#2C7047] hover:bg-[#F2F7F4] transition-colors px-6 py-3 rounded-lg text-sm font-medium">
                  View Curriculum
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div v-for="(stat, index) in stats" :key="index" class="bg-white border border-[#E6EFE9] rounded-2xl p-6 flex flex-col justify-between shadow-sm shadow-[#E6EFE9]/30">
              <div class="flex items-start gap-4">
                 <div class="w-12 h-12 rounded-xl bg-[#F2F7F4] flex items-center justify-center shrink-0" v-html="stat.icon"></div>
                 <div>
                   <h4 class="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">{{ stat.label }}</h4>
                   <div class="text-3xl font-black text-[#1A2E20]">{{ stat.value }}</div>
                 </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-end justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-[#1A2E20]">Recommended for You</h3>
                <p class="text-sm text-gray-500 mt-1">Curated masterpieces to expand your creative horizon.</p>
              </div>
              <router-link to="/courses-catalog" class="text-sm font-bold text-[#2C7047] hover:underline flex items-center gap-1">
                See all courses <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </router-link>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div v-for="course in recommendedCourses" :key="course.id" class="bg-white rounded-[1.5rem] border border-[#E6EFE9] overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col">
                 <div class="aspect-video w-full overflow-hidden shrink-0">
                    <img :src="course.image" :alt="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                 </div>
                 <div class="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 class="font-bold text-gray-800 text-lg mb-2 leading-tight">{{ course.title }}</h4>
                      <p class="text-gray-500 text-sm leading-relaxed mb-6">{{ course.description }}</p>
                    </div>
                    <button class="w-full bg-[#F5F8F6] hover:bg-[#E6EFE9] text-[#2C7047] text-sm font-bold py-3 rounded-xl transition-colors">
                      Learn More
                    </button>
                 </div>
               </div>
            </div>
          </div>

        </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const isLoading = ref(true)
const UserName = ref('');

const fetchUserName = async () => {
  try {
    const response = await api.get('/profile'); 
    UserName.value = response.data.name;
  } catch (error) {
    console.error("Gagal mengambil nama user:", error);
  }
};

const user = ref({
  name: UserName,
  subtitle: 'Your botanical journey is flourishing. Here is your current progress.',
})

const featuredCourse = ref({
  tag: 'ONGOING',
  updatedAt: 'Updated 2 days ago',
  title: 'Advanced UI Design Principles',
  description: 'Master the art of organic precision in digital interfaces. This module covers advanced tonal layering and editorial styling techniques inspired by nature.',
  progress: 65,
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
})

const stats = ref([
  { label: 'COURSES IN PROGRESS', value: '4', icon: '<svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>' },
  { label: 'COMPLETED MODULES', value: '12', icon: '<svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>' },
  { label: 'AVG QUIZ SCORE', value: '88%', icon: '<svg class="text-[#2C7047] w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>' },
])

const recommendedCourses = ref([
  { 
    id: 1, 
    title: 'Digital Illustration Masterclass', 
    description: 'Learn to capture the intricate details of the natural world through advanced digital brush techniques.', 
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 2, 
    title: 'Strategic Brand Design', 
    description: 'Build enduring identities that breathe life into organizations through botanical-inspired design philosophy.', 
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 3, 
    title: 'Botanical Macro Photography', 
    description: 'A deep dive into close-up nature photography. Capture the unseen textures of the forest floor.', 
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
  }
])

onMounted(() => {
  const didJustLogin = window.history.state?.loginSuccess
  fetchUserName();
  setTimeout(() => {
    isLoading.value = false

    if (didJustLogin) {
      toast.success('Login berhasil! Selamat datang kembali ', {
        timeout: 4000,
      })
    }
  }, 1200)
})
</script>
