<template>
  <div class="bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <!-- ===== MAIN ===== -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto">

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="animate-pulse p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
          <div class="h-10 bg-gray-200 rounded w-1/3"></div>
          <div class="h-5 bg-gray-200 rounded w-2/3"></div>
          <div class="flex gap-3 mt-4">
            <div class="h-10 w-20 bg-gray-200 rounded-full" v-for="n in 5" :key="n"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div class="h-80 bg-gray-200 rounded-2xl" v-for="n in 6" :key="n + 10"></div>
          </div>
        </div>

        <!-- Loaded Content --> 
        <div v-else class="mx-auto px-5 md:px-0 py-5">

          <!-- Page Header -->
          <div class="mb-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2C7047] mb-2">Knowledge Grove</p>
            <h2 class="text-3xl lg:text-4xl font-black text-[#1A2E20] leading-tight">Explore Our Curriculum</h2>
            <p class="text-gray-500 text-sm mt-3 max-w-xl leading-relaxed">
              A curated collection of industry-leading courses designed for the modern creative professional. Master the craft of digital botany and precision design.
            </p>
          </div>

          <!-- Category Filters -->
          <div class="flex flex-wrap gap-2 mb-10">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = cat"
              class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
              :class="activeCategory === cat
                ? 'bg-[#2C7047] text-white border-[#2C7047] shadow-sm shadow-[#2C7047]/20'
                : 'bg-white text-gray-600 border-[#E6EFE9] hover:border-[#2C7047] hover:text-[#2C7047]'"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Course Grid -->
          <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            <div
              v-for="course in filteredCourses"
              :key="course.id"
              class="bg-white rounded-2xl border border-[#E6EFE9] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <!-- Image -->
              <div class="aspect-[4/3] w-full overflow-hidden relative">
                <img :src="course.image_url" :alt="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span class="absolute top-4 left-4 px-3 py-1 bg-[#2C7047]/90 text-white text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-sm">
                  {{ course.category }}
                </span>
              </div>

              <!-- Content -->
              <div class="p-6 flex-1 flex flex-col">
                <h3 class="font-bold text-[#1A2E20] text-lg leading-snug mb-2">{{ course.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{{ course.description }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <span class="w-2 h-2 rounded-full" :class="course.is_enrolled ? 'bg-[#2C7047]' : 'bg-red-400'"></span>
                    {{ course.lessonCount }} Lessons
                  </div>
                  <router-link
                    :to="`/courses/${course.id}`"
                    class="px-5 py-2 bg-[#2C7047] hover:bg-[#235838] text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-[#2C7047]/20"
                  >
                    View Detail
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-[#F2F7F4] flex items-center justify-center mx-auto mb-5">
              <svg class="w-10 h-10 text-[#2C7047]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-[#1A2E20] mb-2">No courses found</h3>
            <p class="text-gray-500 text-sm max-w-sm mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
            <button @click="searchQuery = ''; activeCategory = 'All'" class="mt-5 px-6 py-2.5 bg-[#2C7047] text-white text-sm font-medium rounded-xl hover:bg-[#235838] transition-colors">
              Clear Filters
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isLoading = ref(true)
const searchQuery = ref('')
const activeCategory = ref('All')

const categories = ref(['All', 'Fundamentals', 'Frontend', 'UI Design', 'Photography'])

const sidebarMenu = ref([
  { name: 'Gallery', path: '/atelier', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>' },
  { name: 'Exhibits', path: '/courses-catalog', active: true, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>' },
  { name: 'Atelier', path: '/atelier', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>' },
  { name: 'Archive', path: '/atelier', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>' },
  { name: 'Settings', path: '/atelier', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
])

const courses = ref([
  {
    id: 1,
    title: 'The Theory of Organic Form',
    category: 'Fundamentals',
    image_url: 'https://images.unsplash.com/photo-1477554193778-9562c28588c0?auto=format&fit=crop&w=600&q=80',
    description: "Learn the mathematical principles behind nature's most intricate designs and apply them to digital architecture.",
    level: 'Beginner',
    lessonCount: 12,
    is_enrolled: true,
  },
  {
    id: 2,
    title: 'Architectural React Components',
    category: 'Frontend',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    description: 'Building scalable design systems that breathe. Deep dive into headless UI and motion principles for the modern web.',
    level: 'Intermediate',
    lessonCount: 24,
    is_enrolled: true,
  },
  {
    id: 3,
    title: 'The Editorial Interface',
    category: 'UI Design',
    image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=600&q=80',
    description: 'Mastering negative space and typography-first design. Move beyond grids to create high-impact gallery experiences.',
    level: 'Intermediate',
    lessonCount: 18,
    is_enrolled: false,
  },
  {
    id: 4,
    title: 'Macro Botanical Composition',
    category: 'Photography',
    image_url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    description: 'Capture the hidden world. Expert techniques for lighting, focus stacking, and post-production for plant photography.',
    level: 'Beginner',
    lessonCount: 8,
    is_enrolled: false,
  },
  {
    id: 5,
    title: 'Color Theory: The Evergreen Palette',
    category: 'Fundamentals',
    image_url: 'https://images.unsplash.com/photo-1501004318855-fce7bae9c8d3?auto=format&fit=crop&w=600&q=80',
    description: 'Developing a professional eye for tonal harmony. Using natural pigments as inspiration for digital brand identities.',
    level: 'Beginner',
    lessonCount: 10,
    is_enrolled: true,
  },
  {
    id: 6,
    title: 'Motion Design for Luxury Apps',
    category: 'UI Design',
    image_url: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=600&q=80',
    description: 'Mastering the subtle art of animation. Creating interfaces that feel responsive, organic, and premium through movement.',
    level: 'Intermediate',
    lessonCount: 16,
    is_enrolled: false,
  },
])

const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    const matchesCategory = activeCategory.value === 'All' || c.category === activeCategory.value
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
