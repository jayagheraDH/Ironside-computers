import { useCallback } from 'react'
import type { HookFetcher } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useCreateAddress from '@commerce/use-create-address'
import type { CreateAddressBody } from './api/customers/create-address'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/create-address',
  method: 'POST',
}

export type CreateAddressInput = CreateAddressBody

export const fetcher: HookFetcher<null, CreateAddressBody> = (
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
    customer_id,
  },
  fetch
) => {
  if (
    !(first_name && last_name && addr1 && city && zip && country_code && customer_id)
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
      customer_id,
    },
  })
}

export function extendHook(addressFetcher: typeof fetcher) {
  const useCustomerCreateAddress = () => {
    const { revalidate } = useCustomer()
    const fn = useCreateAddress<null, CreateAddressInput>(
      defaultOpts,
      addressFetcher
    )

    return useCallback(
      async function createAddress(input: CreateAddressInput) {
        const data = await fn(input)
        await revalidate()
        return data
      },
      [fn]
    )
  }
  useCustomerCreateAddress.extend = extendHook
  return useCustomerCreateAddress
}

export default extendHook(fetcher)
