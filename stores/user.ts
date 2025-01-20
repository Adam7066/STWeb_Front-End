export const useUser = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    avatar: '',
    isLoggedIn: false,
  }),
  actions: {
    init() {
      this.username = ''
      this.email = ''
      this.avatar = ''
      this.isLoggedIn = false
    },
    setUsername(username: string) {
      this.username = username
    },
    setEmail(email: string) {
      this.email = email
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setIsLoggedIn(isLoggedIn: boolean) {
      this.isLoggedIn = isLoggedIn
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})