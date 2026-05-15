import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import CourseDetailView from '../views/CourseDetailView.vue'
import CoursesView from '../views/CoursesView.vue'
import ModuleView from '../views/ModuleView.vue'
import QuizResultView from '../views/QuizResultView.vue'
import ProjectSubmissionView from '../views/ProjectSubmissionView.vue'
import ProfileView from '../views/ProfileView.vue'
import Register from '../views/Register.vue'

import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminUserEdit from '../views/admin/AdminUserEdit.vue'
import AdminCourses from '../views/admin/AdminCourses.vue'
import AdminQuizzes from '../views/admin/AdminQuizzes.vue'
import AdminQuestions from '../views/admin/AdminQuestions.vue'
import AdminCategories from '../views/admin/categories/Index.vue'
import AdminModules from '../views/admin/modules/Index.vue'
import AdminSettings from '../views/admin/AdminSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/courses-catalog',
          name: 'CoursesCatalog',
          component: CoursesView
        },
        {
          path: '/courses/:id',
          name: 'CourseDetail',
          component: CourseDetailView
        },
        {
          path: '/project-submission/:id?',
          name: 'ProjectSubmission',
          component: ProjectSubmissionView
        },
        {
          path: '/profile',
          name: 'Profile',
          component: ProfileView
        },
        {
          path: '/edit-profile',
          name: 'EditProfile',
          component: () => import('../views/EditProfileView.vue')
        },
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { guestOnly: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { guestOnly: true }
    },
    {
      path: '/courses/:courseId/modules/:moduleId',
      name: 'ModuleView',
      component: ModuleView,
      meta: { requiresAuth: true }
    },
    {
      path: '/quiz-result/:id?',
      name: 'QuizResult',
      component: QuizResultView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: AdminDashboard
        },
        {
          path: 'courses',
          name: 'AdminCourses',
          component: AdminCourses
        },
        {
          path: 'courses/:id/modules',
          name: 'AdminModules',
          component: AdminModules
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: AdminUsers
        },
        {
          path: 'users/edit/:id',
          name: 'AdminUserEdit',
          component: AdminUserEdit
        },
        {
          path: 'users/create',
          name: 'AdminUserCreate',
          component: AdminUserEdit
        },
        {
          path: 'quizzes/manage',
          name: 'QuizManagement',
          component: AdminQuestions
        },
        {
          path: 'quizzes',
          name: 'AdminQuizzes',
          component: AdminQuizzes
        },
        {
          path: 'quizzes/:id/questions',
          name: 'AdminQuestions',
          component: AdminQuestions
        },
        {
          path: 'categories',
          name: 'AdminCategories',
          component: AdminCategories
        },
        {
          path: 'settings',
          name: 'AdminSettings',
          component: AdminSettings
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  const userRaw = localStorage.getItem('user');
  let userData = {};

  if (userRaw && userRaw !== "undefined") {
    try {
      userData = JSON.parse(userRaw);
    } catch (e) {
      console.error("Gagal parse JSON user:", e);
      userData = {};
    }
  }

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  if (to.meta.requiresAdmin) {

    const role = userData?.role?.toLowerCase();

    if (role !== 'admin') {
      return next('/');
    }
  }

  if (to.path === '/login' && token) {
    return next('/');
  }

  next();
});
export default router
