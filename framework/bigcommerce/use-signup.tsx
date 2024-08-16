import { useCallback } from 'react'
import type { HookFetcher } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useCommerceSignup from '@commerce/use-signup'
import type { SignupBody } from './api/customers/signup'
import useCustomer from './use-customer'

const defaultOpts = {
  url: '/api/bigcommerce/customers/signup',
  method: 'POST',
}

export type SignupInput = SignupBody

export const fetcher: HookFetcher<null, SignupBody> = (
  options,
  {
    email,
    firstName,
    lastName,
    password,
    company,
    address1,
    address2,
    city,
    state_or_province,
    postal_code,
    country_code
  },
  fetch
) => {
  if (!(firstName && lastName && email && password && address1 && country_code)) {
    throw new CommerceError({
      message:
        'Required fields can not be empty',
    })
  }

  return fetch({
    ...defaultOpts,
    ...options,
    body: {
      email,
      firstName,
      lastName,
      password,
      company,
      address1,
      address2,
      city,
      state_or_province,
      postal_code,
      country_code
    },
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useSignup = () => {
    const { revalidate } = useCustomer()
    const fn = useCommerceSignup<null, SignupInput>(defaultOpts, customFetcher)

    return useCallback(
      async function signup(input: SignupInput) {
        const data = await fn(input)
        await revalidate()
        return data
      },
      [fn]
    )
  }

  useSignup.extend = extendHook

  return useSignup
}

export default extendHook(fetcher)
