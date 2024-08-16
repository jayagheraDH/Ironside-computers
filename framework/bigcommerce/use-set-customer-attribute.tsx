import { useCallback } from 'react'
import type { HookFetcher } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useCommerceSetCustomerAttribute from '@commerce/use-set-customer-attribute'
import type { SetCustomerAttributeBody } from './api/customers/setCustomerAttribute'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/set-customer-attribute',
  method: 'PUT',
}

export type SetCustomerAttributeInput = SetCustomerAttributeBody

export const fetcher: HookFetcher<null, SetCustomerAttributeBody> = (
  options,
  { attribute_id, value, customer_id },
  fetch
) => {
  if (!(attribute_id && value && customer_id)) {
    throw new CommerceError({
      message: 'Required fields can not be empty',
    })
  }

  return fetch({
    ...defaultOpts,
    ...options,
    body: {
      attribute_id,
      value,
      customer_id,
    },
  })
}

export function extendHook(setAttributeFetcher: typeof fetcher) {
  const useCustomerAttribute = () => {
    const { revalidate } = useCustomer()
    const fn = useCommerceSetCustomerAttribute<null, SetCustomerAttributeInput>(
      defaultOpts,
      setAttributeFetcher
    )

    return useCallback(
      async function updateAddress(input: SetCustomerAttributeInput) {
        const data = await fn(input)
        await revalidate()
        return data
      },
      [fn]
    )
  }
  useCustomerAttribute.extend = extendHook
  return useCustomerAttribute
}

export default extendHook(fetcher)
