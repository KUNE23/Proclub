<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#1A2E20]">Courses Management</h1>
        <p class="text-gray-500 mt-1 text-[13px]">Manage and monitor your educational curriculum from one central hub.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2.5 bg-[#0A733F] text-white rounded-lg text-sm font-semibold hover:bg-[#085a31] flex items-center gap-2 transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Create New Course
      </button>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input v-model="search" type="text" placeholder="Filter by course name or category..." class="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F] transition-shadow">
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <select v-model="filterCategory" class="appearance-none bg-white border border-[#E6EFE9] rounded-xl px-4 py-2.5 pr-8 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-[#0A733F]">
          <option value="">All Categories</option>
          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#E6EFE9] overflow-hidden shadow-sm">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-[#0A733F] border-t-transparent rounded-full animate-spin"></div>
          <span class="text-[13px] text-gray-500">Loading courses...</span>
        </div>
      </div>

      <div v-else-if="fetchError" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3 text-center">
          <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <p class="text-[14px] font-medium text-gray-700">Failed to load courses</p>
          <p class="text-[13px] text-gray-500">{{ fetchError }}</p>
          <button @click="fetchCourses" class="px-4 py-2 bg-[#0A733F] text-white text-[13px] font-medium rounded-lg hover:bg-[#085a31] transition-colors">Retry</button>
        </div>
      </div>

      <template v-else>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white border-b border-[#E6EFE9]">
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[40%]">Title</th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Image</th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Created </th>
              <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E6EFE9]">
            <tr v-if="filteredCourses.length === 0">
              <td colspan="5" class="py-16 text-center text-[13px] text-gray-400">No courses found.</td>
            </tr>
            <tr v-for="course in paginatedCourses" :key="course.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 px-6">
                <div>
                  <p class="text-[14px] font-bold text-[#1A2E20] leading-snug">{{ course.title }}</p>
                  <p class="text-[11px] text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{{ course.description }}</p>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-gray-700">
                  {{ course.category?.cat_name || '-' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="w-14 h-10 rounded-lg overflow-hidden border border-[#E6EFE9] bg-gray-50">
                  <img v-if="course.image" :src="getImageUrl(course.image)" :alt="course.title" class="w-full h-full object-cover" @error="onImgError">
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-[9px] text-gray-400 uppercase font-bold">No IMG</div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="text-[12px] text-gray-500">{{ formatDate(course.createdAt) }}</span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="`/admin/courses/${course.id}/modules`" class="px-3 py-1.5 text-[11px] font-semibold text-[#0A733F] bg-[#F0FDF4] rounded-lg hover:bg-[#dcfce7] transition-colors flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                    Modules
                  </router-link>
                  <button @click="openEditModal(course)" class="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="confirmDelete(course)" class="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="p-4 border-t border-[#E6EFE9] flex items-center justify-between bg-white">
          <span class="text-[12px] text-gray-500 font-medium">
            Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredCourses.length) }} of {{ filteredCourses.length }} courses
          </span>
          <div class="flex items-center gap-1">
            <button @click="currentPage--" :disabled="currentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-40">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button v-for="page in totalPages" :key="page" @click="currentPage = page"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-bold transition-colors"
              :class="page === currentPage ? 'bg-[#0A733F] text-white' : 'hover:bg-gray-50 text-gray-600'">
              {{ page }}
            </button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-40">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </template>
    </div>

    <Teleport to="body">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeFormModal"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto z-10">
          <div class="flex items-center justify-between p-6 border-b border-[#E6EFE9]">
            <div>
              <h2 class="text-lg font-bold text-[#1A2E20]">{{ isEditing ? 'Edit Course' : 'Create New Course' }}</h2>
              <p class="text-[12px] text-gray-500 mt-0.5">{{ isEditing ? 'Update the course information below.' : 'Fill in the details to add a new course.' }}</p>
            </div>
            <button @click="closeFormModal" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <div>
              <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Course Title <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" placeholder="e.g. Advanced React Patterns"
                class="w-full px-4 py-2.5 border rounded-xl text-[13px] focus:outline-none focus:ring-1 transition-shadow"
                :class="formErrors.title ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'">
              <p v-if="formErrors.title" class="mt-1 text-[11px] text-red-500">{{ formErrors.title }}</p>
            </div>

            <div>
              <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Description <span class="text-red-500">*</span></label>
              <textarea v-model="form.description" rows="3" placeholder="Describe what students will learn..."
                class="w-full px-4 py-2.5 border rounded-xl text-[13px] focus:outline-none focus:ring-1 transition-shadow resize-none"
                :class="formErrors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"></textarea>
              <div class="flex items-center justify-between mt-1">
                <p v-if="formErrors.description" class="text-[11px] text-red-500">{{ formErrors.description }}</p>
                <span class="ml-auto text-[11px] text-gray-400">{{ form.description.length }}/500</span>
              </div>
            </div>

            <div>
              <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Category <span class="text-red-500">*</span></label>
              <select v-model.number="form.categoryId" 
                class="w-full px-4 py-2.5 border rounded-xl text-[13px] focus:outline-none focus:ring-1 transition-shadow appearance-none bg-white"
                :class="formErrors.categoryId ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'">
                <option value="" disabled>Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.cat_name }}</option>
              </select>
              <p v-if="formErrors.categoryId" class="mt-1 text-[11px] text-red-500">{{ formErrors.categoryId }}</p>
            </div>

            <div>
              <label class="block text-[12px] font-semibold text-gray-700 mb-1.5">Course Image <span v-if="!isEditing" class="text-red-500">*</span></label>
              <div @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false" @drop.prevent="handleDrop" @click="$refs.fileInput.click()"
                class="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
                :class="[dragOver ? 'border-[#0A733F] bg-[#F0FDF4]' : 'border-[#E6EFE9] hover:border-[#0A733F] hover:bg-[#F0FDF4]/50', formErrors.image ? 'border-red-300 bg-red-50' : '']">
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange">
                <div v-if="imagePreview" class="flex flex-col items-center gap-3">
                  <img :src="imagePreview" class="max-h-40 rounded-lg object-contain shadow-md">
                  <button @click.stop="removeImage" class="px-3 py-1 text-[11px] font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Remove</button>
                </div>
                <div v-else class="flex flex-col items-center gap-2 text-gray-400">
                  <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <p class="text-[13px] font-semibold">Click or drag & drop image</p>
                </div>
              </div>
              <p v-if="formErrors.image" class="mt-1 text-[11px] text-red-500">{{ formErrors.image }}</p>
            </div>

            <div v-if="submitError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{{ submitError }}</div>
          </div>

          <div class="flex items-center justify-end gap-3 p-6 border-t border-[#E6EFE9]">
            <button @click="closeFormModal" class="px-5 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button @click="submitForm" :disabled="submitting" class="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#0A733F] rounded-xl hover:bg-[#085a31] transition-colors flex items-center gap-2 disabled:opacity-60">
              <div v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ submitting ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6 text-center">
          <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </div>
          <h3 class="text-[18px] font-bold text-[#1A2E20]">Delete Course?</h3>
          <p class="text-[13px] text-gray-600 my-4">Are you sure you want to delete <span class="font-semibold text-red-600">"{{ courseToDelete?.title }}"</span>? This action cannot be undone.</p>
          <div v-if="deleteError" class="mb-4 p-3 rounded-xl bg-red-50 text-[12px] text-red-700">{{ deleteError }}</div>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false" class="flex-1 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 rounded-xl">Cancel</button>
            <button @click="deleteCourse" :disabled="deleting" class="flex-1 py-2.5 text-[13px] font-semibold text-white bg-red-600 rounded-xl">
              {{ deleting ? 'Deleting...' : 'Delete Course' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="translate-y-4 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition-all duration-200" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-4 opacity-0">
        <div v-if="toast.show" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-[13px] font-semibold" :class="toast.type === 'success' ? 'bg-[#0A733F]' : 'bg-red-600'">
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const API_COURSES = `${BASE_URL}/courses`
const API_CATEGORIES = `${BASE_URL}/categories`

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

const getImageUrl = (path) => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${BASE_URL}/${path}`
}

const courses = ref([])
const categories = ref([])
const loading = ref(false)
const fetchError = ref('')
const search = ref('')
const filterCategory = ref('')
const currentPage = ref(1)
const perPage = 10

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const submitError = ref('')
const deleteError = ref('')

const selectedCourse = ref(null)
const courseToDelete = ref(null)

const dragOver = ref(false)
const imageFile = ref(null)
const imagePreview = ref('')

const toast = reactive({ show: false, message: '', type: 'success' })
const form = reactive({ title: '', description: '', categoryId: '' })
const formErrors = reactive({ title: '', description: '', categoryId: '', image: '' })

const uniqueCategories = computed(() => {
  const cats = courses.value.map(c => c.category?.cat_name).filter(Boolean)
  return [...new Set(cats)]
})

const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    const matchSearch = !search.value || c.title.toLowerCase().includes(search.value.toLowerCase()) || c.category?.cat_name?.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !filterCategory.value || c.category?.cat_name === filterCategory.value
    return matchSearch && matchCat
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCourses.value.length / perPage)))

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredCourses.value.slice(start, start + perPage)
})

async function fetchCourses() {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await fetch(API_COURSES, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`Server responded with ${res.status}`)
    const json = await res.json()
    courses.value = json.data ?? json
  } catch (err) {
    fetchError.value = err.message || 'Unable to connect to the server.'
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(API_CATEGORIES, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error('Failed to fetch categories')
    const json = await res.json()
    categories.value = json.data ?? json
  } catch (err) {
    console.error('Fetch categories error:', err)
  }
}

async function submitForm() {
  if (!validateForm()) return
  submitting.value = true
  submitError.value = ''

  try {
    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())
    formData.append('categoryId', form.categoryId)
    if (imageFile.value) formData.append('image', imageFile.value)

    const url = isEditing.value ? `${API_COURSES}/${selectedCourse.value.id}` : API_COURSES
    const method = isEditing.value ? 'PUT' : 'POST'

    const res = await fetch(url, { 
      method, 
      body: formData, 
      headers: getAuthHeaders() 
    })
    
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.message || `Error ${res.status}`)

    showToast(isEditing.value ? 'Course updated successfully!' : 'Course created successfully!')
    closeFormModal()
    await fetchCourses()
  } catch (err) {
    submitError.value = err.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}

async function deleteCourse() {
  deleting.value = true
  deleteError.value = ''
  try {
    const res = await fetch(`${API_COURSES}/${courseToDelete.value.id}`, { 
      method: 'DELETE', 
      headers: getAuthHeaders() 
    })
    if (!res.ok) throw new Error('Failed to delete course.')
    showToast('Course deleted successfully!', 'success')
    showDeleteModal.value = false
    await fetchCourses()
  } catch (err) {
    deleteError.value = err.message
  } finally {
    deleting.value = false
  }
}

function validateForm() {
  Object.keys(formErrors).forEach(k => formErrors[k] = '')
  let valid = true
  if (!form.title.trim()) { formErrors.title = 'Title required.'; valid = false }
  if (!form.description.trim()) { formErrors.description = 'Description required.'; valid = false }
  if (!form.categoryId) { formErrors.categoryId = 'Category selection required.'; valid = false }
  if (!isEditing.value && !imageFile.value) { formErrors.image = 'Image required.'; valid = false }
  return valid
}

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (file) processImageFile(file)
}

function handleDrop(e) {
  dragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) processImageFile(file)
}

function processImageFile(file) {
  if (file.size > 2 * 1024 * 1024) { formErrors.image = 'Max 2MB.'; return }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => imagePreview.value = e.target.result
  reader.readAsDataURL(file)
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = ''
}

function onImgError(e) { e.target.style.display = 'none' }

function openCreateModal() {
  isEditing.value = false
  resetForm()
  showFormModal.value = true
}

function openEditModal(course) {
  isEditing.value = true
  selectedCourse.value = course
  form.title = course.title
  form.description = course.description
  form.categoryId = course.category?.id || ''
  imagePreview.value = getImageUrl(course.image)
  imageFile.value = null
  showFormModal.value = true
}

function confirmDelete(course) {
  courseToDelete.value = course
  showDeleteModal.value = true
}

function closeFormModal() { showFormModal.value = false }

function resetForm() {
  form.title = ''
  form.description = ''
  form.categoryId = ''
  imageFile.value = null
  imagePreview.value = ''
}

function formatDate(iso) { return iso ? new Date(iso).toLocaleDateString('id-ID') : '-' }

function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => toast.show = false, 3000)
}

onMounted(() => {
  fetchCourses()
  fetchCategories()
})
</script>