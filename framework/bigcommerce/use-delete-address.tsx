import type { HookFetcher } from '@commerce/utils/types'
import { useCallback } from 'react'
import useCustomer from './use-customer'
import useDeleteCustomerAddress from '@commerce/use-delete-address'

const defaultOpts = {
  url: `/api/bigcommerce/customers/delete-address`,
  method: 'POST',
}

export const fetcher: HookFetcher<null, { entityId: number }> = (
  options,
  { entityId },
  fetch
) => {
  return fetch({
    ...defaultOpts,
    ...options,
    body: {
      entityId,
    },
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useDeleteAddresses = () => {
    const { revalidate } = useCustomer()
    const fn = useDeleteCustomerAddress<null, { entityId: number }>(
      defaultOpts,
      customFetcher
    )

    return useCallback(
      async function customersAddresses(input: { entityId: number }) {
        const data = await fn(input)
        await revalidate()
        return data
      },
      [fn]
    )
  }
  useDeleteAddresses.extend = extendHook
  return useDeleteAddresses
}

export default extendHook(fetcher)
