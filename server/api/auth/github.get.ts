export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user,
      loggedInAt: new Date(),
      secure: {
        token: generateToken(user),
        refreshToken: generateRefreshToken(user)
      }
    })
    return sendRedirect(event, '/todos')
  }
})
