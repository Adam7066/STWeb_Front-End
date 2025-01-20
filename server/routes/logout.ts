export default defineEventHandler((event) => {
  deleteCookie(event, 'aToken')
  deleteCookie(event, 'rToken')

  return sendRedirect(event, '/')
})