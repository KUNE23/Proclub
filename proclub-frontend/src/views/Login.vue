<template>
  <div class="flex h-screen items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100">
      <div class="flex justify-center mb-6">
        <div class="w-14 h-14 rounded-2xl bg-[#2C7047] text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-[#2C7047]/30">P</div>
      </div>
      <h1 class="text-3xl font-black text-gray-900 mb-2 text-center tracking-tight">Welcome back</h1>
      <p class="text-gray-500 text-center mb-8 font-medium">Please enter your details to sign in.</p>
      
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
          <input type="email" 
          class="block w-full border border-gray-200 rounded-xl shadow-sm p-3.5 focus:ring-2 focus:ring-[#2C7047] focus:border-[#2C7047] transition-all bg-gray-50 focus:bg-white text-gray-900" 
          placeholder="Enter your email" 
          required />
        </div>
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-sm font-bold text-gray-700">Password</label>
            <a href="#" class="text-xs font-semibold text-[#2C7047] hover:underline">Forgot password?</a>
          </div>
          <input 
          type="password" 
          class="block w-full border border-gray-200 rounded-xl shadow-sm p-3.5 focus:ring-2 focus:ring-[#2C7047] focus:border-[#2C7047] transition-all bg-gray-50 focus:bg-white text-gray-900" 
          placeholder="••••••••"
          
          required />
        </div>
        
        <div class="pt-2">
          <button type="submit" class="w-full bg-[#2C7047] text-white p-3.5 rounded-xl font-bold tracking-wide shadow-md shadow-[#2C7047]/20 hover:shadow-lg hover:bg-[#235838] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C7047]">
            Sign In
          </button>
        </div>
      </form>
      
      <div class="mt-8 text-center text-sm font-medium text-gray-500 flex justify-center gap-1">
        Don't have an account? <a href="#" class="text-[#2C7047] font-bold hover:underline">Sign up for free</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const handleLogin = () => {
  // Mock login and redirect
  router.push('/');
};
</script>
