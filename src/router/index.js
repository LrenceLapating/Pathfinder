import { createRouter, createWebHistory } from 'vue-router'
import TeacherLayout from '@/views/teacher/TeacherLayout.vue'

const routes = [
  {
    path: '/',
    redirect: to => {
      const userRole = localStorage.getItem('pathfinder_user_role')
      const token = localStorage.getItem('pathfinder_token')
      if (token && userRole === 'teacher') {
        return '/teacher/dashboard'
      }
      return '/login'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/teacher',
    component: TeacherLayout,
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      {
        path: '',
        redirect: '/teacher/dashboard'
      },
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: () => import('@/views/teacher/TeacherDashboard.vue'),
        meta: {
          title: 'Dashboard'
        }
      },
      {
        path: 'analytics',
        name: 'TeacherAnalytics',
        component: () => import('@/views/teacher/LearningAnalytics.vue'),
        meta: {
          title: 'Learning Analytics'
        }
      },
      {
        path: 'schedule',
        name: 'TeacherSchedule',
        component: () => import('@/views/teacher/SmartSchedulePlanner.vue'),
        meta: {
          title: 'Smart Schedule'
        }
      },
      {
        path: 'students',
        name: 'TeacherStudents',
        component: () => import('@/views/teacher/StudentRoster.vue'),
        meta: {
          title: 'Student Roster'
        }
      },
      {
        path: 'students/:id',
        name: 'TeacherStudentProfile',
        component: () => import('@/views/teacher/StudentPerformance.vue'),
        props: true,
        meta: {
          title: 'Student Profile'
        }
      },
      {
        path: 'modules',
        name: 'TeacherModules',
        component: () => import('@/views/teacher/ModuleManagement.vue'),
        meta: {
          title: 'Module Management'
        }
      },
      {
        path: 'quizzes',
        name: 'TeacherQuizzes',
        component: () => import('@/views/teacher/QuizBuilder.vue'),
        meta: {
          title: 'Quiz Builder'
        }
      },
      {
        path: 'resources',
        name: 'TeacherResources',
        component: () => import('@/views/teacher/ResourceManager.vue'),
        meta: {
          title: 'Resource Manager'
        }
      },
      {
        path: 'remedial',
        name: 'TeacherRemedial',
        component: () => import('@/views/teacher/RemedialManager.vue'),
        meta: {
          title: 'Remedial Manager'
        }
      },
      {
        path: 'messages',
        name: 'TeacherMessages',
        component: () => import('@/views/teacher/TeacherMessages.vue'),
        meta: {
          title: 'Messages'
        }
      },
      {
        path: 'notifications',
        name: 'TeacherNotifications',
        component: () => import('@/views/teacher/NotificationCenter.vue'),
        meta: {
          title: 'Notifications'
        }
      },
      {
        path: 'profile',
        name: 'TeacherProfile',
        component: () => import('@/views/teacher/TeacherProfile.vue'),
        meta: {
          title: 'My Profile'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const userRole = localStorage.getItem('pathfinder_user_role')
  const token = localStorage.getItem('pathfinder_token')
  const isLoginPage = to.path === '/login'

  // Allow access to login page if not authenticated
  if (isLoginPage) {
    if (token && userRole === 'teacher') {
      next('/teacher/dashboard')
    } else {
      next()
    }
    return
  }

  // Handle authentication requirements
  if (requiresAuth && !token) {
    next('/login')
  } else if (requiresAuth && to.meta.role && to.meta.role !== userRole) {
    next('/login')
  } else {
    next()
  }
})

export default router 