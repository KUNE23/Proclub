<template>
  <div class="p-8 max-w-[1400px] mx-auto space-y-6">
    <div class="mb-2">
      <router-link to="/admin/courses" class="text-[13px] font-bold text-[#0D7A42] hover:underline flex items-center gap-1.5 w-fit">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Course: Advanced UI Architecture
      </router-link>
    </div>

    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-[#1A2E20]">Lesson Editor</h1>
      <div class="flex items-center gap-3">
        <button class="px-5 py-2.5 bg-white border border-[#E6EFE9] rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          Preview
        </button>
        <button class="px-5 py-2.5 bg-[#0D7A42] text-white rounded-lg text-[13px] font-bold hover:bg-[#0A6034] flex items-center gap-2 transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          Save Lesson
        </button>
      </div>
    </div>

    <div class="flex gap-8 items-start">
      <div class="flex-1 space-y-6">
        <div class="bg-white rounded-xl border border-[#E6EFE9] p-6 shadow-sm">
          <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Lesson Title</label>
          <input type="text" value="Deep Dive into Atomic Design Principles" class="w-full text-2xl font-bold text-[#1A2E20] border-none focus:ring-0 p-0 bg-transparent placeholder-gray-300">
        </div>

        <div class="bg-white rounded-xl border border-[#E6EFE9] shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div class="border-b border-[#E6EFE9] p-3 flex items-center justify-between bg-[#FAFCFB]">
            <div class="flex items-center gap-1">
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <span class="font-serif font-bold text-[15px]">B</span>
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <span class="font-serif italic text-[15px]">I</span>
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <span class="font-serif underline text-[15px]">U</span>
              </button>
              <div class="w-px h-5 bg-gray-300 mx-2"></div>
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              </button>
              <div class="w-px h-5 bg-gray-300 mx-2"></div>
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </button>
            </div>
            <span class="text-[11px] text-gray-400 font-medium mr-2">Last autosaved at 10:42 AM</span>
          </div>
          
          <div class="p-8 flex-1 overflow-y-auto">
            <div class="prose max-w-none text-[#374151] leading-relaxed text-[15px]">
              <p class="mb-4">In this lesson, we will explore the core tenets of Atomic Design as proposed by Brad Frost. We will look at how atoms, molecules, organisms, templates, and pages create a cohesive ecosystem for digital products.</p>
              
              <p class="mb-6">Start by defining your primary atoms. These are the basic building blocks like buttons, inputs, and labels. They shouldn't be broken down any further without losing their functional identity.</p>

              <div class="bg-[#F0FDF4] border-l-4 border-[#16A34A] p-5 rounded-r-lg">
                <p class="font-bold text-[#16A34A] text-[13px] mb-1">Pro Tip:</p>
                <p class="text-[#16A34A] italic m-0">"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[360px] shrink-0 space-y-6">
        <div class="bg-white rounded-xl border border-[#E6EFE9] p-6 shadow-sm">
          <h3 class="text-[17px] font-bold text-[#1A2E20] mb-6">Lesson Settings</h3>
          
          <div class="mb-6">
            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Content Type</label>
            <div class="grid grid-cols-3 gap-3">
              <button class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-[#0D7A42] bg-[#F0FDF4] text-[#0D7A42] transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span class="text-[12px] font-bold">Text</span>
              </button>
              <button class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#E6EFE9] text-gray-500 hover:border-gray-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <span class="text-[12px] font-bold">Video</span>
              </button>
              <button class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#E6EFE9] text-gray-500 hover:border-gray-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <span class="text-[12px] font-bold">File</span>
              </button>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Duration (Minutes)</label>
            <input type="number" value="15" class="w-full px-4 py-2.5 bg-[#FAFCFB] border border-[#E6EFE9] rounded-lg text-[14px] text-[#1A2E20] focus:outline-none focus:border-[#0D7A42] focus:ring-1 focus:ring-[#0D7A42]">
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-[13px] font-bold text-[#1A2E20]">Required Lesson</span>
            <div class="w-11 h-6 bg-[#0D7A42] rounded-full relative cursor-pointer">
              <div class="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-[#E6EFE9] p-6 shadow-sm">
          <h3 class="text-[17px] font-bold text-[#1A2E20] mb-5">Lesson Media</h3>
          
          <div class="border-2 border-dashed border-[#E6EFE9] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#FAFCFB] cursor-pointer hover:bg-gray-50 transition-colors mb-4">
            <div class="w-10 h-10 bg-white rounded-full shadow-sm border border-[#E6EFE9] flex items-center justify-center text-gray-400 mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <p class="text-[13px] font-bold text-[#1A2E20] mb-1">Click or drag to upload</p>
            <p class="text-[11px] text-gray-400">PDF, DOCX, or MP4 (Max 100MB)</p>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg border border-[#E6EFE9] bg-[#FAFCFB]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-[#E6F4EA] flex items-center justify-center text-[#16A34A] shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div class="min-w-0">
                <p class="text-[12px] font-bold text-[#1A2E20] truncate w-48">Atomic_Design_Cheat_Sheet.pdf</p>
                <p class="text-[10px] text-gray-500 mt-0.5">2.4 MB • Completed</p>
              </div>
            </div>
            <button class="text-gray-400 hover:text-red-500 transition-colors p-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>

        <div class="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 flex gap-4 items-start">
          <div class="w-6 h-6 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#16A34A] shrink-0 mt-0.5">
            <span class="font-serif font-bold text-[12px]">i</span>
          </div>
          <div>
            <h4 class="text-[13px] font-bold text-[#1E293B] mb-1">Publishing Status</h4>
            <p class="text-[12px] text-[#475569] leading-relaxed">Currently in <span class="font-bold text-[#16A34A]">Draft</span> mode. Saving will not make this visible to students until you publish the entire module.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
