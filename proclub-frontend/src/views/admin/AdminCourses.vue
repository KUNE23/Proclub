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
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-white border-b border-[#E6EFE9]">
                <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[40%]">Title</th>
    
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
        </div>

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

            <div v-if="submitError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{{ submitError }}</div>
          </div>

          <div class="flex items-center justify-end gap-3 p-6 border-t border-[#E6EFE9]">
            <button @click="closeFormModal" class="px-5 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
            <button @click="submitForm" :disabled="submitting" class="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#0A733F] rounded-xl hover:bg-[#085a31] transition-colors flex items-center gap-2 disabled:opacity-60">
              <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ submitting ? 'Menyimpan...' : (isEditing ? 'Update Course' : 'Create Course') }}
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
            <button @click="showDeleteModal = false" class="flex-1 py-2.5 text-[13px] font-semibold text-gray-600 bg-gray-100 rounded-xl">Batal</button>
            <button @click="deleteCourse" :disabled="deleting" class="flex-1 py-2.5 text-[13px] font-semibold text-white bg-red-600 rounded-xl">
              {{ deleting ? 'Menghapus...' : 'Delete Course' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { Loader2, Save } from 'lucide-vue-next'
import api from '../../api/index.js'

const courses = ref([])
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
const toast = useToast()

const form = reactive({ title: '', description: ''})
const formErrors = reactive({ title: '', description: ''})

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
    const response = await api.get('/courses')
    courses.value = response.data?.data || []
  } catch (err) {
    fetchError.value = err.response?.data?.message || 'Gagal memuat course.'
    toast.error(fetchError.value)
  } finally {
    loading.value = false
  }
}


async function submitForm() {
  if (!validateForm()) return
  submitting.value = true
  submitError.value = ''

  try {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim()
    }

    if (isEditing.value) {
      await api.put(`/courses/${selectedCourse.value.id}`, payload)
    } else {
      await api.post('/courses', payload)
    }

    toast.success(isEditing.value ? 'Course berhasil diperbarui' : 'Course berhasil dibuat')
    closeFormModal()
    await fetchCourses()
  } catch (err) {
    submitError.value = err.response?.data?.message || 'Gagal menyimpan course.'
    toast.error(submitError.value)
  } finally {
    submitting.value = false
  }
}

async function deleteCourse() {
  deleting.value = true
  deleteError.value = ''
  try {
    await api.delete(`/courses/${courseToDelete.value.id}`)
    toast.success('Course berhasil dihapus')
    showDeleteModal.value = false
    await fetchCourses()
  } catch (err) {
    deleteError.value = err.response?.data?.message || 'Gagal menghapus course.'
    toast.error(deleteError.value)
  } finally {
    deleting.value = false
  }
}

function validateForm() {
  Object.keys(formErrors).forEach(k => formErrors[k] = '')
  const title = form.title.trim()
  const description = form.description.trim()

  if (!title) {
    formErrors.title = 'Judul course wajib diisi.'
  } else if (title.length < 3) {
    formErrors.title = 'Judul course minimal 3 karakter.'
  } else if (title.length > 120) {
    formErrors.title = 'Judul course maksimal 120 karakter.'
  }

  if (!description) {
    formErrors.description = 'Deskripsi course wajib diisi.'
  } else if (description.length < 5) {
    formErrors.description = 'Deskripsi course minimal 5 karakter.'
  } else if (description.length > 500) {
    formErrors.description = 'Deskripsi course maksimal 500 karakter.'
  }

  return !formErrors.title && !formErrors.description
}

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
  formErrors.title = ''
  formErrors.description = ''
  submitError.value = ''
}

function formatDate(iso) { return iso ? new Date(iso).toLocaleDateString('id-ID') : '-' }

onMounted(() => {
  fetchCourses()
})
</script>
