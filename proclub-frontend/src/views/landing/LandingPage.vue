<template>
  <div class="landing-page min-h-screen overflow-hidden bg-[#F7FBFA] text-[#07111F]">
    <Transition name="intro">
      <div v-if="showIntro" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#F7FBFA]">
        <div class="intro-logo-wrap">
          <img src="/proclub.png" alt="Proclub" class="h-28 w-28 rounded-[2rem] object-contain shadow-2xl shadow-emerald-950/15">
          <p class="mt-5 text-center text-sm font-black uppercase tracking-[0.28em] text-[#0D7A42]">Proclub</p>
        </div>
      </div>
    </Transition>

    <div class="landing-content" :class="{ 'landing-content-ready': !showIntro }">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HistorySection />
      <LearningPathSection />
      <LearningFlowSection />
      <TeamSection />
      <CTASection />
      <ContactSection />
      <FooterSection />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Navbar from '../../components/landing/Navbar.vue'
import HeroSection from '../../components/landing/HeroSection.vue'
import AboutSection from '../../components/landing/AboutSection.vue'
import HistorySection from '../../components/landing/HistorySection.vue'
import LearningPathSection from '../../components/landing/LearningPathSection.vue'
import LearningFlowSection from '../../components/landing/LearningFlowSection.vue'
import TeamSection from '../../components/landing/TeamSection.vue'
import CTASection from '../../components/landing/CTASection.vue'
import ContactSection from '../../components/landing/ContactSection.vue'
import FooterSection from '../../components/landing/FooterSection.vue'

const showIntro = ref(true)

onMounted(() => {
  window.setTimeout(() => {
    showIntro.value = false
  }, 1400)
})
</script>

<style scoped>
.landing-page {
  background:
    radial-gradient(circle at 12% 18%, rgba(13, 122, 66, 0.16), transparent 28rem),
    radial-gradient(circle at 88% 10%, rgba(56, 189, 248, 0.12), transparent 24rem),
    radial-gradient(circle at 72% 72%, rgba(245, 158, 11, 0.08), transparent 24rem),
    linear-gradient(180deg, #F7FBFA 0%, #F2F8F6 48%, #F8FBFF 100%);
}

:deep(.animate-fade-up) {
  animation: fadeUp 0.8s ease both;
}

:deep(.animate-float) {
  animation: float 5s ease-in-out infinite;
}

.landing-content {
  opacity: 0;
  transform: translateY(34px);
}

.landing-content-ready {
  animation: contentEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.intro-logo-wrap {
  animation: logoPulse 1.2s ease-in-out both;
}

.intro-enter-active,
.intro-leave-active {
  transition: opacity 0.65s ease, transform 0.65s ease;
}

.intro-enter-from,
.intro-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

.intro-leave-to {
  transform: translateY(-100%);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes contentEnter {
  from {
    opacity: 0;
    transform: translateY(42px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes logoPulse {
  0% {
    opacity: 0;
    transform: scale(0.88) translateY(18px);
  }
  45% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 1;
    transform: scale(1.04) translateY(-8px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
</style>
