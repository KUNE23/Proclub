<template>
  <div class="p-8 max-w-[1400px] mx-auto space-y-8">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-[28px] font-bold text-[#1A2E20]">Quiz Management</h1>
        <p class="text-gray-500 mt-1.5 text-[14px]">Configure assessments and questions for your learning paths.</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-8">
      <div class="col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-[#E6EFE9] p-8 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-[#1A2E20]">New Quiz Configuration</h2>
            <span class="px-3 py-1 bg-[#E6F4EA] text-[#0D7A42] text-[12px] font-bold rounded-md">Drafting Mode</span>
          </div>

          <div class="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label class="block text-[13px] font-bold text-[#1A2E20] mb-2">Quiz Title</label>
              <input type="text" placeholder="e.g. Advanced System Architecture" class="w-full px-4 py-3 bg-white border border-[#E6EFE9] rounded-xl text-[14px] focus:outline-none focus:border-[#0D7A42] focus:ring-1 focus:ring-[#0D7A42] transition-shadow placeholder-gray-400">
            </div>
            <div>
              <label class="block text-[13px] font-bold text-[#1A2E20] mb-2">Associated Module</label>
              <div class="relative">
                <select class="w-full appearance-none px-4 py-3 bg-white border border-[#E6EFE9] rounded-xl text-[14px] text-[#1A2E20] focus:outline-none focus:border-[#0D7A42] focus:ring-1 focus:ring-[#0D7A42] transition-shadow">
                  <option>Cloud Infrastructure 101</option>
                  <option>Frontend Development</option>
                  <option>Backend APIs</option>
                </select>
                <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-[#0D7A42]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 class="text-[15px] font-bold text-[#1A2E20]">Add Questions</h3>
            </div>
            <span class="text-[12px] font-medium text-gray-500">Total Questions: 0</span>
          </div>

          <div class="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6">
            <div class="mb-5">
              <label class="block text-[13px] font-bold text-[#1A2E20] mb-2">Question Text</label>
              <textarea placeholder="Enter your question here..." class="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#0D7A42] focus:ring-1 focus:ring-[#0D7A42] transition-shadow placeholder-gray-400 min-h-[100px] resize-none"></textarea>
            </div>

            <div class="space-y-4">
              <label class="block text-[13px] font-bold text-[#1A2E20]">Multiple Choice Options</label>
              
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full border border-gray-300"></div>
                <input type="text" value="Option A" class="flex-1 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:border-[#0D7A42]">
                <button class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full border border-gray-300"></div>
                <input type="text" value="Option B" class="flex-1 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:border-[#0D7A42]">
                <button class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full border border-gray-300"></div>
                <input type="text" value="Option C" class="flex-1 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:border-[#0D7A42]">
                <button class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>

              <button class="text-[#0D7A42] text-[13px] font-bold hover:underline mt-2 inline-block">+ Add another option</button>
            </div>

            <div class="flex items-center justify-end gap-4 mt-8 pt-4 border-t border-[#E2E8F0]">
              <button class="text-[13px] font-bold text-gray-500 hover:text-gray-700 transition-colors">Clear</button>
              <button class="px-5 py-2.5 bg-[#0D7A42] text-white rounded-lg text-[13px] font-bold hover:bg-[#0A6034] transition-colors shadow-sm">Save Question</button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl border border-[#E6EFE9] p-6 shadow-sm">
          <h3 class="text-[17px] font-bold text-[#1A2E20] mb-6">Recent Quizzes</h3>
          
          <div class="space-y-4">
            <div class="p-4 rounded-xl border border-[#E6EFE9] hover:border-[#0D7A42] transition-colors cursor-pointer group">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-[14px] font-bold text-[#1A2E20] group-hover:text-[#0D7A42] transition-colors pr-4">Introduction to Kubernetes</h4>
                <span class="px-2 py-0.5 bg-[#E6F4EA] text-[#0D7A42] text-[10px] font-bold rounded shrink-0 uppercase tracking-wider">Active</span>
              </div>
              <p class="text-[12px] text-gray-500 mb-3">Module: DevOps Fundamentals</p>
              <div class="flex items-center gap-1.5 text-gray-400 text-[11px]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                12 Questions
              </div>
            </div>

            <div class="p-4 rounded-xl border border-[#E6EFE9] hover:border-[#0D7A42] transition-colors cursor-pointer group">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-[14px] font-bold text-[#1A2E20] group-hover:text-[#0D7A42] transition-colors pr-4">React State Management</h4>
                <span class="px-2 py-0.5 bg-[#FFF7ED] text-[#EA580C] text-[10px] font-bold rounded shrink-0 uppercase tracking-wider">Draft</span>
              </div>
              <p class="text-[12px] text-gray-500 mb-3">Module: Modern Frontend Development</p>
              <div class="flex items-center gap-1.5 text-gray-400 text-[11px]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                8 Questions
              </div>
            </div>

            <div class="p-4 rounded-xl border border-[#E6EFE9] hover:border-[#0D7A42] transition-colors cursor-pointer group">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-[14px] font-bold text-[#1A2E20] group-hover:text-[#0D7A42] transition-colors pr-4">NoSQL vs SQL Performance</h4>
                <span class="px-2 py-0.5 bg-[#E6F4EA] text-[#0D7A42] text-[10px] font-bold rounded shrink-0 uppercase tracking-wider">Active</span>
              </div>
              <p class="text-[12px] text-gray-500 mb-3">Module: Database Performance</p>
              <div class="flex items-center gap-1.5 text-gray-400 text-[11px]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                15 Questions
              </div>
            </div>

            <div class="p-4 rounded-xl border border-[#E6EFE9] hover:border-[#0D7A42] transition-colors cursor-pointer group">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-[14px] font-bold text-[#1A2E20] group-hover:text-[#0D7A42] transition-colors pr-4">API Security Protocols</h4>
                <span class="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-bold rounded shrink-0 uppercase tracking-wider">Archived</span>
              </div>
              <p class="text-[12px] text-gray-500 mb-3">Module: Cyber Security</p>
              <div class="flex items-center gap-1.5 text-gray-400 text-[11px]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                20 Questions
              </div>
            </div>
          </div>

          <button class="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-[#E6EFE9] text-[13px] font-bold text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
            View All Quizzes
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm flex items-center gap-5">
        <div class="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A] shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        </div>
        <div>
          <p class="text-[13px] text-gray-500 font-medium mb-1">Average Completion Rate</p>
          <h3 class="text-2xl font-bold text-[#1A2E20]">84.2%</h3>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm flex items-center gap-5">
        <div class="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6] shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
        <div>
          <p class="text-[13px] text-gray-500 font-medium mb-1">Total Quiz Attempts</p>
          <h3 class="text-2xl font-bold text-[#1A2E20]">1,248</h3>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#E6EFE9] shadow-sm flex items-center gap-5">
        <div class="w-12 h-12 rounded-xl bg-[#FAF5FF] flex items-center justify-center text-[#A855F7] shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <p class="text-[13px] text-gray-500 font-medium mb-1">Latest Submission</p>
          <h3 class="text-2xl font-bold text-[#1A2E20]">2m ago</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
