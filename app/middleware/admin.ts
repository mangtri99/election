export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()

  if (loggedIn.value && user.value?.role?.toLocaleLowerCase() !== 'admin') {
    return navigateTo('/')
  }
})
