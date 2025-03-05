export const useLearn = defineStore('learn', {
  state: () => ({
    userId: '',
    total: 0,
  }),
  actions: {
    setUserId(userId: string) {
      this.userId = userId
    },
    setTotal(total: number) {
      this.total = total
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})