<template>
  <div class="p-8 max-w-6xl mx-auto space-y-8">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-[#1A2E20]">Welcome back, Admin</h1>
        <p class="text-gray-500 mt-1.5 text-[15px]">Here's what happened in the Proclub Learning Hub since your last login.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2.5 bg-white border border-[#E6EFE9] rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export Reports
        </button>
        <button class="px-4 py-2.5 bg-[#0D7A42] text-white rounded-lg text-sm font-semibold hover:bg-[#0A6034] flex items-center gap-2 transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          New Course
        </button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2.5 py-1 rounded-full">+12%</span>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Total Courses</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">148</h3>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-full">+4.2%</span>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Total Users</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">3,842</h3>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#F97316] flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>Live</span>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Active Students</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">1,204</h3>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#16A34A] bg-[#F0FDF4] px-2.5 py-1 rounded-full">+24%</span>
        </div>
        <p class="text-[13px] text-gray-500 font-semibold mb-1">Completed Courses</p>
        <h3 class="text-3xl font-bold text-[#1A2E20]">956</h3>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Chart -->
      <div class="col-span-2 bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-[17px] font-bold text-[#1A2E20]">User Engagement & Progress</h2>
          <div class="flex bg-[#F9FAFB] p-1 rounded-lg border border-[#E6EFE9]">
            <button class="px-3 py-1.5 text-[11px] font-bold bg-white shadow-sm rounded-md text-gray-700 tracking-wide">Weekly</button>
            <button class="px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-700 tracking-wide">Monthly</button>
          </div>
        </div>
        
        <div class="flex-1 min-h-[220px] flex items-end justify-between gap-6 px-2 mt-auto">
    
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[20%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[30%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">MON</span>
          </div>
    
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[15%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[40%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">TUE</span>
          </div>
     
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[40%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[25%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">WED</span>
          </div>
     
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[35%]"></div>
              <div class="w-full bg-[#157134] rounded-b-sm h-[60%] shadow-lg shadow-[#157134]/20"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">THU</span>
          </div>
 
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[10%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[35%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">FRI</span>
          </div>

          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[25%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[35%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">SAT</span>
          </div>
     
          <div class="flex flex-col items-center gap-3 flex-1 h-full">
            <div class="w-full h-full flex flex-col justify-end gap-1">
              <div class="w-full bg-[#F0F4F2] rounded-t-lg h-[50%]"></div>
              <div class="w-full bg-[#8EBC9E] rounded-b-sm h-[35%]"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">SUN</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-[17px] font-bold text-[#1A2E20]">Recent Activities</h2>
          <button class="text-[11px] font-bold text-[#157134] hover:underline tracking-wide">View All</button>
        </div>
        
        <div class="space-y-6 flex-1">
  
          <div class="flex gap-4">
            <div class="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 text-[#3B82F6]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            </div>
            <div>
              <p class="text-[13px] font-bold text-[#1A2E20] leading-snug">New enrollment in "UI Design Masterclass"</p>
              <p class="text-[12px] text-gray-500 mt-1">Sarah Jenkins just joined the course.</p>
              <p class="text-[10px] text-gray-400 mt-2">2 minutes ago</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0 text-[#16A34A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p class="text-[13px] font-bold text-[#1A2E20] leading-snug">Quiz Submission: "Advanced React"</p>
              <p class="text-[12px] text-gray-500 mt-1">Marcus Aurelius scored 98% in Module 4.</p>
              <p class="text-[10px] text-gray-400 mt-2">14 minutes ago</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-9 h-9 rounded-full bg-[#FAF5FF] flex items-center justify-center shrink-0 text-[#9333EA]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p class="text-[13px] font-bold text-[#1A2E20] leading-snug">Course Completed</p>
              <p class="text-[12px] text-gray-500 mt-1">Elena Rodriguez finished "Fullstack Dev Bootcamp".</p>
              <p class="text-[10px] text-gray-400 mt-2">1 hour ago</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0 text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div>
              <p class="text-[13px] font-bold text-[#1A2E20] leading-snug">System Update</p>
              <p class="text-[12px] text-gray-500 mt-1">Auto-backup of student database completed successfully.</p>
              <p class="text-[10px] text-gray-400 mt-2">3 hours ago</p>
            </div>
          </div>
        </div>
        
        <button class="w-full mt-6 py-3 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors tracking-widest uppercase border-t border-[#E6EFE9]">LOAD MORE HISTORY</button>
      </div>
    </div>
    
    <div class="bg-[#125B32] rounded-2xl p-10 text-white relative overflow-hidden shadow-lg shadow-[#125B32]/20">
      <div class="relative z-10 md:w-1/2">
        <h2 class="text-2xl font-bold mb-3">Drive User Growth</h2>
        <p class="text-green-50 text-[15px] mb-8 leading-relaxed max-w-md">Launch new collaborative modules and boost student retention rates by up to 35% with our latest toolsets.</p>
        <button class="px-6 py-2.5 bg-white text-[#125B32] text-sm font-bold rounded-lg shadow-md hover:bg-green-50 transition-colors">Explore Strategy</button>
      </div>

      <div class="absolute inset-0 bg-gradient-to-r from-[#125B32] via-[#125B32]/90 to-transparent z-0"></div>
      <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80" alt="Students" class="absolute right-0 top-0 h-full w-2/3 object-cover opacity-60 mix-blend-overlay">
    </div>
  </div>
</template>

<script setup>
</script>
