import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Home from './views/home.vue'
import './style.css'
import { authMutations } from './store/auth'
import ResetPassword from './components/ResetPassword.vue'
import PasswordResetRedirect from './components/PasswordResetRedirect.vue'

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
      component: () => import('./views/ChooseRole.vue'),
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
          component: () => import('./views/student/StudentDashboard.vue')
        },
        {
          path: 'performance',
          name: 'student-performance',
          component: () => import('./components/student/PerformanceTracker.vue')
        },
        {
          path: 'schedule',
          name: 'student-schedule',
          component: () => import('./components/student/SmartSchedule.vue')
        },
        {
          path: 'quiz/:id',
          name: 'student-quiz',
          component: () => import('./components/student/Quiz.vue'),
          props: true
        },
        {
          path: 'modules',
          name: 'student-modules',
          component: () => import('./views/student/ModulesList.vue')
        },
        {
          path: 'modules/:id',
          name: 'student-module-detail',
          component: () => import('./views/student/ModuleDetail.vue'),
          props: true
        },
        {
          path: 'adaptive-module/:id',
          name: 'student-adaptive-module',
          component: () => import('./components/student/AdaptiveModule.vue'),
          props: true
        },
        {
          path: 'analytics',
          name: 'student-analytics',
          component: () => import('./components/student/LearningAnalytics.vue')
        },
        {
          path: 'remedial',
          name: 'student-remedial',
          component: () => import('./components/student/RemedialEnrichment.vue')
        },
        {
          path: 'resources',
          name: 'student-resources',
          component: () => import('./views/student/ResourceLibrary.vue')
        },
        {
          path: 'profile',
          name: 'student-profile',
          component: () => import('./views/student/StudentProfile.vue')
        },
        {
          path: 'activity',
          name: 'student-activity',
          component: () => import('./components/student/ActivityLog.vue')
        },
        {
          path: 'community',
          name: 'student-community',
          component: () => import('./components/student/StudentCommunity.vue')
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
          path: 'students',
          name: 'teacher-students',
          component: () => import('./views/teacher/StudentRoster.vue')
        },
        {
          path: 'students/:id/performance',
          name: 'teacher-student-performance',
          component: () => import('./views/teacher/StudentPerformance.vue'),
          props: true
        },
        {
          path: 'modules',
          name: 'teacher-modules',
          component: () => import('./views/teacher/ModuleManagement.vue')
        },
        {
          path: 'quizzes',
          name: 'teacher-quizzes',
          component: () => import('./views/teacher/QuizBuilder.vue')
        },
        {
          path: 'schedule',
          name: 'teacher-schedule',
          component: () => import('./views/teacher/SmartSchedulePlanner.vue')
        },
        {
          path: 'analytics',
          name: 'teacher-analytics',
          component: () => import('./views/teacher/LearningAnalytics.vue')
        },
        {
          path: 'remedial-tools',
          name: 'teacher-remedial',
          component: () => import('./views/teacher/RemedialManager.vue')
        },
        {
          path: 'resources',
          name: 'teacher-resources',
          component: () => import('./views/teacher/ResourceManager.vue')
        },
        {
          path: 'messages',
          name: 'teacher-messages',
          component: () => import('./views/teacher/TeacherMessages.vue')
        },
        {
          path: 'achievements',
          name: 'teacher-achievements',
          component: () => import('./views/teacher/AchievementManager.vue')
        },
        {
          path: 'notifications',
          name: 'teacher-notifications',
          component: () => import('./views/teacher/NotificationCenter.vue')
        },
        {
          path: 'profile',
          name: 'teacher-profile',
          component: () => import('./views/teacher/TeacherProfile.vue')
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
