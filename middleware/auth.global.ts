import type { GetUserRes } from '~/scripts/fetchInterface'

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUser()

  const isLoggedIn = useState<boolean>('isLoggedIn', () => false)
  const { data } = await useFetch<boolean>('/api/isLoggedIn')
  isLoggedIn.value = data?.value ?? false

  if (!isLoggedIn.value) {
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
  } else {
    const { data } = await useFetch<GetUserRes>('/api/getUser')
    if (data.value) {
      userStore.setUsername(data.value.data.username)
      userStore.setEmail(data.value.data.email)
      userStore.setAvatar(data.value.data.avatar)
    }

    if (to.path === '/login') return navigateTo('/')
    if (to.path.startsWith('/dashboard')) {
      const userRole = useState<string>('userRole', () => 'User')
      const { data } = await useFetch<string>('/api/getUserRole')
      userRole.value = data?.value ?? 'User'

      if (userRole.value === 'User') {
        const goToHomePath = ['/dashboard/usermgmt', '/dashboard/membermgmt']
        if (goToHomePath.includes(to.path)) return navigateTo('/')
      }
    }
  }
})
