import { get2FARedirect } from '~/lib/utils'

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, session } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/auth/signin')
  }
  else if (loggedIn.value && session.value && session.value.user) {
    const redirectResult = get2FARedirect(session.value.user, to.path)

    // Prevent infinite redirect loop
    if (redirectResult !== to.path) {
      return navigateTo(redirectResult)
    }
  }
})
