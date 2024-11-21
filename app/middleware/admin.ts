export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()

  if (user.value?.role?.toLocaleLowerCase() !== 'admin') {
    return navigateTo('/')
  }
})
