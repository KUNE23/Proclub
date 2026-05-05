<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#1A2E20]">Courses Management</h1>
        <p class="text-gray-500 mt-1 text-[13px]">Manage and monitor your educational curriculum from one central hub.</p>
      </div>
      <button class="px-4 py-2.5 bg-[#0A733F] text-white rounded-lg text-sm font-semibold hover:bg-[#085a31] flex items-center gap-2 transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Create New Course
      </button>
    </div>

    <div class="grid grid-cols-4 gap-6">
      <div class="bg-white p-5 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#16A34A]">+12%</span>
        </div>
        <p class="text-[12px] text-gray-500 font-medium mb-0.5">Total Courses</p>
        <h3 class="text-2xl font-bold text-[#1A2E20]">42</h3>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-lg bg-[#FFF1F2] flex items-center justify-center text-[#E11D48]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#16A34A]">+8.2%</span>
        </div>
        <p class="text-[12px] text-gray-500 font-medium mb-0.5">Total Enrollment</p>
        <h3 class="text-2xl font-bold text-[#1A2E20]">12,840</h3>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#E11D48]">-2%</span>
        </div>
        <p class="text-[12px] text-gray-500 font-medium mb-0.5">Avg. Completion</p>
        <h3 class="text-2xl font-bold text-[#1A2E20]">68.4%</h3>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#E6EFE9] shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-lg bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
          </div>
          <span class="text-[11px] font-bold text-[#16A34A]">+0.5</span>
        </div>
        <p class="text-[12px] text-gray-500 font-medium mb-0.5">Student Rating</p>
        <h3 class="text-2xl font-bold text-[#1A2E20]">4.9/5</h3>
      </div>
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input type="text" placeholder="Filter by course name or instructor..." class="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E6EFE9] rounded-xl text-[13px] focus:outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F] transition-shadow">
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <select class="appearance-none bg-white border border-[#E6EFE9] rounded-xl px-4 py-2.5 pr-8 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-[#0A733F]">
          <option>All Categories</option>
          <option>Development</option>
          <option>Design</option>
          <option>Marketing</option>
        </select>
        <select class="appearance-none bg-white border border-[#E6EFE9] rounded-xl px-4 py-2.5 pr-8 text-[13px] font-medium text-gray-700 focus:outline-none focus:border-[#0A733F]">
          <option>Status: All</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
        <button class="px-4 py-2.5 bg-white border border-[#E6EFE9] rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          More Filters
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#E6EFE9] overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-white border-b border-[#E6EFE9]">
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-[40%]">Title</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">Modules</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Enrolled</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
            <th class="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E6EFE9]">
          <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-4 px-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="course.iconBg">
                  <div v-html="course.icon" class="w-5 h-5" :class="course.iconColor"></div>
                </div>
                <div>
                  <p class="text-[14px] font-bold text-[#1A2E20] leading-snug">{{ course.title }}</p>
                  <p class="text-[11px] text-gray-500 mt-0.5">by {{ course.instructor }}</p>
                </div>
              </div>
            </td>
            <td class="py-4 px-6">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-gray-700">
                {{ course.category }}
              </span>
            </td>
            <td class="py-4 px-6 text-center">
              <span class="text-[13px] font-medium text-gray-800">{{ course.modules }}</span>
            </td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <img v-for="(avatar, i) in course.enrolledAvatars" :key="i" :src="avatar" class="w-6 h-6 rounded-full border-2 border-white object-cover">
                </div>
                <span class="text-[13px] font-medium text-gray-600">{{ course.enrolledCount }}</span>
              </div>
            </td>
            <td class="py-4 px-6">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                :class="{
                  'bg-[#F0FDF4] text-[#16A34A]': course.status === 'Published',
                  'bg-[#F3F4F6] text-gray-600': course.status === 'Draft',
                }">
                <span class="w-1.5 h-1.5 rounded-full" :class="course.status === 'Published' ? 'bg-[#16A34A]' : 'bg-gray-400'"></span>
                {{ course.status }}
              </span>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <button class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="View">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
                <button class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button class="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="p-4 border-t border-[#E6EFE9] flex items-center justify-between bg-white">
        <span class="text-[12px] text-gray-500 font-medium">Showing 1 to 10 of 42 courses</span>
        <div class="flex items-center gap-1">
          <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600 disabled:opacity-50" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0A733F] text-white text-[12px] font-bold">1</button>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 text-[12px] font-bold">2</button>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 text-[12px] font-bold">3</button>
          <span class="w-8 h-8 flex items-center justify-center text-gray-400 text-[12px]">...</span>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 text-[12px] font-bold">5</button>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6EFE9] text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6 pt-2">

      <div class="col-span-2 bg-[#0A733F] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div class="relative z-10 w-2/3">
          <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">Course of the month</span>
          <h2 class="text-2xl font-bold mb-3">Full Stack Engineering Bootcamp</h2>
          <p class="text-green-50 text-[14px] mb-8 leading-relaxed max-w-sm">Our most popular course just got a major update with Next.js 14 and advanced backend patterns.</p>
          <button class="px-5 py-2 bg-white text-[#0A733F] text-[13px] font-bold rounded-lg shadow-sm hover:bg-green-50 transition-colors">Manage Content</button>
        </div>

        <div class="absolute inset-0 bg-gradient-to-r from-[#0A733F] via-[#0A733F]/80 to-transparent z-0"></div>
        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" alt="Code on screens" class="absolute right-0 top-0 h-full w-2/3 object-cover opacity-60 mix-blend-overlay">
      </div>

      <div class="bg-white rounded-2xl p-6 border border-[#E6EFE9] shadow-sm flex flex-col">
        <h3 class="text-[17px] font-bold text-[#1A2E20] mb-6">Quick Insights</h3>
        
        <div class="space-y-6">
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-[13px] font-medium text-gray-500">Active Students</span>
              <span class="text-[13px] font-bold text-[#1A2E20]">8.4k</span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#16A34A] rounded-full" style="width: 75%"></div>
            </div>
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-[13px] font-medium text-gray-500">Revenue Goals</span>
              <span class="text-[13px] font-bold text-[#1A2E20]">$12,400 / $15k</span>
            </div>
            <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#E11D48] rounded-full" style="width: 82%"></div>
            </div>
          </div>
        </div>

        <button class="mt-auto flex items-center justify-center gap-2 w-full pt-6 text-[13px] font-bold text-[#0A733F] hover:text-[#085a31] transition-colors group">
          View Detailed Analytics
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const courses = ref([
  { 
    id: 1, 
    title: 'Advanced React Patterns', 
    instructor: 'Sarah Jenkins', 
    category: 'Development', 
    modules: 12, 
    enrolledCount: '1,240',
    enrolledAvatars: ['https://i.pravatar.cc/150?u=a1', 'https://i.pravatar.cc/150?u=a2'],
    status: 'Published',
    iconBg: 'bg-[#F0FDF4]',
    iconColor: 'text-[#16A34A]',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>'
  },
  { 
    id: 2, 
    title: 'UI/UX Design Masterclass', 
    instructor: 'Marcus Thorne', 
    category: 'Design', 
    modules: 24, 
    enrolledCount: '3,450',
    enrolledAvatars: ['https://i.pravatar.cc/150?u=a3', 'https://i.pravatar.cc/150?u=a4', 'https://ui-avatars.com/api/?name=+80&background=F3F4F6&color=374151'],
    status: 'Draft',
    iconBg: 'bg-[#FFF1F2]',
    iconColor: 'text-[#E11D48]',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>'
  },
  { 
    id: 3, 
    title: 'Growth Marketing 101', 
    instructor: 'Elena Rodriguez', 
    category: 'Marketing', 
    modules: 8, 
    enrolledCount: '892',
    enrolledAvatars: ['https://i.pravatar.cc/150?u=a5', 'https://i.pravatar.cc/150?u=a6'],
    status: 'Published',
    iconBg: 'bg-[#EFF6FF]',
    iconColor: 'text-[#3B82F6]',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>'
  },
  { 
    id: 4, 
    title: 'Database Architecture', 
    instructor: 'Simon Petrov', 
    category: 'Development', 
    modules: 15, 
    enrolledCount: '156',
    enrolledAvatars: ['https://ui-avatars.com/api/?name=SP&background=F3F4F6&color=374151'],
    status: 'Draft',
    iconBg: 'bg-[#FFF7ED]',
    iconColor: 'text-[#F97316]',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>'
  },
])
</script>
