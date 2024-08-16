import { useCallback } from 'react'
import type { HookFetcher } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useUpdateAddress from '@commerce/use-update-address'
import type { UpdateAddressBody } from './api/customers/updateAddress'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/update-address',
  method: 'PUT',
}

export type UpdateAddressInput = UpdateAddressBody

export const fetcher: HookFetcher<null, UpdateAddressBody> = (
  options,
  {
    first_name,
    last_name,
    phone,
    addr1,
    addr2,
    city,
    country_code,
    state,
    zip,
    id,
  },
  fetch
) => {
  if (
    !(first_name && last_name && addr1 && city && zip && country_code && id)
  ) {
    throw new CommerceError({
      message: 'Required fields can not be empty',
    })
  }

  return fetch({
    ...defaultOpts,
    ...options,
    body: {
      first_name,
      last_name,
      phone,
      addr1,
      addr2,
      city,
      country_code,
      state,
      zip,
      id,
    },
  })
}

export function extendHook(addressFetcher: typeof fetcher) {
  const useCustomerUpdateAddress = () => {
    const { revalidate } = useCustomer()
    const fn = useUpdateAddress<null, UpdateAddressInput>(
      defaultOpts,
      addressFetcher
    )

    return useCallback(
      async function updateAddress(input: UpdateAddressInput) {
        const data = await fn(input)
        await revalidate()
        return data
      },
      [fn]
    )
  }
  useCustomerUpdateAddress.extend = extendHook
  return useCustomerUpdateAddress
}

export default extendHook(fetcher)
