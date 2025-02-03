import type { GetUserRes, GetUserRoleRes } from '~/scripts/fetchInterface'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    const config = useRuntimeConfig()
    const userStore = useUser()

    const isLoggedIn = useState<boolean>('isLoggedIn', () => false)
    const { data } = await useFetch<boolean>('/api/isLoggedIn')
    isLoggedIn.value = data?.value ?? false

    if (isLoggedIn.value) {
      if (!userStore.username || !userStore.email || !userStore.avatar) {
        const { data: getUserRes } = await useFetch<GetUserRes>(config.public.backendApi + '/user', {
          method: 'GET',
          credentials: 'include',
        })
        if (getUserRes.value) {
          userStore.setUsername(getUserRes.value.data.username)
          userStore.setEmail(getUserRes.value.data.email)
          userStore.setAvatar(getUserRes.value.data.avatar)
        }
      }

      if (to.path === '/login') return navigateTo('/')

      if (to.path.startsWith('/dashboard')) {
        const { data: getUserRoleRes } = await useFetch<GetUserRoleRes>(config.public.backendApi + '/user/role', {
          method: 'GET',
          credentials: 'include',
        })
        const userRole = useState<string>('userRole', () => 'User')
        userRole.value = getUserRoleRes.value ? getUserRoleRes.value.data : 'User'

        if (userRole.value === 'User') return navigateTo('/')
      }
    } else {
      userStore.init()

      if (to.path === '/') return

      const noLoginRequiredPath = ['/about', '/tools', '/login']
      let goToLoginFlag = true
      for (const path of noLoginRequiredPath) {
        if (to.path.startsWith(path)) {
          goToLoginFlag = false
          break
        }
      }
      if (goToLoginFlag) return navigateTo('/login')
    }
  }
})