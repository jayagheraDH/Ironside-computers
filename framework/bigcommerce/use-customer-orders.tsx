import type { HookFetcher } from '@commerce/utils/types'
import { useCallback } from 'react'
import useCustomer from './use-customer'
import useCommerceCustomerOrders from '@commerce/use-customer-orders' 

const defaultOpts = {
  url: `/api/bigcommerce/customers/orders`,
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
  const useCustomerOrders = () => {
    const { revalidate } = useCustomer()
    const fn = useCommerceCustomerOrders<null, { entityId: number }>(
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
  useCustomerOrders.extend = extendHook
  return useCustomerOrders
}

export default extendHook(fetcher)
