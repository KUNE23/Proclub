# Proclub LMS

Proclub LMS adalah platform pembelajaran berbasis web yang dikembangkan untuk Unit Kegiatan Mahasiswa (UKM) Programming Club. Sistem ini dirancang untuk membantu mahasiswa belajar pemrograman secara terstruktur melalui materi, kuis, dan project berbasis praktik.

## Fitur Utama

### Authentication
- Register & Login menggunakan JWT
- Role-based access (Admin, Mentor, Member)
- Forgot password & Logout

### User Management
- Admin dapat CRUD user (create, read, update, delete)
- User dapat melihat & mengedit profil sendiri (nama, email, password)
- Pagination & role filter pada daftar user

### Course Management
- Admin dapat membuat dan mengelola course + upload image
- Soft-delete (tidak langsung terhapus)
- User dapat melihat daftar course dengan search & filter kategori
- Pagination pada listing course

### Module System
- Materi pembelajaran terstruktur per module (tipe MATERIAL / QUIZ)
- Sistem urutan pembelajaran (step-by-step)
- Admin CRUD module + drag-and-drop quiz builder inline

### Quiz System
- Kuis pada setiap module dengan auto grading
- Ambang batas kelulusan (KKM) per module (default 70)
- Sistem scoring berdasarkan jumlah jawaban benar
- Submit jawaban via quiz player interaktif

### Progress Tracking
- Status pembelajaran: LOCKED, IN_PROGRESS, COMPLETED, FAILED
- Tracking progress per module per user
- Akses module sequential (module berikutnya terbuka setelah menyelesaikan quiz)
- User Progress Dashboard (Admin): lihat progress semua member per course

### Project Submission
- User dapat submit project (link GitHub + notes)
- Mentor/Admin dapat melakukan review (approve/reject)

### Dashboard
- User: daftar course dengan status module & persentase penyelesaian
- Admin: statistik (total users, courses, quiz results, dll)
- Admin Quiz Results: lihat semua hasil kuis user (paginated)

### Category Management
- Admin dapat CRUD kategori course
- Soft-delete kategori

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Security:** Helmet, XSS, express-rate-limit, Multer (upload)

### Frontend
- **Framework:** Vue.js 3 (Composition API + `<script setup>`)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide Vue

## Struktur Project

```
proclub/
 ├── proclub-backend/
 │    ├── prisma/
 │    │    └── schema.prisma          # Database schema
 │    ├── src/
 │    │    ├── config/
 │    │    │    └── prisma.js          # Prisma client
 │    │    ├── controllers/
 │    │    │    ├── authController.js       # register, login, logout, forgotpassword
 │    │    │    ├── userController.js       # profile CRUD + progress
 │    │    │    ├── courseController.js     # course CRUD
 │    │    │    ├── moduleController.js     # module CRUD + quiz results
 │    │    │    ├── quizController.js       # quiz CRUD + submit
 │    │    │    ├── projectController.js    # submit & review project
 │    │    │    ├── categoryController.js   # category CRUD
 │    │    │    └── dashboardController.js  # dashboard & progress
 │    │    ├── middleware/
 │    │    │    ├── authMiddleware.js       # JWT verification
 │    │    │    ├── roleMiddleware.js       # role-based access
 │    │    │    ├── checkModuleAccess.js    # sequential module access
 │    │    │    ├── uploadMiddleware.js     # Multer config
 │    │    │    ├── validate.js             # Zod validation
 │    │    │    └── rateLimiter.js          # Rate limiters
 │    │    ├── routes/
 │    │    │    ├── authRoutes.js
 │    │    │    ├── userRoutes.js
 │    │    │    ├── courseRoutes.js
 │    │    │    ├── modulesRoutes.js
 │    │    │    ├── quizRoutes.js
 │    │    │    ├── projectRoutes.js
 │    │    │    ├── categoryRoutes.js
 │    │    │    └── dashboardRoutes.js
 │    │    ├── schema/                # Zod validation schemas
 │    │    ├── uploads/courses/       # Course images
 │    │    └── app.js                 # Express app entry
 │    ├── .env
 │    └── package.json
 │
 └── proclub-frontend/
      ├── src/
      │    ├── api/
      │    │    └── index.js              # Axios instance + JWT interceptor
      │    ├── router/
      │    │    └── index.js              # All routes + navigation guards
      │    ├── layouts/
      │    │    ├── MainLayout.vue        # User layout (sidebar + header + footer)
      │    │    └── AdminLayout.vue       # Admin layout (sidebar + header)
      │    ├── components/
      │    │    └── QuizPlayer.vue        # Quiz-taking component
      │    ├── services/
      │    │    ├── moduleService.js
      │    │    ├── contentService.js
      │    │    ├── categoryService.js
      │    │    └── userProgressService.js
      │    ├── views/
      │    │    ├── Login.vue
      │    │    ├── Register.vue
      │    │    ├── Dashboard.vue
      │    │    ├── CoursesView.vue
      │    │    ├── CourseDetailView.vue
      │    │    ├── ModuleView.vue
      │    │    ├── QuizResultView.vue
      │    │    ├── ProjectSubmissionView.vue
      │    │    ├── ProfileView.vue
      │    │    ├── EditProfileView.vue
      │    │    └── admin/
      │    │         ├── AdminDashboard.vue
      │    │         ├── AdminUsers.vue
      │    │         ├── AdminUserEdit.vue
      │    │         ├── AdminCourses.vue
      │    │         ├── AdminQuizzes.vue
      │    │         ├── AdminQuestions.vue
      │    │         ├── AdminSettings.vue
      │    │         ├── AdminQuizResult.vue
      │    │         ├── AdminUserProgress.vue
      │    │         ├── categories/
      │    │         │    ├── Index.vue
      │    │         │    └── CategoryForm.vue
      │    │         └── modules/
      │    │              ├── Index.vue
      │    │              ├── ModuleForm.vue
      │    │              └── ContentForm.vue
      │    ├── App.vue
      │    ├── main.js
      │    └── style.css
      ├── index.html
      ├── vite.config.js
      ├── tailwind.config.js
      └── package.json
```

## Instalasi

1. Clone repository

```
git clone https://github.com/KUNE23/Proclub.git
cd Proclub
```

2. Install dependency backend

```
cd proclub-backend
npm install
```

3. Setup environment

Buat file `.env` di `proclub-backend/`:

```
DATABASE_URL="postgresql://..."
JWT_SECRET=your_secret_key
```

4. Setup database

```
npx prisma db push
npx prisma generate
```

5. Install dependency frontend

```
cd ../proclub-frontend
npm install
```

6. Jalankan server

```
cd ../proclub-backend
npm run dev        # Server: http://localhost:3000
```

7. Jalankan frontend (terminal terpisah)

```
cd proclub-frontend
npm run dev        # Client: http://localhost:5173
```

## API Endpoint

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout` (auth)
- POST `/api/auth/forgot-password`

### User
- GET `/api/profile` (auth)
- PUT `/api/profile` (auth)
- GET `/api/` (admin)
- POST `/api/` (admin)
- GET `/api/:id` (admin)
- PUT `/api/:id` (admin)
- DELETE `/api/:id` (admin)
- GET `/api/user/progress` (auth) — progress user sendiri
- GET `/api/admin/user-progress` (admin) — progress semua member

### Course
- GET `/api/courses`
- GET `/api/courses/:id`
- POST `/api/courses` (admin)
- PUT `/api/courses/:id` (admin)
- DELETE `/api/courses/:id` (admin)

### Module
- GET `/api/courses/:courseId/modules`
- GET `/api/courses/:courseId/modules/:id` (auth)
- POST `/api/courses/:courseId/modules` (admin)
- GET `/api/modules/:id` (auth)
- PUT `/api/modules/:id` (admin)
- DELETE `/api/modules/:id` (admin)
- POST `/api/modules/:id/progress` (auth)

### Quiz
- GET `/api/modules/:moduleId/quizzes` (auth)
- POST `/api/quizzes` (admin)
- PUT `/api/quizzes/:id` (admin)
- DELETE `/api/quizzes/:id` (admin)
- POST `/api/modules/:id/submit` (auth)
- GET `/api/admin/quiz-results` (admin)

### Project
- POST `/api/projects` (auth)
- GET `/api/projects` (auth)
- PUT `/api/projects/:id/review` (admin, mentor)

### Category
- GET `/api/categories` (auth)
- POST `/api/categories` (admin)
- PUT `/api/categories/:id` (admin)
- DELETE `/api/categories/:id` (admin)

### Dashboard
- GET `/api/dashboard` (auth)
- GET `/api/courses/:courseId/modules/progress` (auth)

## Status Pengembangan

### Sudah Selesai
- [x] Auth (Register, Login, Logout, Forgot Password)
- [x] User Management CRUD + profile
- [x] Course Management CRUD + image upload
- [x] Module Management (MATERIAL / QUIZ)
- [x] Quiz System + Auto Grading
- [x] Progress Tracking per user per module
- [x] Sequential module unlock system
- [x] Project Submission + Review
- [x] Category Management
- [x] Dashboard user & admin
- [x] Quiz Results admin (paginated)
- [x] User Progress Monitoring (admin)
- [x] Frontend Vue.js 3 (Login, Register, Course Catalog, Module View, Admin Panel, Profile, dll)

### Dalam Pengembangan
- [ ] Dashboard dengan statistik real (masih ada data hardcoded)
- [ ] QuizResultView integrasi API
- [ ] ProjectSubmissionView integrasi API
- [ ] AdminQuizzes & AdminQuestions integrasi API CRUD
- [ ] Forgot Password (kirim email real)

### Rencana ke Depan
- Integrasi AI (Vibe Coding)
- Gamification (badge, level, leaderboard)
- Forum diskusi
- Fitur enrollment/membership
- Refresh token mechanism
- Unit testing

## Tujuan Project

Proclub LMS dibuat untuk:
- Membantu mahasiswa belajar coding secara terstruktur
- Meningkatkan skill melalui project-based learning
- Menyediakan sistem pembelajaran modern berbasis teknologi

## Database Schema

- **User** — name, email, password, role (admin/mentor/member)
- **Course** — title, description, image, categoryId, isDeleted
- **Module** — title, content, type (MATERIAL/QUIZ), order, courseId, kkm, isDeleted
- **Quiz** — question, options (JSON), correctAnswer, moduleId
- **UserProgress** — status (LOCKED/IN_PROGRESS/COMPLETED/FAILED), score, answers (JSONB), userId, moduleId
- **Project** — linkGithub, note, status (pending/approved/rejected), userId, courseId, moduleId
- **Category** — cat_name, isDeleted

## Kontribusi

Kontribusi terbuka untuk siapa saja yang ingin membantu pengembangan project ini.

## License

Project ini dibuat untuk keperluan edukasi dan pengembangan UKM.
