import Vue from 'vue'
import VueRouter from 'vue-router'
import Public from '@/router/modules/public.js'
import Admin from '@/router/modules/admin.js'
import SuperAdmin from '@/router/modules/superAdmin.js'
import store from '@/store'

Vue.use(VueRouter)

const routes = [...Public, ...Admin, ...SuperAdmin]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { authorize } = to.meta
  await store.dispatch('autoSignIn')
  const user = store.state.Auth.user

  if (
    authorize.length > 0 &&
    to.path !== '/signin' &&
    !to.params.token &&
    from.path !== '/signup'
  ) {
    if (!user) {
      return next(redirect())
    }

    if (!authorize.includes(user.accessLevel)) {
      return next(redirect())
    }
  }
  if (user && (to.path == '/signin' || to.path == '/signup')) {
    return next(redirect())
  }

  next()
})

function redirect() {
  if (!store.state.Auth.user) return '/'
  const level = store.state.Auth.user.accessLevel

  if (level == 0) return '/superadmin'
  if (level == 1) return '/testslist'
  return '/'
}

export default router
