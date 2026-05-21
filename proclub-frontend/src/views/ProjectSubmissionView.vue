<template>
  <div class="bg-[#FAFCFB] font-sans text-gray-800">
    <div class="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
      <div v-if="loading" class="space-y-6">
        <div class="h-7 w-40 animate-pulse rounded-lg bg-gray-200"></div>
        <div class="h-10 w-96 max-w-full animate-pulse rounded-lg bg-gray-200"></div>
        <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div class="h-64 animate-pulse rounded-xl bg-gray-200"></div>
          <div class="h-64 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#2C7047]">
              <span class="h-1.5 w-1.5 rounded-sm bg-[#2C7047]"></span>
              {{ selectedCourse?.title || 'Final Project' }}
            </p>
            <h1 class="text-3xl font-black leading-tight text-[#1A2E20]">Project Submission</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Submit repository GitHub project final kamu. Sertifikat akan muncul setelah semua kelas selesai dan project di-approve admin.
            </p>
          </div>

          <select
            v-if="courses.length > 1"
            v-model.number="selectedCourseId"
            class="h-10 rounded-lg border border-[#E6EFE9] bg-white px-3 text-[13px] font-semibold text-[#1A2E20] outline-none transition focus:border-[#0A733F] focus:ring-2 focus:ring-[#0A733F]/10"
          >
            <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.title }}</option>
          </select>
        </div>

        <div v-if="pageError" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {{ pageError }}
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section class="rounded-xl border border-[#E6EFE9] bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <ClipboardCheck class="h-5 w-5 text-[#2C7047]" />
                  <h2 class="font-bold text-[#1A2E20]">Project Requirements</h2>
                </div>
                <p class="mt-1 text-xs text-gray-500">Pastikan repository kamu memenuhi requirement berikut.</p>
              </div>
              <span class="rounded-full border border-[#E6EFE9] bg-[#F2F7F4] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2C7047]">Final Project</span>
            </div>

            <div v-if="requirements.length === 0" class="rounded-xl border border-dashed border-[#D9E7DF] bg-[#FAFCFB] p-6 text-center">
              <ListChecks class="mx-auto h-10 w-10 text-gray-300" />
              <p class="mt-3 text-sm font-bold text-[#1A2E20]">Requirement belum dibuat</p>
              <p class="mt-1 text-xs text-gray-500">Admin perlu menambahkan requirement project untuk course ini.</p>
            </div>

            <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div v-for="requirement in requirements" :key="requirement.id" class="flex items-start gap-3 rounded-xl border border-[#E6EFE9] bg-[#FCFDFD] p-4">
                <div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D1E6DA]">
                  <Check class="h-3.5 w-3.5 text-[#2C7047]" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-[#1A2E20]">{{ requirement.title }}</h3>
                  <p class="mt-1 text-xs leading-relaxed text-gray-500">{{ requirement.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-[#E6EFE9] bg-white p-6 shadow-sm">
            <div class="mb-6">
              <div class="flex items-center gap-2">
                <Github class="h-5 w-5 text-[#2C7047]" />
                <h2 class="font-bold text-[#1A2E20]">Submission Details</h2>
              </div>
              <p class="mt-1 text-xs text-gray-500">Masukkan repository GitHub project kamu.</p>
            </div>

            <div class="space-y-5">
              <div>
                <label class="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">GitHub Repository URL</label>
                <div class="relative">
                  <Github class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    v-model.trim="form.linkGithub"
                    type="url"
                    placeholder="https://github.com/username/project-final"
                    class="w-full rounded-xl border bg-[#FAFCFB] py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#2C7047] focus:ring-2 focus:ring-[#2C7047]/20"
                    :class="errors.linkGithub ? 'border-red-400 ring-2 ring-red-100' : 'border-[#E6EFE9]'"
                  >
                </div>
                <p v-if="errors.linkGithub" class="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <CircleAlert class="h-3.5 w-3.5" />
                  {{ errors.linkGithub }}
                </p>
              </div>

              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C7047] py-4 text-sm font-bold text-white shadow-lg shadow-[#2C7047]/20 transition hover:bg-[#235838] disabled:cursor-wait disabled:opacity-70"
                :disabled="submitting || !selectedCourseId"
                @click="submitProject"
              >
                <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
                <Send v-else class="h-4 w-4" />
                {{ submitting ? 'Mengirim...' : 'Submit Project for Review' }}
              </button>

              <div v-if="currentSubmission" class="rounded-xl border p-4" :class="submissionClass(currentSubmission.status)">
                <div class="flex items-start gap-3">
                  <Clock v-if="currentSubmission.status === 'pending'" class="mt-0.5 h-5 w-5 text-yellow-600" />
                  <CheckCircle2 v-else-if="currentSubmission.status === 'approved'" class="mt-0.5 h-5 w-5 text-[#2C7047]" />
                  <XCircle v-else class="mt-0.5 h-5 w-5 text-red-600" />
                  <div>
                    <h3 class="text-sm font-bold">{{ submissionTitle(currentSubmission.status) }}</h3>
                    <p class="mt-1 text-xs leading-relaxed">{{ submissionDescription(currentSubmission.status) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  Check,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock,
  Github,
  ListChecks,
  Loader2,
  Send,
  XCircle
} from 'lucide-vue-next'
import api from '../api/index.js'
import { getProjectRequirements, submitProjectRepository } from '../services/projectReviewService.js'

const route = useRoute()
const toast = useToast()
const loading = ref(true)
const submitting = ref(false)
const pageError = ref('')
const courses = ref([])
const requirements = ref([])
const projects = ref([])
const selectedCourseId = ref(null)

const form = reactive({
  linkGithub: ''
})

const errors = reactive({
  linkGithub: ''
})

const selectedCourse = computed(() => courses.value.find((course) => course.id === selectedCourseId.value) || null)
const currentSubmission = computed(() => projects.value.find((project) => project.course?.id === selectedCourseId.value || project.courseId === selectedCourseId.value) || null)

watch(selectedCourseId, async (courseId) => {
  if (courseId) await fetchRequirements(courseId)
})

async function fetchInitialData() {
  loading.value = true
  pageError.value = ''

  try {
    const [coursesRes, projectsRes] = await Promise.allSettled([
      api.get('/courses'),
      api.get('/projects')
    ])

    if (coursesRes.status === 'fulfilled') {
      courses.value = coursesRes.value.data?.data || []
    }

    if (projectsRes.status === 'fulfilled') {
      projects.value = projectsRes.value.data?.data || []
    } else {
      projects.value = []
    }

    const routeCourseId = Number(route.params.id)
    const fallbackCourse = courses.value[courses.value.length - 1]
    selectedCourseId.value = !Number.isNaN(routeCourseId) && routeCourseId
      ? routeCourseId
      : fallbackCourse?.id || null

    if (!selectedCourseId.value) {
      pageError.value = 'Course belum tersedia untuk project submission.'
    }
  } catch (error) {
    pageError.value = error.response?.data?.message || 'Gagal memuat halaman project submission.'
    toast.error(pageError.value)
  } finally {
    loading.value = false
  }
}

async function fetchRequirements(courseId) {
  try {
    const response = await getProjectRequirements(courseId)
    requirements.value = response.data?.data?.requirements || []
  } catch (error) {
    requirements.value = []
    toast.error(error.response?.data?.message || 'Gagal memuat project requirements.')
  }
}

function validateForm() {
  errors.linkGithub = ''
  const pattern = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/

  if (!form.linkGithub) {
    errors.linkGithub = 'URL repository GitHub wajib diisi.'
    return false
  }

  if (!pattern.test(form.linkGithub)) {
    errors.linkGithub = 'Gunakan format https://github.com/username/repository.'
    return false
  }

  return true
}

async function submitProject() {
  if (!validateForm()) return

  submitting.value = true

  try {
    await submitProjectRepository({
      linkGithub: form.linkGithub,
      courseId: selectedCourseId.value
    })

    toast.success('Project berhasil dikirim dan menunggu approval admin.')
    form.linkGithub = ''
    await refreshProjects()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal mengirim project.')
  } finally {
    submitting.value = false
  }
}

async function refreshProjects() {
  try {
    const response = await api.get('/projects')
    projects.value = response.data?.data || []
  } catch {
    projects.value = []
  }
}

function submissionClass(status) {
  const classes = {
    pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    approved: 'bg-[#F2F7F4] border-[#2C7047]/20 text-[#2C7047]',
    rejected: 'bg-red-50 border-red-200 text-red-600'
  }

  return classes[status] || 'bg-gray-50 border-gray-200 text-gray-600'
}

function submissionTitle(status) {
  const titles = {
    pending: 'Menunggu Review Admin',
    approved: 'Project Approved',
    rejected: 'Project Ditolak'
  }

  return titles[status] || 'Status Submission'
}

function submissionDescription(status) {
  const descriptions = {
    pending: 'Project kamu sedang dicek. Sertifikat akan muncul setelah project di-approve dan semua kelas selesai.',
    approved: 'Project kamu sudah disetujui. Jika semua kelas selesai, sertifikat akan muncul di profile.',
    rejected: 'Project belum memenuhi requirement. Perbaiki repository lalu submit kembali.'
  }

  return descriptions[status] || ''
}

onMounted(fetchInitialData)
</script>
