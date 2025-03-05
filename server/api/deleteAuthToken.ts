import type { H3Event } from 'h3'

export default defineEventHandler((event: H3Event) => {
  deleteCookie(event, 'aToken')
  deleteCookie(event, 'rToken')
  return true
})