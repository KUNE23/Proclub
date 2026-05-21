<template>
  <div class="p-5 max-w-7xl mx-auto space-y-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-widest text-[#0A733F]">Project Approval</p>
        <h1 class="mt-1 text-2xl font-bold text-[#1A2E20]">Project Review</h1>
        <p class="mt-1 text-[13px] text-gray-500">Approve final project student untuk menerbitkan sertifikat otomatis.</p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            v-model.trim="filters.search"
            type="text"
            placeholder="Cari student atau course"
            class="h-10 w-full rounded-lg border border-[#E6EFE9] bg-white pl-9 pr-3 text-[13px] outline-none transition focus:border-[#0A733F] focus:ring-2 focus:ring-[#0A733F]/10 sm:w-64"
          >
        </div>

        <select
          v-model="filters.status"
          class="h-10 rounded-lg border border-[#E6EFE9] bg-white px-3 text-[13px] font-semibold text-[#1A2E20] outline-none transition focus:border-[#0A733F] focus:ring-2 focus:ring-[#0A733F]/10"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          type="button"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E6EFE9] bg-white px-4 text-[13px] font-bold text-[#1A2E20] transition hover:bg-[#F2F7F4]"
          @click="fetchProjects"
        >
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-[#E6EFE9] bg-white p-5">
        <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Pending</p>
        <p class="mt-2 text-3xl font-black text-[#1A2E20]">{{ summary.pending }}</p>
      </div>
      <div class="rounded-xl border border-[#E6EFE9] bg-white p-5">
        <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Approved</p>
        <p class="mt-2 text-3xl font-black text-[#0A733F]">{{ summary.approved }}</p>
      </div>
      <div class="rounded-xl border border-[#E6EFE9] bg-white p-5">
        <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Certificate Issued</p>
        <p class="mt-2 text-3xl font-black text-[#1A2E20]">{{ summary.certificates }}</p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section class="rounded-xl border border-[#E6EFE9] bg-white p-5 shadow-sm">
        <div class="mb-5">
          <p class="text-[11px] font-bold uppercase tracking-widest text-[#0A733F]">Requirement CMS</p>
          <h2 class="mt-1 text-lg font-bold text-[#1A2E20]">Project Requirements</h2>
          <p class="mt-1 text-xs text-gray-500">Kelola requirement yang akan tampil di halaman Projects student.</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Course</label>
            <select
              v-model.number="selectedRequirementCourseId"
              class="h-10 w-full rounded-lg border border-[#E6EFE9] bg-white px-3 text-[13px] font-semibold text-[#1A2E20] outline-none transition focus:border-[#0A733F] focus:ring-2 focus:ring-[#0A733F]/10"
            >
              <option disabled :value="null">Pilih course</option>
              <option v-for="course in adminCourses" :key="course.id" :value="course.id">{{ course.title }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Judul</label>
            <input
              v-model.trim="requirementForm.title"
              type="text"
              class="h-10 w-full rounded-lg border px-3 text-[13px] outline-none transition focus:border-[#0A733F] focus:ring-2 focus:ring-[#0A733F]/10"
              :class="requirementErrors.title ? 'border-red-300' : 'border-[#E6EFE9]'"
              placeholder="Minimal fitur CRUD"
            >
            <p v-if="requirementErrors.title" class="mt-1 text-[11px] text-red-500">{{ requirementErrors.title }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Deskripsi</label>
            <textarea
              v-model.trim="requirementForm.description"
              rows="4"
              class="w-full resize-none rounded-lg border px-3 py-2 text-[13px] outline-none transition focus:border-[#0A733F] focus:ring-2 focus:ring-[#0A733F]/10"
              :class="requirementErrors.description ? 'border-red-300' : 'border-[#E6EFE9]'"
              placeholder="Jelaskan kriteria project yang harus dipenuhi."
            ></textarea>
            <p v-if="requirementErrors.description" class="mt-1 text-[11px] text-red-500">{{ requirementErrors.description }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Urutan</label>
            <input
              v-model.number="requirementForm.order"
              type="number"
              min="1"
              max="100"
              class="h-10 w-full rounded-lg border px-3 text-[13px] outline-none transition focus:border-[#0A733F] focus:ring-2 focus:ring-[#0A733F]/10"
              :class="requirementErrors.order ? 'border-red-300' : 'border-[#E6EFE9]'"
            >
            <p v-if="requirementErrors.order" class="mt-1 text-[11px] text-red-500">{{ requirementErrors.order }}</p>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0A733F] px-4 text-[13px] font-bold text-white transition hover:bg-[#085a31] disabled:opacity-60"
              :disabled="savingRequirement || !selectedRequirementCourseId"
              @click="saveRequirement"
            >
              <Loader2 v-if="savingRequirement" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              {{ selectedRequirement ? 'Update' : 'Tambah' }}
            </button>
            <button
              v-if="selectedRequirement"
              type="button"
              class="h-10 rounded-lg border border-[#E6EFE9] px-4 text-[13px] font-bold text-gray-600 transition hover:bg-gray-50"
              @click="resetRequirementForm"
            >
              Batal
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-[#E6EFE9] bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-[#1A2E20]">Daftar Requirements</h2>
            <p class="mt-1 text-xs text-gray-500">Requirement aktif untuk course yang dipilih.</p>
          </div>
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#E6EFE9] bg-white px-3 text-[12px] font-bold text-[#1A2E20] transition hover:bg-[#F2F7F4]"
            @click="fetchRequirements"
          >
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': loadingRequirements }" />
            Refresh
          </button>
        </div>

        <div v-if="loadingRequirements" class="flex min-h-48 items-center justify-center">
          <Loader2 class="h-7 w-7 animate-spin text-[#0A733F]" />
        </div>

        <div v-else-if="requirements.length === 0" class="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-[#D9E7DF] bg-[#FAFCFB] text-center">
          <div>
            <ListChecks class="mx-auto h-10 w-10 text-gray-300" />
            <p class="mt-3 text-sm font-bold text-[#1A2E20]">Belum ada requirement</p>
            <p class="mt-1 text-xs text-gray-500">Tambahkan requirement pertama untuk course ini.</p>
          </div>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="requirement in requirements"
            :key="requirement.id"
            class="flex items-start gap-4 rounded-xl border border-[#E6EFE9] bg-[#FCFDFD] p-4"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-[12px] font-black text-[#0A733F]">
              {{ requirement.order }}
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-sm font-bold text-[#1A2E20]">{{ requirement.title }}</h3>
              <p class="mt-1 text-xs leading-relaxed text-gray-500">{{ requirement.description }}</p>
            </div>
            <div class="flex shrink-0 gap-1">
              <button
                type="button"
                class="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                @click="editRequirement(requirement)"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                @click="confirmRemoveRequirement(requirement)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="overflow-hidden rounded-xl border border-[#E6EFE9] bg-white shadow-sm">
      <div v-if="loading" class="flex min-h-[360px] items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <Loader2 class="h-8 w-8 animate-spin text-[#0A733F]" />
          <p class="text-[13px] font-semibold text-gray-500">Memuat project submission...</p>
        </div>
      </div>

      <div v-else-if="projects.length === 0" class="flex min-h-[360px] items-center justify-center px-6 text-center">
        <div>
          <ClipboardCheck class="mx-auto h-12 w-12 text-gray-300" />
          <h2 class="mt-4 text-lg font-bold text-[#1A2E20]">Belum ada project submission</h2>
          <p class="mt-1 text-sm text-gray-500">Submission student akan muncul di sini setelah dikirim.</p>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-[#E6EFE9] bg-[#F2F7F4]">
            <tr>
              <th class="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Student</th>
              <th class="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Learning Path</th>
              <th class="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Project</th>
              <th class="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th class="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-widest text-gray-500">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-[#E6EFE9]">
            <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 align-top">
                <p class="font-bold text-[#1A2E20]">{{ project.user?.name || '-' }}</p>
                <p class="mt-0.5 text-xs text-gray-500">{{ project.user?.email || '-' }}</p>
                <p class="mt-2 text-[11px] text-gray-400">{{ formatDate(project.createdAt) }}</p>
              </td>

              <td class="px-6 py-4 align-top">
                <p class="font-semibold text-[#1A2E20]">{{ project.course?.title || '-' }}</p>
                <p class="mt-1 text-xs text-gray-500">{{ project.module?.title || 'Final Project' }}</p>
                <p v-if="project.lesson?.title" class="mt-0.5 text-xs text-gray-400">{{ project.lesson.title }}</p>
              </td>

              <td class="max-w-md px-6 py-4 align-top">
                <a
                  :href="project.linkGithub"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0A733F] hover:underline"
                >
                  <Github class="h-4 w-4" />
                  Repository
                </a>
                <p class="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500">{{ project.note || 'Tidak ada catatan.' }}</p>
                <div v-if="project.certificate" class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1 text-[11px] font-bold text-[#0A733F]">
                  <Award class="h-3.5 w-3.5" />
                  {{ project.certificate.code }}
                </div>
              </td>

              <td class="px-6 py-4 align-top">
                <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold capitalize" :class="statusClass(project.status)">
                  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {{ statusLabel(project.status) }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="project.status !== 'approved' || !project.certificate"
                    type="button"
                    class="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#0A733F] px-3 text-[12px] font-bold text-white transition hover:bg-[#085a31] disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="reviewingId === project.id"
                    @click="review(project, 'approved')"
                  >
                    <Loader2 v-if="reviewingId === project.id && nextStatus === 'approved'" class="h-4 w-4 animate-spin" />
                    <CheckCircle2 v-else class="h-4 w-4" />
                    {{ project.status === 'approved' ? 'Terbitkan' : 'Approve' }}
                  </button>

                  <button
                    v-if="project.status !== 'rejected'"
                    type="button"
                    class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-[12px] font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="reviewingId === project.id"
                    @click="review(project, 'rejected')"
                  >
                    <XCircle class="h-4 w-4" />
                    Reject
                  </button>

                  <a
                    v-if="project.certificate"
                    :href="`/certificate/${project.certificate.code}`"
                    target="_blank"
                    class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#E6EFE9] bg-white px-3 text-[12px] font-bold text-[#1A2E20] transition hover:bg-[#F2F7F4]"
                  >
                    <ExternalLink class="h-4 w-4" />
                    Cek
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-[#E6EFE9] bg-white p-4">
        <span class="text-[12px] font-medium text-gray-500">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-8 items-center justify-center rounded-lg border border-[#E6EFE9] px-3 text-[12px] font-bold text-gray-500 disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Prev
          </button>
          <button
            type="button"
            class="inline-flex h-8 items-center justify-center rounded-lg border border-[#E6EFE9] px-3 text-[12px] font-bold text-gray-500 disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="requirementToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" @click="requirementToDelete = null"></div>
        <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 class="h-7 w-7" />
          </div>
          <h3 class="text-lg font-bold text-[#1A2E20]">Hapus Requirement?</h3>
          <p class="my-4 text-[13px] leading-relaxed text-gray-500">
            Requirement "{{ requirementToDelete.title }}" akan dihapus dari course ini.
          </p>
          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-xl bg-gray-100 py-2.5 text-[13px] font-semibold text-gray-600"
              @click="requirementToDelete = null"
            >
              Batal
            </button>
            <button
              type="button"
              class="flex-1 rounded-xl bg-red-600 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
              :disabled="deletingRequirement"
              @click="removeRequirement"
            >
              {{ deletingRequirement ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Github,
  ListChecks,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Save,
  Trash2,
  XCircle
} from 'lucide-vue-next'
import api from '../../api/index.js'
import {
  createProjectRequirement,
  deleteProjectRequirement,
  getProjectRequirements,
  getProjectReviews,
  reviewProjectSubmission,
  updateProjectRequirement
} from '../../services/projectReviewService.js'

const toast = useToast()
const projects = ref([])
const loading = ref(false)
const reviewingId = ref(null)
const nextStatus = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const adminCourses = ref([])
const selectedRequirementCourseId = ref(null)
const requirements = ref([])
const loadingRequirements = ref(false)
const savingRequirement = ref(false)
const selectedRequirement = ref(null)
const requirementToDelete = ref(null)
const deletingRequirement = ref(false)

const filters = reactive({
  search: '',
  status: ''
})

const requirementForm = reactive({
  title: '',
  description: '',
  order: 1
})

const requirementErrors = reactive({
  title: '',
  description: '',
  order: ''
})

const summary = computed(() => ({
  pending: projects.value.filter((project) => project.status === 'pending').length,
  approved: projects.value.filter((project) => project.status === 'approved').length,
  certificates: projects.value.filter((project) => project.certificate).length
}))

let searchTimer = null

watch(
  () => [filters.search, filters.status],
  () => {
    window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => {
      currentPage.value = 1
      fetchProjects()
    }, 350)
  }
)

watch(selectedRequirementCourseId, async () => {
  resetRequirementForm()
  await fetchRequirements()
})

async function fetchProjects() {
  loading.value = true

  try {
    const response = await getProjectReviews({
      page: currentPage.value,
      limit: 10,
      search: filters.search || undefined,
      status: filters.status || undefined
    })

    projects.value = response.data?.data || []
    currentPage.value = response.data?.pagination?.currentPage || 1
    totalPages.value = response.data?.pagination?.totalPages || 1
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat project submission.')
  } finally {
    loading.value = false
  }
}

async function fetchCourses() {
  try {
    const response = await api.get('/courses')
    adminCourses.value = response.data?.data || []
    selectedRequirementCourseId.value = adminCourses.value[adminCourses.value.length - 1]?.id || null
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat course.')
  }
}

async function fetchRequirements() {
  if (!selectedRequirementCourseId.value) return

  loadingRequirements.value = true

  try {
    const response = await getProjectRequirements(selectedRequirementCourseId.value)
    requirements.value = response.data?.data?.requirements || []
  } catch (error) {
    requirements.value = []
    toast.error(error.response?.data?.message || 'Gagal memuat project requirements.')
  } finally {
    loadingRequirements.value = false
  }
}

function validateRequirement() {
  requirementErrors.title = ''
  requirementErrors.description = ''
  requirementErrors.order = ''

  if (requirementForm.title.length < 3) {
    requirementErrors.title = 'Judul minimal 3 karakter.'
  }

  if (requirementForm.description.length < 8) {
    requirementErrors.description = 'Deskripsi minimal 8 karakter.'
  }

  if (!Number.isInteger(Number(requirementForm.order)) || requirementForm.order < 1 || requirementForm.order > 100) {
    requirementErrors.order = 'Urutan harus 1 sampai 100.'
  }

  return !requirementErrors.title && !requirementErrors.description && !requirementErrors.order
}

async function saveRequirement() {
  if (!validateRequirement()) return

  savingRequirement.value = true

  const payload = {
    title: requirementForm.title,
    description: requirementForm.description,
    order: Number(requirementForm.order)
  }

  try {
    if (selectedRequirement.value) {
      await updateProjectRequirement(selectedRequirement.value.id, payload)
      toast.success('Requirement berhasil diperbarui.')
    } else {
      await createProjectRequirement(selectedRequirementCourseId.value, payload)
      toast.success('Requirement berhasil dibuat.')
    }

    resetRequirementForm()
    await fetchRequirements()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan requirement.')
  } finally {
    savingRequirement.value = false
  }
}

function editRequirement(requirement) {
  selectedRequirement.value = requirement
  requirementForm.title = requirement.title
  requirementForm.description = requirement.description
  requirementForm.order = requirement.order
}

function confirmRemoveRequirement(requirement) {
  requirementToDelete.value = requirement
}

async function removeRequirement() {
  if (!requirementToDelete.value) return

  deletingRequirement.value = true

  try {
    await deleteProjectRequirement(requirementToDelete.value.id)
    toast.warning('Requirement berhasil dihapus.')
    requirementToDelete.value = null
    await fetchRequirements()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menghapus requirement.')
  } finally {
    deletingRequirement.value = false
  }
}

function resetRequirementForm() {
  selectedRequirement.value = null
  requirementForm.title = ''
  requirementForm.description = ''
  requirementForm.order = requirements.value.length + 1
  requirementErrors.title = ''
  requirementErrors.description = ''
  requirementErrors.order = ''
}

async function review(project, status) {
  reviewingId.value = project.id
  nextStatus.value = status

  try {
    const response = await reviewProjectSubmission(project.id, status)
    const certificate = response.data?.certificate

    if (status === 'approved') {
      toast.success(certificate ? 'Project disetujui dan sertifikat berhasil diterbitkan.' : 'Project disetujui. Sertifikat belum terbit karena syarat belum lengkap.')
    } else {
      toast.warning('Project ditolak.')
    }

    await fetchProjects()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui status project.')
  } finally {
    reviewingId.value = null
    nextStatus.value = ''
  }
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchProjects()
}

function statusClass(status) {
  const classes = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    approved: 'bg-[#F0FDF4] text-[#0A733F] border border-green-200',
    rejected: 'bg-red-50 text-red-600 border border-red-200'
  }

  return classes[status] || 'bg-gray-100 text-gray-600 border border-gray-200'
}

function statusLabel(status) {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  }

  return labels[status] || status
}

function formatDate(date) {
  if (!date) return '-'

  return new Date(date).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

onMounted(() => {
  fetchProjects()
  fetchCourses()
})
</script>
