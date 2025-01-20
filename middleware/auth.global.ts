export default defineNuxtRouteMiddleware((to) => {
  const aTokenCookie = useCookie('aToken')
  const rTokenCookie = useCookie('rToken')
  const userStore = useUser()

  const isLoggedIn = useState<boolean>('isLoggedIn', () => !!aTokenCookie.value && !!rTokenCookie.value)
  if (import.meta.server) {
    isLoggedIn.value = !!aTokenCookie.value && !!rTokenCookie.value
    if (!isLoggedIn.value) userStore.init()
  }
  userStore.setIsLoggedIn(isLoggedIn.value)

  if (isLoggedIn.value) {
    if (to.path === '/login') return navigateTo('/')
  }
})