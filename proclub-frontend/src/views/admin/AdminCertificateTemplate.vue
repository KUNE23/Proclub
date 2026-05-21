<template>
  <div class="mx-auto max-w-7xl space-y-6 p-8">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-widest text-[#0A733F]">Certificate CMS</p>
        <h1 class="mt-1 text-2xl font-bold text-[#1A2E20]">Certificate Template</h1>
        <p class="mt-1 text-[13px] text-gray-500">Upload background dari Canva, lalu atur posisi nama, tanggal, dan QR code.</p>
      </div>
      <button
        @click="submitTemplate"
        :disabled="submitting"
        class="flex items-center gap-2 rounded-xl bg-[#0A733F] px-5 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#085a31] disabled:opacity-60"
        type="button"
      >
        <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
        <Save v-else class="h-4 w-4" />
        Simpan Template
      </button>
    </div>

    <div class="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form class="space-y-4 rounded-2xl border border-[#E6EFE9] bg-white p-5 shadow-sm" @submit.prevent="submitTemplate">
        <div>
          <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">Nama Template</label>
          <input
            v-model="form.name"
            class="w-full rounded-xl border px-4 py-2.5 text-[13px] outline-none focus:ring-1"
            :class="errors.name ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-[#E6EFE9] focus:border-[#0A733F] focus:ring-[#0A733F]/20'"
            placeholder="Template Sertifikat Proclub"
            type="text"
          >
          <p v-if="errors.name" class="mt-1 text-[11px] text-red-500">{{ errors.name }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-[12px] font-semibold text-gray-700">Upload Background</label>
          <label class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E7DF] bg-[#F8FBF9] px-4 py-8 text-center transition-colors hover:bg-[#F0FDF4]">
            <Upload class="mb-2 h-7 w-7 text-[#0A733F]" />
            <span class="text-[13px] font-bold text-[#1A2E20]">{{ fileName || 'Pilih PNG/JPG dari Canva' }}</span>
            <span class="mt-1 text-[11px] text-gray-400">Maksimal 5MB, akan dikompres otomatis.</span>
            <input class="hidden" type="file" accept="image/png,image/jpeg" @change="handleFile">
          </label>
          <p v-if="errors.background" class="mt-1 text-[11px] text-red-500">{{ errors.background }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <NumberInput v-model="form.nameX" label="Position Nama X" />
          <NumberInput v-model="form.nameY" label="Position Nama Y" />
          <NumberInput v-model="form.dateX" label="Position Tanggal X" />
          <NumberInput v-model="form.dateY" label="Position Tanggal Y" />
          <NumberInput v-model="form.qrX" label="Position QR X" />
          <NumberInput v-model="form.qrY" label="Position QR Y" />
          <NumberInput v-model="form.qrSize" label="QR Size" />
          <NumberInput v-model="form.nameFontSize" label="Font Nama" />
          <NumberInput v-model="form.dateFontSize" label="Font Tanggal" />
          <div>
            <label class="mb-1.5 block text-[11px] font-bold text-gray-500">Font</label>
            <select
              v-model="form.fontFamily"
              class="h-[38px] w-full rounded-xl border border-[#E6EFE9] bg-white px-3 text-[13px] outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20"
            >
              <option value="Helvetica">Helvetica</option>
              <option value="Times-Roman">Times Roman</option>
              <option value="Courier">Courier</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-[11px] font-bold text-gray-500">Warna</label>
            <input v-model="form.textColor" class="h-[38px] w-full rounded-xl border border-[#E6EFE9] bg-white px-2" type="color">
          </div>
        </div>
      </form>

      <div class="rounded-2xl border border-[#E6EFE9] bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold text-[#1A2E20]">Preview Template</h2>
            <p class="text-[12px] text-gray-500">Posisi overlay ditampilkan sebagai panduan.</p>
          </div>
          <span v-if="template" class="rounded-full bg-[#F0FDF4] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0A733F]">Aktif</span>
        </div>

        <div class="relative overflow-hidden rounded-xl border border-[#E6EFE9] bg-slate-50">
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="w-full object-contain"
            alt="Preview certificate template"
          >
          <div v-else class="flex min-h-[420px] flex-col items-center justify-center text-center text-gray-400">
            <ImageIcon class="mb-3 h-10 w-10" />
            <p class="text-sm font-semibold">Belum ada background</p>
          </div>

          <template v-if="previewUrl">
            <div class="absolute rounded border border-dashed border-[#0A733F] bg-white/80 px-3 py-1 text-sm font-bold" :style="markerStyle(form.nameX, form.nameY)">
              Nama Student
            </div>
            <div class="absolute rounded border border-dashed border-blue-500 bg-white/80 px-3 py-1 text-xs font-bold" :style="markerStyle(form.dateX, form.dateY)">
              21 Mei 2026
            </div>
            <div class="absolute flex items-center justify-center rounded border border-dashed border-red-500 bg-white/80 text-[10px] font-bold" :style="qrMarkerStyle">
              QR
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { Image as ImageIcon, Loader2, Save, Upload } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { getCertificateTemplate, saveCertificateTemplate } from '../../services/certificateService.js'

const NumberInput = defineComponent({
  props: {
    modelValue: { type: Number, default: 0 },
    label: { type: String, required: true }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', [
      h('label', { class: 'mb-1.5 block text-[11px] font-bold text-gray-500' }, props.label),
      h('input', {
        value: props.modelValue,
        type: 'number',
        min: 0,
        max: 3000,
        class: 'w-full rounded-xl border border-[#E6EFE9] px-3 py-2 text-[13px] outline-none focus:border-[#0A733F] focus:ring-1 focus:ring-[#0A733F]/20',
        onInput: (event) => emit('update:modelValue', Number(event.target.value))
      })
    ])
  }
})

const toast = useToast()
const submitting = ref(false)
const template = ref(null)
const background = ref(null)
const localPreview = ref('')
const fileName = ref('')

const form = reactive({
  name: 'Template Sertifikat Proclub',
  nameX: 420,
  nameY: 320,
  dateX: 260,
  dateY: 520,
  qrX: 980,
  qrY: 520,
  qrSize: 120,
  fontFamily: 'Helvetica',
  nameFontSize: 42,
  dateFontSize: 18,
  textColor: '#1A2E20'
})

const errors = reactive({
  name: '',
  background: ''
})

const previewUrl = computed(() => {
  if (localPreview.value) return localPreview.value
  if (template.value?.backgroundUrl) return `http://localhost:3000${template.value.backgroundUrl}`
  return ''
})

const scale = computed(() => {
  const width = template.value?.imageWidth || 1200
  return 100 / width
})

const markerStyle = (x, y) => ({
  left: `${x * scale.value}%`,
  top: `${y * scale.value}%`,
  transform: 'translateY(-50%)',
  color: form.textColor
})

const qrMarkerStyle = computed(() => ({
  left: `${form.qrX * scale.value}%`,
  top: `${form.qrY * scale.value}%`,
  width: `${form.qrSize * scale.value}%`,
  aspectRatio: '1 / 1'
}))

const validate = () => {
  errors.name = ''
  errors.background = ''

  if (form.name.trim().length < 3) errors.name = 'Nama template minimal 3 karakter.'
  if (!background.value && !template.value) errors.background = 'Background wajib diupload.'
  if (background.value && background.value.size > 5 * 1024 * 1024) errors.background = 'Ukuran background maksimal 5MB.'

  return !errors.name && !errors.background
}

const handleFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  background.value = file
  fileName.value = file.name
  localPreview.value = URL.createObjectURL(file)
  errors.background = ''
}

const loadTemplate = async () => {
  try {
    const response = await getCertificateTemplate()
    template.value = response.data?.data || null

    if (template.value) {
      Object.assign(form, {
        name: template.value.name,
        nameX: template.value.nameX,
        nameY: template.value.nameY,
        dateX: template.value.dateX,
        dateY: template.value.dateY,
        qrX: template.value.qrX,
        qrY: template.value.qrY,
        qrSize: template.value.qrSize,
        fontFamily: template.value.fontFamily,
        nameFontSize: template.value.nameFontSize,
        dateFontSize: template.value.dateFontSize,
        textColor: template.value.textColor
      })
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memuat template sertifikat')
  }
}

const submitTemplate = async () => {
  if (!validate()) return

  submitting.value = true

  try {
    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => payload.append(key, value))
    if (background.value) payload.append('background', background.value)

    const response = await saveCertificateTemplate(payload)
    template.value = response.data?.data
    background.value = null
    fileName.value = ''
    localPreview.value = ''
    toast.success('Template sertifikat berhasil disimpan')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan template sertifikat')
  } finally {
    submitting.value = false
  }
}

onMounted(loadTemplate)
</script>
