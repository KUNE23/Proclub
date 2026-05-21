<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div
      v-if="questions && questions.length > 0"
      class="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-[#E6EFE9] overflow-hidden"
    >
      <div class="bg-[#F2F7F4] px-8 py-4 flex items-center justify-between border-b border-[#E6EFE9]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#2C7047] font-bold shadow-sm">
            {{ currentIndex + 1 }}
          </div>

          <div>
            <h3 class="text-[13px] font-bold text-[#1A2E20]">
              Pertanyaan {{ currentIndex + 1 }} dari {{ questions.length }}
            </h3>

            <div class="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                class="h-full bg-[#2C7047] transition-all duration-300"
                :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-8">
        <h2 class="text-lg font-bold text-[#1A2E20] leading-relaxed mb-8">
          {{ currentQuestion.question }}
        </h2>

        <div class="space-y-3">
          <button
            v-for="(opt, index) in currentQuestion.options"
            :key="index"
            @click="!props.isCompleted && selectAnswer(opt, index)"
            :disabled="props.isCompleted"
            class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left disabled:cursor-not-allowed"
            :class="[
              userAnswers[currentIndex]?.index === index
                ? 'border-[#2C7047] bg-[#F2F7F4] text-[#2C7047]'
                : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
            ]"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
              :class="
                userAnswers[currentIndex]?.index === index
                  ? 'bg-[#2C7047] text-white'
                  : 'bg-white text-gray-400 border border-gray-200'
              "
            >
              {{ String.fromCharCode(65 + index) }}
            </div>

            <span class="text-[14px] font-medium">
              {{ opt }}
            </span>
          </button>
        </div>
      </div>

      <div class="px-8 py-6 bg-gray-50/50 border-t border-[#E6EFE9] flex items-center justify-between">
        <button
          @click="prev"
          :disabled="currentIndex === 0"
          class="px-6 py-2.5 text-[13px] font-bold text-gray-500 hover:text-[#1A2E20] disabled:opacity-30 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>

          Sebelumnya
        </button>

        <button
          v-if="currentIndex < questions.length - 1"
          @click="next"
          class="bg-[#2C7047] text-white px-8 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-[#2C7047]/20 hover:bg-[#235838] transition-all flex items-center gap-2"
        >
          Selanjutnya

          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          v-else
          @click="submitQuiz"
          :disabled="isSubmitting || props.isCompleted"
          class="bg-[#0A733F] text-white px-10 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-[#0A733F]/20 hover:bg-[#085a31] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <svg
            v-if="isSubmitting"
            class="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>

          {{ props.isCompleted ? 'Quiz Sudah Diselesaikan' : 'Kirim Jawaban' }}

          <svg
            v-if="!isSubmitting && !props.isCompleted"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../api/index.js'

const props = defineProps({
  questions: Array,
  lessonId: Number,
  savedAnswers: {
    type: Array,
    default: () => []
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['completed'])
const toast = useToast()

const currentIndex = ref(0)
const userAnswers = ref([])
const isSubmitting = ref(false)

const currentQuestion = computed(() => {
  return props.questions[currentIndex.value] || {}
})

function selectAnswer(opt, index) {
  userAnswers.value[currentIndex.value] = {
    value: opt,
    index: index
  }
}

async function submitQuiz() {
  const unansweredIndex = userAnswers.value.findIndex(
    ans => ans === null
  )

  if (unansweredIndex !== -1) {
    currentIndex.value = unansweredIndex
    toast.error('Harap jawab semua soal sebelum mengirim!')
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      answers: props.questions.map((q, index) => ({
        quizId: q.id,
        answer: userAnswers.value[index].value
      }))
    }

    const res = await api.post(
      `/lessons/${props.lessonId}/submit`,
      payload
    )

    emit('completed', res.data)

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      'Gagal mengirim jawaban'
    )
  } finally {
    isSubmitting.value = false
  }
}

function next() {
  if (currentIndex.value < props.questions.length - 1) {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

onMounted(() => {
  if (props.savedAnswers.length > 0) {
    userAnswers.value = props.questions.map((q) => {
      const saved = props.savedAnswers.find(
        a => a.quizId === q.id
      )

      if (!saved) return null

      const optionIndex = q.options.findIndex(
        opt => opt === saved.answer
      )

      return {
        value: saved.answer,
        index: optionIndex
      }
    })
  } else {
    userAnswers.value = props.questions.map(() => null)
  }
})
</script>
