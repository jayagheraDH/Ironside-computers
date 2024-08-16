import type { HookFetcher } from '@commerce/utils/types'
import { useCallback } from 'react'
import useCustomer from './use-customer'
import useCommerceCustomerAddresses from '@commerce/use-customers-addresses'

const defaultOpts = {
  url: `/api/bigcommerce/customers/addresses`,
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
  const useCustomersAddresses = () => {
    const { revalidate } = useCustomer()
    const fn = useCommerceCustomerAddresses<null, { entityId: number }>(
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
  useCustomersAddresses.extend = extendHook
  return useCustomersAddresses
}

export default extendHook(fetcher)
