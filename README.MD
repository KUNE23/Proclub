# Proclub LMS

Proclub LMS adalah platform pembelajaran berbasis web yang dikembangkan untuk Unit Kegiatan Mahasiswa (UKM) Programming Club. Sistem ini dirancang untuk membantu mahasiswa belajar pemrograman secara terstruktur melalui materi, kuis, dan project berbasis praktik.

## 🚀 Fitur Utama

### 🔐 Authentication

* Register & Login menggunakan JWT
* Role-based access (Admin, Mentor, Member)

### 📚 Course Management

* Admin dapat membuat dan mengelola course
* User dapat melihat daftar course

### 📖 Module System

* Materi pembelajaran terstruktur per module
* Sistem urutan pembelajaran (step-by-step)

### 🧪 Quiz System

* Kuis pada setiap module
* Auto grading
* Penilaian berbasis skor

### 📊 Progress Tracking

* Status pembelajaran:

  * locked
  * unlocked
  * completed
* Tracking progress per module

### 🔓 Unlock System

* Module berikutnya terbuka setelah user menyelesaikan quiz

### 🧑‍💻 Project Submission

* User dapat submit project (link GitHub)
* Mentor/Admin dapat melakukan review

### 📊 Dashboard

* Melihat progress belajar user
* Persentase penyelesaian course
* Status module

---

## 🛠️ Tech Stack

* Backend: Node.js, Express.js
* Database: MySQL
* ORM: Prisma
* Authentication: JWT
* Hashing: bcrypt

---

## 📁 Struktur Project

```
src/
 ├── config/
 │    └── prisma.js
 ├── controllers/
 │    ├── authController.js
 │    ├── courseController.js
 │    ├── moduleController.js
 │    ├── quizController.js
 │    ├── dashboardController.js
 │    └── projectController.js
 ├── middleware/
 │    ├── authMiddleware.js
 │    └── roleMiddleware.js
 ├── routes/
 │    ├── authRoutes.js
 │    ├── courseRoutes.js
 │    ├── quizRoutes.js
 │    └── dashboardRoutes.js
 └── app.js
```

---

## ⚙️ Instalasi

1. Clone repository

```
git clone https://github.com/username/proclub-lms.git
cd proclub-lms
```

2. Install dependency

```
npm install
```

3. Setup environment

Buat file `.env`:

```
DATABASE_URL="mysql://root:@127.0.0.1:3306/proclub"
JWT_SECRET=your_secret_key
```

4. Setup database

```
npx prisma db push
npx prisma generate
```

5. Jalankan server

```
npm run dev
```

Server akan berjalan di:

```
http://localhost:3000
```

---

## 🔑 API Endpoint

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Course

* GET `/api/courses`
* POST `/api/courses` (admin)

### Module

* GET `/api/courses/:id/modules`
* POST `/api/modules` (admin)

### Quiz

* GET `/api/quiz/:moduleId`
* POST `/api/quiz/:moduleId/submit`

### Dashboard

* GET `/api/dashboard`
* GET `/api/courses/:courseId/modules`

### Project

* POST `/api/projects`
* GET `/api/projects`

---

## 🎯 Tujuan Project

Proclub LMS dibuat untuk:

* Membantu mahasiswa belajar coding secara terstruktur
* Meningkatkan skill melalui project-based learning
* Menyediakan sistem pembelajaran modern berbasis teknologi

---

## 🚀 Future Development

* Integrasi AI (Vibe Coding)
* Gamification (badge, level, leaderboard)
* Forum diskusi
* Frontend dengan Vue.js

---

## 🤝 Kontribusi

Kontribusi terbuka untuk siapa saja yang ingin membantu pengembangan project ini.

---

## 📄 License

Project ini dibuat untuk keperluan edukasi dan pengembangan UKM.
