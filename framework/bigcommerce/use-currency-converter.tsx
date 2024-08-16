import type { HookFetcher } from '@commerce/utils/types'
import { useCallback } from 'react'
import useCurrencyConverter from '@commerce/use-currency-converter'

const defaultOpts = {
  url: `/api/bigcommerce/customers/currency-converter`,
  method: 'GET',
}

export const fetcher: HookFetcher<any, null> = async (options, _, fetch) => {
  return fetch({
    ...defaultOpts,
    ...options,
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useCurrencyConvert = () => {
    const fn = useCurrencyConverter<any>(defaultOpts, customFetcher)

    return useCallback(
      async function currencyConvert() {
        const data = await fn(null)
        return data
      },
      [fn]
    )
  }
  useCurrencyConvert.extend = extendHook
  return useCurrencyConvert
}

export default extendHook(fetcher)
