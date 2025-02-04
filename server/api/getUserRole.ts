import type { H3Event } from 'h3'
import type { GetUserRoleRes } from '~/scripts/fetchInterface'

export default defineEventHandler(async (event: H3Event) => {
  const cookies = parseCookies(event)
  const config = useRuntimeConfig()

  const resp = await $fetch<GetUserRoleRes>(config.public.backendApi + '/user/role', {
    method: 'GET',
    headers: {
      Cookie: `aToken=${cookies.aToken}; rToken=${cookies.rToken}`,
    },
  })
  return resp?.data ?? 'User'
})