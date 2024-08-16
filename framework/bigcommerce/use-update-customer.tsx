import { useCallback } from 'react'
import type { HookFetcher } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useCommerceUpdateCustomer from '@commerce/use-update-customer'
import type { UpdateCustomerBody } from './api/customers/updateCustomer'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/update-customer',
  method: 'PUT',
}

export type UpdateCustomerInput = UpdateCustomerBody

export const fetcher: HookFetcher<null, UpdateCustomerBody> = (
  options,
  { email, firstName, lastName, phone, entityId, newPassword },
  fetch
) => {
  if (!(firstName && lastName && email)) {
    throw new CommerceError({
      message: 'Required fields can not be empty',
    })
  }

  return fetch({
    ...defaultOpts,
    ...options,
    body: {
      email,
      firstName,
      lastName,
      phone,
      entityId,
      newPassword
    },
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useUpdateCustomer = () => {
    const { revalidate } = useCustomer()
    const fn = useCommerceUpdateCustomer<null, UpdateCustomerInput>(
      defaultOpts,
      customFetcher
    )

    return useCallback(
      async function updateCustomer(input: UpdateCustomerInput) {
        const data = await fn(input)
        await revalidate()
        return data
      },
      [fn]
    )
  }
  useUpdateCustomer.extend = extendHook
  return useUpdateCustomer
}

export default extendHook(fetcher)
