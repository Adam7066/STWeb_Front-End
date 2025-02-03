export const useUser = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    avatar: '',
  }),
  actions: {
    init() {
      this.username = ''
      this.email = ''
      this.avatar = ''
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
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})