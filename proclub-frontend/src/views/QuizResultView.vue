<template>
  <div class="flex flex-col h-screen bg-[#FAFCFB] font-sans antialiased text-gray-800">

    <!-- ===== TOP NAVIGATION ===== -->
    <header class="h-14 px-6 flex items-center justify-between bg-white border-b border-[#E6EFE9] shrink-0 z-20">
      <div class="flex items-center gap-8">
        <router-link to="/atelier" class="text-[15px] font-extrabold text-[#1A2E20] tracking-tight">Lumina Academy</router-link>
        <nav class="hidden md:flex items-center gap-1">
          <router-link
            v-for="link in topNavLinks"
            :key="link.name"
            :to="link.path"
            class="px-3 py-1.5 text-[13px] font-medium transition-colors"
            :class="link.active ? 'text-[#2C7047] border-b-2 border-[#2C7047] pb-0.5' : 'text-gray-500 hover:text-[#2C7047]'"
          >{{ link.name }}</router-link>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-gray-400 hover:text-[#2C7047] transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&q=80" alt="User" class="w-8 h-8 rounded-full object-cover border border-[#E6EFE9]" />
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">

      <!-- ===== LEFT SIDEBAR ===== -->
      <aside class="w-56 bg-white border-r border-[#E6EFE9] flex flex-col justify-between shrink-0">
        <div>
          <div class="px-6 pt-6 pb-4">
            <p class="text-[9px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Botanical Studies</p>
          </div>
          <nav class="px-3 space-y-0.5">
            <button
              v-for="item in sidebarMenu"
              :key="item.name"
              class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all duration-200 relative"
              :class="item.active
                ? 'text-[#2C7047] bg-[#F2F7F4]'
                : 'text-gray-500 hover:text-[#2C7047] hover:bg-[#F2F7F4]/50'"
            >
              <div v-if="item.active" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-[#2C7047] rounded-r-md"></div>
              <div v-html="item.icon" class="w-[18px] h-[18px] shrink-0"></div>
              {{ item.name }}
            </button>
          </nav>
        </div>
        <div class="p-4">
          <router-link to="/module" class="w-full flex items-center justify-center gap-2 border-2 border-[#1A2E20] text-[#1A2E20] hover:bg-[#1A2E20] hover:text-white py-2.5 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm">
            Return to Course
          </router-link>
        </div>
      </aside>

      <!-- ===== MAIN CONTENT ===== -->
      <main class="flex-1 overflow-y-auto">

        <!-- Loading -->
        <div v-if="isLoading" class="animate-pulse max-w-4xl mx-auto p-8 lg:p-12 space-y-8 mt-8">
          <div class="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div class="h-14 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div class="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div class="flex gap-6 mt-8">
            <div class="flex-1 h-72 bg-gray-200 rounded-2xl"></div>
            <div class="w-64 space-y-6">
              <div class="h-32 bg-gray-200 rounded-2xl"></div>
              <div class="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
          <div class="h-48 bg-gray-200 rounded-2xl mt-6"></div>
        </div>

        <!-- ===== SUCCESS STATE ===== -->
        <div v-else-if="quizResult.isPassed" class="max-w-4xl mx-auto px-6 lg:px-12 py-10 lg:py-14">

          <!-- Hero Text -->
          <div class="text-center mb-10">
            <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2C7047] mb-3">Module Complete</p>
            <h1 class="text-3xl lg:text-5xl font-black text-[#1A2E20] leading-tight">
              Excellence in <em class="text-[#2C7047] not-italic font-black italic">{{ quizResult.moduleName }}</em>
            </h1>
            <p class="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto mt-4">
              {{ quizResult.successMessage }}
            </p>
          </div>

          <!-- Score + Stats Row -->
          <div class="flex flex-col lg:flex-row gap-6 mb-10">

            <!-- Score Card -->
            <div class="flex-1 bg-white rounded-2xl border border-[#E6EFE9] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <!-- Badge -->
              <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 rounded-full bg-[#2C7047] flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                </div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-[#2C7047]">Assessment Passed</span>
              </div>

              <!-- Score -->
              <div class="flex items-end justify-between">
                <div>
                  <div class="text-7xl font-black text-[#1A2E20] leading-none">{{ quizResult.scorePercent }}%</div>
                  <p class="text-sm text-gray-500 mt-2 font-medium">{{ quizResult.correctAnswers }} out of {{ quizResult.totalQuestions }} correct answers</p>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-3 mt-6">
                    <router-link to="/module" class="bg-[#2C7047] hover:bg-[#235838] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md shadow-[#2C7047]/20">
                      Continue to Next Module
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </router-link>
                    <button class="text-sm font-medium text-gray-500 hover:text-[#2C7047] transition-colors px-4 py-3">
                      Review Answers
                    </button>
                  </div>
                </div>

                <!-- Decorative Botanical Image -->
                <div class="hidden md:block w-40 h-40 rounded-xl overflow-hidden opacity-80 shrink-0 ml-4">
                  <img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=300&q=70" alt="Botanical" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- Right Stat Cards -->
            <div class="w-full lg:w-64 shrink-0 space-y-6">
              <!-- Time Spent -->
              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Time Spent</span>
                  <svg class="w-5 h-5 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="text-3xl font-black text-[#1A2E20]">{{ quizResult.timeSpent }}</div>
                <p class="text-xs text-gray-400 mt-1">{{ quizResult.timeComparison }}</p>
              </div>

              <!-- Accuracy -->
              <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Accuracy</span>
                  <svg class="w-5 h-5 text-[#2C7047]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div class="text-3xl font-black text-[#1A2E20]">{{ quizResult.accuracyRank }}</div>
                <p class="text-xs text-gray-400 mt-1">{{ quizResult.accuracyNote }}</p>
              </div>
            </div>
          </div>

          <!-- Conceptual Mastery Breakdown -->
          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-8 shadow-sm mb-10">
            <h3 class="text-xl font-bold text-[#1A2E20] mb-1">Conceptual Mastery</h3>
            <p class="text-sm text-gray-500 mb-6">How you performed in specific subject areas</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              <div v-for="topic in quizResult.topicBreakdown" :key="topic.name">
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-sm font-medium text-gray-700">{{ topic.name }}</span>
                  <span class="text-sm font-bold" :class="topic.score >= 80 ? 'text-[#2C7047]' : topic.score >= 60 ? 'text-yellow-600' : 'text-red-500'">{{ topic.score }}%</span>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700"
                    :class="topic.score >= 80 ? 'bg-[#2C7047]' : topic.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'"
                    :style="{ width: topic.score + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Share / Certificate Row -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#F5F8F6] rounded-2xl border border-[#E6EFE9] p-6">
            <div>
              <h4 class="font-bold text-[#1A2E20] text-sm">Share Your Achievement</h4>
              <p class="text-xs text-gray-500 mt-1">Let your peers know about your mastery in {{ quizResult.moduleName }}.</p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <button class="px-5 py-2.5 border-2 border-[#E6EFE9] bg-white text-[#1A2E20] rounded-xl text-xs font-bold hover:border-[#2C7047] hover:text-[#2C7047] transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                Share
              </button>
              <button class="px-5 py-2.5 bg-[#2C7047] hover:bg-[#235838] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shadow-[#2C7047]/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Certificate
              </button>
            </div>
          </div>
        </div>

        <!-- ===== FAILURE STATE ===== -->
        <div v-else class="max-w-2xl mx-auto px-6 lg:px-8 py-12 lg:py-16 text-center">

          <!-- Icon -->
          <div class="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/10">
            <svg class="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
          </div>

          <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 mb-3">Keep Learning</p>
          <h1 class="text-3xl font-black text-[#1A2E20] mb-3">Almost There!</h1>
          <p class="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
            {{ quizResult.failureMessage }}
          </p>

          <!-- Score Card -->
          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-8 mb-8 shadow-sm inline-block mx-auto">
            <div class="text-6xl font-black text-orange-500 leading-none">{{ quizResult.scorePercent }}%</div>
            <p class="text-sm text-gray-500 mt-2 font-medium">{{ quizResult.correctAnswers }} of {{ quizResult.totalQuestions }} correct</p>
            <p class="text-xs text-gray-400 mt-1">You need {{ quizResult.passingScore }}% to pass</p>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4 min-w-[220px]">
              <div class="h-full bg-orange-400 rounded-full transition-all duration-700" :style="{ width: quizResult.scorePercent + '%' }"></div>
            </div>
          </div>

          <!-- Feedback -->
          <div class="bg-[#F5F8F6] rounded-2xl border border-[#E6EFE9] p-6 mb-8 text-left max-w-md mx-auto">
            <h4 class="font-bold text-[#1A2E20] text-sm mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#2C7047]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              Feedback
            </h4>
            <p class="text-sm text-gray-600 leading-relaxed">{{ quizResult.feedbackText }}</p>
          </div>

          <!-- Topic Breakdown (Failure) -->
          <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 mb-8 text-left max-w-md mx-auto shadow-sm">
            <h4 class="font-bold text-[#1A2E20] text-sm mb-4">Areas to Review</h4>
            <div class="space-y-4">
              <div v-for="topic in quizResult.topicBreakdown" :key="topic.name">
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-sm font-medium text-gray-700">{{ topic.name }}</span>
                  <span class="text-sm font-bold" :class="topic.score >= 80 ? 'text-[#2C7047]' : topic.score >= 60 ? 'text-yellow-600' : 'text-red-500'">{{ topic.score }}%</span>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700"
                    :class="topic.score >= 80 ? 'bg-[#2C7047]' : topic.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'"
                    :style="{ width: topic.score + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-center gap-4">
            <router-link to="/quiz" class="px-6 py-3 bg-[#2C7047] hover:bg-[#235838] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#2C7047]/20 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Try Again
            </router-link>
            <router-link to="/module" class="px-6 py-3 border-2 border-[#1A2E20] text-[#1A2E20] rounded-xl text-sm font-bold hover:bg-[#1A2E20] hover:text-white transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Review Material
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <footer class="border-t border-[#E6EFE9] bg-[#F5F8F6] py-6 mt-auto">
          <div class="max-w-4xl mx-auto text-center">
            <div class="flex items-center justify-center gap-6 text-xs text-gray-400 mb-2">
              <a href="#" class="hover:text-[#2C7047] transition-colors underline">Privacy</a>
              <a href="#" class="hover:text-[#2C7047] transition-colors underline">Terms</a>
              <a href="#" class="hover:text-[#2C7047] transition-colors underline">Support</a>
            </div>
            <p class="text-[11px] text-gray-400">© 2024 Botanical Atelier Learning</p>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)

// Top Nav
const topNavLinks = ref([
  { name: 'Dashboard', path: '/atelier', active: true },
  { name: 'Courses', path: '/courses-catalog', active: false },
  { name: 'Resources', path: '/atelier', active: false },
])

// Sidebar
const sidebarMenu = ref([
  { name: 'Current Quiz', active: true, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>' },
  { name: 'My Learning', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>' },
  { name: 'Achievements', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>' },
  { name: 'Settings', active: false, icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
])

// ===== Quiz Result Data (API-Ready) =====
const quizResult = ref({
  // Core score data
  isPassed: true, // Toggle this to false to see the failure state
  scorePercent: 80,
  correctAnswers: 8,
  totalQuestions: 10,
  passingScore: 70,

  // Module context
  moduleName: 'Flora Taxonomy',

  // Messages
  successMessage: 'Your understanding of botanical structures and classification systems has been thoroughly validated. You have met the mastery requirements for this chapter.',
  failureMessage: "You didn't quite meet the passing threshold this time. Review the material below and give it another try — you're close to mastery!",

  // Stats
  timeSpent: '12:45',
  timeComparison: '3 minutes faster than average',
  accuracyRank: 'Top 15%',
  accuracyNote: 'Compared to Lumina Academy peers',

  // Feedback for failure state
  feedbackText: "You're great at Morphological Structures,  but need more practice in Historical Classifications and Native Species Identification. Focus on Chapters 2.3 and 3.1 for the best improvement.",

  // Topic breakdown
  topicBreakdown: [
    { name: 'Morphological Structures', score: 100 },
    { name: 'Historical Classifications', score: 60 },
    { name: 'Taxonomic Rank Systems', score: 85 },
    { name: 'Native Species Identification', score: 75 },
  ],
})

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>
