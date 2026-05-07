<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#1A2E20]">Category Management</h1>
        <p class="text-gray-500 mt-1 text-[13px]">Organize and manage your course curriculum classifications.</p>
      </div>
      <button
        @click="openCreate"
        id="create-category-btn"
        class="px-4 py-2.5 bg-[#0A733F] text-white rounded-lg text-sm font-semibold hover:bg-[#085a31] flex items-center gap-2 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Create Category
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-[#E6EFE9] p-5 flex items-center gap-4 shadow-sm">
        <div class="w-11 h-11 rounded-xl bg-[#F0FDF4] flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-[#0A733F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
        </div>
        <div>
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Categories</p>
          <p class="text-2xl font-bold text-[#1A2E20] mt-0.5">{{ categories.length }}</p>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-[#E6EFE9] p-5 flex items-center gap-4 shadow-sm">
        <div class="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        </div>
        <div>
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Filtered Results</p>
          <p class="text-2xl font-bold text-[#1A2E20] mt-0.5">{{ filteredCategories.length }}</p>
        </div>
      </div>
    </div>

    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input
        v-model="rawSearch"
        type="text"
        id="category-search"
        placeholder="Search categories by name..."
        class="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20 transition-all"
      >
      <button v-if="rawSearch" @click="rawSearch = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="bg-white rounded-xl border border-[#E6EFE9] overflow-hidden shadow-sm">

      <div v-if="loading" class="flex items-center justify-center py-24">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-[#0A733F] border-t-transparent rounded-full animate-spin"></div>
          <span class="text-[13px] text-gray-500">Loading categories...</span>
        </div>
      </div>

      <div v-else-if="fetchError" class="flex items-center justify-center py-24">
        <div class="flex flex-col items-center gap-3 text-center max-w-sm">
          <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <p class="text-[14px] font-semibold text-gray-700">Failed to load categories</p>
          <p class="text-[12px] text-gray-400">{{ fetchError }}</p>
          <button @click="fetchCategories" class="px-4 py-2 bg-[#0A733F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#085a31] transition-colors">Retry</button>
        </div>
      </div>

      <template v-else>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#E6EFE9] bg-gray-50/60">
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-16">#</th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Category Name</th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Created At</th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Updated At</th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E6EFE9]">
  
            <tr v-if="filteredCategories.length === 0">
              <td colspan="5" class="py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-14 h-14 rounded-full bg-gray-50 border border-[#E6EFE9] flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                  </div>
                  <p class="text-[14px] font-semibold text-gray-500">No categories found</p>
                  <p class="text-[12px] text-gray-400">{{ rawSearch ? 'Try a different search term.' : 'Start by creating your first category.' }}</p>
                  <button v-if="!rawSearch" @click="openCreate" class="mt-1 px-4 py-2 bg-[#0A733F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#085a31] transition-colors">Create Category</button>
                </div>
              </td>
            </tr>

            <tr
              v-for="(cat, idx) in paginatedCategories"
              :key="cat.id"
              class="hover:bg-[#FAFCFB] transition-colors group"
            >
              <td class="py-4 px-6">
                <span class="text-[12px] text-gray-400 font-medium">{{ (currentPage - 1) * perPage + idx + 1 }}</span>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#D1FAE5] flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-[#0A733F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                  </div>
                  <span class="text-[14px] font-semibold text-[#1A2E20]">{{ cat.cat_name }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="text-[12px] text-gray-500">{{ formatDate(cat.createdAt) }}</span>
              </td>
              <td class="py-4 px-6">
                <span class="text-[12px] text-gray-500">{{ formatDate(cat.updatedAt) }}</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="openEdit(cat)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredCategories.length > 0" class="p-4 border-t border-[#E6EFE9] flex items-center justify-between bg-white">
          <span class="text-[12px] text-gray-500 font-medium">
            Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredCategories.length) }} of {{ filteredCategories.length }} categories
          </span>
          <div class="flex items-center gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              v-for="page in totalPages" :key="page" @click="currentPage = page"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-bold transition-colors"
              :class="page === currentPage ? 'bg-[#0A733F] text-white' : 'hover:bg-gray-50 text-gray-600'"
            >{{ page }}</button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </template>
    </div>

    <CategoryForm
      v-model="showForm"
      :category="selectedCategory"
      @saved="onSaved"
    />

    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="translate-y-4 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-4 opacity-0"
      >
        <div
          v-if="toast.show"
          class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-[13px] font-semibold"
          :class="toast.type === 'success' ? 'bg-[#0A733F]' : 'bg-red-600'"
        >
          <svg v-if="toast.type === 'success'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <svg v-else class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import CategoryForm from './CategoryForm.vue'
import { getCategories } from '../../../services/categoryService.js'

const categories = ref([])
const loading = ref(false)
const fetchError = ref('')
const rawSearch = ref('')
const search = ref('')
const currentPage = ref(1)
const perPage = 10

const showForm = ref(false)
const selectedCategory = ref(null)

const toast = reactive({ show: false, message: '', type: 'success' })

let debounceTimer = null
watch(rawSearch, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    search.value = val
    currentPage.value = 1
  }, 350)
})

const filteredCategories = computed(() => {
  if (!search.value.trim()) return categories.value
  const q = search.value.toLowerCase()
  return categories.value.filter(c => c.cat_name.toLowerCase().includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCategories.value.length / perPage)))

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredCategories.value.slice(start, start + perPage)
})

async function fetchCategories() {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await getCategories()
    categories.value = res.data?.data ?? res.data ?? []
  } catch (err) {
    fetchError.value = err?.response?.data?.message || err.message || 'Unable to connect to the server.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  selectedCategory.value = null
  showForm.value = true
}

function openEdit(cat) {
  selectedCategory.value = cat
  showForm.value = true
}

function onSaved(action) {
  fetchCategories()
  showToast(action === 'updated' ? 'Category updated successfully!' : 'Category created successfully!')
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
}

function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => toast.show = false, 3500)
}

onMounted(fetchCategories)
</script>
