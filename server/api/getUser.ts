import type { H3Event } from 'h3'
import type { GetUserRes } from '~/scripts/fetchInterface'

export default defineEventHandler(async (event: H3Event) => {
  const cookies = parseCookies(event)
  const config = useRuntimeConfig()

  return await $fetch<GetUserRes>(config.public.backendApi + '/user', {
    method: 'GET',
    headers: {
      Cookie: `aToken=${cookies.aToken}; rToken=${cookies.rToken}`,
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        })
      }
    }
  })
})