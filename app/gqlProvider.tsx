// app/gqlProvider.tsx
'use client'

import { PropsWithChildren, useMemo } from 'react'
import {
  UrqlProvider,
  ssrExchange,
  fetchExchange,
  createClient,
  gql,
} from '@urql/next'
import { cacheExchange } from '@urql/exchange-graphcache' // automatic redux like cache

import { url } from '@/utils/url'
import { getToken } from '@/utils/token'

export default function GQLProvider({ children }: PropsWithChildren) {
  const [client, ssr] = useMemo(() => {
    // server side rendering exchange
    // exchage is a plugin that
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined',
    })

    const client = createClient({
      url,
      exchanges: [cacheExchange({}), ssr, fetchExchange],
      fetchOptions: () => {
        const token = getToken()

        return token
          ? {
              headers: { authorization: `Bearer ${token}` },
            }
          : {}
      },
    })

    return [client, ssr]
  }, []) // use memo to avoid creating a new client on every render

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}
