import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Home from './views/home.vue'
import './style.css'
import { authMutations } from './store/auth'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
          path: 'remedial',
          name: 'student-remedial',
          component: () => import('./components/student/RemedialEnrichment.vue')
        },
        {
          path: 'community',
          name: 'student-community',
          component: () => import('./components/student/StudentCommunity.vue')
        }
      ]
    },
    {
      path: '/teacher-dashboard',
      name: 'teacher-dashboard',
      component: () => import('./views/TeacherDashboard.vue'),
      meta: { requiresAuth: true, role: 'teacher' }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('pathfinder_token')
  const userRole = localStorage.getItem('pathfinder_user_role')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      authMutations.openSignInModal()
      next('/')
    } else if (to.meta.role && to.meta.role !== userRole) {
      // If route requires specific role but user doesn't have it
      next('/dashboard')
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
