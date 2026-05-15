<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-black text-[#1A2E20]">
        Hasil Quiz User
      </h1>

      <p class="text-sm text-gray-500 mt-1">
        Daftar hasil quiz yang telah dikerjakan user.
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
              <th class="px-6 py-4 text-left font-bold">Skor</th>
              <th class="px-6 py-4 text-left font-bold">Status</th>
              <th class="px-6 py-4 text-left font-bold">Tanggal</th>
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

                  <div class="text-xs text-gray-500">
                    {{ item.user.email }}
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/index.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const results = ref([])

async function fetchResults() {
  try {
    const res = await api.get('/admin/quiz-results')
    results.value = res.data.data || []
  } catch (error) {
    toast.error('Gagal memuat hasil quiz')
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

onMounted(fetchResults)
</script>