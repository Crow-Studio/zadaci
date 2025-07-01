import type { OauthStore, IOauth } from '~/types'

export const useOauthStore = defineStore('oauthStore', {
  state: (): OauthStore => ({
    oauth: {
      isSigninWithOauth: false,
      provider: null,
    },
  }),
  actions: {
    onSigninWithOauthProvider(payload: IOauth): void {
      this.oauth = payload
    },
    onResetOauth(): void {
      this.oauth = {
        isSigninWithOauth: false,
        provider: null,
      }
    },
  },
  persist: true,
})
