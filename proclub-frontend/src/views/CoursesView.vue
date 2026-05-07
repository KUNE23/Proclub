<template>
  <div class="bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <div class="flex-1 flex flex-col overflow-hidden">

      <div class="flex-1 overflow-y-auto">

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

        <div v-else class="mx-auto px-5 md:px-0 py-5">

          <div class="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2C7047] mb-2">Ruang Belajar</p>
              <h2 class="text-3xl lg:text-4xl font-black text-[#1A2E20] leading-tight">Jelajahi Kurikulum Proclub</h2>
              <p class="text-gray-500 text-sm mt-3 max-w-xl leading-relaxed">
                Kumpulan materi pembelajaran terkurasi yang dirancang untuk membantu kamu mengembangkan skill di bidang teknologi, mulai dari Frontend hingga Backend. Belajar secara terstruktur, praktis, dan relevan dengan kebutuhan industri saat ini.
              </p>
            </div>
          </div>

          <div v-if="fetchError" class="mb-6 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Gagal memuat data dari server. <button @click="fetchCourses" class="underline font-medium">Coba lagi</button></span>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
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

          <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            <div
              v-for="course in filteredCourses"
              :key="course.id"
              class="bg-white rounded-2xl border border-[#E6EFE9] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >

              <div class="aspect-[4/3] w-full overflow-hidden relative">
                <img :src="`http://localhost:3000/api/${course.image}`" :alt="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span class="absolute top-4 left-4 px-3 py-1 bg-[#2C7047]/90 text-white text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-sm">
                  {{ typeof course.category === 'object' ? course.category.cat_name : course.category }}
                </span>
              </div>

              <div class="p-6 flex-1 flex flex-col">
                <h3 class="font-bold text-[#1A2E20] text-lg leading-snug mb-2">{{ course.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{{ course.description }}</p>
                <div class="flex items-center justify-between">
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
import { ref, watch, computed, onMounted } from 'vue'
import api from '../api/index.js'

const isLoading = ref(true)
const fetchError = ref(false)
const activeCategory = ref('All')
const searchQuery = ref('')
const categories = ref(['All'])

const courses = ref([])
const currentPage = ref(1)
const limit = ref(6)

const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    
    const raw = response.data.data || [];
    
    const names = raw.map(c => {
      if (typeof c === 'string') return c;
      return c.cat_name; 
    });
    
    categories.value = ['All', ...names];
  } catch (error) {
    console.error('Gagal mengambil kategori:', error);
  }
};

const fetchCourses = async () => {
  isLoading.value = true
  fetchError.value = false
  try {
    const response = await api.get('/courses', {
      params: {
        page: currentPage.value,
        limit: limit.value,
        category: activeCategory.value !== 'All' ? activeCategory.value : undefined
      }
    })
    courses.value = response.data.data ?? []
  } catch (error) {
    console.error('Gagal mengambil data kursus:', error)
    courses.value = []
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
}

const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    const categoryName = typeof c.category === 'object' ? c.category.cat_name : c.category;
    
    const matchesCategory = activeCategory.value === 'All' || categoryName === activeCategory.value;
    
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
});

watch(activeCategory, () => {
  currentPage.value = 1
  fetchCourses()
})

watch(currentPage, () => {
  fetchCourses()
})

onMounted(async () => {
  await fetchCategories()
  fetchCourses()
})
</script>
