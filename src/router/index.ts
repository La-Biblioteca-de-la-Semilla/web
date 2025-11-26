import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useOrganizationStore } from '@/stores/organization'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cookies-policy',
      name: 'cookies-policy',
      component: () => import('@/views/CookiesPolicyView.vue')
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('@/views/PrivacyPolicyView.vue')
    },
    {
      path: '/what-is',
      name: 'what-is-this',
      component: () => import('@/views/WhatIsThisView.vue')
    },
    {
      path: '/semilla/new',
      name: 'seed-new',
      component: () => import('@/views/SeedNewView.vue'),
      meta: {
        requiresAuth: true,
        requiresOrg: true
      }
    },
    {
      path: '/semilla/:id',
      name: 'seed-detail',
      component: () => import('@/views/SeedDetailView.vue')
    },
    {
      path: '/semilla/:id/edit',
      name: 'seed-edit',
      component: () => import('@/views/SeedEditView.vue'),
      meta: {
        requiresAuth: true,
        requiresOrg: true
      }
    },
    {
      path: '/semilla/:id/suggestion',
      name: 'seed-suggestion',
      component: () => import('@/views/SuggestionNewView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/suggestions',
      name: 'suggestions',
      component: () => import('@/views/OwnerSuggestionListView.vue'),
      meta: {
        requiresAuth: true,
        requiresOrg: true
      }
    },
    {
      path: '/suggestions/:id',
      name: 'suggestion-detail',
      component: () => import('@/views/OwnerSuggestionDetailView.vue'),
      meta: {
        requiresAuth: true,
        requiresOrg: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/views/GalleryView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import('@/views/ExchangeView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('@/views/UserDetailView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/users/:id/chat',
      name: 'user-chat',
      component: () => import('@/views/UserChatView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chats',
      name: 'chats',
      component: () => import('@/views/ChatListView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ],
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert('No tienes permiso para entrar aqui')
      next('/')
    }
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresOrg)) {

    const organizationStore = useOrganizationStore()
    if (organizationStore.organizations[0]) {
      next()
    } else {
      alert('No tienes permiso para entrar aqui')
      next('/')
    }
  } else {
    next()
  }
})


export default router