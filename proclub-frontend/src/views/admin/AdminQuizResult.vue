<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-black text-[#1A2E20]">
        Quiz Result User
      </h1>

      <p class="text-sm text-gray-500 mt-1">
        A list of quiz results completed by the user.
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-[#E6EFE9] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#F2F7F4] text-[#1A2E20]">
            <tr>
              <th class="px-6 py-4 text-left font-bold">User</th>
              <th class="px-6 py-4 text-left font-bold">Course</th>
              <th class="px-6 py-4 text-left font-bold">Quiz</th>
              <th class="px-6 py-4 text-left font-bold">Score</th>
              <th class="px-6 py-4 text-left font-bold">Status</th>
              <th class="px-6 py-4 text-left font-bold">Date</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in results"
              :key="item.id"
              class="border-t border-gray-100 hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div>
                  <div class="font-semibold text-[#1A2E20]">
                    {{ item.user.name }}
                  </div>

                </div>
              </td>

              <td class="px-6 py-4 text-gray-600">
                {{ item.module.course.title }}
              </td>

              <td class="px-6 py-4 text-gray-600">
                {{ item.module.title }}
              </td>

              <td class="px-6 py-4">
                <span class="font-bold text-[#2C7047]">
                  {{ item.score }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold"
                  :class="
                    item.score >= item.module.kkm
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  "
                >
                  {{ item.score >= item.module.kkm ? 'LULUS' : 'TIDAK LULUS' }}
                </span>
              </td>

              <td class="px-6 py-4 text-gray-500 text-xs">
                {{ formatDate(item.updatedAt) }}
              </td>
            </tr>

            <tr v-if="results.length === 0">
              <td colspan="6" class="text-center py-10 text-gray-400">
                Belum ada hasil quiz.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-[#E6EFE9] flex items-center justify-between bg-white">
        <span class="text-[12px] text-gray-500 font-medium">
          Showing {{ currentPage }} of {{ totalPages }}
        </span>

        <div class="flex items-center gap-1">

          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
             class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
        'w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-bold transition-colors',
        currentPage === currentPage ? 'bg-[#0D7A42] text-white' : 'hover:bg-gray-50 text-gray-600'
      ]"
          >
             {{ currentPage }}
          </button>

            <button 
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-30"
        >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/index.js'
import { useToast } from 'vue-toastification'

const toast = useToast()

const results = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(10)

async function fetchResults(page = 1) {
  try {
    const res = await api.get('/admin/quiz-results', {
      params: {
        page,
        limit: limit.value
      }
    })

    results.value = res.data.data || []
    currentPage.value = res.data.pagination.page
    totalPages.value = res.data.pagination.totalPages
  } catch (error) {
    toast.error('Gagal memuat hasil quiz')
  }
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  fetchResults(page)
}

function formatDate(date) {
  return new Date(date).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

onMounted(() => {
  fetchResults()
})
</script>