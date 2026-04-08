<template>
  <div class="flex flex-col bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <div class="flex flex-1">

      <!-- ===== MAIN QUIZ AREA ===== -->
      <main class="flex-1">

        <!-- Loading State -->
        <div v-if="isLoading" class="animate-pulse max-w-2xl mx-auto p-8 lg:p-12 space-y-6 mt-8">
          <div class="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div class="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div class="h-3 bg-gray-200 rounded w-full mt-4"></div>
          <div class="h-40 bg-gray-200 rounded-2xl mt-8"></div>
          <div class="h-20 bg-gray-200 rounded-xl mt-4"></div>
          <div class="h-20 bg-gray-200 rounded-xl"></div>
          <div class="h-20 bg-gray-200 rounded-xl"></div>
          <div class="h-20 bg-gray-200 rounded-xl"></div>
        </div>

        <!-- ===== QUIZ IN PROGRESS ===== -->
        <div v-else-if="!showResults" class="mx-auto px-5 md:px-0 py-5">

          <!-- Quiz Title -->
          <div class="text-center mb-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2C7047] mb-2">Knowledge Assessment</p>
            <h1 class="text-2xl font-bold text-[#1A2E20]">{{ quizTitle }}</h1>
          </div>

          <!-- Progress Bar -->
          <div class="mb-10">
            <div class="flex justify-between items-center mb-2">
              <span class="text-[13px] font-semibold text-[#1A2E20]">Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
              <span class="text-[13px] font-semibold text-[#2C7047]">{{ progressPercent }}% Complete</span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-[#E6EFE9]">
              <div class="h-full bg-[#2C7047] rounded-full transition-all duration-500 ease-out" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>

          <!-- Question Card -->
          <div class="bg-[#F5F8F6] rounded-2xl p-6 lg:p-8 mb-8 border border-[#E6EFE9]">
            <p class="text-lg font-semibold text-[#1A2E20] leading-relaxed">
              {{ currentQuestion.text }}
            </p>
          </div>

          <!-- Answer Options -->
          <div class="space-y-3 mb-10">
            <button
              v-for="(option, optIdx) in currentQuestion.options"
              :key="optIdx"
              @click="selectOption(optIdx)"
              class="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 group"
              :class="userAnswers[currentQuestionIndex] === optIdx
                ? 'border-[#2C7047] bg-[#F2F7F4] shadow-sm shadow-[#2C7047]/10'
                : 'border-[#E6EFE9] bg-white hover:border-[#2C7047]/40 hover:shadow-sm'"
            >
              <!-- Option Letter Badge -->
              <span
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors"
                :class="userAnswers[currentQuestionIndex] === optIdx
                  ? 'bg-[#2C7047] text-white'
                  : 'bg-[#F5F8F6] text-gray-500 group-hover:bg-[#E6EFE9]'"
              >
                {{ optionLetters[optIdx] }}
              </span>

              <!-- Option Text -->
              <span class="text-[15px] font-medium flex-1"
                :class="userAnswers[currentQuestionIndex] === optIdx ? 'text-[#1A2E20]' : 'text-gray-700'">
                {{ option }}
              </span>

              <!-- Selected Checkmark -->
              <div v-if="userAnswers[currentQuestionIndex] === optIdx" class="w-6 h-6 rounded-full bg-[#2C7047] flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              </div>
            </button>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between">
            <button
              @click="prevQuestion"
              :disabled="currentQuestionIndex === 0"
              class="flex items-center gap-2 text-sm font-medium transition-colors"
              :class="currentQuestionIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-[#2C7047]'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Previous
            </button>

            <button
              v-if="currentQuestionIndex < questions.length - 1"
              @click="nextQuestion"
              :disabled="userAnswers[currentQuestionIndex] === undefined"
              class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              :class="userAnswers[currentQuestionIndex] !== undefined
                ? 'bg-[#2C7047] hover:bg-[#235838] text-white shadow-md shadow-[#2C7047]/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            >
              Next Question
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>

            <button
              v-else
              @click="submitQuiz"
              :disabled="userAnswers[currentQuestionIndex] === undefined"
              class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              :class="userAnswers[currentQuestionIndex] !== undefined
                ? 'bg-[#2C7047] hover:bg-[#235838] text-white shadow-md shadow-[#2C7047]/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            >
              Submit Quiz
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </div>
        
        <!-- ===== RESULTS SCREEN ===== -->
        <div v-else class="mx-auto px-5 md:px-0 py-5 text-center">

          <!-- Result Icon -->
          <div class="mb-6">
            <div v-if="hasPassed" class="w-24 h-24 rounded-full bg-[#D1E6DA] flex items-center justify-center mx-auto shadow-lg shadow-[#2C7047]/10">
              <svg class="w-12 h-12 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div v-else class="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
              <svg class="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
            </div>
          </div>

          <!-- Result Title -->
          <h2 class="text-3xl font-black text-[#1A2E20] mb-3">
            {{ hasPassed ? 'Excellent Work!' : 'Almost There!' }}
          </h2>
          <p class="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
            {{ hasPassed
              ? 'You\'ve demonstrated mastery of this module. The next chapter has been unlocked for you.'
              : 'You need 70% to pass. Review the material and give it another shot — you\'re close!'
            }}
          </p>

          <!-- Score Card -->
          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-8 mb-8 shadow-sm inline-block mx-auto">
            <div class="text-5xl font-black mb-2" :class="hasPassed ? 'text-[#2C7047]' : 'text-orange-500'">
              {{ score }}%
            </div>
            <p class="text-sm text-gray-500 font-medium">{{ correctCount }} of {{ questions.length }} correct</p>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4 min-w-[200px]">
              <div class="h-full rounded-full transition-all duration-700"
                :class="hasPassed ? 'bg-[#2C7047]' : 'bg-orange-400'"
                :style="{ width: score + '%' }"></div>
            </div>
          </div>

          <!-- Answer Breakdown -->
          <div class="bg-[#F5F8F6] rounded-2xl border border-[#E6EFE9] p-6 mb-8 text-left max-w-md mx-auto">
            <h4 class="font-bold text-[#1A2E20] text-sm mb-4">Answer Breakdown</h4>
            <div class="space-y-2">
              <div v-for="(q, idx) in questions" :key="q.id" class="flex items-center gap-3 py-1.5">
                <span class="text-xs font-bold text-gray-400 w-5 text-right">{{ idx + 1 }}.</span>
                <div v-if="userAnswers[idx] === q.correctIndex" class="w-5 h-5 rounded-full bg-[#2C7047] flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <div v-else class="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </div>
                <span class="text-sm text-gray-700 truncate flex-1">{{ q.text.substring(0, 50) }}...</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-center gap-4">
            <button v-if="!hasPassed" @click="retryQuiz" class="px-6 py-3 bg-[#2C7047] hover:bg-[#235838] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#2C7047]/20 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Retry Quiz
            </button>
            <router-link v-if="hasPassed" to="/module" class="px-6 py-3 bg-[#2C7047] hover:bg-[#235838] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#2C7047]/20 flex items-center gap-2">
              Continue to Next Module
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </router-link>
            <router-link to="/module" class="px-6 py-3 border-2 border-[#1A2E20] text-[#1A2E20] rounded-xl text-sm font-bold hover:bg-[#1A2E20] hover:text-white transition-all">
              Return to Course
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isLoading = ref(true)
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const optionLetters = ['A', 'B', 'C', 'D', 'E']

// Top Nav
const topNavLinks = ref([
  { name: 'Dashboard', path: '/atelier', active: false },
  { name: 'Courses', path: '/courses-catalog', active: true },
  { name: 'Resources', path: '/atelier', active: false },
])

// Quiz Data
const quizTitle = ref('Quiz: Module 3 Knowledge Check')

const questions = ref([
  {
    id: 'q1',
    text: 'What is the primary role of chlorophyll in photosynthesis?',
    options: ['Providing structural support', 'Absorbing light energy', 'Transporting water', 'Storing glucose'],
    correctIndex: 1,
  },
  {
    id: 'q2',
    text: 'Which layer of soil is most important for root development and nutrient absorption in urban gardens?',
    options: ['O Horizon (Organic Layer)', 'A Horizon (Topsoil)', 'B Horizon (Subsoil)', 'C Horizon (Parent Material)'],
    correctIndex: 1,
  },
  {
    id: 'q3',
    text: 'What is the optimal pH range for most urban vegetable gardens?',
    options: ['4.0 - 5.0', '5.5 - 6.5', '6.0 - 7.0', '7.5 - 8.5'],
    correctIndex: 2,
  },
  {
    id: 'q4',
    text: 'Which of the following cellular structures is primarily responsible for the conversion of light energy into chemical energy during photosynthesis?',
    options: ['The Mitochondria Matrix', 'The Chloroplast Thylakoids', 'The Endoplasmic Reticulum', 'The Golgi Apparatus'],
    correctIndex: 1,
  },
  {
    id: 'q5',
    text: 'What is the primary benefit of mycorrhizal fungi in urban substrates?',
    options: ['They produce oxygen', 'They extend the root system for nutrient absorption', 'They consume harmful bacteria', 'They regulate soil temperature'],
    correctIndex: 1,
  },
  {
    id: 'q6',
    text: 'Which macronutrient is most critical for leaf growth and green coloration?',
    options: ['Phosphorus (P)', 'Potassium (K)', 'Nitrogen (N)', 'Calcium (Ca)'],
    correctIndex: 2,
  },
  {
    id: 'q7',
    text: 'What does the term "rhizosphere" refer to?',
    options: ['The canopy layer of a forest', 'The zone of soil surrounding plant roots', 'The water table beneath soil', 'The atmospheric layer above a field'],
    correctIndex: 1,
  },
  {
    id: 'q8',
    text: 'Which process describes the loss of water vapor from plant leaves?',
    options: ['Osmosis', 'Transpiration', 'Condensation', 'Fermentation'],
    correctIndex: 1,
  },
  {
    id: 'q9',
    text: 'What is the main advantage of using a closed-loop hydroponic system in urban environments?',
    options: ['It eliminates the need for sunlight', 'It recycles water and reduces waste', 'It prevents all plant diseases', 'It removes the need for nutrients'],
    correctIndex: 1,
  },
  {
    id: 'q10',
    text: 'Which sensor type is most useful for monitoring Photosynthetically Active Radiation (PAR)?',
    options: ['Barometric pressure sensor', 'Quantum sensor', 'Anemometer', 'Hygrometer'],
    correctIndex: 1,
  },
  {
    id: 'q11',
    text: 'What is the nitrogen cycle\'s role in maintaining soil fertility?',
    options: ['It heats the soil', 'It converts atmospheric nitrogen into usable forms for plants', 'It prevents erosion', 'It increases soil porosity'],
    correctIndex: 1,
  },
  {
    id: 'q12',
    text: 'Which composting method is best suited for small-scale urban environments?',
    options: ['Windrow composting', 'Vermicomposting', 'In-vessel composting', 'Sheet composting'],
    correctIndex: 1,
  },
])

// User Answers — keyed by question index
const userAnswers = ref({})

// Computed
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const progressPercent = computed(() => Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100))

const correctCount = computed(() => {
  let count = 0
  questions.value.forEach((q, idx) => {
    if (userAnswers.value[idx] === q.correctIndex) count++
  })
  return count
})

const score = computed(() => Math.round((correctCount.value / questions.value.length) * 100))
const hasPassed = computed(() => score.value >= 70)

// Methods
function selectOption(optIdx) {
  userAnswers.value[currentQuestionIndex.value] = optIdx
}

function nextQuestion() {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  }
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function submitQuiz() {
  showResults.value = true
}

function retryQuiz() {
  userAnswers.value = {}
  currentQuestionIndex.value = 0
  showResults.value = false
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>
