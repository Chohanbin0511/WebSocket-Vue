import { createRouter, createWebHistory } from 'vue-router'

// routes
import mainRoute from '@/router/routes/mainRoute'

// 참조문서: https://router.vuejs.org/guide/
// TODO 뒤로가기를 한 후 표시 위치를 기억하도록 scrollBehavior 추가
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', redirect: { name: '/main' } }, ...mainRoute]
})

// 참조문서: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach((to, from, next) => {
  next()
})

export default router
