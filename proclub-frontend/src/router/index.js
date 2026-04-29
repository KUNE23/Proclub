import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import CourseDetailView from '../views/CourseDetailView.vue'
import CoursesView from '../views/CoursesView.vue'
import ModuleView from '../views/ModuleView.vue'
import QuizView from '../views/QuizView.vue'
import QuizResultView from '../views/QuizResultView.vue'
import ProjectSubmissionView from '../views/ProjectSubmissionView.vue'
import ProfileView from '../views/ProfileView.vue'
import Register from '../views/Register.vue'

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
          path: '/quiz/:id?',
          name: 'QuizView',
          component: QuizView
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
      path: '/module/:id?',
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
  ]
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('accessToken');

  if (to.meta.requiresAuth && !token) {
    return '/login';
  }

  if (to.path === '/login' && token) {
    return '/';
  }

});
export default router
