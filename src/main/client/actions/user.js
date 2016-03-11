export const userLoggedIn = (user, projects) => {
  return {
    type: 'USER_LOGGED_IN',
    user,
    projects
  }
}
