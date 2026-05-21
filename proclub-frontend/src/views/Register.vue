<template>
  <div class="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#2C7047]/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#2C7047]/10 rounded-full blur-3xl"></div>

    <div class="w-full max-w-[440px] bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 z-10">
      
      <div class="flex flex-col items-center mb-10">
        <div class="relative group transition-all duration-500">
          <div class="absolute -inset-1 bg-gradient-to-r from-[#2C7047] to-[#4ade80] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div class="relative flex items-center justify-center bg-white rounded-2xl p-3 shadow-sm border border-gray-50">
            <img src="/proclub.png" alt="Proclub Logo" class="w-20 h-auto object-contain" />
          </div>
        </div>
        
        <div class="mt-4 text-center">
          <h2 class="text-sm font-black tracking-[0.3em] text-gray-800 uppercase">Proclub</h2>
          <p class="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-bold mt-1">STTC Programming Club</p>
        </div>
      </div>

      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
        <p class="text-gray-500 mt-2 font-medium">Begin your journey start witth the Proclub collective today.</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Nama Lengkap</label>
          <input 
            v-model="name"
            type="text" 
            autofocus
            class="block w-full border border-gray-200 rounded-2xl shadow-sm p-4 focus:ring-2 focus:ring-[#2C7047]/20 focus:border-[#2C7047] transition-all bg-gray-50/50 focus:bg-white text-gray-900 outline-none" 
            placeholder="Name" 
            required 
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email address</label>
          <input 
            v-model="email"
            type="email" 
            class="block w-full border border-gray-200 rounded-2xl shadow-sm p-4 focus:ring-2 focus:ring-[#2C7047]/20 focus:border-[#2C7047] transition-all bg-gray-50/50 focus:bg-white text-gray-900 outline-none" 
            placeholder="name@student.sttcipasung.ac.id" 
            required 
          />
        </div>

        <div>
          <div class="flex justify-between items-center mb-2 ml-1">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
          </div>
          <input
            v-model="password" 
            type="password" 
            class="block w-full border border-gray-200 rounded-2xl shadow-sm p-4 focus:ring-2 focus:ring-[#2C7047]/20 focus:border-[#2C7047] transition-all bg-gray-50/50 focus:bg-white text-gray-900 outline-none" 
            placeholder="••••••••"
            required 
          />
        </div>
        
        <div class="pt-4">
          <button 
            :disabled="isLoading" 
            type="submit" 
            class="w-full bg-[#2C7047] text-white p-4 rounded-2xl font-bold tracking-wide shadow-lg shadow-[#2C7047]/20 hover:shadow-[#2C7047]/30 hover:bg-[#235838] disabled:bg-gray-300 disabled:shadow-none hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing up...' : 'Sign Up' }}
          </button>
        </div>
      </form>
      
      <div class="mt-10 text-center text-sm font-medium text-gray-500">
        Already have an account? 
        <a href="/login" class="text-[#2C7047] font-bold hover:underline decoration-2 underline-offset-4">Sign in here</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import api from '../api/index.js';
import { useToast } from "vue-toastification";

const toast = useToast();
const isLoading = ref(false);
const router = useRouter();
const email = ref('');  
const password = ref('');
const name = ref('');
const campusEmailPattern = /^[a-zA-Z0-9._%+-]+@student\.sttcipasung\.ac\.id$/;

const handleRegister = async () => {
  if (!campusEmailPattern.test(email.value.trim())) {
    toast.warning('Gunakan email kampus dengan domain @student.sttcipasung.ac.id');
    return;
  }

  isLoading.value = true;
  try {
    const response = await api.post('auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });
  
    localStorage.setItem('accessToken', response.data.token);

    toast.success('Register Berhasil! Selamat datang di Proclub.');

    await router.push('/');
    
  } catch (error) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401) {
      toast.error(serverMessage || 'Email atau Password salah');
    } else if (status === 429) {
      toast.warning('Terlalu banyak percobaan. Silakan tunggu 15 menit.');
    } else if (status === 500) {
      toast.error('Server sedang bermasalah, coba lagi nanti.');
    } else {
      toast.error(serverMessage || 'Terjadi kesalahan sistem.');
    }
    
    password.value = '';
    
  } finally {
    isLoading.value = false;
  }
};
</script>
