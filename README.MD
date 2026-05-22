# Proclub Learning Hub

Proclub Learning Hub adalah platform Learning Management System untuk UKM Programming Club. Aplikasi ini dibuat untuk membantu anggota belajar pemrograman secara bertahap, menyelesaikan materi, mengerjakan kuis, mengirim project final berbasis GitHub, dan mendapatkan sertifikat digital yang bisa diverifikasi melalui QR code.

Alur pembelajaran utama:

```text
Learning Path / Course
  -> Module
    -> Lesson
      -> Content Blocks
```

Contoh struktur:

```text
Learning Path: Fundamental Programming
Module: Introduction & Algorithm
Lessons:
- Apa itu Pemrograman
- Cara Berpikir Algoritma
- Flowchart Dasar
- Pseudocode
- Quiz Introduction
```

## Ringkasan Fitur

### Authentication & Access

- Register, login, logout menggunakan JWT.
- Register member wajib menggunakan domain email kampus `@student.sttcipasung.ac.id`.
- Password divalidasi dari frontend dan backend: minimal 8 karakter, huruf besar, huruf kecil, angka, dan special character.
- Forgot password menggunakan kode OTP yang dikirim ke email.
- Akun member baru tidak langsung bisa login. Admin harus mengaktifkan akun terlebih dahulu melalui Admin Users.
- Role-based access untuk `admin`, `mentor`, dan `member`.
- User yang sedang login dapat terlihat oleh admin melalui indikator titik hijau pada avatar di halaman User Management.

### Student Area

Halaman student memakai `MainLayout` dengan sidebar, dashboard, learning path, project, certificate, profile, dan notification.

Fitur student:

- Dashboard modern dengan progress learning path.
- XP dan level di sidebar.
- Streak harian. Streak bertambah ketika student menyelesaikan minimal satu lesson pada hari tersebut.
- Upcoming event card untuk menampilkan jadwal kegiatan terdekat dari admin.
- Recommended learning path.
- Learning path menampilkan daftar course dan jumlah module.
- Course detail menampilkan roadmap module.
- Course berikutnya dapat dikunci sampai course sebelumnya selesai.
- Module dan lesson menggunakan sequential access. Lesson berikutnya hanya dapat diakses setelah lesson sebelumnya selesai.
- Lesson dapat berisi content blocks:
  - Text
  - Image
  - Video
  - YouTube embed
  - PDF
  - External link
  - Code block
  - Callout/resource
- Quiz menggunakan auto grading dengan KKM.
- Progress bar lesson berjalan dengan animasi.
- Project submission hanya membutuhkan GitHub repository URL.
- Profile menampilkan learning progress, completed modules, completed lessons, dan certificate.
- Student notification untuk informasi module baru dan module selesai.

### Learning Path, Module, Lesson, Content Block

Struktur LMS sudah tidak lagi berhenti di Course -> Module. Sistem sekarang mendukung:

- Course sebagai Learning Path.
- Module sebagai bagian besar dari learning path.
- Lesson sebagai unit belajar yang dikerjakan student.
- Content Blocks sebagai isi lesson yang fleksibel.

Content block memakai field JSON sehingga setiap block bisa menyimpan format berbeda sesuai tipe kontennya.

### Quiz & Progress

- Quiz tersimpan pada lesson bertipe `QUIZ`.
- Setiap quiz memiliki question, options JSON, dan correctAnswer.
- Submit quiz akan menghitung score otomatis.
- Jika score memenuhi KKM, progress lesson menjadi `COMPLETED`.
- Progress disimpan di `UserProgress` dengan unique key `userId + lessonId`.
- Saat semua lesson dalam module selesai, sistem membuat notifikasi module selesai.
- Saat semua lesson dalam course selesai, sistem dapat menganggap learning path selesai.

### Project Submission

Project submission menjadi syarat akhir sebelum student dapat mengambil sertifikat.

Alur project:

```text
Student selesai learning path
  -> Student submit GitHub repository URL
  -> Admin/Mentor review project
  -> Jika approved, sistem generate certificate
```

Fitur project:

- Admin/Mentor membuat Project Requirements per course.
- Student membaca requirements pada halaman project.
- Student submit GitHub repository URL.
- Admin/Mentor melihat semua submission pada Project Review.
- Admin/Mentor dapat approve atau reject.
- Jika approved dan syarat course terpenuhi, sertifikat dibuat otomatis.

### Certificate System

Fitur sertifikat dibuat untuk mendukung template dari Canva.

Alur admin:

```text
Admin design certificate di Canva
  -> Export PNG/JPG
  -> Upload ke Proclub Admin
  -> Atur posisi nama, tanggal, dan QR code
  -> Simpan template aktif
```

Alur sistem:

```text
Student selesai learning path
  -> Project final approved
  -> Sistem generate certificate
  -> Nama, learning path, tanggal, dan QR code dirender otomatis
  -> PDF siap di-download
```

Fitur sertifikat:

- Admin upload background template PNG/JPG.
- Backend melakukan kompresi gambar agar lebih ringan.
- Admin mengatur:
  - posisi nama
  - posisi tanggal
  - posisi QR code
  - ukuran QR
  - font family
  - ukuran font
  - warna teks
- Certificate PDF dibuat dengan PDFKit.
- QR code dibuat dengan library `qrcode`.
- QR code mengarah ke URL verifikasi seperti:

```text
proclub.id/certificate/PCB-00012
```

- Saat QR di-scan, user diarahkan ke halaman verifikasi certificate.
- Halaman verify menampilkan informasi sertifikat berdasarkan certificate code.
- Student dapat mengunduh PDF certificate dari akun mereka.

### Notification

Sistem notifikasi tersedia untuk student dan admin.

Student notification:

- Module baru tersedia.
- Module berhasil diselesaikan.

Admin notification:

- User baru mendaftar.
- Student menyelesaikan lesson.
- Student menyelesaikan module.
- Student menyelesaikan course / learning path.
- Student mengirim project submission.

Admin memiliki:

- Bell notification pada navbar admin.
- Badge jumlah unread notification.
- Dropdown notification ringkas.
- Halaman pusat notifikasi di `/admin/notifications`.
- Mark as read dan mark all as read.

### Upcoming Events

Upcoming Events dipakai untuk jadwal kegiatan Proclub, misalnya pelatihan offline.

Fitur:

- Admin CRUD jadwal kegiatan di `/admin/upcoming-events`.
- Input title, description, location, date time, dan active status.
- Student dashboard menampilkan event aktif yang paling dekat.
- Admin dashboard menampilkan card upcoming dan shortcut ke halaman kelola event.

### Admin Console

Admin Console memiliki layout responsive dengan sidebar drawer pada mobile.

Halaman admin:

- Dashboard
- Courses / Quizzes
- Module & Lesson CMS
- Quiz Result
- Project Review
- Certificates
- Upcoming Events
- Users
- User Progress
- Notifications
- Account Settings

Fitur admin:

- Statistik dashboard.
- CRUD Course / Learning Path.
- CRUD Module di dalam course.
- CRUD Lesson di dalam module.
- CRUD Content Blocks di dalam lesson.
- CRUD Quiz dan questions.
- Melihat hasil quiz semua student.
- Melihat progress user.
- CRUD Project Requirements.
- Review project submission.
- Upload dan konfigurasi certificate template.
- CRUD Upcoming Events.
- CRUD User.
- Aktivasi/nonaktif akun member.
- Melihat status online user.
- Notifikasi aktivitas student.

## Tech Stack

### Backend

- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Password hashing: bcrypt
- Validation: Zod
- Security: Helmet, CORS, XSS sanitization, express-rate-limit
- Upload: Multer
- Image processing: Sharp
- Email: Nodemailer
- PDF generation: PDFKit
- QR generation: qrcode

### Frontend

- Framework: Vue 3
- Syntax: Composition API dan `<script setup>`
- Build tool: Vite
- Routing: Vue Router
- HTTP client: Axios
- Styling: Tailwind CSS
- Notification UI: vue-toastification
- Icons: lucide-vue-next

## Struktur Project

```text
Proclub/
  README.MD
  proclub-backend/
    prisma/
      schema.prisma
      migrations/
    src/
      app.js
      config/
        prisma.js
      controllers/
        authController.js
        certificateController.js
        courseController.js
        dashboardController.js
        memberDashboardController.js
        moduleController.js
        notificationController.js
        projectController.js
        quizController.js
        upcomingEventController.js
        userController.js
      middleware/
        authMiddleware.js
        checkModuleAccess.js
        rateLimiter.js
        roleMiddleware.js
        uploadMiddleware.js
        validate.js
      routes/
        authRoutes.js
        certificateRoutes.js
        courseRoutes.js
        dashboardRoutes.js
        memberDashboardRoutes.js
        modulesRoutes.js
        notificationRoutes.js
        projectRoutes.js
        quizRoutes.js
        upcomingEventRoutes.js
        userRoutes.js
      schema/
      services/
        adminNotificationService.js
        certificateService.js
        emailService.js
        learningAccessService.js
      uploads/
    package.json
  proclub-frontend/
    src/
      api/
        index.js
      components/
        QuizPlayer.vue
      layouts/
        AdminLayout.vue
        MainLayout.vue
      router/
        index.js
      services/
        certificateService.js
        dashboardService.js
        moduleService.js
        notificationService.js
        projectReviewService.js
        upcomingEventService.js
        userProgressService.js
      views/
        CertificateVerifyView.vue
        CourseDetailView.vue
        Dashboard.vue
        EditProfileView.vue
        ForgotPassword.vue
        LearningPath.vue
        Login.vue
        ModuleView.vue
        ProfileView.vue
        ProjectSubmissionView.vue
        Register.vue
        admin/
          AdminCertificateTemplate.vue
          AdminCourses.vue
          AdminDashboard.vue
          AdminNotifications.vue
          AdminProjectReview.vue
          AdminQuizResult.vue
          AdminQuizzes.vue
          AdminQuestions.vue
          AdminSettings.vue
          AdminUpcomingEvents.vue
          AdminUserEdit.vue
          AdminUserProgress.vue
          AdminUsers.vue
          modules/
            ContentForm.vue
            Index.vue
            LessonForm.vue
            ModuleForm.vue
    package.json
```

## Database Model Utama

- `User`: data akun, role, token aktif, status aktivasi.
- `Course`: learning path.
- `Module`: bagian dari course.
- `Lesson`: unit pembelajaran di dalam module.
- `ContentBlock`: konten fleksibel lesson berbasis JSON.
- `Quiz`: pertanyaan quiz untuk lesson.
- `UserProgress`: progress user per lesson.
- `Project`: submission GitHub repository.
- `ProjectRequirement`: requirement project final per course.
- `CertificateTemplate`: template sertifikat dari admin.
- `Certificate`: sertifikat final user.
- `Notification`: notifikasi student/admin.
- `UpcomingEvent`: jadwal kegiatan Proclub.
- `PasswordResetOtp`: OTP reset password.

## Instalasi

### 1. Clone repository

```bash
git clone https://github.com/KUNE23/Proclub.git
cd Proclub
```

### 2. Install dependency backend

```bash
cd proclub-backend
npm install
```

### 3. Setup environment backend

Buat file `.env` di folder `proclub-backend/`.

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret_key"

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your_email"
SMTP_PASS="your_password"
SMTP_FROM="Proclub <noreply@proclub.id>"

APP_URL="http://localhost:5173"
```

SMTP dipakai untuk forgot password OTP. Jika SMTP belum tersedia, sistem tetap bisa membuat OTP tetapi email tidak benar-benar dikirim.

### 4. Setup database

```bash
npx prisma migrate deploy
npx prisma generate
```

Untuk development awal, jika belum memakai migration:

```bash
npx prisma db push
npx prisma generate
```

### 5. Jalankan backend

```bash
npm run dev
```

Backend berjalan di:

```text
http://localhost:3000
```

### 6. Install dependency frontend

```bash
cd ../proclub-frontend
npm install
```

### 7. Jalankan frontend

```bash
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

## API Endpoint

Base URL:

```text
http://localhost:3000/api
```

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

### Profile & User

- `GET /profile`
- `PUT /profile`
- `GET /progress`
- `PATCH /lessons/:lessonId/complete`
- `GET /`
- `POST /`
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`
- `PATCH /:id/activation`
- `GET /admin/user-progress`

### Course / Learning Path

- `GET /courses`
- `GET /courses/:id`
- `POST /courses`
- `PUT /courses/:id`
- `DELETE /courses/:id`

### Module & Lesson

- `GET /courses/:courseId/modules`
- `POST /courses/:courseId/modules`
- `PUT /modules/:id`
- `DELETE /modules/:id`
- `GET /modules/:moduleId/lessons`
- `POST /modules/:moduleId/lessons`
- `GET /lessons/:id`
- `PUT /lessons/:id`
- `DELETE /lessons/:id`
- `POST /lessons/:id/progress`

### Quiz

- `POST /quizzes`
- `PUT /quizzes/:id`
- `DELETE /quizzes/:id`
- `GET /lessons/:lessonId/quizzes`
- `POST /lessons/:id/submit`
- `GET /admin/quiz-results`

### Project

- `POST /projects`
- `GET /projects`
- `GET /admin/projects`
- `PUT /projects/:id/review`
- `GET /courses/:courseId/project-requirements`
- `POST /courses/:courseId/project-requirements`
- `PUT /project-requirements/:id`
- `DELETE /project-requirements/:id`

### Certificate

- `GET /certificate-template`
- `POST /certificate-template`
- `GET /certificates/mine`
- `POST /certificates/generate/:courseId`
- `GET /certificates/verify/:code`
- `GET /certificates/:code/download`

### Notification

- `GET /notifications`
- `PATCH /notifications/read-all`
- `PATCH /notifications/:id/read`

### Upcoming Events

- `GET /upcoming-events/nearest`
- `GET /admin/upcoming-events`
- `POST /admin/upcoming-events`
- `PUT /admin/upcoming-events/:id`
- `DELETE /admin/upcoming-events/:id`

### Dashboard

- `GET /admin/dashboard`
- `GET /member/dashboard`

## Frontend Routes

### Public

- `/login`
- `/register`
- `/forgot-password`
- `/certificate/:code`

### Student

- `/`
- `/learning-path`
- `/courses/:id`
- `/courses/:courseId/lessons/:lessonId`
- `/project-submission/:id?`
- `/profile`
- `/edit-profile`

### Admin

- `/admin`
- `/admin/courses`
- `/admin/courses/:id/modules`
- `/admin/users`
- `/admin/users/create`
- `/admin/users/edit/:id`
- `/admin/quiz-results`
- `/admin/project-review`
- `/admin/certificates`
- `/admin/upcoming-events`
- `/admin/notifications`
- `/admin/progress`
- `/admin/settings`

## Keamanan & Validasi

- JWT disimpan di localStorage dan dikirim lewat Authorization Bearer token.
- Backend memvalidasi token dan memastikan token masih sama dengan token aktif di database.
- Logout menghapus token di database sehingga session tidak bisa dipakai lagi.
- Role middleware membatasi endpoint admin dan mentor.
- `checkModuleAccess` mencegah student menembak URL lesson yang masih locked.
- Register dibatasi domain kampus.
- Akun baru harus diaktifkan admin.
- Zod dipakai untuk validasi input backend.
- Frontend memakai validasi form dan alert bahasa Indonesia melalui vue-toastification.
- XSS sanitization digunakan pada input tertentu seperti project note dan project requirements.
- Rate limiter digunakan untuk login dan register.

## Status Pengembangan

### Selesai

- [x] Auth register, login, logout.
- [x] Aktivasi akun oleh admin.
- [x] Forgot password OTP email.
- [x] Role-based access.
- [x] Student dashboard.
- [x] XP, level, dan streak.
- [x] Learning Path / Course.
- [x] Module.
- [x] Lesson.
- [x] Content Blocks.
- [x] Sequential unlock lesson dan course.
- [x] Quiz auto grading.
- [x] Progress tracking.
- [x] Project requirements.
- [x] Project submission GitHub URL.
- [x] Project review approve/reject.
- [x] Certificate template upload.
- [x] Certificate auto-generate.
- [x] Certificate QR verification.
- [x] Certificate PDF download.
- [x] Student notification.
- [x] Admin notification.
- [x] Upcoming events.
- [x] User management.
- [x] User online indicator.
- [x] Admin dashboard.
- [x] Admin mobile responsive sidebar.
- [x] Admin user progress.
- [x] Admin quiz results.

### Rencana Lanjutan

- Refresh token mechanism.
- Unit dan integration testing.
- Realtime notification dengan WebSocket/SSE.
- Leaderboard penuh.
- Community/forum discussion.
- Analytics pembelajaran lebih detail.

## Tujuan Project

Proclub Learning Hub dibuat untuk:

- Membantu anggota Proclub belajar coding secara terstruktur.
- Mendorong pembelajaran berbasis project.
- Membuat student tidak hanya mendapatkan sertifikat, tetapi juga menghasilkan product nyata dari project final.
- Memudahkan admin dan mentor mengelola kurikulum, progress, project, dan sertifikasi.

## License

Project ini dibuat untuk kebutuhan edukasi dan pengembangan internal UKM Programming Club.
