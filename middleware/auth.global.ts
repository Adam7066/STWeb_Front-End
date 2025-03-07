import type { GetUserRes } from '~/scripts/fetchInterface'

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUser()

  const isLoggedIn = useState<boolean>('isLoggedIn', () => false)
  const { data } = await useFetch<boolean>('/api/isLoggedIn')
  isLoggedIn.value = data?.value ?? false

  if (isLoggedIn.value) {
    const { data, error } = await useFetch<GetUserRes>('/api/getUser')
    if (error.value?.statusCode === 401) {
      await useFetch('/api/deleteAuthToken')
      isLoggedIn.value = false
    }
    if (data.value) {
      userStore.setUsername(data.value.data.username)
      userStore.setEmail(data.value.data.email)
      userStore.setAvatar(data.value.data.avatar)
    }
  }

  if (!isLoggedIn.value) {
    userStore.init()

    if (to.path === '/') return

    const noLoginRequiredPath = ['/about', '/learn', '/tools', '/login']
    let goToLoginFlag = true
    for (const path of noLoginRequiredPath) {
      if (to.path.startsWith(path)) {
        goToLoginFlag = false
        break
      }
    }
    if (goToLoginFlag) return navigateTo('/login')
  } else {
    if (to.path === '/login') return navigateTo('/')
    if (to.path.startsWith('/dashboard')) {
      const userRole = useState<string>('userRole', () => 'User')
      const { data } = await useFetch<string>('/api/getUserRole')
      userRole.value = data?.value ?? 'User'

      if (userRole.value === 'User') {
        const goToHomePath = [
          '/dashboard/usermgmt',
          '/dashboard/membermgmt',
          '/dashboard/learnmgmt',
        ]
        if (goToHomePath.includes(to.path)) return navigateTo('/')
      }
    }
  }
})
