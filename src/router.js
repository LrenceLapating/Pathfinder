import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Home from './views/home.vue'
import './style.css'
import { authMutations } from './store/auth'
import ResetPassword from './components/ResetPassword.vue'
import PasswordResetRedirect from './components/PasswordResetRedirect.vue'
import NotFound from './views/not-found.vue'

// Student views
import StudentDashboard from './views/student/StudentDashboard.vue'
import StudyGuide from './views/student/StudyGuide.vue'
import QuizReview from './views/student/QuizReview.vue'
import StudentProfile from './views/student/StudentProfile.vue'

// Auth views
import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import ChooseRole from './views/ChooseRole.vue'

Vue.use(Router)
Vue.use(Meta)

// Check if we're running on port 8080 (which needs redirection)
const isPort8080 = window.location.port === '8080';

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      // If we're on port 8080, use the redirect component, otherwise use the actual reset component
      component: isPort8080 ? PasswordResetRedirect : ResetPassword,
      props: (route) => ({ 
        // Pass any query params as props
        ...route.query
      })
    },
    {
      path: '/choose-role',
      name: 'choose-role',
      component: ChooseRole,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/student',
      component: () => import('./views/student/StudentLayout.vue'),
      meta: { requiresAuth: true, role: 'student' },
      children: [
        {
          path: '',
          name: 'student-dashboard',
          component: StudentDashboard
        },
        {
          path: 'performance',
          name: 'student-performance',
          component: () => import('./components/student/PerformanceTracker.vue')
        },
        {
          path: 'classrooms',
          name: 'student-classrooms',
          component: () => import('./views/student/Classrooms.vue')
        },
        {
          path: 'classroom/:id',
          name: 'student-classroom-detail',
          component: () => import('./views/student/ClassroomDetail.vue'),
          props: true
        },
        {
          path: 'quiz/:id',
          name: 'student-quiz',
          component: () => import('./components/student/Quiz.vue'),
          props: true
        },
        {
          path: 'profile',
          name: 'student-profile',
          component: StudentProfile
        },
        {
          path: 'study-guide',
          name: 'study-guide',
          component: StudyGuide,
          meta: { requiresAuth: true, role: 'student' }
        },
        {
          path: 'study-guide/:id',
          name: 'study-guide-detail',
          component: StudyGuide,
          props: true,
          meta: { requiresAuth: true, role: 'student' }
        },
        {
          path: 'quiz-review',
          name: 'quiz-review',
          component: QuizReview,
          meta: { requiresAuth: true, role: 'student' }
        },
        {
          path: 'quiz-review/:id',
          name: 'quiz-review-detail',
          component: QuizReview,
          props: true,
          meta: { requiresAuth: true, role: 'student' }
        }
      ]
    },
    {
      path: '/teacher',
      component: () => import('./views/teacher/TeacherLayout.vue'),
      meta: { requiresAuth: true, role: 'teacher' },
      children: [
        {
          path: '',
          name: 'teacher-dashboard',
          component: () => import('./views/teacher/TeacherDashboard.vue')
        },
        {
          path: 'profile',
          name: 'teacher-profile',
          component: () => import('./views/teacher/TeacherProfile.vue')
        },
        {
          path: 'classrooms',
          name: 'teacher-classrooms',
          component: () => import('./views/teacher/ClassroomManagement.vue')
        },
        {
          path: 'classroom/:id',
          name: 'teacher-classroom-detail',
          component: () => import('./views/teacher/ClassroomDetail.vue'),
          props: true
        },
        {
          path: 'performance',
          name: 'teacher-performance',
          component: () => import('./views/teacher/StudentPerformance.vue')
        },
        {
          path: 'score-upload',
          name: 'teacher-score-upload',
          component: () => import('./views/teacher/ScoreUpload.vue')
        },
        {
          path: 'analytics',
          name: 'teacher-analytics',
          component: () => import('./views/teacher/PerformanceAnalytics.vue')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem('pathfinder_token')
  const userRole = localStorage.getItem('pathfinder_user_role')
  const userData = JSON.parse(localStorage.getItem('pathfinder_user') || '{}')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      authMutations.openSignInModal()
      next('/')
    } else if (userData.isVerified === false) {
      // If user is not verified, redirect to home and show sign in modal
      authMutations.openSignInModal()
      next('/')
    } else if (userData.role) {
      // If user already has a role in their profile
      if (to.path === '/choose-role') {
        // Redirect to appropriate dashboard based on role
        next(userData.role === 'student' ? '/student' : '/teacher')
      } else if (to.meta.role && to.meta.role !== userData.role) {
        // If route requires specific role but user doesn't have it
        next(userData.role === 'student' ? '/student' : '/teacher')
      } else {
        next()
      }
    } else if (!userRole && to.path !== '/choose-role') {
      // If user is authenticated but hasn't chosen a role yet
      next('/choose-role')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
